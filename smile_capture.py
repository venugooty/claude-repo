#!/usr/bin/env python3
"""
Smile Detection Camera
Captures images automatically when a person smiles.
"""

import cv2
import os
import time
from datetime import datetime
import json


class SmileDetectionCamera:
    """Camera that captures images when detecting smiles."""

    def __init__(self, config_file='config.json'):
        """Initialize the smile detection camera."""
        self.load_config(config_file)
        self.setup_camera()
        self.setup_classifiers()
        self.last_capture_time = 0

        # Create output directory if it doesn't exist
        os.makedirs(self.output_dir, exist_ok=True)

    def load_config(self, config_file):
        """Load configuration from file or use defaults."""
        default_config = {
            "output_dir": "captured_smiles",
            "capture_cooldown": 2.0,
            "smile_threshold": 30,
            "camera_index": 0,
            "resolution": [640, 480],
            "display_window": True
        }

        if os.path.exists(config_file):
            with open(config_file, 'r') as f:
                config = json.load(f)
                default_config.update(config)

        self.output_dir = default_config['output_dir']
        self.capture_cooldown = default_config['capture_cooldown']
        self.smile_threshold = default_config['smile_threshold']
        self.camera_index = default_config['camera_index']
        self.resolution = default_config['resolution']
        self.display_window = default_config['display_window']

    def setup_camera(self):
        """Initialize the camera."""
        self.camera = cv2.VideoCapture(self.camera_index)
        self.camera.set(cv2.CAP_PROP_FRAME_WIDTH, self.resolution[0])
        self.camera.set(cv2.CAP_PROP_FRAME_HEIGHT, self.resolution[1])

        if not self.camera.isOpened():
            raise RuntimeError(f"Failed to open camera with index {self.camera_index}")

    def setup_classifiers(self):
        """Load Haar Cascade classifiers for face and smile detection."""
        # Load face cascade
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )

        # Load smile cascade
        self.smile_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_smile.xml'
        )

        if self.face_cascade.empty() or self.smile_cascade.empty():
            raise RuntimeError("Failed to load Haar Cascade classifiers")

    def detect_smile(self, frame):
        """
        Detect faces and smiles in the frame.

        Returns:
            tuple: (processed_frame, smile_detected)
        """
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces
        faces = self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )

        smile_detected = False

        # For each face, detect smiles
        for (x, y, w, h) in faces:
            # Draw rectangle around face
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)

            # Region of interest for smile detection (lower half of face)
            roi_gray = gray[y:y+h, x:x+w]
            roi_color = frame[y:y+h, x:x+w]

            # Detect smiles in the face region
            smiles = self.smile_cascade.detectMultiScale(
                roi_gray,
                scaleFactor=1.8,
                minNeighbors=self.smile_threshold,
                minSize=(25, 25)
            )

            # Draw rectangles around smiles
            for (sx, sy, sw, sh) in smiles:
                cv2.rectangle(
                    roi_color,
                    (sx, sy),
                    (sx+sw, sy+sh),
                    (0, 255, 0),
                    2
                )
                smile_detected = True

            # Add label
            label = "Smiling!" if len(smiles) > 0 else "Face"
            cv2.putText(
                frame,
                label,
                (x, y-10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.9,
                (0, 255, 0) if len(smiles) > 0 else (255, 0, 0),
                2
            )

        return frame, smile_detected

    def capture_image(self, frame):
        """Save the captured frame to disk."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"smile_{timestamp}.jpg"
        filepath = os.path.join(self.output_dir, filename)

        cv2.imwrite(filepath, frame)
        print(f"✓ Captured: {filename}")

        return filepath

    def run(self):
        """Main loop for smile detection and capture."""
        print("Smile Detection Camera Started!")
        print("="*50)
        print(f"Output directory: {self.output_dir}")
        print(f"Capture cooldown: {self.capture_cooldown}s")
        print(f"Press 'q' to quit, 's' to manually capture")
        print("="*50)

        capture_count = 0

        try:
            while True:
                ret, frame = self.camera.read()

                if not ret:
                    print("Failed to read frame from camera")
                    break

                # Detect smiles in the frame
                processed_frame, smile_detected = self.detect_smile(frame)

                # Check if enough time has passed since last capture
                current_time = time.time()
                cooldown_elapsed = (current_time - self.last_capture_time) >= self.capture_cooldown

                # Capture image if smile detected and cooldown elapsed
                if smile_detected and cooldown_elapsed:
                    self.capture_image(frame)
                    self.last_capture_time = current_time
                    capture_count += 1

                # Display status on frame
                status_text = f"Captures: {capture_count}"
                cv2.putText(
                    processed_frame,
                    status_text,
                    (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (0, 255, 255),
                    2
                )

                if smile_detected and not cooldown_elapsed:
                    cooldown_text = "Cooldown..."
                    cv2.putText(
                        processed_frame,
                        cooldown_text,
                        (10, 60),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.7,
                        (0, 165, 255),
                        2
                    )

                # Display the frame
                if self.display_window:
                    cv2.imshow('Smile Detection Camera', processed_frame)

                # Check for key presses
                key = cv2.waitKey(1) & 0xFF

                if key == ord('q'):
                    print("\nQuitting...")
                    break
                elif key == ord('s'):
                    # Manual capture
                    self.capture_image(frame)
                    print("Manual capture triggered")
                    capture_count += 1
                    self.last_capture_time = current_time

        except KeyboardInterrupt:
            print("\n\nInterrupted by user")

        finally:
            self.cleanup()
            print(f"\nTotal captures: {capture_count}")
            print("Camera stopped.")

    def cleanup(self):
        """Release resources."""
        self.camera.release()
        cv2.destroyAllWindows()


def main():
    """Entry point for the application."""
    try:
        camera = SmileDetectionCamera()
        camera.run()
    except Exception as e:
        print(f"Error: {e}")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
