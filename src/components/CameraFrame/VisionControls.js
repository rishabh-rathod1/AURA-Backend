import React, { useState, useContext, useEffect, useCallback } from 'react';
import ToggleSwitch from '../../ToggleSwitch/ToggleSwitch';
import { IpAddressContext } from '../../IpAddressContext';
import { Lightbulb, LightbulbOff, Gamepad } from 'lucide-react';

const VisionControls = ({ socket }) => {
  const { ipAddress } = useContext(IpAddressContext);
  const [mainLight, setMainLight] = useState(false);
  const [auxLight, setAuxLight] = useState(false);
  const [lastButtonState, setLastButtonState] = useState({ 1: false, 2: false });

  const handleGamepadInput = useCallback(() => {
    const gamepads = navigator.getGamepads();
    for (const gamepad of gamepads) {
      if (gamepad) {
        if (gamepad.buttons[1].pressed !== lastButtonState[1]) {
          if (gamepad.buttons[1].pressed) {
            setAuxLight(prev => !prev);
          }
          setLastButtonState(prev => ({ ...prev, 1: gamepad.buttons[1].pressed }));
        }

        if (gamepad.buttons[2].pressed !== lastButtonState[2]) {
          if (gamepad.buttons[2].pressed) {
            setMainLight(prev => !prev);
          }
          setLastButtonState(prev => ({ ...prev, 2: gamepad.buttons[2].pressed }));
        }
      }
    }
  }, [lastButtonState]);

  useEffect(() => {
    let animationFrameId;
    const gameLoop = () => {
      handleGamepadInput();
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [handleGamepadInput]);

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        command: 'update_lights',
        main_light: mainLight,
        aux_light: auxLight
      }));
    }
  }, [mainLight, auxLight, socket]);

  return (
    <div className="flex flex-col w-full h-full min-h-0 max-h-full overflow-y-auto">
      {/* Main Container with proper spacing and padding */}
      <div className="flex-1 flex flex-col space-y-4 p-3 sm:p-4 md:p-6">
        {/* Header - Responsive text size */}
        <div className="flex justify-center mb-2">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-full shadow-lg">
            <span className="text-xs sm:text-sm font-medium">Vision Controls</span>
          </div>
        </div>

        {/* Controls Grid - Responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {/* Main Light Control */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-md border border-slate-200">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                {mainLight ? (
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                ) : (
                  <LightbulbOff className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                )}
                <h2 className="text-xs sm:text-sm font-medium text-slate-700">Main Light</h2>
              </div>
              <ToggleSwitch
                Name="MainLight"
                isOn={mainLight}
                handleToggle={() => setMainLight(!mainLight)}
              />
            </div>
          </div>

          {/* Auxiliary Light Control */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-md border border-slate-200">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                {auxLight ? (
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                ) : (
                  <LightbulbOff className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                )}
                <h2 className="text-xs sm:text-sm font-medium text-slate-700">Aux Light</h2>
              </div>
              <ToggleSwitch
                Name="AuxLight"
                isOn={auxLight}
                handleToggle={() => setAuxLight(!auxLight)}
              />
            </div>
          </div>
        </div>

        {/* Footer Information - Stacked on mobile, side by side on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
          {/* Gamepad Info */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-md border border-slate-200">
            <div className="flex items-center justify-center space-x-2">
              <Gamepad className="w-10 h-10 sm:w-10 sm:h-10" />
              <span className="text-[10px] sm:text-xs text-slate-600">
                Button 1: Aux Light | Button 2: Main Light
              </span>
            </div>
          </div>

          {/* IP Address Display */}
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