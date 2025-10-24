import React from 'react';

type LogoutProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

const Logout: React.FC<LogoutProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="text-center flex bg-white m-4 py-8 rounded-2xl justify-center items-center flex-col px-16">
      <h1 className="text-2xl font-bold">Log out?</h1>
      <h2 className="text-lg font-bold mb-4">Are you sure you want to log out?</h2>
      <div className="flex justify-center gap-4">
        <button
          onClick={onCancel}
          className="border-green-700 cursor-pointer my-4 font-bold border bg-white text-green-700 px-10 py-2 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="text-white cursor-pointer font-bold bg-green-700 px-10 my-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Logout;
