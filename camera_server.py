import asyncio
import websockets
import cv2
import base64
import json
import time
import random

# Function to generate mock sensor data
def generate_mock_data():
    return {
        "depth": round(random.uniform(8.5, 10.5), 2),
        "temperature": round(random.uniform(20.0, 25.0), 1),
        "pressure": round(random.uniform(1010.0, 1015.0), 2),
        "battery": random.randint(80, 100)
    }

# Custom CORS handler
async def process_request(path, request_headers):
    # Allow requests from any origin (replace "*" with specific domain if needed)
    origin = request_headers.get("Origin")
    if origin:
        return (
            200,
            [("Access-Control-Allow-Origin", "*")],  # Allow all origins
        )
    return None  # Proceed with the WebSocket handshake

async def send_data(websocket, path):
    cap = cv2.VideoCapture(0)
    
    # Set lower resolution for faster processing
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    # Increase FPS
    cap.set(cv2.CAP_PROP_FPS, 30)

    try:
        last_frame_time = time.time()
        while True:
            try:
                # Limit frame rate to reduce lag
                current_time = time.time()
                if current_time - last_frame_time < 1/30:  # Aim for 30 FPS
                    await asyncio.sleep(0.01)
                    continue

                ret, frame = cap.read()
                if not ret:
                    print("Failed to capture frame")
                    await asyncio.sleep(0.1)
                    continue

                # Resize frame for faster processing and transmission
                frame = cv2.resize(frame, (320, 240))

                # Encode frame as JPEG with lower quality for faster transmission
                encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 70]
                _, buffer = cv2.imencode('.jpg', frame, encode_param)
                jpg_as_text = base64.b64encode(buffer).decode('utf-8')

                await websocket.send(json.dumps({
                    "type": "camera",
                    "camera": "camera1",
                    "frame": jpg_as_text
                }))

                # Send sensor data less frequently
                if int(current_time) % 5 == 0:  # Every 5 seconds
                    mock_data = generate_mock_data()
                    await websocket.send(json.dumps({
                        "type": "sensor",
                        "data": mock_data
                    }))

                last_frame_time = current_time

            except websockets.exceptions.ConnectionClosed:
                print("Client disconnected. Waiting for new connection.")
                break
            except Exception as e:
                print(f"Error occurred: {e}")
                await asyncio.sleep(0.1)

    finally:
        cap.release()

async def main():
    server = await websockets.serve(
        send_data, 
        "localhost", 
        8765, 
        process_request=process_request  # Add the custom CORS handler
    )
    print("Server started. Waiting for connections...")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
