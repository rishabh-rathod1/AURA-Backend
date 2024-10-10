import React, { useState, useContext, useEffect, useCallback } from 'react';
import ToggleSwitch from '../../ToggleSwitch/ToggleSwitch';
import { IpAddressContext } from '../../IpAddressContext';

const VisionControls = ({ socket }) => {
  const { ipAddress } = useContext(IpAddressContext);
  const [mainLight, setMainLight] = useState(false);
  const [auxLight, setAuxLight] = useState(false);
  const [lastButtonState, setLastButtonState] = useState({ 4: false, 5: false });

  const handleGamepadInput = useCallback(() => {
    const gamepads = navigator.getGamepads();
    for (const gamepad of gamepads) {
      if (gamepad) {
        // Check left shoulder button (index 4) for auxiliary light
        if (gamepad.buttons[4].pressed !== lastButtonState[4]) {
          if (gamepad.buttons[4].pressed) {
            setAuxLight(prev => !prev);
          }
          setLastButtonState(prev => ({ ...prev, 4: gamepad.buttons[4].pressed }));
        }
        
        // Check right shoulder button (index 5) for main light
        if (gamepad.buttons[5].pressed !== lastButtonState[5]) {
          if (gamepad.buttons[5].pressed) {
            setMainLight(prev => !prev);
          }
          setLastButtonState(prev => ({ ...prev, 5: gamepad.buttons[5].pressed }));
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

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
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
    <div className='flex-3 m-3 rounded-2xl'>
      <div className="mx-auto max-w-fit px-2 sm:px-6 lg:px-8 bg-blue-500 rounded-full mt-2">
        <div className="h-8">
          <h1 className='text-base text-center pt-1 text-white'>Vision</h1>
        </div>
      </div>
      <div className='flex flex-col h-full rounded-2xl'>
        <div className='flex-1'>
          <h1 className='text-center mt-5'>
            <h1>Main Light</h1>
            <ToggleSwitch Name="MainLight" isOn={mainLight} handleToggle={() => setMainLight(!mainLight)} />
          </h1>
        </div>
        <div className='flex-1'>
          <h1 className='text-center pb-9'>
            <h1>Auxiliary Light</h1>
            <ToggleSwitch Name="AuxLight" isOn={auxLight} handleToggle={() => setAuxLight(!auxLight)} />
          </h1>
          IP Address: {ipAddress}
        </div>
      </div>
    </div>
  );
};

export default VisionControls;