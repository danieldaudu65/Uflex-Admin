import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { side_menu } from '../Assets/data';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { side_menu } from '../data/SideMenu';
import ModalWrapper from './modalParent';
import Logout from './Logout';

const Sidebar:React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openLogOut, setOpenLogOut] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const renderLinks = () => (
    <nav className="flex flex-1 flex-col items-start w-full">
      <AnimatePresence>
        {side_menu.map((link, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="w-full"
          >
            <Link
              to={link.href}
              onClick={(e) => {
                if (link.custom && link.label === "Log out") {
                  e.preventDefault();
                  setOpenLogOut(true);
                  return;
                } else {
                  closeSidebar();
                }
              }}
              className="group flex hover:bg-[#1AA80326] w-full p-4 text-black items-center gap-2 transition-all duration-300"
            >
              <div className="relative w-6 h-6">
                <img
                  src={link.icon}
                  alt={link.label}
                  className="absolute top-1 inset-0 w-4 h-4 transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                />
                <img
                  src={link.icon}
                  alt={`${link.label} hover`}
                  className="absolute top-1 inset-0 w-5 h-5 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                />
              </div>
              <span className="font-extralight capitalize">{link.label}</span>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </nav>
  );

  return (
    <>
      {/* Hamburger Icon (Mobile Only) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={toggleSidebar} className="text-black bg-white rounded p-2 shadow-md">
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full pt-12 slim-scrollbar overflow-y-auto pb-8 w-64 bg-white shadow-md z-40 md:hidden"
          >
            <div className="top-8">{renderLinks()}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Static) */}
      <aside className="w-fit hidden pt-12 md:flex overflow-y-auto pb-28 flex-col h-screen items-center gap-20 bg-white text-black">
        {renderLinks()}
      </aside>

      {/* Modal */}
      <ModalWrapper isOpen={openLogOut} onClose={() => setOpenLogOut(false)}>
        <Logout
          onCancel={() => setOpenLogOut(false)}
          onConfirm={() => {
            localStorage.removeItem('token'); // remove just token
            localStorage.removeItem('admin'); // remove just token
            // or sessionStorage.clear(); // if you want to clear everything
            setOpenLogOut(false);
            window.location.href = '/'; // redirect to login or any route
          }}
        />
      </ModalWrapper>
    </>
  );
};

export default Sidebar;
