import React from 'react'
import SpatialView from './SpatialView'
import Readings from './Readings'
const AnalyticsSuit = () => {
  return (
    <div className='flex-1 bg-gray-200 m-3 pb-10 rounded-2xl'>
      <div class="mx-auto max-w-fit px-2 sm:px-6 lg:px-8 bg-blue-500 rounded-full mt-2">
                          <div class="h-8 ">
                        <h1 className=' text-base text-center pt-1 text-white'>Analytics Suit</h1>
                    </div>
                  </div>
      {/* <h1 className='text-center pt-1'  > Analytics Suit</h1> */}
      <div className='flex flex-row h-full'>
        <SpatialView />
        <Readings />
      </div>
    </div>
  )
}
export default AnalyticsSuit


