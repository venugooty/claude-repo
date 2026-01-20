# Smile Detection Camera

A Python-based camera application that automatically captures images when it detects a person smiling. Perfect for creating fun photo collections, booth applications, or interactive installations.

## Features

- Real-time face detection using Haar Cascade classifiers
- Automatic smile detection and image capture
- Configurable capture cooldown to prevent duplicate shots
- Manual capture option with 's' key
- Visual feedback with bounding boxes around faces and smiles
- Customizable settings via JSON configuration
- Timestamp-based file naming
- Simple and intuitive interface

## Requirements

- Python 3.7 or higher
- Webcam or camera device
- Linux, macOS, or Windows

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd claude-repo
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Basic Usage

Run the application with default settings:

```bash
python smile_capture.py
```

### Controls

- **q**: Quit the application
- **s**: Manually capture an image
- The camera will automatically capture when it detects a smile

### Configuration

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

## How It Works

1. **Face Detection**: The application uses OpenCV's Haar Cascade classifier to detect faces in real-time
2. **Smile Detection**: For each detected face, it analyzes the lower half to detect smiles
3. **Auto-Capture**: When a smile is detected and the cooldown period has elapsed, it automatically saves the frame
4. **Visual Feedback**: Displays blue rectangles around faces and green rectangles around detected smiles

## Project Structure

```
claude-repo/
├── smile_capture.py       # Main application script
├── config.json           # Configuration file
├── requirements.txt      # Python dependencies
├── captured_smiles/      # Output directory for captured images
│   └── .gitkeep
└── README.md            # This file
```

## Troubleshooting

### Camera Not Opening

- Check that your camera is not being used by another application
- Try changing `camera_index` in config.json (0, 1, 2, etc.)
- Verify camera permissions on your system

### Smile Detection Too Sensitive/Not Sensitive

- Adjust `smile_threshold` in config.json:
  - Lower values (20-25): More sensitive, may have false positives
  - Higher values (35-45): Less sensitive, requires more obvious smiles

### Performance Issues

- Reduce resolution in config.json (e.g., [320, 240])
- Increase capture_cooldown to reduce processing

### No Window Displaying

- Ensure `display_window` is set to `true` in config.json
- Check that you're not running in a headless environment
- Install OpenCV with GUI support: `pip install opencv-python`

## Example Output

Captured images are saved with timestamps:
```
captured_smiles/
├── smile_20260120_143022.jpg
├── smile_20260120_143025.jpg
└── smile_20260120_143030.jpg
```

## Tips for Best Results

- Ensure good lighting conditions
- Position your face clearly in front of the camera
- Smile naturally - exaggerated expressions work better
- Keep a distance of 1-3 feet from the camera
- Avoid cluttered backgrounds when possible

## Technical Details

- Uses OpenCV's Haar Cascade classifiers (haarcascade_frontalface_default and haarcascade_smile)
- Face detection runs on grayscale conversion for better performance
- Smile detection analyzes region of interest (ROI) within detected faces
- Multi-scale detection with configurable parameters

## License

MIT License - Feel free to use and modify for your projects.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## Future Enhancements

Potential features for future development:
- Support for multiple face detection
- Emotion detection beyond smiles
- Cloud storage integration
- Web interface
- Video recording option
- Social media sharing
- Face recognition to organize photos by person

## Acknowledgments

Built with OpenCV and Python. Uses pre-trained Haar Cascade classifiers from the OpenCV project.
