import React from 'react';
import Cameraview from './CameraFrame/CameraView';
import AnalyticsSuit from './Analytics/AnalyticsFrame';
import ControllerDisplay from './ControllerDisplay';

const Mainframe = ({ socket }) => {
  return (
    <div className="flex flex-col h-full">
      <Cameraview socket={socket} />
      <div className="flex flex-row flex-1">
        <div className="flex-1 bg-gray-200 m-3 pb-10 rounded-2xl">
          <ControllerDisplay socket={socket} />
        </div>
        <AnalyticsSuit />
      </div>
    </div>
  );
};

export default Mainframe;