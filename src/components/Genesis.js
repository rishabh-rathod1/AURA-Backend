import React, { useState, useEffect, useContext, useCallback } from 'react';
import { IpAddressContext } from '../IpAddressContext';
import { 
  ArrowLeft, 
  Cpu, 
  Shield, 
  Maximize2, 
  Minimize2, 
  Camera,
  Power,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  Radio,
  Radar,
  Navigation,
  Eye,
  Hexagon,
  Network
} from 'lucide-react';


const StatusBadge = ({ status }) => {
  const colors = {
    inactive: "bg-gray-500",
    active: "bg-green-500",
    error: "bg-red-500",
    initializing: "bg-yellow-500"
  };

  return (
    <span className={`${colors[status]} w-2 h-2 rounded-full animate-pulse inline-block`} />
  );
};

const InitializationScreen = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-teal-900 to-blue-950">
    <div className="relative flex flex-col items-center gap-12">
      <div className="absolute inset-0 bg-teal-500/10 blur-3xl rounded-full" />
      
      <div className="flex gap-16 items-center">
        <Hexagon className="w-16 h-16 text-teal-400 animate-pulse" />
        <Cpu className="w-20 h-20 text-blue-300 animate-spin-slow" />
        <Network className="w-16 h-16 text-teal-400 animate-pulse" />
      </div>

      <div className="text-center space-y-8 relative">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-blue-400 to-teal-300 tracking-wide">
          AURA Genesis
        </h1>
        
        <div className="flex justify-center gap-4">
          <span className="w-1 h-8 bg-gradient-to-b from-teal-400 to-blue-500 rounded-full animate-pulse" />
          <span className="w-1 h-6 bg-gradient-to-b from-blue-400 to-teal-500 rounded-full animate-pulse [animation-delay:0.2s]" />
          <span className="w-1 h-8 bg-gradient-to-b from-teal-400 to-blue-500 rounded-full animate-pulse [animation-delay:0.4s]" />
        </div>

        <div className="space-y-2">
          <p className="text-xl font-light tracking-wider text-teal-100">
            Initializing Autonomous Systems
            <span className="animate-pulse">...</span>
          </p>
          <p className="text-sm text-blue-200/70 tracking-widest uppercase">
            System Version 2.0.4
          </p>
        </div>
      </div>
    </div>
  </div>
);

const ActivationAnimation = () => (
  <div className="fixed inset-0 bg-teal-500/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-out">
    <div className="text-center">
      <div className="w-16 h-16 relative mx-auto mb-4">
        <div className="absolute inset-0 bg-teal-500/50 rounded-full animate-ping" />
        <Power className="w-16 h-16 text-teal-300 animate-pulse relative" />
      </div>
      <p className="text-teal-200 text-xl font-bold animate-pulse">Activating Autonomous Systems</p>
    </div>
  </div>
);

const DeactivationAnimation = () => (
  <div className="fixed inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-out">
    <div className="text-center">
      <div className="w-16 h-16 relative mx-auto mb-4">
        <div className="absolute inset-0 bg-red-500/50 rounded-full animate-ping" />
        <Power className="w-16 h-16 text-red-300 animate-pulse relative" />
      </div>
      <p className="text-red-200 text-xl font-bold animate-pulse">Deactivating Autonomous Systems</p>
    </div>
  </div>
);

const CameraView = ({ ipAddress }) => {
    const [isStreaming, setIsStreaming] = useState(true);
    const [viewMode, setViewMode] = useState('normal');
  
    return (
      <div className="bg-black/30 border border-teal-900/50 rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <Camera className="w-5 h-5 text-teal-300" />
              <h3 className="text-lg font-semibold text-teal-300">Primary Camera Feed</h3>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setViewMode(viewMode === 'normal' ? 'enhanced' : 'normal')}
                className="px-4 py-2 text-xs bg-white/10 hover:bg-white/20 rounded-full transition-all"
              >
                {viewMode === 'normal' ? 'Enhanced View' : 'Normal View'}
              </button>
              <button 
                onClick={() => setIsStreaming(!isStreaming)}
                className="px-4 py-2 text-xs bg-white/10 hover:bg-white/20 rounded-full transition-all"
              >
                {isStreaming ? 'Pause Feed' : 'Resume Feed'}
              </button>
            </div>
          </div>
          
          <div className="aspect-video bg-black rounded-lg overflow-hidden border border-teal-900/50 relative">
            {isStreaming ? (
              <img 
                src={`http://${ipAddress}:5000/camera/1`} 
                alt="Live Camera Feed" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src='/api/placeholder/640/480';
                  console.error('Camera stream failed');
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <p className="text-sm text-teal-300">Feed Paused</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

const Alert = ({ type, message }) => {
  const bgColors = {
    success: "bg-green-500/20 border-green-500/50",
    error: "bg-red-500/20 border-red-500/50",
    info: "bg-blue-500/20 border-blue-500/50"
  };

  const Icon = type === 'success' ? CheckCircle : type === 'error' ? XCircle : AlertCircle;

  return (
    <div className={`${bgColors[type]} border rounded-lg p-4 flex items-center space-x-3`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

const SystemCapabilities = ({ autonomousStatus }) => {
  const capabilities = [
    { icon: Shield, label: 'Safety Protocols', status: autonomousStatus },
    { icon: Radar, label: 'Proximity Detection', status: autonomousStatus },
    { icon: Navigation, label: 'Navigation', status: autonomousStatus },
    { icon: Eye, label: 'Object Recognition', status: autonomousStatus },
    { icon: Radio, label: 'Communication', status: autonomousStatus },
    { icon: Camera, label: 'Visual Processing', status: autonomousStatus }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {capabilities.map(({ icon: Icon, label, status }) => (
        <div 
          key={label} 
          className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all group flex items-center space-x-3"
        >
          <Icon className="w-5 h-5 text-teal-300 group-hover:scale-110 transition-transform flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate mb-1">{label}</p>
            <div className="flex items-center space-x-2">
              <StatusBadge status={status} />
              <span className="text-xs text-gray-400 capitalize">{status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AutonomousControlPage = ({ socket, onExit }) => {
  const { ipAddress } = useContext(IpAddressContext);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autonomousStatus, setAutonomousStatus] = useState('inactive');
  const [systemMessage, setSystemMessage] = useState(null);
  const [showActivationAnim, setShowActivationAnim] = useState(false);
  const [showDeactivationAnim, setShowDeactivationAnim] = useState(false);
  const [pythonScriptPid, setPythonScriptPid] = useState(null);

  // Animation and initialization effect
  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setIsAnimating(false);
      setSystemMessage({ type: 'info', message: 'System ready for autonomous operation' });
    }, 3000);

    return () => clearTimeout(animationTimer);
  }, []);

  // Fullscreen toggle function
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen toggle failed", err);
    }
  }, []);

  // Launch Python script function
  const launchPythonScript = useCallback(async (mode) => {
    try {
      // Check if Electron's IPC is available
      if (!window.require) {
        throw new Error('Electron IPC not available');
      }

      const { ipcRenderer } = window.require('electron');
      
      return new Promise((resolve, reject) => {
        // Send message to launch Python script
        ipcRenderer.send('run-python-script', {
          scriptPath: 'C:\\AURA\\auto.py',
          mode: mode
        });

        // Listen for script launch response
        ipcRenderer.once('python-script-response', (event, response) => {
          if (response.success) {
            setPythonScriptPid(response.pid);
            resolve(response);
          } else {
            reject(new Error(response.error || 'Script launch failed'));
          }
        });

        // Set a timeout for the script launch
        setTimeout(() => {
          reject(new Error('Script launch timed out'));
        }, 10000);
      });
    } catch (error) {
      console.error('Python script launch error:', error);
      throw error;
    }
  }, []);

  // Terminate Python script function
  const terminatePythonScript = useCallback(async () => {
    try {
      if (!window.require) {
        throw new Error('Electron IPC not available');
      }

      const { ipcRenderer } = window.require('electron');
      
      return new Promise((resolve, reject) => {
        // Send message to terminate Python script
        ipcRenderer.send('terminate-python-script', { pid: pythonScriptPid });

        // Listen for termination response
        ipcRenderer.once('python-script-terminate-response', (event, response) => {
          if (response.success) {
            setPythonScriptPid(null);
            resolve(response);
          } else {
            reject(new Error(response.error || 'Script termination failed'));
          }
        });

        // Set a timeout for script termination
        setTimeout(() => {
          reject(new Error('Script termination timed out'));
        }, 5000);
      });
    } catch (error) {
      console.error('Python script termination error:', error);
      throw error;
    }
  }, [pythonScriptPid]);

  // Toggle autonomous mode function
  const toggleAutonomousMode = useCallback(async () => {
    try {
      const newStatus = autonomousStatus === 'inactive' ? 'active' : 'inactive';
      
      if (newStatus === 'active') {
        // Activation process
        setShowActivationAnim(true);
        
        try {
          await launchPythonScript('activate');
          setSystemMessage({ 
            type: 'success', 
            message: 'Autonomous mode activated successfully' 
          });
        } catch (error) {
          setSystemMessage({ 
            type: 'error', 
            message: `Activation failed: ${error.message}` 
          });
          return;
        } finally {
          setTimeout(() => setShowActivationAnim(false), 1500);
        }
      } else {
        // Deactivation process
        setShowDeactivationAnim(true);
        
        try {
          await terminatePythonScript();
          setSystemMessage({ 
            type: 'info', 
            message: 'Autonomous mode deactivated' 
          });
        } catch (error) {
          setSystemMessage({ 
            type: 'error', 
            message: `Deactivation failed: ${error.message}` 
          });
          return;
        } finally {
          setTimeout(() => setShowDeactivationAnim(false), 1500);
        }
      }

      // Update autonomous status
      setAutonomousStatus(newStatus);
    } catch (error) {
      console.error('Autonomous mode toggle error:', error);
      setSystemMessage({ 
        type: 'error', 
        message: 'System error during mode toggle' 
      });
    }
  }, [autonomousStatus, launchPythonScript, terminatePythonScript]);

  // Render initialization screen if still animating
  if (isAnimating) {
    return <InitializationScreen />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-teal-900 to-blue-900 text-white">
      {showActivationAnim && <ActivationAnimation />}
      {showDeactivationAnim && <DeactivationAnimation />}
      
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-sm p-4 flex justify-between items-center z-40">
        <div className="flex items-center space-x-3">
          <Power className={`w-5 h-5 ${autonomousStatus === 'active' ? 'text-green-400' : 'text-gray-400'}`} />
          <span className="text-sm font-medium">Status: <span className="text-teal-300 capitalize">{autonomousStatus}</span></span>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={onExit}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Camera View */}
          <div className="lg:col-span-2 space-y-4">
            <CameraView ipAddress={ipAddress} />
            {systemMessage && (
              <Alert type={systemMessage.type} message={systemMessage.message} />
            )}
          </div>

          {/* Control Panel */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-black/30 border border-teal-900/50 rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-bold text-teal-300 flex items-center space-x-3 mb-6">
                <Cpu className="w-5 h-5" />
                <span>AURA Genesis Autonomous Control</span>
              </h2>
              
              <SystemCapabilities />

              <button
                onClick={toggleAutonomousMode}
                className={`w-full py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                  autonomousStatus === 'active' 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-teal-600 hover:bg-teal-700'
                }`}
              >
                <Power className="w-5 h-5" />
                <span>{autonomousStatus === 'active' ? 'Deactivate Autonomous Mode' : 'Activate Autonomous Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomousControlPage;