import React, { useState,useEffect } from 'react';
import Cameraview from './CameraFrame/CameraView';
import AnalyticsSuit from './Analytics/AnalyticsFrame';
import ControllerDisplay from './ControllerDisplay';
import Topbar from './Topbar';
import { Compass, Gauge, Navigation, Camera, Radio } from 'lucide-react';
import { Maximize2, Minimize2 } from 'lucide-react';
import FeaturePortal from './FeaturePortal';
import AutonomousControlPage from './Genesis';
import FloatingAutonomousButton from './FloatingAutonomousButton';



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

// Custom Toggle Switch Component
const Toggle = ({ checked, onChange, className = '' }) => (
  <button
    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
      checked ? 'bg-blue-600' : 'bg-gray-300'
    } ${className}`}
    onClick={() => onChange?.(!checked)}
    role="switch"
    aria-checked={checked}
  >
    <div
      className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

const Slider = ({ label, value, onChange, min = 0, max = 100, unit = '%' }) => (
  <div>
    <label className="text-sm text-blue-900 mb-1 block">{label}</label>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value}
      onChange={(e) => onChange?.(parseInt(e.target.value))}
      className="w-full accent-blue-600"
    />
    <div className="text-right text-sm text-blue-900">{value}{unit}</div>
  </div>
);





const AdvancedController = () => {
  const [settings, setSettings] = useState({
    thrusterPower: 50,
    frontThrusters: 50,
    verticalThrusters: 50,
    lightPower: 0,
    spotlightPower: 0,
    depthHold: false,
    headingHold: false,
    hoverMode: false,
    cameraStabilization: false,
    recordingMode: false,
    cameraTilt: 0,
    collisionAvoidance: false,
    leakDetection: true,
    batteryOptimization: false,
    emergencyMode: false
  });

  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [lockedFeatures, setLockedFeatures] = useState(
    Object.entries(FEATURES).reduce((acc, [key, feature]) => ({
      ...acc,
      [key]: feature.defaultLocked
    }), {})
  );

  const updateSetting = (key, value) => {
    if (lockedFeatures[key]) return;
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderControl = (key, component) => {
    const isLocked = lockedFeatures[key];
    return (
      <div className={`relative ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
        {component}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 rounded">
            <span className="text-sm text-gray-500">Feature locked by firmware</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full p-4 flex flex-col overflow-y-auto">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          Advanced ROV Controls
        </h3>
        <button
          onClick={() => setIsPortalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          Feature Portal
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column - Thruster & Light Controls */}
        <div className="space-y-6">
          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="font-medium text-blue-900 flex items-center gap-2 mb-4">
              <Gauge className="w-4 h-4" />
              Thruster Configuration
            </h4>
            
            <div className="space-y-6">
              {renderControl('thrusterPower',
                <Slider
                  label="Main Thruster Power"
                  value={settings.thrusterPower}
                  onChange={(v) => updateSetting('thrusterPower', v)}
                />
              )}
              {renderControl('frontThrusters',
                <Slider
                  label="Front Thrusters"
                  value={settings.frontThrusters}
                  onChange={(v) => updateSetting('frontThrusters', v)}
                />
              )}
              {renderControl('verticalThrusters',
                <Slider
                  label="Vertical Thrusters"
                  value={settings.verticalThrusters}
                  onChange={(v) => updateSetting('verticalThrusters', v)}
                />
              )}
            </div>
          </div>

          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="font-medium text-blue-900 flex items-center gap-2 mb-4">
              <Camera className="w-4 h-4" />
              Lighting System
            </h4>
            
            <div className="space-y-6">
              {renderControl('lightPower',
                <Slider
                  label="Main Lights"
                  value={settings.lightPower}
                  onChange={(v) => updateSetting('lightPower', v)}
                />
              )}
              {renderControl('spotlightPower',
                <Slider
                  label="Spotlight Intensity"
                  value={settings.spotlightPower}
                  onChange={(v) => updateSetting('spotlightPower', v)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column - System Controls & Safety */}
        <div className="space-y-6">
          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="font-medium text-blue-900 flex items-center gap-2 mb-4">
              <Compass className="w-4 h-4" />
              Navigation Controls
            </h4>
            
            <div className="space-y-3">
              {[
                ['Depth Hold', 'depthHold'],
                ['Heading Hold', 'headingHold'],
                ['Hover Mode', 'hoverMode']
              ].map(([label, key]) => (
                <div key={key}>
                  {renderControl(key,
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-900">{label}</span>
                      <Toggle
                        checked={settings[key]}
                        onChange={(checked) => updateSetting(key, checked)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="font-medium text-blue-900 flex items-center gap-2 mb-4">
              <Camera className="w-4 h-4" />
              Camera Controls
            </h4>
            
            <div className="space-y-4">
              {[
                ['Camera Stabilization', 'cameraStabilization'],
                ['Recording Mode', 'recordingMode']
              ].map(([label, key]) => (
                <div key={key}>
                  {renderControl(key,
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-900">{label}</span>
                      <Toggle
                        checked={settings[key]}
                        onChange={(checked) => updateSetting(key, checked)}
                      />
                    </div>
                  )}
                </div>
              ))}
              {renderControl('cameraTilt',
                <Slider
                  label="Camera Tilt"
                  value={settings.cameraTilt}
                  onChange={(v) => updateSetting('cameraTilt', v)}
                  min={-90}
                  max={90}
                  unit="°"
                />
              )}
            </div>
          </div>

          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="font-medium text-blue-900 flex items-center gap-2 mb-4">
              <Radio className="w-4 h-4" />
              Safety Systems
            </h4>
            
            <div className="space-y-4">
              {[
                ['Collision Avoidance', 'collisionAvoidance'],
                ['Leak Detection', 'leakDetection'],
                ['Battery Optimization', 'batteryOptimization']
              ].map(([label, key]) => (
                <div key={key}>
                  {renderControl(key,
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-900">{label}</span>
                      <Toggle
                        checked={settings[key]}
                        onChange={(checked) => updateSetting(key, checked)}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {renderControl('emergencyMode',
                <button
                  className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                    settings.emergencyMode
                      ? 'bg-red-600 text-white'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                  onClick={() => updateSetting('emergencyMode', !settings.emergencyMode)}
                >
                  {settings.emergencyMode ? 'EMERGENCY MODE ACTIVE' : 'Emergency Surface'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <FeaturePortal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        lockedFeatures={lockedFeatures}
        setLockedFeatures={setLockedFeatures}
      />
    </div>
  );
};
// Custom Tab Component
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







const Mainframe = ({ socket, cameraData, sensorData }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);
  const [activeController, setActiveController] = useState("basic");
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);
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

      {isAutonomousMode && (
        <AutonomousControlPage 
          socket={socket}
          onExit={() => setIsAutonomousMode(false)} 
        />
      )}
      {/* Fullscreen Toggle */}
      <button
        onClick={toggleFullscreen}
        className="fixed top-2 right-2 z-[60] p-1.5 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-300 backdrop-blur-sm border border-white/50"
      >
        {isFullscreen ? (
          <Minimize2 className="w-4 h-4 text-blue-900" />
        ) : (
          <Maximize2 className="w-4 h-4 text-blue-900" />
        )}
      </button>
      

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
              {/* Controller Panel with Tabs */}
              <div className="h-full min-h-0">
                <div className="w-full h-full bg-gradient-to-r from-teal-50 via-cyan-100 to-blue-100 rounded-lg shadow-lg backdrop-blur-sm border border-white/40 overflow-hidden flex flex-col">
                  {/* Added Command Control Header */}
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
    </div>
  );
};


export default Mainframe;