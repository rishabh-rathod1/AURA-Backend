import React, { useState, useEffect, useRef,useContext } from 'react';
import FloatingWindow from './FloatingWindow';
import { RotateCw, RotateCcw } from 'lucide-react';
import { Activity, AlertCircle, Camera, Maximize2 } from 'lucide-react';
import { IpAddressContext } from '../IpAddressContext';
import { MapPin, Thermometer, Droplets, Navigation, ChevronLeft, Battery, Signal } from 'lucide-react';




const LoRaWeatherNetwork = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  
  const nodes = [
    {
      id: "NODE_001",
      location: { x: 30, y: 25 },
      temp: 24.5,
      humidity: 65,
      gps: "51.5074° N, 0.1278° W",
      lastUpdate: "2 min ago",
      battery: 85,
      signal: 92
    },
    {
      id: "NODE_002",
      location: { x: 70, y: 45 },
      temp: 22.8,
      humidity: 58,
      gps: "51.5080° N, 0.1281° W",
      lastUpdate: "5 min ago",
      battery: 92,
      signal: 87
    },
    {
      id: "NODE_003",
      location: { x: 50, y: 75 },
      temp: 23.2,
      humidity: 62,
      gps: "51.5069° N, 0.1272° W",
      lastUpdate: "1 min ago",
      battery: 76,
      signal: 95
    }
  ];

  const NetworkMap = () => (
    <div className="w-full text-cyan-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          LoRa Weather Network
        </h3>
        <div className="text-xs sm:text-sm text-cyan-400 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
          Live
        </div>
      </div>
      
      <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-cyan-950/80 to-cyan-900/80 rounded-xl backdrop-blur-xl border border-cyan-800/30 p-4 overflow-hidden">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-all duration-300"
            style={{ left: `${node.location.x}%`, top: `${node.location.y}%` }}
            onClick={() => setSelectedNode(node)}
          >
            <div className="relative group">
              <div className="absolute -inset-3 bg-cyan-400/20 rounded-full blur-md group-hover:bg-cyan-400/30 transition-colors duration-300" />
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors relative" />
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-teal-400 group-hover:bg-teal-300 transition-colors" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-2 text-xs sm:text-sm text-cyan-400/70 text-center flex items-center justify-center gap-1">
        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
        Click nodes for details
      </div>
    </div>
  );

  const NodeDetails = ({ node }) => (
    <div className="w-full text-cyan-50">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedNode(null)}
            className="text-xs sm:text-sm px-2 py-1 bg-cyan-950/60 border border-cyan-800/30 rounded-lg hover:bg-cyan-900/60 transition-all inline-flex items-center gap-1 text-cyan-300"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Back
          </button>
          <h3 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            {node.id}
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm text-cyan-400">
          <div className="flex items-center gap-1">
            <Battery className="w-3 h-3 sm:w-4 sm:h-4" />
            {node.battery}%
          </div>
          <div className="flex items-center gap-1">
            <Signal className="w-3 h-3 sm:w-4 sm:h-4" />
            {node.signal}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="p-3 sm:p-4 bg-gradient-to-br from-cyan-950/80 to-cyan-900/80 rounded-xl border border-cyan-800/30 backdrop-blur-xl flex flex-col items-center justify-center group hover:bg-cyan-900/80 transition-all duration-300">
          <Thermometer className="w-5 h-5 sm:w-6 sm:h-6 mb-2 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          <p className="text-lg sm:text-2xl font-bold mb-0.5">{node.temp}°C</p>
          <p className="text-xs sm:text-sm text-cyan-400/70">Temperature</p>
        </div>

        <div className="p-3 sm:p-4 bg-gradient-to-br from-cyan-950/80 to-cyan-900/80 rounded-xl border border-cyan-800/30 backdrop-blur-xl flex flex-col items-center justify-center group hover:bg-cyan-900/80 transition-all duration-300">
          <Droplets className="w-5 h-5 sm:w-6 sm:h-6 mb-2 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          <p className="text-lg sm:text-2xl font-bold mb-0.5">{node.humidity}%</p>
          <p className="text-xs sm:text-sm text-cyan-400/70">Humidity</p>
        </div>

        <div className="p-3 sm:p-4 bg-gradient-to-br from-cyan-950/80 to-cyan-900/80 rounded-xl border border-cyan-800/30 backdrop-blur-xl flex flex-col items-center justify-center group hover:bg-cyan-900/80 transition-all duration-300">
          <Navigation className="w-5 h-5 sm:w-6 sm:h-6 mb-2 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          <p className="text-xs sm:text-sm font-semibold mb-0.5 text-center">{node.gps}</p>
          <p className="text-xs sm:text-sm text-cyan-400/70">Location</p>
        </div>

        <div className="p-3 sm:p-4 bg-gradient-to-br from-cyan-950/80 to-cyan-900/80 rounded-xl border border-cyan-800/30 backdrop-blur-xl flex flex-col items-center justify-center group hover:bg-cyan-900/80 transition-all duration-300">
          <Signal className="w-5 h-5 sm:w-6 sm:h-6 mb-2 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          <div className="w-full space-y-1.5">
            <div className="flex justify-between text-xs sm:text-sm text-cyan-400/70">
              <span>Signal</span>
              <span>{node.signal}%</span>
            </div>
            <div className="w-full h-1.5 bg-cyan-950/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${node.signal}%` }}
              />
            </div>
            <p className="text-[10px] sm:text-xs text-cyan-400/50 text-center">
              {node.lastUpdate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-gradient-to-br from-cyan-950 via-cyan-900 to-cyan-950 p-3 sm:p-4 rounded-xl">
      {selectedNode ? <NodeDetails node={selectedNode} /> : <NetworkMap />}
    </div>
  );
};



// Assuming you have an IPContext set up elsewhere

const CrackDetection = () => {
  const { ipAddress } = useContext(IpAddressContext);
  const detectionStats = {
    status: "Active",
    confidence: "96.5%",
    lastDetection: "2.3s ago",
    resolution: "1920x1080",
    processingRate: "30 FPS"
  };

  return (
    <div className="w-full h-full min-h-screen p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-900 via-cyan-950 to-teal-950">
      <div className="max-w-7xl mx-auto flex flex-col h-full gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
            <Camera className="text-cyan-400" />
            Crack Detection Model
          </h2>
          <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-full">
            <Activity size={16} className="text-emerald-400" />
            <span className="text-sm text-emerald-300">Model Active</span>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative w-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-950 to-gray-900 border border-cyan-900/20 shadow-lg">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button className="p-2 bg-gray-900/80 rounded-lg hover:bg-gray-900 transition-colors">
              <Maximize2 size={20} className="text-cyan-400" />
            </button>
          </div>
          <div className="relative w-full pb-[56.25%]">
            <iframe
              src={`http://${ipAddress}:5001`}
              className="absolute top-0 left-0 w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries({
            "Confidence": detectionStats.confidence,
            "Last Detection": detectionStats.lastDetection,
            "Resolution": detectionStats.resolution,
            "Processing Rate": detectionStats.processingRate
          }).map(([label, value]) => (
            <div key={label} className="bg-gradient-to-br from-cyan-950/50 to-gray-900/50 p-4 rounded-lg border border-cyan-900/20">
              <div className="text-sm text-gray-400 mb-1">{label}</div>
              <div className="text-lg font-semibold text-cyan-400">{value}</div>
            </div>
          ))}
        </div>

        {/* Alert Box */}
        <div className="w-full p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <div className="flex items-start gap-2">
            <AlertCircle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-500 mb-1">Detection Notes</h3>
              <p className="text-sm text-gray-300">
                The model is calibrated for surface cracks between 0.1mm - 5mm width. 
                Ensure proper lighting conditions for optimal detection accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




const ThrusterIcon = ({ type, clockwise, number }) => {
  const baseColor = clockwise ? 'fill-cyan-400' : 'fill-teal-400';
  const hoverEffect = 'group-hover:filter group-hover:brightness-110';
  
  if (type === 'vector') {
    return (
      <div className="relative group">
        <svg width="44" height="44" viewBox="0 0 44 44" className="transform rotate-45">
          <path 
            d="M12,12 h20 l-10,20 z" 
            className={`${baseColor} ${hoverEffect} stroke-white/20`} 
            strokeWidth="1.5"
          />
          <circle cx="22" cy="17" r="3" className="fill-white" />
          {clockwise ? (
            <path 
              d="M22,14 A5,5 0 1,1 19,15 L20,13 L18,14 L19,16"
              className="fill-none stroke-white"
              strokeWidth="1.5"
            />
          ) : (
            <path 
              d="M22,14 A5,5 0 1,0 25,15 L24,13 L26,14 L25,16"
              className="fill-none stroke-white"
              strokeWidth="1.5"
            />
          )}
        </svg>
        <span className="absolute -top-1 -left-1 text-xs bg-gray-900 px-1.5 py-0.5 rounded-full text-white font-medium shadow-lg">
          {number}
        </span>
      </div>
    );
  }
  
  return (
    <div className="relative group">
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle 
          cx="22" 
          cy="22" 
          r="16" 
          className={`${baseColor} ${hoverEffect} stroke-white/20`} 
          strokeWidth="1.5"
        />
        <circle cx="22" cy="22" r="3" className="fill-white" />
        {clockwise ? (
          <path 
            d="M22,14 A8,8 0 1,1 14,22 L18,22 A4,4 0 1,0 22,18 Z" 
            className="fill-white"
          />
        ) : (
          <path 
            d="M22,14 A8,8 0 1,0 30,22 L26,22 A4,4 0 1,1 22,18 Z" 
            className="fill-white"
          />
        )}
      </svg>
      <span className="absolute -top-1 -left-1 text-xs bg-gray-900 px-1.5 py-0.5 rounded-full text-white font-medium shadow-lg">
        {number}
      </span>
    </div>
  );
};

const ROVLayout = ({ version }) => {
  const layouts = {
    V1: {
      shape: "octagon",
      thrusters: [
        { type: 'vector', clockwise: true, number: 1, className: "absolute top-0 right-1/4" },
        { type: 'vector', clockwise: false, number: 2, className: "absolute top-0 left-1/4" },
        { type: 'vector', clockwise: true, number: 3, className: "absolute bottom-0 right-1/4" },
        { type: 'vector', clockwise: false, number: 4, className: "absolute bottom-0 left-1/4" }
      ]
    },
    V2: {
      shape: "octagon",
      thrusters: [
        { type: 'vector', clockwise: true, number: 1, className: "absolute top-0 right-1/4" },
        { type: 'vector', clockwise: false, number: 2, className: "absolute top-0 left-1/4" },
        { type: 'vector', clockwise: true, number: 3, className: "absolute bottom-0 right-1/4" },
        { type: 'vector', clockwise: false, number: 4, className: "absolute bottom-0 left-1/4" },
        { type: 'circular', clockwise: true, number: 5, className: "absolute right-0 top-1/2 -translate-y-1/2" },
        { type: 'circular', clockwise: false, number: 6, className: "absolute left-0 top-1/2 -translate-y-1/2" }
      ]
    },
    V3: {
      shape: "octagon",
      thrusters: [
        { type: 'vector', clockwise: true, number: 1, className: "absolute top-0 right-1/4" },
        { type: 'vector', clockwise: false, number: 2, className: "absolute top-0 left-1/4" },
        { type: 'vector', clockwise: true, number: 3, className: "absolute bottom-0 right-1/4" },
        { type: 'vector', clockwise: false, number: 4, className: "absolute bottom-0 left-1/4" },
        { type: 'circular', clockwise: true, number: 5, className: "absolute -right-2 top-1/3" },
        { type: 'circular', clockwise: false, number: 6, className: "absolute -left-2 top-1/3" },
        { type: 'circular', clockwise: false, number: 7, className: "absolute -right-2 bottom-1/3" },
        { type: 'circular', clockwise: true, number: 8, className: "absolute -left-2 bottom-1/3" }
      ]
    }
  };

  const layout = layouts[version];
  const octagonPath = "M30,0 L70,0 L100,30 L100,70 L70,100 L30,100 L0,70 L0,30 Z";

  return (
    <div className="relative w-72 h-72 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="frameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="stop-color-cyan-900" style={{ stopColor: '#164e63' }} />
            <stop offset="100%" className="stop-color-teal-900" style={{ stopColor: '#134e4a' }} />
          </linearGradient>
        </defs>
        <path 
          d={octagonPath} 
          fill="url(#frameGradient)"
          className="stroke-cyan-400/20" 
          strokeWidth="1"
        />
      </svg>
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rotate-45 border border-cyan-400/30" />
        </div>
        {layout.thrusters.map((thruster, index) => (
          <div key={index} className={thruster.className}>
            <ThrusterIcon 
              type={thruster.type}
              clockwise={thruster.clockwise}
              number={thruster.number}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const FrameProfile = () => {
  const [selectedVersion, setSelectedVersion] = useState('V1');

  const versions = {
    'V1': 'Basic',
    'V2': 'Vectored',
    'V3': 'Vectored Heavy'
  };

  return (
    <div className="w-full max-w-4xl p-8 bg-gradient-to-br from-gray-900 via-cyan-950 to-teal-950 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold mb-6 text-center text-white">
        AURA ROV Frame Profile
      </h2>
      
      <div className="flex gap-4 mb-8 justify-center">
        {Object.entries(versions).map(([version, config]) => (
          <button
            key={version}
            onClick={() => setSelectedVersion(version)}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all ${
              selectedVersion === version 
                ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-white ring-1 ring-cyan-400/30' 
                : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <span className="font-medium">{version}</span>
            <span className="text-xs opacity-80">{config}</span>
          </button>
        ))}
      </div>

      <div className="p-8 bg-gradient-to-br from-gray-950 to-gray-900 rounded-lg shadow-lg border border-cyan-900/20">
        <ROVLayout version={selectedVersion} />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-300 mb-4 font-medium">
            {selectedVersion === 'V1' ? '4 Thrusters' : selectedVersion === 'V2' ? '6 Thrusters' : '8 Thrusters'} Configuration
          </p>
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2 bg-cyan-950/30 px-3 py-1.5 rounded-lg">
              <RotateCw size={16} className="text-cyan-400" />
              <span className="text-sm text-gray-200">Clockwise Rotation</span>
            </div>
            <div className="flex items-center gap-2 bg-teal-950/30 px-3 py-1.5 rounded-lg">
              <RotateCcw size={16} className="text-teal-400" />
              <span className="text-sm text-gray-200">Counter-Clockwise</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const PowerAnalytics = () => {
  const [showDetails, setShowDetails] = useState(false);

  const PowerMetrics = () => (
    <div className="text-white min-w-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-center">Power Analytics</h3>
      <div 
        className="p-6 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-all
                   flex flex-col items-center justify-center text-center"
        onClick={() => setShowDetails(true)}
      >
        <p className="font-semibold text-xl mb-2">Power Metrics</p>
        <p className="text-sm text-gray-400">Click to view detailed power information</p>
      </div>
    </div>
  );

  const PowerDetails = () => (
    <div className="text-white min-w-[400px]">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-lg font-semibold">Power Details</h3>
        <button 
          onClick={() => setShowDetails(false)}
          className="text-sm px-4 py-1.5 bg-white/10 rounded-md hover:bg-white/20 transition-all"
        >
          Back
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 p-2">
        <div className="p-4 bg-white/5 rounded-lg flex flex-col items-center justify-center">
          <p className="text-sm text-gray-400 mb-1">System Voltage</p>
          <p className="text-2xl font-semibold">12.4 V</p>
        </div>
        
        <div className="p-4 bg-white/5 rounded-lg flex flex-col items-center justify-center">
          <p className="text-sm text-gray-400 mb-1">Current Consumption</p>
          <p className="text-2xl font-semibold">2.1 A</p>
        </div>
        
        <div className="p-4 bg-white/5 rounded-lg flex flex-col items-center justify-center">
          <p className="text-sm text-gray-400 mb-1">Power Consumption</p>
          <p className="text-2xl font-semibold">25.6 W</p>
        </div>
        
        <div className="p-4 bg-white/5 rounded-lg flex flex-col items-center justify-center">
          <p className="text-sm text-gray-400 mb-1">Power Source</p>
          <p className="text-2xl font-semibold mb-2">Battery</p>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-3/4 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">75% Remaining</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center w-full p-4">
      {showDetails ? <PowerDetails /> : <PowerMetrics />}
    </div>
  );
};

const VehicleInfo = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const vehicles = [
    {
      id: "AURA-2024-001",
      name: "V1 - AURA ROV",
      thrusters: 4,
      dof: "3 DOF",
      configuration: "Basic",
      maxDepth: "50 meters",
      camera: "Single HD Camera (120° Wide-Angle)",
      power: "12V Battery (450W)",
      sensors: "Basic IMU (MPU6050)",
      purpose: "Basic underwater exploration and navigation.",
    },
    {
      id: "AURA-2024-002",
      name: "V2 - AURA ROV",
      thrusters: 6,
      dof: "6 DOF",
      configuration: "Vectored",
      maxDepth: "100 meters",
      camera: "Dual HD Cameras (120° and 90° FOV)",
      power: "12V Battery with Auto Switch Circuit",
      sensors: "IMU (MPU6050), Temperature Sensor (DS18B20), Pressure Sensor (0.8 MPa)",
      purpose: "Research-oriented tasks with precision movement and stability.",
    },
    {
      id: "AURA-2024-003",
      name: "V3 - AURA ROV",
      thrusters: 8,
      dof: "6 DOF",
      configuration: "Vectored Heavy",
      maxDepth: "200 meters",
      camera: "Triple HD Cameras with Thermal Imaging",
      power: "Dual 12V Batteries with Backup Circuit",
      sensors: "Advanced IMU, Pressure Sensor (2 MPa), GPS Surface Tracker",
      payload: "Up to 5 kg",
      purpose: "Heavy-duty underwater missions, payload handling, and advanced research.",
    },
  ];

  const MainMenu = () => (
    <div className="text-white min-w-[400px]">
      <h3 className="text-lg font-semibold mb-6 text-center">AURA ROV Versions</h3>
      <div className="grid grid-cols-1 gap-4">
        {vehicles.map((vehicle, index) => (
          <div
            key={index}
            className="p-6 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-all flex flex-col items-center justify-center"
            onClick={() => setSelectedVehicle(vehicle)}
          >
            <p className="font-semibold text-xl">{vehicle.name}</p>
            <p className="text-sm text-gray-400">{vehicle.configuration}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const VehicleDetails = ({ vehicle }) => (
    <div className="text-white min-w-[400px]">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-lg font-semibold">{vehicle.name}</h3>
        <button
          onClick={() => setSelectedVehicle(null)}
          className="text-sm px-4 py-1.5 bg-white/10 rounded-md hover:bg-white/20 transition-all"
        >
          Back
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 p-2">
        <div className="p-4 bg-white/5 rounded-lg">
          <p><strong>Vehicle ID:</strong> {vehicle.id}</p>
          <p><strong>Thrusters:</strong> {vehicle.thrusters}</p>
          <p><strong>Degrees of Freedom:</strong> {vehicle.dof}</p>
          <p><strong>Configuration:</strong> {vehicle.configuration}</p>
          <p><strong>Max Depth:</strong> {vehicle.maxDepth}</p>
          <p><strong>Camera System:</strong> {vehicle.camera}</p>
          <p><strong>Power Source:</strong> {vehicle.power}</p>
          <p><strong>Sensors:</strong> {vehicle.sensors}</p>
          {vehicle.payload && <p><strong>Payload Capacity:</strong> {vehicle.payload}</p>}
          <p><strong>Purpose:</strong> {vehicle.purpose}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center w-full p-4">
      {selectedVehicle ? <VehicleDetails vehicle={selectedVehicle} /> : <MainMenu />}
    </div>
  );
};



const Topbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [activeWindow, setActiveWindow] = useState(null);
  const dropdownRef = useRef(null);
  const topbarRef = useRef(null);

  // Toggle dropdown function
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!isDropdownOpen);
  };

  // Handle mouse leave function
  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  // Handle item click function
  const handleItemClick = (item) => {
    setActiveWindow(item);
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !topbarRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Window content mapping
  const windowContents = {
    'Vehicle Info': <VehicleInfo/>,
    'Advanced Analytics': <PowerAnalytics />,
    'Crack Detection': <CrackDetection/>,
    'Frame Profile': <FrameProfile/>,
    'LoRa Weather Network':<LoRaWeatherNetwork/>,
    'Manuals': (
      <div className="text-white">
        <h3 className="text-lg font-semibold mb-4">System Manuals</h3>
        <div className="space-y-4">
          <p>User Guide v2.1</p>
          <p>Technical Documentation</p>
          <p>Maintenance Manual</p>
        </div>
      </div>
    )
  };

  return (
    <div className="relative z-50">
      {/* Topbar */}
      <nav 
        ref={topbarRef}
        onClick={toggleDropdown}
        className="relative bg-gradient-to-r from-blue-700 via-teal-600 to-blue-900 shadow-2xl 
                 rounded-full mt-2 mx-2 cursor-pointer transform transition-all duration-200 
                 hover:scale-[1.01] hover:shadow-lg hover:from-blue-600 hover:via-teal-500 
                 hover:to-blue-800"
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="h-12 flex items-center justify-center relative">
            <h1 className="font-good-times text-2xl text-center text-white tracking-widest">
              AURA Nexus Interface
            </h1>
          </div>
        </div>
      </nav>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div 
          ref={dropdownRef}
          onMouseLeave={handleMouseLeave}
          className="absolute top-16 left-1/2 transform -translate-x-1/2 w-64
                    bg-gradient-to-b from-blue-900 to-teal-900 rounded-2xl 
                    shadow-2xl overflow-hidden z-50
                    animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="p-2">
            <ul className="space-y-1">
              {Object.keys(windowContents).map((item, index) => (
                <li 
                  key={index}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 
                                rounded-xl transition-all duration-200" />
                  <button 
                    className="relative w-full px-4 py-3 text-left text-white 
                             transition-all duration-200 transform hover:translate-x-2
                             rounded-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Floating Window */}
      <FloatingWindow
        isOpen={activeWindow !== null}
        onClose={() => setActiveWindow(null)}
        title={activeWindow}
      >
        {activeWindow && windowContents[activeWindow]}
      </FloatingWindow>

      {/* Overlay when dropdown is open */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default Topbar;