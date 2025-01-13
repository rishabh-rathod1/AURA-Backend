import React, { useState, useEffect, useCallback } from 'react';
import Cameraview from './CameraFrame/CameraView';
import AnalyticsSuit from './Analytics/AnalyticsFrame';
import ControllerDisplay from './ControllerDisplay';
import Topbar from './Topbar';
import { Compass, Gauge, Navigation, Camera, Radio, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import FeaturePortal from './FeaturePortal';
import AutonomousControlPage from './Genesis';
import FloatingAutonomousButton from './FloatingAutonomousButton';
import AdvancedController from './AdvancedController';
import ConnectPopup from './ConnectPopup';






const TabControl = ({ active, onChange, options }) => (
  <div className="flex w-full border-b border-blue-100">
    {options.map((option) => (
      <button
        key={option.value}
        className={`flex-1 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
          active === option.value
            ? 'text-blue-900 border-b-2 border-blue-600 bg-white/10'
            : 'text-blue-600 hover:text-blue-900 hover:bg-white/5'
        }`}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const RECONNECT_TIMEOUT = 5000; // 5 seconds timeout for connection attempts
const MAX_RETRY_ATTEMPTS = 3;

const FEATURES = {
  thrusterPower: { name: 'Main Thruster Power', defaultLocked: false },
  frontThrusters: { name: 'Front Thrusters', defaultLocked: false },
  verticalThrusters: { name: 'Vertical Thrusters', defaultLocked: false },
  lightPower: { name: 'Main Lights', defaultLocked: false },
  spotlightPower: { name: 'Spotlight Intensity', defaultLocked: true },
  depthHold: { name: 'Depth Hold', defaultLocked: true },
  headingHold: { name: 'Heading Hold', defaultLocked: true },
  hoverMode: { name: 'Hover Mode', defaultLocked: true },
  cameraStabilization: { name: 'Camera Stabilization', defaultLocked: false },
  recordingMode: { name: 'Recording Mode', defaultLocked: false },
  cameraTilt: { name: 'Camera Tilt', defaultLocked: false },
  collisionAvoidance: { name: 'Collision Avoidance', defaultLocked: true },
  leakDetection: { name: 'Leak Detection', defaultLocked: false },
  batteryOptimization: { name: 'Battery Optimization', defaultLocked: true },
  emergencyMode: { name: 'Emergency Surface', defaultLocked: false }
};

const Mainframe = ({ socket, cameraData, sensorData, onConnect }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);
  const [activeController, setActiveController] = useState("basic");
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);
  const [lastConnectedIp, setLastConnectedIp] = useState('');
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [showConnectPopup, setShowConnectPopup] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');



  // Store the last connected IP
  useEffect(() => {
    if (socket) {
      const checkConnection = () => {
        const newStatus = socket.readyState === WebSocket.OPEN ? 'connected' 
                       : socket.readyState === WebSocket.CONNECTING ? 'connecting'
                       : 'disconnected';
        
        setConnectionStatus(newStatus);
        
        if (newStatus === 'connected') {
          setRetryCount(0);
          setShowConnectPopup(false); // Ensure popup is closed when connected
        } else if (newStatus === 'disconnected' && lastConnectedIp && !isReconnecting) {
          handleReconnect();
        }
      };

      checkConnection();
      const interval = setInterval(checkConnection, 1000);
      return () => clearInterval(interval);
    }
  }, [socket, lastConnectedIp]);

  // Load last connected IP from localStorage, but don't auto-connect if already connected
  useEffect(() => {
    const storedIp = localStorage.getItem('lastConnectedIp');
    if (storedIp) {
      setLastConnectedIp(storedIp);
      // Only attempt connection if not already connected
      if (socket?.readyState !== WebSocket.OPEN) {
        handleConnect(storedIp);
      }
    }
  }, []);

  const handleConnect = useCallback(async (ipAddress) => {
    // Don't attempt to connect if already connected
    if (socket?.readyState === WebSocket.OPEN) {
      setShowConnectPopup(false);
      return;
    }

    try {
      setIsReconnecting(true);
      setConnectionStatus('connecting');
      
      const connectPromise = onConnect(ipAddress);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), RECONNECT_TIMEOUT)
      );

      await Promise.race([connectPromise, timeoutPromise]);
      
      localStorage.setItem('lastConnectedIp', ipAddress);
      setLastConnectedIp(ipAddress);
      setRetryCount(0);
      setShowConnectPopup(false);
    } catch (error) {
      console.error('Connection failed:', error);
      setConnectionStatus('failed');
      
      if (retryCount < MAX_RETRY_ATTEMPTS) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => handleReconnect(), 1000);
      } else {
        // Only show popup if we're not connected and have exhausted retries
        if (socket?.readyState !== WebSocket.OPEN) {
          setShowConnectPopup(true);
        }
      }
    } finally {
      setIsReconnecting(false);
    }
  }, [onConnect, retryCount, socket]);

  const handleReconnect = useCallback(async () => {
    // Don't attempt to reconnect if already connected
    if (socket?.readyState === WebSocket.OPEN) {
      return;
    }

    if (!lastConnectedIp) {
      setShowConnectPopup(true);
      return;
    }

    if (!isReconnecting) {
      await handleConnect(lastConnectedIp);
    }
  }, [lastConnectedIp, isReconnecting, handleConnect, socket]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      setShowPermissionAlert(true);
      setTimeout(() => setShowPermissionAlert(false), 3000);
    }
  };

  if (isAutonomousMode) {
    return (
      <AutonomousControlPage 
        socket={socket}
        onExit={() => setIsAutonomousMode(false)} 
      />
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-cyan-100 via-teal-200 to-blue-300">
      <FloatingAutonomousButton 
        onActivate={() => setIsAutonomousMode(true)} 
      />

      <div className="fixed top-2 right-2 z-[60] flex gap-2">
        <button
          onClick={handleReconnect}
          disabled={isReconnecting}
          className={`p-1.5 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/50 group
            ${isReconnecting ? 'bg-blue-200/30' : 'bg-white/30 hover:bg-white/40'}
            ${connectionStatus === 'connected' ? 'border-green-500/50' : 'border-white/50'}`}
          title={`${connectionStatus === 'connected' ? 'Connected' : lastConnectedIp ? `Reconnect to ${lastConnectedIp}` : 'Connect to server'}`}
        >
          <RefreshCw 
            className={`w-4 h-4 
              ${isReconnecting ? 'animate-spin text-blue-700' : 'group-hover:rotate-180 transition-transform duration-500 text-blue-900'}
              ${connectionStatus === 'connected' ? 'text-green-600' : ''}`} 
          />
        </button>
        
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-300 backdrop-blur-sm border border-white/50"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-blue-900" />
          ) : (
            <Maximize2 className="w-4 h-4 text-blue-900" />
          )}
        </button>
      </div>

      <div className="flex flex-col h-full">
        <div className="flex-none">
          <Topbar />
        </div>

        {showPermissionAlert && (
          <div className="fixed top-14 left-1/2 transform -translate-x-1/2 z-[70] px-4 py-2 rounded bg-blue-500/20 border border-blue-300/50 text-blue-900 text-xs">
            Please allow fullscreen for the best experience
          </div>
        )}

        <div className="flex-1 flex flex-col min-h-0 px-2 pb-2">
          <div className="flex-[52] min-h-0 mb-2">
            <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border border-white/30 backdrop-blur-sm">
              <Cameraview socket={socket} cameraData={cameraData} />
            </div>
          </div>

          <div className="flex-[48] min-h-0">
            <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="h-full min-h-0">
                <div className="w-full h-full bg-gradient-to-r from-teal-50 via-cyan-100 to-blue-100 rounded-lg shadow-lg backdrop-blur-sm border border-white/40 overflow-hidden flex flex-col">
                  <div className="mx-auto max-w-fit px-2 sm:px-6 lg:px-8 bg-blue-500 rounded-full mt-3">
                    <div className="h-8">
                      <h1 className="text-base text-center pt-1 text-white">Command Control</h1>
                    </div>
                  </div>
                  <TabControl
                    active={activeController}
                    onChange={setActiveController}
                    options={[
                      { value: 'basic', label: 'Basic Control' },
                      { value: 'advanced', label: 'Advanced Control' }
                    ]}
                  />
                  <div className="flex-1 overflow-hidden">
                    {activeController === "basic" ? (
                      <ControllerDisplay socket={socket} />
                    ) : (
                      <AdvancedController socket={socket} />
                    )}
                  </div>
                </div>
              </div>

              <div className="h-full min-h-0">
                <div className="w-full h-full bg-gradient-to-r from-teal-50 via-cyan-100 to-blue-100 rounded-lg shadow-lg backdrop-blur-sm border border-white/40 overflow-hidden">
                  <AnalyticsSuit sensorData={sensorData} />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      {showConnectPopup && socket?.readyState !== WebSocket.OPEN && (
        <ConnectPopup 
          onConnect={handleConnect}
          onClose={() => setShowConnectPopup(false)}
        />
      )}
    </div>
  );
};

export default Mainframe;