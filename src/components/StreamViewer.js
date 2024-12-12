import React, { useEffect, useState, useRef } from 'react';
import { Peer } from 'peerjs';
import { Wifi } from 'lucide-react';

const StreamViewer = ({ peerId }) => {
  const [status, setStatus] = useState('connecting');
  const [error, setError] = useState(null);
  const camera1Ref = useRef(null);
  const camera2Ref = useRef(null);

  useEffect(() => {
    const peer = new Peer();
    
    peer.on('open', () => {
      const conn = peer.connect(peerId);
      
      conn.on('open', () => {
        setStatus('connected');
      });

      conn.on('data', (data) => {
        if (data.type === 'video-frame') {
          const blob = new Blob([data.data], { type: 'image/jpeg' });
          const url = URL.createObjectURL(blob);
          
          if (data.camera === 'camera1' && camera1Ref.current) {
            camera1Ref.current.src = url;
            URL.revokeObjectURL(camera1Ref.current.src);
          } else if (data.camera === 'camera2' && camera2Ref.current) {
            camera2Ref.current.src = url;
            URL.revokeObjectURL(camera2Ref.current.src);
          }
        }
      });

      conn.on('error', (err) => {
        setError(err.message);
        setStatus('error');
      });

      conn.on('close', () => {
        setStatus('disconnected');
      });
    });

    return () => {
      peer.destroy();
    };
  }, [peerId]);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="h-screen bg-gray-100 p-4">
      <div className="mb-4 p-4 bg-white rounded-lg border border-gray-300 shadow">
        <div className="flex items-center gap-2">
          <Wifi className={getStatusColor()} />
          <span className="font-medium">Stream Status: {status}</span>
          {error && <span className="text-red-500 ml-2">{error}</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Camera 1</h2>
          <img
            ref={camera1Ref}
            alt="Camera 1 Stream"
            className="w-full h-auto"
          />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Camera 2</h2>
          <img
            ref={camera2Ref}
            alt="Camera 2 Stream"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default StreamViewer;