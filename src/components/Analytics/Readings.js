import React from 'react';
import { Gauge, Thermometer, ArrowDown, Waves } from 'lucide-react';

const Readings = ({ sensorData }) => {
  const depth = sensorData 
    ? ((sensorData.pressure - 0.09 - 0.3000) / 0.00981).toFixed(2)
    : undefined;

  const pressure = sensorData 
    ? (sensorData.pressure - 0.3000).toFixed(4)
    : undefined;

  const SensorReading = ({ label, value, unit, Icon }) => (
    <div className="w-full bg-white rounded-lg p-2 border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-navy-600" />
          <span className="text-sm text-navy-600 font-medium truncate">{label}</span>
        </div>
        <span className="text-sm font-semibold text-navy-800 whitespace-nowrap">
          {value !== undefined ? `${value} ${unit}` : 'N/A'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Gauge className="w-5 h-5 text-navy-600" />
        <h2 className="text-lg font-semibold text-navy-800">Sensor Feed</h2>
      </div>
      
      <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto">
        <SensorReading 
          label="Depth"
          value={depth}
          unit="m"
          Icon={ArrowDown}
        />
        
        <SensorReading 
          label="Temperature"
          value={sensorData?.temperature}
          unit="°C"
          Icon={Thermometer}
        />
        
        <SensorReading 
          label="Pressure"
          value={pressure}
          unit="MPa"
          Icon={Waves}
        />
      </div>
    </div>
  );
};

export default Readings;