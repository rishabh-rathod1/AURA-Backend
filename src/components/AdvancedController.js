import React, { useState,useEffect } from 'react';
import { Compass, Gauge, Navigation, Camera, Radio } from 'lucide-react';
import FeaturePortal from './FeaturePortal';


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

// Toggle and Slider components remain the same as in the original code

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

const Slider = ({ label, value, onChange, onRelease, min = 0, max = 100, unit = '%' }) => {
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setLocalValue(newValue);
    onChange?.(newValue);
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      onRelease?.(localValue);
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      onRelease?.(localValue);
      setIsDragging(false);
    }
  };

  return (
    <div>
      <label className="text-sm text-blue-900 mb-1 block">{label}</label>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={localValue}
        onChange={handleChange}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
        className="w-full accent-blue-600"
      />
      <div className="text-right text-sm text-blue-900">{localValue}{unit}</div>
    </div>
  );
};






const AdvancedController = ({ socket }) => {
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

  // WebSocket send function for feature updates
  const sendFeatureUpdate = (key, value) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const updatePayload = {
        command: 'update',
        [key]: value
      };
      
      try {
        socket.send(JSON.stringify(updatePayload));
        console.log(`Sent update for ${key}:`, value);
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
      }
    } else {
      console.warn('WebSocket is not open. Unable to send update.');
    }
  };

  const updateSetting = (key, value) => {
    if (lockedFeatures[key]) return;
    
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateSettingAndSend = (key, value) => {
    if (lockedFeatures[key]) return;
    
    // Update local state
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Send update to WebSocket server
    sendFeatureUpdate(key, value);
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
                  onRelease={(v) => updateSettingAndSend('thrusterPower', v)}
                />
              )}
              {renderControl('frontThrusters',
                <Slider
                  label="Front Thrusters"
                  value={settings.frontThrusters}
                  onChange={(v) => updateSetting('frontThrusters', v)}
                  onRelease={(v) => updateSettingAndSend('frontThrusters', v)}
                />
              )}
              {renderControl('verticalThrusters',
                <Slider
                  label="Vertical Thrusters"
                  value={settings.verticalThrusters}
                  onChange={(v) => updateSetting('verticalThrusters', v)}
                  onRelease={(v) => updateSettingAndSend('verticalThrusters', v)}
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
                  onRelease={(v) => updateSettingAndSend('lightPower', v)}
                />
              )}
              {renderControl('spotlightPower',
                <Slider
                  label="Spotlight Intensity"
                  value={settings.spotlightPower}
                  onChange={(v) => updateSetting('spotlightPower', v)}
                  onRelease={(v) => updateSettingAndSend('spotlightPower', v)}
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
                        onChange={(checked) => updateSettingAndSend(key, checked)}
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
                        onChange={(checked) => updateSettingAndSend(key, checked)}
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
                  onRelease={(v) => updateSettingAndSend('cameraTilt', v)}
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
                        onChange={(checked) => updateSettingAndSend(key, checked)}
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
                  onClick={() => updateSettingAndSend('emergencyMode', !settings.emergencyMode)}
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

export default AdvancedController;