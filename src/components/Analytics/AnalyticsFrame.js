import SpatialView from './SpatialView';
import Readings from './Readings';
import React, { useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { IpAddressContext } from '../../IpAddressContext';
import { Maximize2, X } from 'lucide-react';

const PopupIframe = () => {
  const { ipAddress } = useContext(IpAddressContext);
  const [isPopup, setIsPopup] = useState(false);

  const togglePopup = () => {
    setIsPopup(!isPopup);
  };

  const defaultView = (
    <div className="relative w-full h-full min-h-[300px]">
      <iframe
        src={`http://${ipAddress}:3756`}
        className="w-full h-full rounded-lg border border-gray-200/30 bg-white/50"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
      <button
        onClick={togglePopup}
        className="absolute top-2 right-2 p-1.5 bg-black/30 hover:bg-black/50 rounded-lg transition-colors duration-200 text-white"
        aria-label="Open in popup"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
    </div>
  );

  const popupView = (
    <div className="fixed inset-4 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={togglePopup} />
      <div className="relative w-11/12 h-5/6 bg-white rounded-xl shadow-2xl">
        <iframe
          src={`http://${ipAddress}:3756`}
          className="w-full h-full rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        <button
          onClick={togglePopup}
          className="absolute top-3 right-3 p-1.5 bg-black/30 hover:bg-black/50 rounded-lg transition-colors duration-200 text-white"
          aria-label="Close popup"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {defaultView}
      {isPopup && createPortal(popupView, document.body)}
    </>
  );
};


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
            <PopupIframe/>
            
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSuite