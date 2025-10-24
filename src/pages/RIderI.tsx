import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import Search from "../components/Search";
import { bell, userLogin } from "../assets";
import { FaChevronDown } from "react-icons/fa";
import { apiRequest } from "../utils/api";
import toast from "react-hot-toast";

interface Booking {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  vehicle: string;
  status: string;
  payment: string;
  passenger: string;
}

interface RiderDetails {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateJoined?: string;
  totalTrips?: number;
  vehicle: string;
  bookings?: Booking[];
  profileImage?: string;
  total_assigned_booking?: number;
  total_pending_booking?: number;
  total_completed_booking?: number;
  is_active?: boolean;
}

const RiderI: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rider, setRider] = useState<RiderDetails | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  // const [isEscort, setIsEscort] = useState<boolean>(false);

  const riderData = location.state as RiderDetails;

  // 🟦 Fetch latest rider data on mount
  useEffect(() => {
    const fetchRider = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await apiRequest("/admin_rider/details", "POST", {
          token,
          riderId: riderData._id,
        });

        if (res.success) {
          setRider(res.rider);
        } else {
          setRider(riderData); // fallback to passed data
        }
      } catch (err) {
        console.error("Error fetching rider:", err);
        toast.error("Failed to fetch rider data");
        setRider(riderData);
      }
    };

    fetchRider();
  }, [riderData]);

  // 🟥 Delete Rider
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this rider?")) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await apiRequest("/admin_rider/delete", "POST", {
        token,
        riderId: rider?._id,
      });

      if (res.success) {
        toast.success("Rider deleted successfully");
        navigate(-1);
      } else {
        toast.error(res.msg || "Failed to delete rider");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error deleting rider");
    } finally {
      setLoading(false);
    }
  };

  // 🟧 Block / Unblock Rider
  const handleToggleActive = async () => {
    if (!rider) return;
    const willBlock = rider.is_active; // if active → we are blocking
    const confirmMsg = willBlock
      ? "Are you sure you want to block this rider?"
      : "Unblock this rider?";
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await apiRequest("/admin_rider/block", "POST", {
        token,
        riderId: rider._id,
        block: willBlock, // true → block, false → unblock
      });

      if (res.success) {
        toast.success(
          willBlock
            ? "Rider has been blocked successfully"
            : "Rider has been unblocked successfully"
        );
        setRider(res.rider); // update with fresh data
      } else {
        toast.error(res.msg || "Action failed");
      }
    } catch (err) {
      console.error("Block/Unblock error:", err);
      toast.error("Error updating rider status");
    } finally {
      setLoading(false);
    }
  };

  if (!rider) return <div className="p-6 text-gray-600">Loading rider...</div>;

  return (
    <div className="p-6 bg-white h-full space-y-6 slim-scrollbar w-full">
      {/* Header */}
      <div className="flex relative justify-center items-center">
        <h1 className="font-extrabold text-lg">Rider</h1>
        <div className="flex gap-2 absolute right-1 justify-end">
          <img src={bell} alt="Notifications" />
          <img src={userLogin} alt="User" />
        </div>
      </div>

      {/* <Search /> */}

      {/* Rider Card */}
      <div className="border border-gray-200 rounded-lg p-2 shadow-sm">
        <h2 className="text-lg font-bold">{`${rider.firstName} ${rider.lastName}`}</h2>
        <p className="text-gray-600">{rider.email}</p>

        <div className="mt-3 space-y-1 text-sm">
          <p className="flex justify-between">
            <span className="font-medium">Phone Number:</span> {rider.phone}
          </p>
          <p className="flex justify-between">
            <span className="font-medium">Vehicle:</span> {rider.vehicle}
          </p>
          <p className="flex justify-between">
            <span className="font-medium">Account Status:</span>{" "}
            <span
              className={`font-semibold ${rider.is_active ? "text-green-600" : "text-red-600"
                }`}
            >
              {rider.is_active ? "Active" : "Blocked"}
            </span>
          </p>
          {rider.totalTrips !== undefined && (
            <p className="flex justify-between">
              <span className="font-medium">Total Trips:</span>{" "}
              {rider.totalTrips}
            </p>
          )}
          {rider.dateJoined && (
            <p className="flex justify-between">
              <span className="font-medium">Date Joined:</span>{" "}
              {rider.dateJoined}
            </p>
          )}
        </div>

        {/* 🚨 Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleToggleActive}
            disabled={loading}
            className={`px-3 py-1 text-sm rounded text-white transition ${loading
                ? "bg-gray-400"
                : rider.is_active
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {loading
              ? "Processing..."
              : rider.is_active
                ? "Block Rider"
                : "Unblock Rider"}
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className={`px-3 py-1 text-sm rounded text-white transition ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {loading ? "Processing..." : "Delete Rider"}
          </button>
        </div>

        {/* Bookings Section */}
        {rider.bookings && rider.bookings.length > 0 && (
          <div className="mt-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <h3 className="font-semibold">Recent Trips</h3>
              <FaChevronDown
                className={`transition-transform duration-300 ${open ? "rotate-180" : ""
                  }`}
              />
            </div>

            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${open ? "max-h-screen opacity-100 mt-3" : "max-h-0 opacity-0"
                }`}
            >
              <div className="space-y-3">
                {rider.bookings.map((booking, idx) => (
                  <div
                    key={idx}
                    className="border rounded-md border-gray-200 p-3 text-sm gap-2 shadow-sm"
                  >
                    <p className="flex justify-between">
                      <span className="font-medium">Trip ID:</span> {booking.id}
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">From - To:</span>{" "}
                      {booking.from} - {booking.to}
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Date:</span> {booking.date}
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Time:</span> {booking.time}
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Vehicle:</span>{" "}
                      {booking.vehicle}
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`${booking.status === "Completed"
                            ? "text-green-600"
                            : "text-yellow-600"
                          } font-medium`}
                      >
                        {booking.status}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Payment:</span>{" "}
                      <span
                        className={`${booking.payment === "Paid"
                            ? "text-green-600"
                            : "text-red-600"
                          } font-medium`}
                      >
                        {booking.payment}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Passenger:</span>{" "}
                      {booking.passenger}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderI;
