import React from 'react';
import Cameraview from './CameraFrame/CameraView';
import AnalyticsSuit from './Analytics/AnalyticsFrame';
import ControllerDisplay from './ControllerDisplay';

const Mainframe = ({ socket, cameraData, sensorData }) => {
  return (
    <div className="flex flex-col h-full">
      <Cameraview socket={socket} cameraData={cameraData} />
      <div className="flex flex-row flex-1">
        <div className="flex-1 bg-gray-200 m-3 pb-10 rounded-2xl">
          <ControllerDisplay socket={socket} />
        </div>
        <AnalyticsSuit sensorData={sensorData} />
      </div>
    </div>
  );
};

export default Mainframe;