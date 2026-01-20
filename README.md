# Smile Detection Camera

An AI-powered camera application that automatically captures images when it detects a person smiling. Available as both a web application and a Python desktop application.

## 🌐 Try It Online!

**[Launch Web App →](https://venugooty.github.io/claude-repo/)**

No installation required! Just click the link above to use the smile detection camera directly in your browser.

## 📋 Two Ways to Use

### Option 1: Web Application (Recommended)
- **No installation needed** - runs directly in your browser
- Modern AI-powered face detection using TensorFlow.js
- Beautiful, responsive interface
- Works on desktop and mobile devices
- All processing happens locally - your privacy is protected

### Option 2: Python Desktop Application
- Standalone application for Windows, macOS, and Linux
- Uses OpenCV for fast face detection
- Configurable via JSON file
- Ideal for offline use or integration into other projects

## Features

### Web Application
- Real-time face detection and expression analysis
- Automatic smile detection and image capture
- Adjustable smile sensitivity slider
- Configurable capture cooldown
- Manual capture button
- Image gallery with download and delete options
- Download all captures at once
- Modern, responsive UI
- Works offline after initial load
- No data sent to servers - 100% client-side processing

### Python Desktop Application
- Real-time face detection using Haar Cascade classifiers
- Automatic smile detection and image capture
- Configurable capture cooldown
- Manual capture with keyboard shortcut
- Visual feedback with bounding boxes
- JSON-based configuration
- Timestamp-based file naming

## Requirements

### Web Application
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Webcam or camera device
- Internet connection (only for initial load)

### Python Desktop Application
- Python 3.7 or higher
- Webcam or camera device
- Linux, macOS, or Windows

## 🚀 Quick Start

### Web Application (No Installation)

1. Visit **[https://venugooty.github.io/claude-repo/](https://venugooty.github.io/claude-repo/)**
2. Click "Start Camera" and allow camera access
3. Smile at the camera and watch it automatically capture!

### Python Desktop Application

1. Clone this repository:
```bash
git clone <repository-url>
cd claude-repo
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python smile_capture.py
```

## 📖 Detailed Usage

### Web Application

1. **Start Camera**: Click the "Start Camera" button and grant camera permissions
2. **Adjust Settings**:
   - Use the **Smile Sensitivity** slider to control detection (lower = more sensitive)
   - Adjust **Capture Cooldown** to set time between automatic captures
   - Toggle **Auto-capture** on/off for automatic vs. manual-only mode
3. **Capture Images**:
   - Smile naturally - the app will automatically capture when you smile
   - Click "Manual Capture" button to take a photo anytime
4. **Manage Gallery**:
   - View all captured images in the gallery
   - Download individual images or all at once
   - Delete unwanted captures
5. **Stop Camera**: Click "Stop Camera" when finished

### Python Desktop Application

#### Basic Usage

Run the application with default settings:

```bash
python smile_capture.py
```

#### Controls

- **q**: Quit the application
- **s**: Manually capture an image
- The camera will automatically capture when it detects a smile

#### Configuration

Edit `config.json` to customize the behavior:

```json
{
  "output_dir": "captured_smiles",      // Directory for saved images
  "capture_cooldown": 2.0,              // Seconds between auto-captures
  "smile_threshold": 30,                // Sensitivity (lower = more sensitive)
  "camera_index": 0,                    // Camera device index
  "resolution": [640, 480],             // Camera resolution [width, height]
  "display_window": true                // Show camera preview window
}
```

#### Configuration Parameters

- **output_dir**: Directory where captured images will be saved
- **capture_cooldown**: Minimum time (in seconds) between automatic captures to avoid duplicates
- **smile_threshold**: Number of neighbors required for smile detection (20-40 recommended, lower values are more sensitive)
- **camera_index**: Index of the camera device (usually 0 for built-in camera, 1+ for external cameras)
- **resolution**: Camera resolution as [width, height] in pixels
- **display_window**: Whether to show the camera preview window (set to false for headless operation)

## 🔧 How It Works

### Web Application
1. **AI Models Loading**: Loads TensorFlow.js face detection and expression recognition models
2. **Camera Access**: Uses WebRTC API to access your device camera
3. **Real-time Analysis**: Continuously analyzes video frames for faces and expressions
4. **Smile Detection**: Uses neural networks to detect happiness/smiling expressions
5. **Auto-Capture**: Captures and saves images when smile confidence exceeds threshold
6. **Local Processing**: All processing happens in your browser - no data sent to servers

### Python Desktop Application
1. **Face Detection**: Uses OpenCV's Haar Cascade classifier to detect faces in real-time
2. **Smile Detection**: Analyzes the lower half of detected faces to identify smiles
3. **Auto-Capture**: When a smile is detected and the cooldown period has elapsed, it automatically saves the frame
4. **Visual Feedback**: Displays blue rectangles around faces and green rectangles around detected smiles

## 📁 Project Structure

```
claude-repo/
├── index.html            # Web application - main HTML
├── app.js               # Web application - JavaScript logic
├── style.css            # Web application - styling
├── smile_capture.py     # Python desktop application
├── config.json          # Python app configuration
├── requirements.txt     # Python dependencies
├── captured_smiles/     # Output directory for Python app
├── _config.yml          # GitHub Pages configuration
└── README.md            # This documentation
```

## 🔧 Troubleshooting

### Web Application

#### Camera Not Working
- **Permissions**: Ensure you've granted camera access when prompted
- **HTTPS Required**: The app must be served over HTTPS (GitHub Pages handles this)
- **Browser Support**: Use a modern browser (Chrome, Firefox, Safari, Edge)
- **Check Other Apps**: Close other applications using the camera
- **Private/Incognito Mode**: May block camera access in some browsers

#### Models Not Loading
- **Check Internet**: Initial load requires internet to download AI models
- **Try Refreshing**: Refresh the page to retry model loading
- **Clear Cache**: Try clearing browser cache and reloading

#### Detection Not Working
- **Lighting**: Ensure good lighting on your face
- **Distance**: Position yourself 1-3 feet from camera
- **Adjust Sensitivity**: Use the smile sensitivity slider
- **Face the Camera**: Look directly at the camera

#### Performance Issues
- **Close Tabs**: Close unnecessary browser tabs
- **Update Browser**: Ensure you're using the latest browser version
- **Hardware Acceleration**: Enable hardware acceleration in browser settings

### Python Desktop Application

#### Camera Not Opening
- Check that your camera is not being used by another application
- Try changing `camera_index` in config.json (0, 1, 2, etc.)
- Verify camera permissions on your system

#### Smile Detection Too Sensitive/Not Sensitive
- Adjust `smile_threshold` in config.json:
  - Lower values (20-25): More sensitive, may have false positives
  - Higher values (35-45): Less sensitive, requires more obvious smiles

#### Performance Issues
- Reduce resolution in config.json (e.g., [320, 240])
- Increase capture_cooldown to reduce processing

#### No Window Displaying
- Ensure `display_window` is set to `true` in config.json
- Check that you're not running in a headless environment
- Install OpenCV with GUI support: `pip install opencv-python`

## 📸 Example Output

### Web Application
- Images are displayed in an interactive gallery
- Click to download individual images
- Download all captures at once
- Delete unwanted images

### Python Desktop Application
Captured images are saved with timestamps:
```
captured_smiles/
├── smile_20260120_143022.jpg
├── smile_20260120_143025.jpg
└── smile_20260120_143030.jpg
```

## 💡 Tips for Best Results

- **Lighting**: Ensure good, even lighting on your face
- **Positioning**: Keep your face centered and 1-3 feet from the camera
- **Smile Naturally**: Exaggerated expressions work better for detection
- **Look at Camera**: Face the camera directly for best detection
- **Clean Background**: Avoid cluttered backgrounds when possible
- **Adjust Sensitivity**: Fine-tune the smile threshold for your preference
- **Good Connection**: Ensure stable internet for initial web app load

## 🔬 Technical Details

### Web Application
- **Frontend**: Pure HTML5, CSS3, and JavaScript (ES6+)
- **AI Framework**: TensorFlow.js with face-api.js wrapper
- **Face Detection**: TinyFaceDetector model (lightweight and fast)
- **Expression Recognition**: Face Expression Net (neural network)
- **Camera Access**: WebRTC getUserMedia API
- **Processing**: 100% client-side, no server communication
- **Hosting**: GitHub Pages (static site hosting)
- **Privacy**: All processing local to your device

### Python Desktop Application
- **Computer Vision**: OpenCV (cv2)
- **Face Detection**: Haar Cascade classifiers (haarcascade_frontalface_default)
- **Smile Detection**: Haar Cascade classifier (haarcascade_smile)
- **Image Processing**: Grayscale conversion for performance
- **Multi-scale Detection**: Configurable detection parameters
- **Real-time Processing**: Continuous frame analysis

## 🚀 Deploying to GitHub Pages

This project is already configured for GitHub Pages! To deploy your own version:

1. Fork or clone this repository to your GitHub account
2. Go to repository Settings → Pages
3. Under "Source", select the branch (e.g., `main` or `claude/smile-detection-camera-cGlT8`)
4. Click Save
5. Your site will be published at `https://your-username.github.io/your-repo-name/`

The web application will work immediately - no build process required!

## 📄 License

MIT License - Feel free to use and modify for your projects.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 🎯 Future Enhancements

Potential features for future development:
- **Multiple Face Support**: Detect and capture multiple people simultaneously
- **Emotion Range**: Detect other emotions (surprise, joy, sadness)
- **Cloud Storage**: Integrate with cloud services for backup
- **Video Recording**: Record video clips alongside photos
- **Social Sharing**: Direct sharing to social media platforms
- **Face Recognition**: Organize photos by person
- **Filters & Effects**: Apply real-time filters and effects
- **Mobile App**: Native iOS and Android applications
- **Analytics**: Track smile frequency and patterns over time

## 🙏 Acknowledgments

### Web Application
- Built with [face-api.js](https://github.com/justadudewhohacks/face-api.js) by Vincent Mühler
- Powered by [TensorFlow.js](https://www.tensorflow.org/js)
- Models trained on public datasets

### Python Desktop Application
- Built with [OpenCV](https://opencv.org/)
- Uses pre-trained Haar Cascade classifiers from the OpenCV project

## 🌟 Star This Project

If you find this project useful, please consider giving it a star on GitHub!

---

**Made with ❤️ for capturing smiles around the world**
