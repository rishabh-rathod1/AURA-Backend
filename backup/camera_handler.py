from picamera2 import Picamera2
from libcamera import controls
import threading
import time
import cv2
import numpy as np
from typing import Optional, Generator
from contextlib import contextmanager

class PiCameraHandler:
    def __init__(self):
        self.cameras = {
            0: None,  # Primary camera
            1: None   # Secondary camera
        }
        self.camera_locks = {
            0: threading.Lock(),
            1: threading.Lock()
        }
        self.is_running = {
            0: False,
            1: False
        }
        self.camera_configs = {
            0: None,
            1: None
        }
        self.frame_interval = 0.016  # ~60 FPS for better performance
    
    def initialize_camera(self, camera_id: int) -> bool:
        if camera_id not in self.cameras:
            return False
            
        try:
            with self.camera_locks[camera_id]:
                if self.cameras[camera_id] is None:
                    try:
                        self.cameras[camera_id] = Picamera2(camera_id)
                        # Increased resolution and quality settings
                        config = self.cameras[camera_id].create_preview_configuration(
                            main={"size": (1920, 1080), "format": "RGB888"},  # Full HD
                            buffer_count=4
                        )
                        self.cameras[camera_id].configure(config)
                        self.camera_configs[camera_id] = config
                        
                        # Enhanced camera settings with autofocus
                        self.cameras[camera_id].set_controls({
                            "FrameDurationLimits": (16666, 16666),  # ~60 FPS
                            "ExposureTime": 33333,  # Default exposure
                            "AnalogueGain": 1.0,    # Default gain
                            "NoiseReductionMode": 2, # Default noise reduction
                            "Brightness": 0.0,      # Default brightness
                            "Contrast": 1.0,        # Default contrast
                            "Saturation": 1.0,      # Default saturation
                            "Sharpness": 1.0,       # Default sharpness
                            "AeEnable": True,       # Auto exposure enabled
                            "AwbEnable": True,      # Auto white balance enabled
                            "AfMode": controls.AfModeEnum.Continuous,  # Continuous autofocus
                            "AfSpeed": controls.AfSpeedEnum.Normal,    # Normal autofocus speed
                            "AfRange": controls.AfRangeEnum.Normal,    # Full autofocus range
                            "AfMetering": controls.AfMeteringEnum.Auto,# Auto AF metering
                            "AfWindows": [[0, 0, 1, 1]],              # Full frame AF window
                            "AfTrigger": controls.AfTriggerEnum.Start # Start autofocus
                        })
                        
                        self.cameras[camera_id].start()
                        self.is_running[camera_id] = True
                        return True
                    except Exception as e:
                        print(f"Camera {camera_id} init error: {str(e)}")
                        self.cameras[camera_id] = None
                        return False
                return self.is_running[camera_id]
                
        except Exception as e:
            print(f"Camera {camera_id} error: {str(e)}")
            return False

    def generate_frames(self, camera_id: int) -> Generator[bytes, None, None]:
        if camera_id not in self.cameras:
            return

        if not self.is_running[camera_id]:
            self.initialize_camera(camera_id)

        last_frame_time = 0
        while True:
            current_time = time.time()
            if current_time - last_frame_time < self.frame_interval:
                time.sleep(0.001)
                continue

            with self.camera_locks[camera_id]:
                try:
                    if self.cameras[camera_id] is not None and self.is_running[camera_id]:
                        # Capture frame
                        frame = self.cameras[camera_id].capture_array()
                        
                        # Rotate camera 1 stream by 180 degrees
                        if camera_id == 0:
                            frame = cv2.rotate(frame, cv2.ROTATE_180)
                        
                        # Encode to JPEG with higher quality
                        ret, jpeg = cv2.imencode('.jpg', frame, [
                            cv2.IMWRITE_JPEG_QUALITY, 95,  # Increased JPEG quality
                            cv2.IMWRITE_JPEG_OPTIMIZE, 1
                        ])
                        frame_data = jpeg.tobytes()
                        
                        yield (b'--frame\r\n'
                               b'Content-Type: image/jpeg\r\n\r\n' + frame_data + b'\r\n')
                    else:
                        frame_data = self.generate_no_signal_frame()
                        yield (b'--frame\r\n'
                               b'Content-Type: image/jpeg\r\n\r\n' + frame_data + b'\r\n')
                    
                except Exception as e:
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + 
                           self.generate_no_signal_frame() + b'\r\n')
                
            last_frame_time = time.time()

    def generate_no_signal_frame(self) -> bytes:
        """Generate a 'Camera Not Available' frame"""
        # Updated resolution to match main camera resolution
        frame = np.full((1080, 1920, 3), 255, dtype=np.uint8)
        
        font = cv2.FONT_HERSHEY_SIMPLEX
        text = "Camera Not Available"
        font_scale = 2
        thickness = 2
        color = (0, 0, 0)
        
        text_size = cv2.getTextSize(text, font, font_scale, thickness)[0]
        text_x = (frame.shape[1] - text_size[0]) // 2
        text_y = (frame.shape[0] + text_size[1]) // 2
        
        cv2.putText(frame, text, (text_x, text_y), font, font_scale, color, thickness)
        
        ret, jpeg = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 95])
        return jpeg.tobytes()

# Create a singleton instance
camera_handler = PiCameraHandler()