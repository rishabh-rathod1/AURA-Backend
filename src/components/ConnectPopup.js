import React, { useState, useEffect } from 'react';
import { Cable, Wifi, X, Server, Activity, ShieldCheck, Loader2 } from 'lucide-react';

const ConnectPopup = ({ onConnect, onClose }) => {
  const [ipAddress, setIpAddress] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(0);

  // Simulate connection status animation
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (validateIpAddress(ipAddress)) {
      setIsScanning(true);
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsScanning(false);
      onConnect(ipAddress);
    } else {
      setError('Please enter a valid IP address');
    }
  };

  const validateIpAddress = (ip) => {
    const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
  };

  // Status monitoring items
  const statusItems = [
    { icon: Server, text: "Server Status", status: "Online" },
    { icon: Cable, text: "Connection Type", status: "Ethernet" },
    { icon: Activity, text: "Network Activity", status: "Normal" },
    { icon: ShieldCheck, text: "Security Protocol", status: "Active" },
  ];

  return (
    <div className="fixed inset-0 bg-black/20 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-blue-900 to-teal-900 p-6 rounded-xl shadow-2xl w-full max-w-md 
                    transform transition-all duration-200 animate-in fade-in zoom-in-95 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-10">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute h-[2px] w-[100px] bg-teal-400"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  opacity: Math.random(),
                  animation: `pulse ${2 + Math.random() * 3}s infinite`
                }}
              />
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Cable className="w-6 h-6 text-teal-400" />
              <div className="absolute inset-0 bg-teal-400/20 animate-pulse rounded-full" />
            </div>
            <div>
              <h2 className="text-xl text-white font-good-times tracking-wider">AURA Nexus Interface</h2>
              <p className="text-sm text-white/60">Ethernet Connection Manager</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors group"
            >
              <X className="w-5 h-5 text-white/80 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
            </button>
          )}
        </div>

        {/* Coming Soon Badge */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-full text-xs text-white/60">
            <Wifi className="w-3 h-3" />
            <span>Wireless Coming Soon</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Network Address
            </label>
            <div className="relative">
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="e.g., 192.168.1.100"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 
                         text-white placeholder-white/40 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-teal-500 
                         focus:border-transparent transition-all duration-200"
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400 animate-in fade-in slide-in-from-top-1">{error}</p>
            )}
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-white/5 rounded-lg">
            {statusItems.map(({ icon: Icon, text, status }, index) => (
              <div key={index} className="flex items-center gap-2 p-2">
                <Icon className="w-4 h-4 text-teal-400" />
                <div>
                  <p className="text-xs text-white/60">{text}</p>
                  <p className="text-sm text-white">{status}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isScanning}
              className="flex-1 bg-gradient-to-r from-teal-500 to-blue-500 
                       text-white py-2 px-4 rounded-lg font-medium
                       hover:from-teal-400 hover:to-blue-400 
                       transform transition-all duration-200 
                       hover:shadow-lg hover:scale-[1.02]
                       focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 
                       focus:ring-offset-blue-900 disabled:opacity-50
                       disabled:cursor-not-allowed disabled:hover:scale-100
                       relative group"
            >
              <span className="flex items-center justify-center gap-2">
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Establishing Connection...
                  </>
                ) : (
                  'Connect'
                )}
              </span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-400/0 via-white/20 to-blue-400/0 
                            opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/10 text-white py-2 px-4 rounded-lg font-medium
                         hover:bg-white/20 transform transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Connection Status Indicator */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm text-white/60">
            <span>Connection Status</span>
            <span className="text-teal-400">{connectionStatus}%</span>
          </div>
          <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-300"
              style={{ width: `${connectionStatus}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Add required keyframes for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.3; }
  }
`;
document.head.appendChild(style);

export default ConnectPopup;