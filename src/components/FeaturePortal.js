import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Shield, X, Lock, Unlock } from 'lucide-react';

// Define features with more comprehensive structure
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

// Custom Scrollbar Component with Modern Tailwind Styling
const CustomScrollbar = ({ children, className = '' }) => {
  return (
    <div className={`
      ${className}
      overflow-y-auto 
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-gray-100/50
      [&::-webkit-scrollbar-thumb]:bg-teal-500/40 
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb:hover]:bg-teal-600/60
      hover:scrollbar-thumb-teal-600/70
    `}>
      {children}
    </div>
  );
};

const FeaturePortal = ({ 
  isOpen, 
  onClose, 
  lockedFeatures: initialLockedFeatures, 
  setLockedFeatures: updateLockedFeatures 
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Initialize locked features with default locked state if not provided
  const [lockedFeatures, setLockedFeatures] = useState(
    initialLockedFeatures || 
    Object.fromEntries(
      Object.entries(FEATURES).map(([key, feature]) => [key, feature.defaultLocked])
    )
  );

  // Reset authorization when portal opens
  useEffect(() => {
    if (isOpen) {
      setIsAuthorized(false);
      setCode('');
      setError('');
    }
  }, [isOpen]);

  const validateCode = () => {
    // Simple code validation - in a real app, use secure authentication
    if (code === 'aurafirm') {
      setIsAuthorized(true);
      setError('');
    } else {
      setError('Invalid firmware code');
    }
  };

  const handleFeatureToggle = (key) => {
    const newLockedState = { ...lockedFeatures, [key]: !lockedFeatures[key] };
    setLockedFeatures(newLockedState);
    
    // If an external update function is provided, call it
    if (updateLockedFeatures) {
      updateLockedFeatures(newLockedState);
    }
  };

  // Return null if portal is not open
  if (!isOpen) return null;

  const portalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white/80 rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500/90 to-blue-600/90 text-white px-4 py-3 flex items-center justify-between backdrop-blur-sm">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Feature Management
          </h2>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-all rounded-full p-2 hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 space-y-4">
          {!isAuthorized ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Firmware Code
                </label>
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && validateCode()}
                  className="w-full px-3 py-2 bg-white/70 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-300/50 transition-all"
                  placeholder="Enter authorization code"
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </div>
              <button
                onClick={validateCode}
                className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-5 h-5" />
                Validate Code
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Unlock className="w-5 h-5 mr-2 text-green-600" />
                Feature Management
              </div>
              
              <CustomScrollbar className="max-h-[50vh] pr-1">
                {Object.entries(FEATURES).map(([key, feature]) => (
                  <div 
                    key={key} 
                    className="bg-white/70 rounded-lg p-3 border border-gray-200 flex items-center justify-between mb-2 last:mb-0 hover:bg-teal-50/50 transition-colors"
                  >
                    <div className="flex-grow pr-2">
                      <span className="text-sm font-medium text-gray-800">{feature.name}</span>
                      <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!lockedFeatures[key]}
                        onChange={() => handleFeatureToggle(key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                ))}
              </CustomScrollbar>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(
    portalContent,
    document.body
  );
};

export default FeaturePortal;