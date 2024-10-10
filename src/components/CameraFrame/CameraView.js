import React from 'react'
import VisionControls from './VisionControls'

const Cameraview = ({ socket, cameraData }) => {
  return (
    <div className="flex flex-row h-full flex-1 bg-gray-200 mx-3 my-2 rounded-2xl" >
      <div className='bg-white flex-1 ml-3 mt-3 mb-3 pl-3 pt-3 pr-3 pb-3 rounded-2xl'>Camera 1
        <div className='bg-transparent flex-column justify-center rounded-2xl' style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
          {cameraData && cameraData.camera1 ? (
            <img
              src={`data:image/jpeg;base64,${cameraData.camera1}`}
              alt="Camera 1"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          ) : (
            <div>No camera feed available</div>
          )}
        </div>
      </div>
      <VisionControls socket={socket} />
      <div className='bg-white flex-1 mr-3 mt-3 mb-3 pl-3 pt-3 pr-3 pb-3 rounded-2xl'>Camera 2
        <div className='bg-transparent flex-column justify-center rounded-2xl' style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
          <iframe
            src='https://media.istockphoto.com/id/1398507734/video/choppy-water-wavy-sea-underwater-wave-hit-on-rocks-and-makes-foam-on-the-surface-of-the-sea.mp4?s=mp4-640x640-is&k=20&c=iso8deDs9oNHLnXGvAnFobla3_mIEyi9OKzdFF6k1FQ='
            frameBorder='0'
            allow='autoplay; encrypted-media'
            allowFullScreen
            title='video1'
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  )
}

export default Cameraview