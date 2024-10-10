import asyncio
import websockets
import json

def control_rov(command):
    if 'buttons' in command:
        for i, button_state in enumerate(command['buttons']):
            if button_state:
                print(f"Button {i} pressed")
    
    if 'axes' in command:
        for i, axis_value in enumerate(command['axes']):
            if abs(axis_value) > 0.1:  # Only print if the axis value is significant
                print(f"Axis {i}: {axis_value:.2f}")

async def handle_websocket(websocket, path):
    try:
        async for message in websocket:
            data = json.loads(message)
            command = data.get('command')
            if command == 'update':
                control_rov(data)
                await websocket.send(json.dumps({"status": "success", "message": "Received controller update"}))
            else:
                await websocket.send(json.dumps({"status": "error", "message": "Invalid command"}))
    except websockets.exceptions.ConnectionClosed:
        pass

async def main():
    server = await websockets.serve(handle_websocket, "localhost", 8765)
    print("WebSocket server started on ws://localhost:8765")
    print("Waiting for controller input...")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())