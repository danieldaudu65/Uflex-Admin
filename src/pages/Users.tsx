import React, { useEffect, useState } from "react";
import { bell, userLogin } from "../assets";
import Search from "../components/Search";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";
import toast from "react-hot-toast";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  uflex_Id: string;
  status: string;
  createdAt: string;
};

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in again.");
          return;
        }

        const res = await apiRequest("/admin_user/all_users", "POST", { token });
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        toast.error(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Filter users based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const lower = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(lower) ||
        user.lastName?.toLowerCase().includes(lower) ||
        user.email?.toLowerCase().includes(lower) ||
        user.uflex_Id?.toLowerCase().includes(lower) ||
        user.phoneNumber?.toLowerCase().includes(lower)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  return (
    <div className="p-6 bg-white h-full space-y-6 slim-scrollbar w-full">
      {/* Header */}
      <div className="flex relative justify-center items-center">
        <h1 className="font-extrabold text-lg">Users</h1>
        <div className="flex gap-2 absolute right-1 justify-end">
          <img src={bell} className="w-5" alt="Notifications" />
          <img src={userLogin} className="w-5" alt="User" />
        </div>
      </div>

      {/* ✅ Search Input */}
      <div className="w-full max-w-sm mx-auto">
        <Search
          // placeholder="Search by name, email, ID, or phone..."
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto slim-scrollbar max-h-[400px] overflow-y-auto">
        <table className="w-full text-[12px] md:text-lg table-auto">
          <thead className="bg-[#65CE00] text-white">
            <tr>
              <th className="px-3 py-2 text-left min-w-[80px]">User ID</th>
              <th className="px-3 py-2 text-left min-w-[150px]">Full Name</th>
              <th className="px-3 py-2 text-left min-w-[180px]">Email</th>
              <th className="px-3 py-2 text-left min-w-[120px]">Phone</th>
              <th className="px-3 py-2 text-left min-w-[100px]">Role</th>
              <th className="px-3 py-2 text-left min-w-[90px]">Status</th>
              <th className="px-3 py-2 text-left min-w-[110px]">Created At</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500 font-medium">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={index}
                  onClick={() => navigate(`user/${user._id}`, { state: user })}
                  className="hover:bg-gray-50 bg-white cursor-pointer"
                >
                  <td className="px-3 py-3">{user.uflex_Id}</td>
                  <td className="px-3 py-3">{`${user.firstName} ${user.lastName}`}</td>
                  <td className="px-3 py-3">{user.email}</td>
                  <td className="px-3 py-3">{user.phoneNumber}</td>
                  <td className="px-3 py-3">{user.role || "User"}</td>
                  <td className="px-3 py-3">{user.status || "Active"}</td>
                  <td className="px-3 py-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500 font-medium">
                  No matching users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
