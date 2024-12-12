import React, { useContext, useState } from 'react';
import { IpAddressContext } from '../../IpAddressContext';
import { Maximize2, Minimize2 } from 'lucide-react';
import { createPortal } from 'react-dom';

const SpatialView = () => {
  const { ipAddress } = useContext(IpAddressContext);
  const [isDetached, setIsDetached] = useState(false);
  const spurl = `http://${ipAddress}:5001`;

  const DetachedView = () => {
    return createPortal(
      <div 
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isDetached ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setIsDetached(false)}
      >
        <div 
          className={`absolute inset-4 bg-white rounded-lg shadow-2xl transition-all duration-300 transform ${
            isDetached ? 'scale-100' : 'scale-90'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-slate-800">Spatial View</h2>
              <button
                onClick={() => setIsDetached(false)}
                className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
              >
                <Minimize2 className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="relative flex-1 rounded-lg overflow-hidden">
              <iframe
                src={spurl}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Spatial View Stream"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.parentElement.innerHTML = `
                    <div class="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 rounded-lg">
                      <svg class="w-12 h-12 text-red-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12" y2="16"/>
                      </svg>
                      <div class="text-center">
                        <h3 class="text-base font-medium text-slate-700">Stream Not Accessible</h3>
                        <p class="text-sm text-slate-500">Please check your connection</p>
                      </div>
                    </div>
                  `;
                }}
              />
            </div>
            <div className="mt-2 px-3 py-2 bg-slate-50 rounded-md border border-slate-200">
              <span className="text-sm text-slate-700 truncate block">
                Stream: <span className="font-medium text-blue-600">{spurl}</span>
              </span>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="flex flex-col h-full w-full min-h-0">
      <h2 className="text-lg font-medium text-navy-800 text-center py-1 flex-none">
        Spatial View
      </h2>
      
      <div className="flex-1 min-h-0 w-full relative">
        <div className="absolute inset-0 p-1">
          <div className="relative w-full h-full bg-slate-100 rounded-xl border border-slate-200 shadow-md overflow-hidden">
            <div className="absolute inset-0">
              <iframe
                src={spurl}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Spatial View Stream"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.parentElement.innerHTML = `
                    <div class="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 rounded-md">
                      <svg class="w-8 h-8 text-red-400 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12" y2="16"/>
                      </svg>
                      <div class="text-center">
                        <h3 class="text-sm font-medium text-slate-700">Stream Not Accessible</h3>
                        <p class="text-xs text-slate-500">Please check your connection</p>
                      </div>
                    </div>
                  `;
                }}
              />
              <button
                onClick={() => setIsDetached(true)}
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-md transition-colors"
              >
                <Maximize2 className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {isDetached && <DetachedView />}
    </div>
  );
};

export default SpatialView;