import React from 'react';
import SpatialView from './SpatialView';
import Readings from './Readings';

const AnalyticsSuite = ({ sensorData }) => {
  return (
    <div className="h-full w-full flex flex-col bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20 shadow-lg">
      <div className="relative flex justify-center mb-4">
        <div className="px-6 py-1 bg-blue-500 backdrop-blur-sm rounded-full shadow-md">
          <h1 className="text-base text-center text-white font-medium">Analytics Suite</h1>
        </div>
      </div>
      
      <div className="flex flex-1 gap-4 min-h-0">
        <div className="flex-1 bg-slate-50 backdrop-blur-sm rounded-xl p-4 border border-slate-200 shadow-md overflow-auto">
          <SpatialView />
        </div>

        <div className="w-1/4 min-w-64 max-w-72">
          <div className="h-full bg-slate-50 backdrop-blur-sm rounded-xl p-4 border border-slate-200 shadow-md">
            <Readings sensorData={sensorData} />
            
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSuite