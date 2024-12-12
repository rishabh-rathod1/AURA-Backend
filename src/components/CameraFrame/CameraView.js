import React, { useContext, useState, useRef } from 'react';
import VisionControls from './VisionControls';
import { IpAddressContext } from '../../IpAddressContext';
import { Camera, Maximize2, Minimize2, Lock, Unlock } from 'lucide-react';
import { createPortal } from 'react-dom';

const CameraView = ({ socket }) => {
  const { ipAddress } = useContext(IpAddressContext);
  const [isLocked, setIsLocked] = useState(false);
  const [sections, setSections] = useState([
    { id: 'camera1', title: 'Camera 1', type: 'camera', width: '38%', order: 1 },
    { id: 'controls', title: 'Vision Controls', type: 'controls', width: '24%', order: 2 },
    { id: 'camera2', title: 'Camera 2', type: 'camera', width: '38%', order: 3 }
  ]);
  
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  
  const camera1Url = `http://${ipAddress}:5000/camera/0`;
  const camera2Url = `http://${ipAddress}:5000/camera/1`;
  
  const takeFullPageScreenshot = () => {
    window.print();
  };

  const handleDragStart = (e, position) => {
    if (isLocked) return;
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    if (isLocked) return;
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (isLocked) return;
    
    const newSections = [...sections];
    const draggedItemContent = newSections[dragItem.current];
    
    newSections.splice(dragItem.current, 1);
    newSections.splice(dragOverItem.current, 0, draggedItemContent);
    
    // Update order property for each item
    newSections.forEach((item, index) => {
      item.order = index + 1;
    });
    
    dragItem.current = null;
    dragOverItem.current = null;
    setSections(newSections);
  };

  const CameraStream = ({ title, url }) => {
    const [isDetached, setIsDetached] = useState(false);
  
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
                <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
                <button
                  onClick={() => setIsDetached(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <Minimize2 className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <div className="relative flex-1 rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`${title} Stream`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '';
                    e.target.alt = 'Stream not available';
                    e.target.parentElement.innerHTML = `
                      <div class="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 rounded-lg">
                        <svg class="w-12 h-12 text-red-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12" y2="16"/>
                        </svg>
                        <div class="text-center">
                          <h3 class="text-base font-medium text-slate-700">Camera Not Accessible</h3>
                          <p class="text-sm text-slate-500">Please check your camera connection</p>
                        </div>
                      </div>
                    `;
                  }}
                />
              </div>
              <div className="mt-2 px-3 py-2 bg-slate-50 rounded-md border border-slate-200">
                <span className="text-sm text-slate-700 truncate block">
                  Stream: <span className="font-medium text-blue-600">{url}</span>
                </span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      );
    };

    return (
      <>
        <div className="flex-1 h-full bg-white/90 p-2 rounded-lg border border-slate-300 shadow-md">
          <div className="flex justify-between items-center h-6 border-b border-slate-400">
            <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
          </div>
          <div className="relative h-[calc(100%-4rem)] mt-2">
            <img
              src={url}
              alt={`${title} Stream`}
              className="w-full h-full object-cover rounded-md border border-slate-200"
              onError={(e) => {
                e.target.src = '';
                e.target.alt = 'Stream not available';
                e.target.parentElement.innerHTML = `
                  <div class="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 rounded-md">
                    <svg class="w-8 h-8 text-red-400 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12" y2="16"/>
                    </svg>
                    <div class="text-center">
                      <h3 class="text-sm font-medium text-slate-700">Camera Not Accessible</h3>
                      <p class="text-xs text-slate-500">Please check your camera connection</p>
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
          <div className="mt-1 px-2 py-1 bg-slate-50 rounded border border-slate-400">
            <span className="text-xs text-slate-700 truncate block">
              Stream: <span className="font-medium text-blue-600">{url}</span>
            </span>
          </div>
        </div>
        {isDetached && <DetachedView />}
      </>
    );
  };

  const renderSection = (section, index) => {
    const style = {
      width: section.width,
      height: '100%',
      cursor: isLocked ? 'default' : 'move',
      opacity: dragItem.current === index ? 0.5 : 1,
    };

    return (
      <div
        key={section.id}
        className="h-full"
        style={style}
        draggable={!isLocked}
        onDragStart={(e) => handleDragStart(e, index)}
        onDragEnter={(e) => handleDragEnter(e, index)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => e.preventDefault()}
      >
        {section.type === 'camera' && (
          <CameraStream 
            title={section.title} 
            url={section.title === 'Camera 1' ? camera1Url : camera2Url} 
          />
        )}
        {section.type === 'controls' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 bg-white/90 p-2 rounded-lg border border-slate-300 shadow-md overflow-auto">
              <VisionControls socket={socket} />
            </div>
            <button
              onClick={takeFullPageScreenshot}
              className="flex items-center justify-center gap-1 px-3 py-1.5 mt-2 text-xs rounded-md 
                       bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200
                       border border-blue-600 shadow-sm w-full"
            >
              <Camera size={14} />
              <span>Take Screenshot</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-100/95 backdrop-blur-sm p-2 rounded-xl border border-slate-300 shadow-lg">
      <div className="mb-2 flex justify-end">
        <button
          onClick={() => setIsLocked(!isLocked)}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm transition-colors ${
            isLocked 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-green-100 text-green-600 hover:bg-green-200'
          }`}
        >
          {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
          <span>{isLocked ? 'Unlock Layout' : 'Lock Layout'}</span>
        </button>
      </div>
      <div className="flex-1 flex gap-2 min-h-0">
        {sections.map((section, index) => renderSection(section, index))}
      </div>
    </div>
  );
};

export default CameraView;