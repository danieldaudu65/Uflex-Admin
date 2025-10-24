import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import Search from "../components/Search";
import { bell, del, userLogin } from "../assets";
import { FaChevronDown } from "react-icons/fa";
import { apiRequest } from "../utils/api";
import toast from "react-hot-toast";

interface Booking {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  bookingDate?: string;
  bookingTime?: string;
  vehicle: string;
  bookingStatus: string;
  paymentStatus: string;
  rider?: { name: string };
}

interface UserDetails {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  is_blocked: boolean;
  createdAt: string;
}

const User: React.FC = () => {
  const location = useLocation();
  const initialUser = location.state as UserDetails;
  const [user, setUser] = useState<UserDetails | null>(initialUser);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Delete user
  const handleDeleteUser = async () => {
    if (!user?._id) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const res = await apiRequest("/admin_user/delete_user", "POST", {
        userId: user._id,
      });
      toast.success(res.message || "User deleted successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  // Block or unblock user
  const handleBlockUser = async (block: boolean) => {
    if (!user?._id) return;
    const confirmBlock = window.confirm(
      `Are you sure you want to ${block ? "block" : "unblock"} this user?`
    );
    if (!confirmBlock) return;

    try {
      setLoading(true);
      const res = await apiRequest("/admin_user/block_user", "POST", {
        userId: user._id,
        block,
      });
      toast.success(res.message || `User ${block ? "blocked" : "unblocked"} successfully`);
      setUser((prev) => (prev ? { ...prev, is_blocked: block } : prev));
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      if (!user?._id) return;
      try {
        const res = await apiRequest("/admin_user/get_user", "POST", {
          userId: user._id,
        });
        setUser(res.data);
      } catch (err: any) {
        console.error("Error fetching user:", err);
        toast.error(err.message || "Failed to fetch user data");
      }
    };
    fetchUser();
  }, [user?._id]);

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await apiRequest("/admin_user/user_bookings", "POST", {
          userId: user._id,
        });

        const mapped = res.data?.map((b: any) => {
          const formattedDate = b.bookingDate
            ? new Date(b.bookingDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "--";

          const formattedTime = b.bookingTime
            ? new Date(b.bookingTime).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "--";

          return {
            _id: b._id,
            pickupLocation: b.pickupLocation || "--",
            dropoffLocation: b.dropoffLocation || "--",
            bookingDate: formattedDate,
            bookingTime: formattedTime,
            vehicle: b.vehicle || "N/A",
            bookingStatus: b.bookingStatus || "Pending",
            paymentStatus: b.paymentStatus || "Unpaid",
            rider: b.rider || null,
          };
        });

        setBookings(mapped || []);
      } catch (err: any) {
        console.error("Error fetching bookings:", err);
        toast.error(err.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user?._id]);

  if (!user) return <div>No user data available.</div>;

  return (
    <div className="p-6 bg-white min-h-[100vh] space-y-6 slim-scrollbar w-full">
      {/* Header */}
      <div className="flex relative justify-center items-center">
        <h1 className="font-extrabold text-lg">User</h1>
        <div className="flex gap-2 absolute right-1 justify-end">
          <img src={bell} alt="Notifications" />
          <img src={userLogin} alt="User" />
        </div>
      </div>

      {/* <Search /> */}

      {/* User Details */}
      <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-bold">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-gray-600">{user.email}</p>

        <div className="mt-3 space-y-1 text-sm">
          <p className="flex justify-between">
            <span className="font-medium">Date Joined:</span>{" "}
            {new Date(user.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="flex justify-between">
            <span className="font-medium">Phone Number:</span>{" "}
            {user.phoneNumber || "--"}
          </p>
          <p className="flex justify-between">
            <span className="font-medium">Bookings Made:</span>{" "}
            {bookings.length}
          </p>
        </div>

        {/* Booking Details */}
        <div className="mt-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <h3 className="font-semibold">Booking Details</h3>
            <FaChevronDown
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              open ? "max-h-screen opacity-100 mt-3" : "max-h-0 opacity-0"
            }`}
          >
            {loading ? (
              <p className="text-center text-gray-500 py-3">Loading bookings...</p>
            ) : bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.map((b, idx) => (
                  <div
                    key={idx}
                    className="border rounded-md border-gray-200 p-3 text-sm gap-2 shadow-sm"
                  >
                    <p className="flex justify-between">
                      <span className="font-medium">Booking ID:</span> {b._id.slice(-6)}
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">From - To:</span>{" "}
                      {b.pickupLocation} - {b.dropoffLocation}
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Date:</span> {b.bookingDate}
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Time:</span> {b.bookingTime}
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Vehicle:</span> {b.vehicle}
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Status:</span>{" "}
                      <span className="text-green-600 font-medium">
                        {b.bookingStatus}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Payment:</span>{" "}
                      <span className="text-green-600 font-medium">
                        {b.paymentStatus}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Assigned Rider:</span>{" "}
                      {b.rider?.name || "Not Assigned"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-3">
                No bookings found for this user.
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-5 justify-between">
          <button
            className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
            onClick={handleDeleteUser}
          >
            <img src={del} alt="" /> Delete User
          </button>

          <button
            className={`flex items-center gap-1 px-4 py-2 text-white text-sm rounded-md ${
              user.is_blocked
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-500 hover:bg-red-600"
            }`}
            onClick={() => handleBlockUser(!user.is_blocked)}
          >
            <img src={userLogin} alt="" />
            {user.is_blocked ? "Unblock User" : "Block User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
