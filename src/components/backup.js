import React, { useState,useEffect } from 'react';
import Cameraview from './CameraFrame/CameraView';
import AnalyticsSuit from './Analytics/AnalyticsFrame';
import ControllerDisplay from './ControllerDisplay';

import Topbar from './Topbar';
import { Compass, Gauge, Navigation, Camera, Radio, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';
import FeaturePortal from './FeaturePortal';
import AutonomousControlPage from './Genesis';
import FloatingAutonomousButton from './FloatingAutonomousButton';
import AdvancedController from './AdvancedController';

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

const Mainframe = ({ socket, cameraData, sensorData }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);
  const [activeController, setActiveController] = useState("basic");
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);
  const [lastConnectedIp, setLastConnectedIp] = useState('');
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [showConnectPopup, setShowConnectPopup] = useState(false);

  // Store the last connected IP
  useEffect(() => {
    const storedIp = localStorage.getItem('lastConnectedIp');
    if (storedIp) {
      setLastConnectedIp(storedIp);
    }
  }, []);

  const handleConnect = (ipAddress) => {
    localStorage.setItem('lastConnectedIp', ipAddress);
    setLastConnectedIp(ipAddress);
    onConnect(ipAddress);
    setShowConnectPopup(false);
  };

  const handleReconnect = async () => {
    if (!lastConnectedIp) {
      setShowConnectPopup(true);
      return;
    }

    setIsReconnecting(true);
    try {
      await onConnect(lastConnectedIp);
    } catch (error) {
      console.error('Reconnection failed:', error);
    } finally {
      setIsReconnecting(false);
    }
  };
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const attemptFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        setShowPermissionAlert(true);
        setTimeout(() => setShowPermissionAlert(false), 3000);
      }
    };

    attemptFullscreen();
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

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
          className="p-1.5 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-300 backdrop-blur-sm border border-white/50 group"
          title={lastConnectedIp ? `Reconnect to ${lastConnectedIp}` : 'Connect to server'}
        >
          <RefreshCw className={`w-4 h-4 text-blue-900 ${isReconnecting ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
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
      {showConnectPopup && (
        <ConnectPopup 
          onConnect={handleConnect}
          onClose={() => setShowConnectPopup(false)}
        />
      )}

    </div>
  );
};

export default Mainframe;