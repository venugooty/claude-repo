// Smile Detection Camera Web App
class SmileCamera {
    constructor() {
        // DOM elements
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('overlay');
        this.ctx = this.canvas.getContext('2d');
        this.loading = document.getElementById('loading');
        this.gallery = document.getElementById('gallery');

        // Buttons
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.captureBtn = document.getElementById('captureBtn');
        this.downloadAllBtn = document.getElementById('downloadAllBtn');
        this.clearGalleryBtn = document.getElementById('clearGalleryBtn');

        // Status elements
        this.statusEl = document.getElementById('status');
        this.captureCountEl = document.getElementById('captureCount');
        this.detectionStatusEl = document.getElementById('detectionStatus');

        // Settings
        this.smileThreshold = parseFloat(document.getElementById('smileThreshold').value);
        this.cooldownTime = parseFloat(document.getElementById('cooldownTime').value) * 1000;
        this.autoCapture = document.getElementById('autoCapture').checked;

        // State
        this.stream = null;
        this.isRunning = false;
        this.modelsLoaded = false;
        this.captureCount = 0;
        this.lastCaptureTime = 0;
        this.capturedImages = [];

        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadModels();
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startCamera());
        this.stopBtn.addEventListener('click', () => this.stopCamera());
        this.captureBtn.addEventListener('click', () => this.manualCapture());
        this.downloadAllBtn.addEventListener('click', () => this.downloadAll());
        this.clearGalleryBtn.addEventListener('click', () => this.clearGallery());

        // Settings listeners
        document.getElementById('smileThreshold').addEventListener('input', (e) => {
            this.smileThreshold = parseFloat(e.target.value);
            document.getElementById('smileValue').textContent = e.target.value;
        });

        document.getElementById('cooldownTime').addEventListener('input', (e) => {
            this.cooldownTime = parseFloat(e.target.value) * 1000;
            document.getElementById('cooldownValue').textContent = e.target.value;
        });

        document.getElementById('autoCapture').addEventListener('change', (e) => {
            this.autoCapture = e.target.checked;
        });

        // Handle video metadata loaded
        this.video.addEventListener('loadedmetadata', () => {
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
        });
    }

    async loadModels() {
        this.updateStatus('Loading AI models...');
        this.loading.classList.remove('hidden');

        try {
            const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
            ]);

            this.modelsLoaded = true;
            this.updateStatus('Models loaded! Ready to start');
            this.loading.classList.add('hidden');
            console.log('Face detection models loaded successfully');
        } catch (error) {
            console.error('Error loading models:', error);
            this.updateStatus('Error loading models. Please refresh.');
            this.loading.querySelector('p').textContent = 'Error loading models. Please refresh the page.';
        }
    }

    async startCamera() {
        if (!this.modelsLoaded) {
            alert('Please wait for models to load first');
            return;
        }

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: false
            });

            this.video.srcObject = this.stream;
            this.isRunning = true;

            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.captureBtn.disabled = false;

            this.updateStatus('Camera active - Smile!');

            // Wait for video to be ready
            await new Promise(resolve => {
                this.video.onloadedmetadata = resolve;
            });

            this.detectFaces();

        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please ensure you have granted camera permissions.');
            this.updateStatus('Camera access denied');
        }
    }

    stopCamera() {
        this.isRunning = false;

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        this.video.srcObject = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.captureBtn.disabled = true;

        this.updateStatus('Camera stopped');
        this.updateDetectionStatus('No face');
    }

    async detectFaces() {
        if (!this.isRunning) return;

        try {
            const detections = await faceapi
                .detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();

            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (detections && detections.length > 0) {
                // Resize detections to match canvas
                const displaySize = { width: this.canvas.width, height: this.canvas.height };
                const resizedDetections = faceapi.resizeResults(detections, displaySize);

                let smileDetected = false;

                resizedDetections.forEach(detection => {
                    const { box } = detection.detection;
                    const expressions = detection.expressions;

                    // Check if person is happy (smiling)
                    const happiness = expressions.happy;
                    const isSmiling = happiness > this.smileThreshold;

                    if (isSmiling) {
                        smileDetected = true;
                    }

                    // Draw box around face
                    this.ctx.strokeStyle = isSmiling ? '#10b981' : '#4f46e5';
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeRect(box.x, box.y, box.width, box.height);

                    // Draw label
                    const label = isSmiling ?
                        `Smiling! (${Math.round(happiness * 100)}%)` :
                        `Face (${Math.round(happiness * 100)}%)`;

                    this.ctx.fillStyle = isSmiling ? '#10b981' : '#4f46e5';
                    this.ctx.font = '16px Arial';
                    this.ctx.fillText(label, box.x, box.y - 10);

                    // Draw landmarks
                    const landmarks = detection.landmarks.positions;
                    this.ctx.fillStyle = isSmiling ? '#10b981' : '#4f46e5';
                    landmarks.forEach(point => {
                        this.ctx.beginPath();
                        this.ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
                        this.ctx.fill();
                    });
                });

                // Update detection status
                const topDetection = resizedDetections[0];
                const happiness = topDetection.expressions.happy;
                this.updateDetectionStatus(
                    smileDetected ?
                    `Smiling! (${Math.round(happiness * 100)}%)` :
                    `Face detected (${Math.round(happiness * 100)}%)`
                );

                // Auto-capture if smiling
                if (smileDetected && this.autoCapture) {
                    const now = Date.now();
                    if (now - this.lastCaptureTime > this.cooldownTime) {
                        this.captureImage();
                        this.lastCaptureTime = now;
                    }
                }
            } else {
                this.updateDetectionStatus('No face detected');
            }

        } catch (error) {
            console.error('Detection error:', error);
        }

        // Continue detection loop
        requestAnimationFrame(() => this.detectFaces());
    }

    captureImage() {
        // Create a temporary canvas to capture the video frame
        const captureCanvas = document.createElement('canvas');
        captureCanvas.width = this.video.videoWidth;
        captureCanvas.height = this.video.videoHeight;
        const captureCtx = captureCanvas.getContext('2d');

        // Draw video frame
        captureCtx.drawImage(this.video, 0, 0);

        // Convert to data URL
        const imageData = captureCanvas.toDataURL('image/jpeg', 0.9);

        // Add to gallery
        this.addToGallery(imageData);

        // Update counter
        this.captureCount++;
        this.captureCountEl.textContent = this.captureCount;

        // Flash effect
        this.showFlash();

        console.log('Image captured');
    }

    manualCapture() {
        if (!this.isRunning) return;
        this.captureImage();
        this.updateStatus('Manual capture saved!');
        setTimeout(() => this.updateStatus('Camera active - Smile!'), 2000);
    }

    showFlash() {
        const flash = document.createElement('div');
        flash.className = 'flash';
        this.video.parentElement.appendChild(flash);
        setTimeout(() => flash.remove(), 500);
    }

    addToGallery(imageData) {
        this.capturedImages.push(imageData);

        // Remove empty message if present
        const emptyMessage = this.gallery.querySelector('.empty-message');
        if (emptyMessage) {
            emptyMessage.remove();
        }

        // Create gallery item
        const item = document.createElement('div');
        item.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = imageData;
        img.alt = 'Captured smile';

        const actions = document.createElement('div');
        actions.className = 'gallery-item-actions';

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'gallery-item-btn';
        downloadBtn.textContent = 'Download';
        downloadBtn.onclick = () => this.downloadImage(imageData);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'gallery-item-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => this.deleteImage(item, imageData);

        actions.appendChild(downloadBtn);
        actions.appendChild(deleteBtn);
        item.appendChild(img);
        item.appendChild(actions);

        this.gallery.insertBefore(item, this.gallery.firstChild);

        // Enable gallery controls
        this.downloadAllBtn.disabled = false;
        this.clearGalleryBtn.disabled = false;
    }

    downloadImage(imageData, filename) {
        const link = document.createElement('a');
        link.href = imageData;
        link.download = filename || `smile_${new Date().getTime()}.jpg`;
        link.click();
    }

    deleteImage(item, imageData) {
        item.remove();
        const index = this.capturedImages.indexOf(imageData);
        if (index > -1) {
            this.capturedImages.splice(index, 1);
        }

        if (this.capturedImages.length === 0) {
            this.gallery.innerHTML = '<p class="empty-message">No captures yet. Smile to start!</p>';
            this.downloadAllBtn.disabled = true;
            this.clearGalleryBtn.disabled = true;
        }
    }

    downloadAll() {
        this.capturedImages.forEach((imageData, index) => {
            setTimeout(() => {
                this.downloadImage(imageData, `smile_${index + 1}_${new Date().getTime()}.jpg`);
            }, index * 100);
        });
    }

    clearGallery() {
        if (confirm('Are you sure you want to clear all captured images?')) {
            this.capturedImages = [];
            this.gallery.innerHTML = '<p class="empty-message">No captures yet. Smile to start!</p>';
            this.downloadAllBtn.disabled = true;
            this.clearGalleryBtn.disabled = true;
            this.captureCount = 0;
            this.captureCountEl.textContent = '0';
        }
    }

    updateStatus(message) {
        this.statusEl.textContent = message;
    }

    updateDetectionStatus(message) {
        this.detectionStatusEl.textContent = message;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Smile Detection Camera initialized');
    const camera = new SmileCamera();
});
