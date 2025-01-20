import React, { useState, useContext, useEffect, useCallback } from 'react';
import { IpAddressContext } from '../../IpAddressContext';
import { Lightbulb, LightbulbOff, Gamepad } from 'lucide-react';

const VisionControls = ({ socket }) => {
  const { ipAddress } = useContext(IpAddressContext);
  const [mainLight, setMainLight] = useState(false);
  const [auxLight, setAuxLight] = useState(false);
  const [lastButtonState, setLastButtonState] = useState({ 1: false, 2: false });

  // Function to send light update command
  const sendLightCommand = useCallback((lightType, state) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const command = {
        command: 'update_lights',
      };
      
      // Only include the specific light that changed
      if (lightType === 'main') {
        command.main_light = state;
      } else if (lightType === 'aux') {
        command.aux_light = state;
      }

      socket.send(JSON.stringify(command));
    }
  }, [socket]);

  // Handle UI button clicks
  const handleMainLightToggle = useCallback(() => {
    const newState = !mainLight;
    setMainLight(newState);
    sendLightCommand('main', newState);
  }, [mainLight, sendLightCommand]);

  const handleAuxLightToggle = useCallback(() => {
    const newState = !auxLight;
    setAuxLight(newState);
    sendLightCommand('aux', newState);
  }, [auxLight, sendLightCommand]);

  // Handle gamepad input
  const handleGamepadInput = useCallback(() => {
    const gamepads = navigator.getGamepads();
    for (const gamepad of gamepads) {
      if (gamepad) {
        // Button 1 - Aux Light
        if (gamepad.buttons[1].pressed !== lastButtonState[1]) {
          if (gamepad.buttons[1].pressed) {
            const newState = !auxLight;
            setAuxLight(newState);
            sendLightCommand('aux', newState);
          }
          setLastButtonState(prev => ({ ...prev, 1: gamepad.buttons[1].pressed }));
        }

        // Button 2 - Main Light
        if (gamepad.buttons[2].pressed !== lastButtonState[2]) {
          if (gamepad.buttons[2].pressed) {
            const newState = !mainLight;
            setMainLight(newState);
            sendLightCommand('main', newState);
          }
          setLastButtonState(prev => ({ ...prev, 2: gamepad.buttons[2].pressed }));
        }
      }
    }
  }, [lastButtonState, auxLight, mainLight, sendLightCommand]);

  useEffect(() => {
    let animationFrameId;
    const gameLoop = () => {
      handleGamepadInput();
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [handleGamepadInput]);

  return (
    <div className="flex flex-col w-full h-full min-h-0 max-h-full overflow-y-auto">
      <div className="flex-1 flex flex-col space-y-4 p-3 sm:p-4 md:p-6">
        <div className="flex justify-center mb-2">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-full shadow-lg">
            <span className="text-xs sm:text-sm font-medium">Vision Controls</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {/* Main Light Control */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-md border border-slate-200">
            <div className="flex flex-col items-center space-y-2">
              <h2 className="text-xs sm:text-sm font-medium text-slate-700">Main Light</h2>
              <button
                onClick={handleMainLightToggle}
                className="p-2 bg-blue-500 text-white rounded"
              >
                {mainLight ? (
                  <Lightbulb className="w-6 h-6" />
                ) : (
                  <LightbulbOff className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Auxiliary Light Control */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-md border border-slate-200">
            <div className="flex flex-col items-center space-y-2">
              <h2 className="text-xs sm:text-sm font-medium text-slate-700">Aux Light</h2>
              <button
                onClick={handleAuxLightToggle}
                className="p-2 bg-blue-500 text-white rounded"
              >
                {auxLight ? (
                  <Lightbulb className="w-6 h-6" />
                ) : (
                  <LightbulbOff className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
          

          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-md border border-slate-200">
            <div className="text-center text-[10px] sm:text-xs text-slate-600 mt-4">
              IP Address: <span className="font-medium">{ipAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionControls;