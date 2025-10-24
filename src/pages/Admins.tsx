import React, { useEffect, useState } from "react";
import { bell, del, edit, userLogin } from "../assets";
import Search from "../components/Search";
import { FaPlus } from "react-icons/fa";
import AddAdminModal from "../components/AddAdmin";
import ModalWrapper from "../components/modalParent";
import { apiRequest } from "../utils/api";
import toast from "react-hot-toast";
import RoleModal from "../components/RoleModal";

interface Admin {
  _id: string;
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  role: string;
  displayRole: string;
  status: "Active" | "Inactive";
}

const Admins: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<{ id: string; role: string } | null>(null);
  const [editRoleModal, setEditRoleModal] = useState(false);

  // ✅ Fetch all admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/admin_admin/all", "POST");
      const mappedAdmins: Admin[] = data.admins.map((admin: any) => ({
        id: admin._id,
        name: admin.name,
        email: admin.email,
        dateJoined: new Date(admin.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        role: admin.role,
        displayRole: admin.role === "master" ? "Master Admin" : "Standard Admin",
        status: admin.is_block ? "Inactive" : "Active",
      }));
      setAdmins(mappedAdmins);
      setFilteredAdmins(mappedAdmins);
    } catch (err) {
      console.error("Error fetching admins:", err);
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ✅ Filter admins based on search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAdmins(admins);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = admins.filter(
        (admin) =>
          admin.name.toLowerCase().includes(term) ||
          admin.email.toLowerCase().includes(term) ||
          admin.role.toLowerCase().includes(term) ||
          admin.displayRole.toLowerCase().includes(term) ||
          admin.status.toLowerCase().includes(term)
      );
      setFilteredAdmins(filtered);
    }
  }, [searchTerm, admins]);

  // ✅ Open Edit Role modal
  const handleEditRole = (adminId: string, role: string) => {
    setSelectedAdmin({ id: adminId, role });
    setEditRoleModal(true);
  };

  // ✅ Deactivate admin
  const handleDeactivateAdmin = async (adminId: string) => {
    try {
      setLoading(true);
      const res = await apiRequest(`/admin_admin/deactivate`, "PUT", { id: adminId });
      if (res.success) {
        toast.success("Admin deactivated successfully");
        fetchAdmins();
      } else {
        toast.error("Failed to deactivate admin");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deactivating admin");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Activate admin
  const handleActivateAdmin = async (adminId: string) => {
    try {
      setLoading(true);
      const res = await apiRequest(`/admin_admin/activate`, "PUT", { id: adminId });
      if (res.success) {
        toast.success("Admin activated successfully");
        fetchAdmins();
      } else {
        toast.error("Failed to activate admin");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error activating admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white h-full space-y-6 slim-scrollbar w-full">
      {/* Header */}
      <div className="flex relative justify-center items-center">
        <h1 className="font-extrabold text-lg">Admins</h1>
        <div className="flex gap-2 absolute right-1 justify-end">
          <img src={bell} alt="Notifications" />
          <img src={userLogin} alt="User" />
        </div>
      </div>

      {/* Search + Add */}
      <div className="flex items-center w-full gap-2">
        <Search value={searchTerm} onChange={setSearchTerm} />
        <FaPlus
          onClick={() => setShowModal(true)}
          className="text-2xl p-1 rounded-md text-black/50 border border-gray-400 cursor-pointer hover:bg-gray-100"
        />
      </div>

      {/* Admin Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading admins...</p>
        ) : filteredAdmins.length === 0 ? (
          <div className="flex justify-center">No admin found matching “{searchTerm}”.</div>
        ) : (
          filteredAdmins.map((admin) => (
            <div
              key={admin.id}
              className="border border-gray-300 shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">{admin.name}</h3>
              <p className="text-sm text-gray-500">{admin.email}</p>

              <div className="mt-3 space-y-1">
                <p className="flex justify-between">
                  <span className="font-medium">Date Joined:</span>
                  <span>{admin.dateJoined}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Role:</span>
                  <span>{admin.displayRole}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span
                    className={
                      admin.status === "Active"
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {admin.status}
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-3 mt-4">
                <button
                  className="px-2 py-1.5 text-sm w-1/3 font-bold flex justify-center rounded-md border bg-[#4FA000] items-center text-white gap-2 hover:bg-green-600"
                  onClick={() => handleEditRole(admin.id, admin.role)}
                >
                  <img src={edit} alt="" /> Edit Role
                </button>

                {admin.status === "Active" ? (
                  <button
                    className="px-2 py-1.5 text-sm flex bg-[#FF2C2C] text-white rounded-md border border-red-500 gap-2 hover:bg-red-600"
                    onClick={() => handleDeactivateAdmin(admin.id)}
                  >
                    <img src={del} alt="" /> Deactivate
                  </button>
                ) : (
                  <button
                    className="px-2 py-1.5 text-sm flex bg-[#4FA000] text-white rounded-md border border-green-500 gap-2 hover:bg-green-600"
                    onClick={() => handleActivateAdmin(admin.id)}
                  >
                    <img src={userLogin} alt="" /> Activate
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Role Modal */}
      {selectedAdmin && (
        <RoleModal
          isOpen={editRoleModal}
          onClose={() => setEditRoleModal(false)}
          adminId={selectedAdmin.id}
          currentRole={selectedAdmin.role}
          refresh={fetchAdmins}
        />
      )}

      {/* Add Admin Modal */}
      <ModalWrapper isOpen={showModal} onClose={() => setShowModal(false)}>
        <AddAdminModal
          show={showModal}
          onClose={() => setShowModal(false)}
          refreshAdmins={fetchAdmins}
        />
      </ModalWrapper>
    </div>
  );
};

export default Admins;
