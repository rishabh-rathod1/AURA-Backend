from flask import Flask, Response, render_template_string, jsonify
import cv2
import numpy as np
from tensorflow.keras.models import load_model
import requests
from threading import Thread
import numpy as np
from flask_cors import CORS
import time
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# HTML template remains the same as before
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Crack Detection Stream</title>
    <style>
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .stream-container { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .stream { width: 48%; }
        .stats { background: #f5f5f5; padding: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Crack Detection Stream</h1>
        <div class="stream-container">
            <div class="stream">
                <h2>Raw Stream</h2>
                <img src="{{ url_for('raw_feed') }}" width="100%">
            </div>
            <div class="stream">
                <h2>Detection Stream</h2>
                <img src="{{ url_for('detection_feed') }}" width="100%">
            </div>
        </div>
        <div class="stats" id="stats">
            <h2>Statistics</h2>
            <p>Loading stats...</p>
        </div>
    </div>
    <script>
        function updateStats() {
            fetch('/stats')
                .then(response => response.json())
                .then(data => {
                    const statsHtml = `
                        <h2>Statistics</h2>
                        <p>Connection Status: ${data.connection_status}</p>
                        <p>Confidence: ${data.confidence}%</p>
                        <p>Crack Detected: ${data.crack_detected}</p>
                        <p>Number of Cracks: ${data.crack_count}</p>
                        <p>Largest Crack: ${data.largest_crack} cm</p>
                        <p>Average Width: ${data.avg_width} mm</p>
                    `;
                    document.getElementById('stats').innerHTML = statsHtml;
                });
        }
        setInterval(updateStats, 1000);
    </script>
</body>
</html>
'''

app = Flask(__name__)
CORS(app)

class StreamDetector:
    def __init__(self, stream_url, model_path, input_size=(128, 128), retry_interval=5):
        self.stream_url = stream_url
        self.model = load_model(model_path)
        self.input_size = input_size
        self.bytes = bytes()
        self.frame = None
        self.current_confidence = 0
        self.crack_detected = False
        self.crack_count = 0
        self.largest_crack = 0
        self.avg_width = 0
        self.retry_interval = retry_interval
        self.is_connected = False
        self.session = requests.Session()
        
        # Start frame capturing thread
        self.thread = Thread(target=self._capture_stream_with_retry, daemon=True)
        self.thread.start()

    def _capture_stream_with_retry(self):
        while True:
            try:
                logger.info("Attempting to connect to stream...")
                response = self.session.get(self.stream_url, stream=True, timeout=10)
                
                if response.status_code == 200:
                    logger.info("Successfully connected to stream")
                    self.is_connected = True
                    
                    # Process the stream
                    bytes_buffer = bytes()
                    for chunk in response.iter_content(chunk_size=1024):
                        bytes_buffer += chunk
                        a = bytes_buffer.find(b'\xff\xd8')
                        b = bytes_buffer.find(b'\xff\xd9')
                        
                        if a != -1 and b != -1:
                            jpg = bytes_buffer[a:b+2]
                            bytes_buffer = bytes_buffer[b+2:]
                            
                            # Decode the frame
                            frame = cv2.imdecode(np.frombuffer(jpg, dtype=np.uint8), cv2.IMREAD_COLOR)
                            if frame is not None:
                                self.frame = frame
                                self.bytes = bytes_buffer
                            else:
                                logger.warning("Failed to decode frame")
                                self.is_connected = False
                                break
                else:
                    logger.warning(f"Stream returned status code: {response.status_code}")
                    self.is_connected = False
                    
            except Exception as e:
                logger.error(f"Stream connection error: {str(e)}")
                self.is_connected = False
                
            if not self.is_connected:
                logger.info(f"Retrying in {self.retry_interval} seconds...")
                time.sleep(self.retry_interval)

    def preprocess_frame(self, frame):
        processed = cv2.resize(frame, self.input_size)
        processed = processed.astype('float32') / 255.0
        processed = np.expand_dims(processed, axis=0)
        return processed
    
    def detect_cracks(self, frame):
        if frame is None:
            return None
            
        try:
            visualization = frame.copy()
            processed_frame = self.preprocess_frame(frame)
            prediction = 1 - self.model.predict(processed_frame, verbose=0)[0][0]
            self.current_confidence = prediction * 100
            
            if prediction > 0.5:
                self.crack_detected = True
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                blurred = cv2.GaussianBlur(gray, (5, 5), 0)
                edges = cv2.Canny(blurred, 50, 150)
                contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                
                self.crack_count = len(contours)
                if contours:
                    crack_lengths = [cv2.arcLength(cnt, True) for cnt in contours]
                    self.largest_crack = max(crack_lengths) / 100
                    self.avg_width = sum(crack_lengths) / len(crack_lengths) / 1000
                
                cv2.drawContours(visualization, contours, -1, (0, 0, 255), 2)
            else:
                self.crack_detected = False
                self.crack_count = 0
                self.largest_crack = 0
                self.avg_width = 0
            
            return visualization
            
        except Exception as e:
            logger.error(f"Error in crack detection: {e}")
            return frame

    def generate_raw_frames(self):
        last_frame_time = 0
        frame_interval = 1.0 / 30  # 30 FPS

        while True:
            current_time = time.time()
            if current_time - last_frame_time < frame_interval:
                time.sleep(0.001)  # Small sleep to prevent CPU overuse
                continue

            if self.frame is not None and self.is_connected:
                frame_resized = cv2.resize(self.frame, (800, 450))
                ret, buffer = cv2.imencode('.jpg', frame_resized)
                frame_bytes = buffer.tobytes()
            else:
                placeholder = np.zeros((450, 800, 3), dtype=np.uint8)
                cv2.putText(placeholder, "Waiting for stream...", (250, 225),
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                ret, buffer = cv2.imencode('.jpg', placeholder)
                frame_bytes = buffer.tobytes()

            last_frame_time = current_time
            yield (b'--frame\r\n'
                  b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    def generate_detection_frames(self):
        last_frame_time = 0
        frame_interval = 1.0 / 30  # 30 FPS

        while True:
            current_time = time.time()
            if current_time - last_frame_time < frame_interval:
                time.sleep(0.001)  # Small sleep to prevent CPU overuse
                continue

            if self.frame is not None and self.is_connected:
                detection_frame = self.detect_cracks(self.frame)
                if detection_frame is not None:
                    frame_resized = cv2.resize(detection_frame, (800, 450))
                    ret, buffer = cv2.imencode('.jpg', frame_resized)
                    frame_bytes = buffer.tobytes()
            else:
                placeholder = np.zeros((450, 800, 3), dtype=np.uint8)
                cv2.putText(placeholder, "Waiting for stream...", (250, 225),
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                ret, buffer = cv2.imencode('.jpg', placeholder)
                frame_bytes = buffer.tobytes()

            last_frame_time = current_time
            yield (b'--frame\r\n'
                  b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    def get_current_stats(self):
        return {
            'connection_status': 'connected' if self.is_connected else 'disconnected',
            'confidence': round(self.current_confidence, 1),
            'crack_detected': self.crack_detected,
            'crack_count': self.crack_count,
            'largest_crack': round(self.largest_crack, 2),
            'avg_width': round(self.avg_width, 2)
        }

detector = None

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

@app.route('/raw_feed')
def raw_feed():
    return Response(detector.generate_raw_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detection_feed')
def detection_feed():
    return Response(detector.generate_detection_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/stats')
def get_stats():
    return jsonify(detector.get_current_stats())

if __name__ == "__main__":
    try:
        stream_url = 'http://192.168.2.1:5000/camera/1'
        detector = StreamDetector(
            stream_url=stream_url,
            model_path='crackDetectionModels/best_model.keras',
            retry_interval=5
        )
        app.run(host='0.0.0.0', port=8000, threaded=True)
    except Exception as e:
        logger.error(f"Server initialization error: {str(e)}")