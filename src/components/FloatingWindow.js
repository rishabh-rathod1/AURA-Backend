import React, { useState, useRef, useEffect } from 'react';
import { X, GripHorizontal } from 'lucide-react';

const FloatingWindow = ({ isOpen, onClose, title, children, position }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });
  const [windowSize, setWindowSize] = useState({ width: 600, height: 400 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);

  // ... (all existing handlers and effects remain unchanged)
  const handleMouseDown = (e) => {
    if (e.target.closest('.window-header')) {
      setIsDragging(true);
      const windowRect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - windowRect.left,
        y: e.clientY - windowRect.top
      });
    }
  };

  const handleResizeStart = (e, direction) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setInitialSize({
      width: windowRef.current.offsetWidth,
      height: windowRef.current.offsetHeight
    });
    setInitialPos({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      const windowWidth = windowRef.current.offsetWidth;
      const windowHeight = windowRef.current.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const boundedX = Math.min(Math.max(0, newX), viewportWidth - windowWidth);
      const boundedY = Math.min(Math.max(0, newY), viewportHeight - windowHeight);

      setWindowPosition({ x: boundedX, y: boundedY });
    } else if (isResizing) {
      const deltaX = e.clientX - initialPos.x;
      const deltaY = e.clientY - initialPos.y;
      
      let newWidth = initialSize.width;
      let newHeight = initialSize.height;
      let newX = windowPosition.x;
      let newY = windowPosition.y;

      const minWidth = 400;
      const minHeight = 300;
      const maxWidth = window.innerWidth - windowPosition.x;
      const maxHeight = window.innerHeight - windowPosition.y;

      switch (resizeDirection) {
        case 'e':
          newWidth = Math.min(Math.max(minWidth, initialSize.width + deltaX), maxWidth);
          break;
        case 'w':
          const possibleWidth = initialSize.width - deltaX;
          if (possibleWidth >= minWidth) {
            newWidth = possibleWidth;
            newX = windowPosition.x + deltaX;
          }
          break;
        case 's':
          newHeight = Math.min(Math.max(minHeight, initialSize.height + deltaY), maxHeight);
          break;
        case 'n':
          const possibleHeight = initialSize.height - deltaY;
          if (possibleHeight >= minHeight) {
            newHeight = possibleHeight;
            newY = windowPosition.y + deltaY;
          }
          break;
        case 'se':
          newWidth = Math.min(Math.max(minWidth, initialSize.width + deltaX), maxWidth);
          newHeight = Math.min(Math.max(minHeight, initialSize.height + deltaY), maxHeight);
          break;
        case 'sw':
          if (initialSize.width - deltaX >= minWidth) {
            newWidth = initialSize.width - deltaX;
            newX = windowPosition.x + deltaX;
          }
          newHeight = Math.min(Math.max(minHeight, initialSize.height + deltaY), maxHeight);
          break;
        case 'ne':
          newWidth = Math.min(Math.max(minWidth, initialSize.width + deltaX), maxWidth);
          if (initialSize.height - deltaY >= minHeight) {
            newHeight = initialSize.height - deltaY;
            newY = windowPosition.y + deltaY;
          }
          break;
        case 'nw':
          if (initialSize.width - deltaX >= minWidth) {
            newWidth = initialSize.width - deltaX;
            newX = windowPosition.x + deltaX;
          }
          if (initialSize.height - deltaY >= minHeight) {
            newHeight = initialSize.height - deltaY;
            newY = windowPosition.y + deltaY;
          }
          break;
      }

      setWindowSize({ width: newWidth, height: newHeight });
      setWindowPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  if (!isOpen) return null;

  const resizeHandles = [
    { direction: 'e', className: 'right-0 top-1/2 -translate-y-1/2 w-2 h-12 cursor-e-resize' },
    { direction: 'w', className: 'left-0 top-1/2 -translate-y-1/2 w-2 h-12 cursor-w-resize' },
    { direction: 's', className: 'bottom-0 left-1/2 -translate-x-1/2 h-2 w-12 cursor-s-resize' },
    { direction: 'n', className: 'top-0 left-1/2 -translate-x-1/2 h-2 w-12 cursor-n-resize' },
    { direction: 'se', className: 'bottom-0 right-0 h-4 w-4 cursor-se-resize' },
    { direction: 'sw', className: 'bottom-0 left-0 h-4 w-4 cursor-sw-resize' },
    { direction: 'ne', className: 'top-0 right-0 h-4 w-4 cursor-ne-resize' },
    { direction: 'nw', className: 'top-0 left-0 h-4 w-4 cursor-nw-resize' }
  ];

  return (
    <div className="fixed inset-0 z-50" onMouseDown={(e) => e.stopPropagation()}>
      <div 
        ref={windowRef}
        style={{
          transform: `translate(${windowPosition.x}px, ${windowPosition.y}px)`,
          width: windowSize.width,
          height: windowSize.height,
          transition: isDragging || isResizing ? 'none' : 'transform 0.2s ease-out',
        }}
        className={`
          absolute bg-gradient-to-b from-blue-900 to-teal-900 
          rounded-xl shadow-2xl
          animate-in fade-in zoom-in-95 duration-200
          ${isDragging ? 'cursor-grabbing' : ''}
          select-none
          border border-white/20
          overflow-hidden
          backdrop-blur-xl
          shadow-[0_0_40px_rgba(0,0,0,0.3)]
        `}
      >
        {/* Header */}
        <div 
          className="window-header flex items-center justify-between p-4 border-b border-white/20 cursor-grab active:cursor-grabbing bg-black/20 backdrop-blur-lg"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <GripHorizontal className="w-5 h-5 text-white/50" />
            <h2 className="text-xl text-white font-good-times tracking-wider">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors duration-200 ease-in-out"
          >
            <X className="w-5 h-5 text-white hover:scale-110 transition-transform duration-200" />
          </button>
        </div>

        {/* Content with custom scrollbar */}
        <div 
          className="p-6 overflow-y-auto custom-scrollbar" 
          style={{ 
            height: 'calc(100% - 4rem)',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
          }}
        >
          <style>
            {`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
                margin: 4px;
              }
              
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 999px;
                border: 2px solid transparent;
                background-clip: padding-box;
              }
              
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.4);
                border: 2px solid transparent;
                background-clip: padding-box;
              }
              
              .custom-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
              }
            `}
          </style>
          <div className="prose prose-invert max-w-none">
            {children}
          </div>
        </div>

        {/* Resize Handles with subtle styling */}
        {resizeHandles.map(({ direction, className }) => (
          <div
            key={direction}
            className={`absolute bg-white/5 hover:bg-white/20 transition-colors duration-200 ${className}`}
            style={{
              borderWidth: direction.length === 1 ? '1px' : '1px 1px',
              borderStyle: 'solid',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
            }}
            onMouseDown={(e) => handleResizeStart(e, direction)}
          />
        ))}
      </div>

      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
        onClick={onClose}
      />
    </div>
  );
};

export default FloatingWindow;