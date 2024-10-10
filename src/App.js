import React, { useState, useContext, useCallback } from 'react';
import './App.css';
import WaterAnimation from './components/intro';
import Topbar from './components/Topbar';
import Mainframe from './components/Mainframe';
import ConnectPopup from './components/ConnectPopup';
import { IpAddressContext } from './IpAddressContext';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [socket, setSocket] = useState(null);
  const { setIpAddress } = useContext(IpAddressContext);

  const handleAnimationComplete = () => {
    setShowIntro(false);
    setShowPopup(true);
  };

  const handleConnect = useCallback((ipAddress) => {
    setIpAddress(ipAddress);
    const newSocket = new WebSocket(`ws://${ipAddress}:8765`);
    
    newSocket.onopen = () => {
      console.log('WebSocket connected');
      setSocket(newSocket);
      setShowPopup(false);
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      alert('Failed to connect to the server. Please check the IP address and try again.');
    };

    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
      setSocket(null);
    };
  }, [setIpAddress]);

  return (
    <div className="App">
      {showIntro ? (
        <WaterAnimation onAnimationComplete={handleAnimationComplete} />
      ) : showPopup ? (
        <ConnectPopup onConnect={handleConnect} />
      ) : (
        <div className="h-screen w-full">
          <Topbar />
          <Mainframe socket={socket} />
        </div>
      )}
    </div>
  );
}

export default App;