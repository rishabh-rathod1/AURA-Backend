import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Activity, Server, Wifi, Database, Lock } from 'lucide-react';

const AuraNexusInterface = ({ onAnimationComplete }) => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [progress, setProgress] = useState(0);
  const [animationState, setAnimationState] = useState('initializing');
  const [currentStatus, setCurrentStatus] = useState('Initializing systems...');
  
  const statusMessages = [
    { progress: 0, message: 'Initializing systems...', icon: Server },
    { progress: 20, message: 'Establishing secure connection...', icon: Lock },
    { progress: 40, message: 'Loading network protocols...', icon: Wifi },
    { progress: 60, message: 'Syncing database...', icon: Database },
    { progress: 80, message: 'Configuring system parameters...', icon: Activity },
    { progress: 100, message: 'System ready', icon: ShieldCheck }
  ];
  
  class Particle {
    constructor(x, y, type = 'ambient') {
      this.x = x;
      this.y = y;
      this.type = type;
      this.size = type === 'ambient' ? Math.random() * 1.2 + 0.3 : Math.random() * 1.8 + 0.8;
      this.speedX = (Math.random() - 0.5) * (type === 'ambient' ? 0.3 : 0.8);
      this.speedY = (Math.random() - 0.5) * (type === 'ambient' ? 0.3 : 0.8);
      this.life = 1;
      this.decay = type === 'ambient' ? 0.0015 + Math.random() * 0.002 : 0.004;
      this.color = this.getColor();
    }

    getColor() {
      const stateColors = {
        initializing: {
          ambient: ['14, 165, 233', '20, 184, 166', '56, 189, 248'],
          data: ['94, 234, 212', '45, 212, 191', '147, 237, 253']
        },
        filling: {
          ambient: ['14, 165, 233', '20, 184, 166', '56, 189, 248'],
          data: ['94, 234, 212', '45, 212, 191', '147, 237, 253']
        },
        complete: {
          ambient: ['94, 234, 212', '45, 212, 191', '147, 237, 253'],
          data: ['94, 234, 212', '45, 212, 191', '147, 237, 253']
        }
      };
      const colors = stateColors[animationState] || stateColors.initializing;
      return colors[this.type][Math.floor(Math.random() * colors[this.type].length)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
    }

    draw(ctx) {
      ctx.fillStyle = `rgba(${this.color}, ${this.life * 0.4})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  useEffect(() => {
    const fillingTimer = setTimeout(() => {
      setAnimationState('filling');
    }, 50);

    const completeTimer = setTimeout(() => {
      setAnimationState('complete');
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 4000);

    return () => {
      clearTimeout(fillingTimer);
      clearTimeout(completeTimer);
    };
  }, [onAnimationComplete]);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (animationState === 'complete') return 100;
        const next = prev + 2; // Slower progress for more realistic loading
        
        // Update status message based on progress
        const currentStatusItem = statusMessages.find((status, index) => {
          const nextStatus = statusMessages[index + 1];
          return next >= status.progress && (!nextStatus || next < nextStatus.progress);
        });
        
        if (currentStatusItem) {
          setCurrentStatus(currentStatusItem.message);
        }
        
        return next >= 100 ? 100 : next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [animationState]);

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let frame = 0;
    let animationFrameId;

    const createHexagonPattern = () => {
      const patternCanvas = document.createElement('canvas');
      const patternCtx = patternCanvas.getContext('2d');
      patternCanvas.width = 100;
      patternCanvas.height = 100;

      const size = 30;
      const h = size * Math.sqrt(3);

      patternCtx.strokeStyle = 'rgba(45, 212, 191, 0.08)';
      patternCtx.lineWidth = 0.5;

      for (let row = -1; row < 2; row++) {
        for (let col = -1; col < 2; col++) {
          const x = col * size * 1.5 + 50;
          const y = row * h + 50 + (col % 2) * h / 2;

          patternCtx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) patternCtx.moveTo(px, py);
            else patternCtx.lineTo(px, py);
          }
          patternCtx.closePath();
          patternCtx.stroke();
        }
      }

      return ctx.createPattern(patternCanvas, 'repeat');
    };

    const drawLoadingBar = () => {
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height * 0.65;
      const barWidth = 400;
      const barHeight = 4;
      const cornerRadius = 2;
      
      // Draw background bar
      ctx.beginPath();
      ctx.roundRect(
        centerX - barWidth / 2,
        centerY - barHeight / 2,
        barWidth,
        barHeight,
        cornerRadius
      );
      ctx.fillStyle = 'rgba(45, 212, 191, 0.15)';
      ctx.fill();
      
      // Draw progress bar
      const progressWidth = (progress / 100) * barWidth;
      ctx.beginPath();
      ctx.roundRect(
        centerX - barWidth / 2,
        centerY - barHeight / 2,
        progressWidth,
        barHeight,
        cornerRadius
      );
      
      const progressGradient = ctx.createLinearGradient(
        centerX - barWidth / 2,
        0,
        centerX + barWidth / 2,
        0
      );
      progressGradient.addColorStop(0, 'rgba(45, 212, 191, 0.9)');
      progressGradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.9)');
      progressGradient.addColorStop(1, 'rgba(45, 212, 191, 0.9)');
      ctx.fillStyle = progressGradient;
      ctx.fill();
      
      // Draw percentage and status
      ctx.font = '16px "Good Times Rg"';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round(progress)}%`, centerX, centerY - 25);
      
      // Draw status message
      ctx.font = '14px "Good Times Rg"';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
      ctx.fillText(currentStatus, centerX, centerY + 25);
      
      // Draw status indicators with pulse effect
      const indicatorRadius = 4;
      const indicatorSpacing = 20;
      const totalWidth = (statusMessages.length - 1) * indicatorSpacing;
      let startX = centerX - totalWidth / 2;
      
      statusMessages.forEach((status, index) => {
        const x = startX + index * indicatorSpacing;
        const y = centerY + 50;
        
        // Pulse effect for current status
        const isActive = progress >= status.progress;
        const pulseSize = isActive ? Math.sin(frame * 0.05) * 2 : 0;
        
        // Glow
        if (isActive) {
          ctx.beginPath();
          ctx.arc(x, y, indicatorRadius + 4 + pulseSize, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(45, 212, 191, 0.2)';
          ctx.fill();
        }
        
        // Indicator dot
        ctx.beginPath();
        ctx.arc(x, y, indicatorRadius, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? 'rgba(45, 212, 191, 0.9)' : 'rgba(45, 212, 191, 0.2)';
        ctx.fill();
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, dimensions.height);
      bgGradient.addColorStop(0, 'rgb(15, 23, 42)');
      bgGradient.addColorStop(1, 'rgb(15, 118, 110)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Hexagon pattern
      ctx.fillStyle = createHexagonPattern();
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Particle system
      particles = particles.filter(particle => particle.life > 0);
      if (frame % 3 === 0 && particles.length < 80) {
        particles.push(new Particle(
          Math.random() * dimensions.width,
          Math.random() * dimensions.height,
          'ambient'
        ));
      }

      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      // Draw loading bar
      drawLoadingBar();
      
      // Draw title with effects
      ctx.save();
      
      ctx.font = 'bold 90px "Good Times Rg"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.shadowColor = 'rgba(45, 212, 191, 0.3)';
      ctx.shadowBlur = 20;
      
      const titleGradient = ctx.createLinearGradient(
        dimensions.width / 2 - 150,
        0,
        dimensions.width / 2 + 150,
        0
      );
      titleGradient.addColorStop(0, 'rgba(94, 234, 212, 0.9)');
      titleGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
      titleGradient.addColorStop(1, 'rgba(94, 234, 212, 0.9)');
      
      ctx.fillStyle = titleGradient;
      ctx.fillText('AURA', dimensions.width / 2, dimensions.height * 0.3);
      
      ctx.shadowBlur = 0;
      ctx.font = 'bold 24px "Good Times Rg"';
      const subTitleGradient = ctx.createLinearGradient(
        dimensions.width / 2 - 100,
        0,
        dimensions.width / 2 + 100,
        0
      );
      subTitleGradient.addColorStop(0, 'rgba(45, 212, 191, 0.7)');
      subTitleGradient.addColorStop(1, 'rgba(14, 165, 233, 0.7)');
      
      ctx.fillStyle = subTitleGradient;
      ctx.fillText('NEXUS INTERFACE', dimensions.width / 2, dimensions.height * 0.3 + 45);
      
      ctx.restore();

      frame++;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions, progress, animationState, currentStatus]);

  return (
    <div className="fixed inset-0 bg-slate-900">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
    </div>
  );
};

export default AuraNexusInterface;