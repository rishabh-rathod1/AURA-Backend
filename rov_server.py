import asyncio
import websockets
import json
from flask import Flask, render_template, Response, send_from_directory
import cv2
import threading
import os

# Original Flask app for video streaming
app = Flask(__name__)

# New Flask app for Three.js viewer
viewer_app = Flask(__name__, 
                  static_folder='static',
                  template_folder='templates')

# Video stream URL
video_url = "https://cdn.pixabay.com/video/2022/03/15/110877-689510466_tiny.mp4"

# Original video streaming function
def generate_video_stream():
    while True:
        cap = cv2.VideoCapture(video_url)
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue
            _, jpeg = cv2.imencode('.jpg', frame)
            frame_bytes = jpeg.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        cap.release()

# Original routes for app
@app.route('/camera/0')
def camera_0():
    return Response(generate_video_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/camera/1')
def camera_1():
    return Response(generate_video_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
    return render_template('index.html')

# Routes for viewer_app (Three.js viewer)
@viewer_app.route('/')
def viewer_index():
    return render_template('viewer.html')

@viewer_app.route('/models/<path:filename>')
def serve_model(filename):
    models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
    return send_from_directory(models_dir, filename)

# Original ROV control function
def control_rov(command):
    if 'buttons' in command:
        for i, button_state in enumerate(command['buttons']):
            if button_state:
                print(f"Button {i} pressed")
    
    if 'axes' in command:
        for i, axis_value in enumerate(command['axes']):
            if abs(axis_value) > 0.1:
                print(f"Axis {i}: {axis_value:.2f}")

# Original WebSocket handler
# WebSocket handler with change tracking
previous_axes = None
previous_buttons = None

async def handle_websocket(websocket, path):
    global previous_axes, previous_buttons
    try:
        async for message in websocket:
            data = json.loads(message)
            
            # Process gamepad-related messages
            if 'axes' in data or 'buttons' in data:
                changed_axes = False
                changed_buttons = False
                
                # Track axes changes
                if 'axes' in data:
                    if previous_axes is None:
                        previous_axes = [0] * len(data['axes'])
                    
                    for i, (current, previous) in enumerate(zip(data['axes'], previous_axes)):
                        # Only log significant changes (threshold of 0.1)
                        if abs(current - previous) > 0.1:
                            print(f"Axis {i} changed: {current:.2f}")
                            changed_axes = True
                    
                    previous_axes = data['axes']
                
                # Track button changes
                if 'buttons' in data:
                    if previous_buttons is None:
                        previous_buttons = [0] * len(data['buttons'])
                    
                    for i, (current, previous) in enumerate(zip(data['buttons'], previous_buttons)):
                        # Log button state changes
                        if current != previous:
                            if current:
                                print(f"Button {i} pressed")
                                changed_buttons = True
                    
                    previous_buttons = data['buttons']
                
                # Send acknowledgment if any changes occurred
                if changed_axes or changed_buttons:
                    await websocket.send(json.dumps({"status": "success", "message": "Input received"}))
            
            # Process advanced controller updates
            elif 'command' in data and data['command'] == 'update':
                changed_advanced_settings = False
                
                # Remove 'command' from the data to process other settings
                data.pop('command', None)
                
                # Print out each advanced controller setting update
                for key, value in data.items():
                    print(f"Advanced Controller - {key}: {value}")
                    changed_advanced_settings = True
                
                # Send acknowledgment for advanced controller updates
                if changed_advanced_settings:
                    await websocket.send(json.dumps({"status": "success", "message": "Advanced settings received"}))
    
    except websockets.exceptions.ConnectionClosed:
        pass
        
async def websocket_server():
    server = await websockets.serve(handle_websocket, "localhost", 8765)
    print("WebSocket server started on ws://localhost:8765")
    print("Waiting for controller input...")
    await server.wait_closed()

def start_flask_app():
    app.run(host='0.0.0.0', port=5000, threaded=True)

def start_viewer_app():
    viewer_app.run(host='0.0.0.0', port=5001, threaded=True)

if __name__ == "__main__":
    # Start both Flask apps and WebSocket server concurrently
    threading.Thread(target=start_flask_app, daemon=True).start()
    threading.Thread(target=start_viewer_app, daemon=True).start()
    asyncio.run(websocket_server())