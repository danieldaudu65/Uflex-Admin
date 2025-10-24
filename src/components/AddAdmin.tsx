import React, { useState } from "react";
import { logo } from "../assets";
import { apiRequest } from "../utils/api";
import toast from "react-hot-toast";

interface AddAdminModalProps {
  show: boolean;
  onClose: () => void;
  refreshAdmins?: () => void; // optional refresh after add
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({ show, onClose, refreshAdmins }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !email) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const body = { name, email };

      await apiRequest("/admin_admin/create", "POST", body);

      toast.success("Admin created successfully! ✅");
      setName("");
      setEmail("");
      onClose();
      if (refreshAdmins) refreshAdmins();
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.message || "Failed to create admin. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="bg-white rounded-lg p-6 w-[85%]  m-auto shadow-lg">
      <div className="flex justify-center items-center flex-col">
        <img src={logo} alt="Logo" className="w-16 h-16 mb-2" />
        <h2 className="text-lg font-bold mb-4">Add New Admin</h2>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 outline-gray-300 rounded-md p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border  border-gray-300 outline-gray-300 rounded-md p-2"
        />
      </div>

      <div className="flex my-3 justify-between gap-3 mt-5">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded-md hover:bg-gray-100"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Add Admin"}
        </button>
      </div>
    </div>
  );
};

export default AddAdminModal;
