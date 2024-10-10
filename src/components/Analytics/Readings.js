import React from 'react'
import { useEffect } from 'react';
const Readings = ({ sensorData }) => {
  useEffect(() => {
    console.log("New sensor data received:", sensorData);
  }, [sensorData]);
  return (
    <div className='flex-1'>
      
      <h1 className='text-center pb-2 pt-3'>Sensor Feed</h1>
      <h1 className='text-left pb-3'>Depth: {sensorData ? `${sensorData.depth} m` : 'N/A'}</h1>
      <h1 className='text-left pb-3'>Temperature: {sensorData ? `${sensorData.temperature} °C` : 'N/A'}</h1>
      <h1 className='text-left pb-3'>Pressure: {sensorData ? `${sensorData.pressure} hPa` : 'N/A'}</h1>
    </div>
  )
}

export default Readings