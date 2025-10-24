import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
// import Sidebar from './Sidebar';
// import Sidebar from './component/Sidebar';
// import Navbar from '../../components/Navbar';

const Home:React.FC = () => {
    return (
        <section className="flex h-screen w-full  bg-[#D3FFCA] overflow-hidden">
            {/* <Navbar /> */}
            <div className=''>
                <Sidebar />
            </div>
            <main className="flex mt- flex-col flex-1 overflow-hidden">
                <section className="flex-1 slim-scrollbar overflow-y-auto">
                    <Outlet />
                </section>
            </main>
        </section>

    );
}

export default Home;
