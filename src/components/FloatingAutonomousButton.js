import React, { useState } from 'react';
import { Cpu } from 'lucide-react';
import { motion, useDragControls } from 'framer-motion';

const FloatingAutonomousButton = ({ onActivate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dragControls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: window.innerHeight - 76 });

  const handlePointerDown = (event) => {
    setIsDragging(false);
    dragControls.start(event, { snapToCursor: false });
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setIsHovered(false);
  };

  const handleDragEnd = (event, info) => {
    setPosition({
      x: info.point.x,
      y: info.point.y
    });
  };

  const handleClick = (event) => {
    if (!isDragging && onActivate) {
      onActivate(event);
    }
  };

  return (
    <motion.div
      drag
      dragElastic={0.7}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      dragControls={dragControls}
      dragListener={false}
      animate={{ x: position.x - 16, y: position.y - (window.innerHeight - 76) }}
      className="fixed bottom-4 left-4 z-[100] touch-none"
    >
      <motion.button
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          bg-gradient-to-r 
          from-teal-500 
          to-blue-600 
          text-white 
          rounded-full 
          flex 
          items-center 
          justify-center 
          shadow-2xl 
          cursor-pointer 
          transition-all 
          duration-300 
          border-4 
          border-white/30
          hover:border-white/50
          backdrop-blur-sm
        `}
        style={{
          width: isHovered ? '160px' : '60px',
          height: '60px',
          padding: '0 15px'
        }}
      >
        <motion.div 
          className="flex items-center justify-center w-full"
          initial={{ opacity: 1, x: 0 }}
          animate={{ 
            opacity: 1,
            x: 0
          }}
        >
          <div className={`flex items-center justify-center ${isHovered ? '' : 'w-full'}`}>
            <Cpu className={`opacity-90 ${isHovered ? 'mr-2' : ''}`} style={{
              width: '24px',
              height: '24px'
            }} />
            {isHovered && (
              <span className="text-base font-semibold whitespace-nowrap">
                AURA Genesis
              </span>
            )}
          </div>
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default FloatingAutonomousButton;