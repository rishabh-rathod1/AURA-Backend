import React from 'react'

const SpatialView = () => {
  return (
    <div className='flex-1'>
      <h1 className='text-center px-3'>Spatial View</h1>
      <div className='bg-transparent flex-column  justify-center mr-3 ml-3 mt-3 mb-3 rounded-2xl' style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
              
              src='https://media.istockphoto.com/id/1460919616/video/remote-operated-underwater-vehicle.mp4?s=mp4-640x640-is&k=20&c=QR5CjS1zrf-7X3b4WQycA0v_nRwaLCPuTyunaKrzWtA='
              frameborder='0'
              allow='autoplay; encrypted-media'
              allowfullscreen
              title='video1'
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
              </div>
    </div>
  )
}
export default SpatialView
