import React from 'react'
import { bell, userLogin } from '../assets'
// import Search from '../components/Search'
import RiderTable from '../components/RiderTable'

const Rider:React.FC = () => {
    return (

        <div className="p-6 bg-white h-full space-y-6 slim-scrollbar w-full">
            <div className='flex relative justify-center items-center'>
                <h1 className='font-extrabold text-lg'>Riders</h1>
                <div className='flex gap-2 absolute right-1 justify-end'>
                    <img src={bell} className='w' alt="Notifications" />
                    <img src={userLogin} className='w' alt="User" />
                </div>
            </div>
            {/* <Search /> */}

            <RiderTable />

        </div>
    )
}

export default Rider