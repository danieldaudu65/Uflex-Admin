import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { apiRequest } from "../utils/api";
import {
  bell,
  logo,
  userLogin,
  booked,
  completed,
  pending,
  cancelled,
  revenue,
} from "../assets";
import Search from "../components/Search";
import AssignRiderModal from "../components/AssignRiderModal";
import DashboardCards from "../components/DashboardCards";
import BookingsTable from "../components/BookingsTable";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // --- State ---
  const [stats, setStats] = useState<any>({});
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBookingForAssign, setSelectedBookingForAssign] = useState<string | null>(null);
  const [loadingBookingId, setLoadingBookingId] = useState<string | null>(null);
  const [loadingPaymentId, setLoadingPaymentId] = useState<string | null>(null);

  // ✅ Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await apiRequest("/admin_dashboard/get_record", "POST");
      const bookingsRes = await apiRequest("/admin_dashboard/get_recent", "POST", { limit: 10 });

      if (statsRes.success && bookingsRes.success) {
        setStats(statsRes);
        setRecentBookings(bookingsRes.data);
      } else {
        toast.error("Failed to load dashboard data");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // 🌀 Initial load
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const icons = {
    total_bookings: booked,
    total_completed_bookings: completed,
    total_pending: pending,
    total_cancelled_bookings: cancelled,
    total_revenue: revenue,
  };

  // --- Handlers ---
  const handlePriceSubmit = async (bookingId: string, value: string) => {
    const cleaned = value.replace(/[₦,]/g, "").trim();
    const numeric = Number(cleaned);
    if (!numeric || numeric <= 0) return toast.error("Please enter a valid price");

    try {
      setLoadingBookingId(bookingId);
      const res = await apiRequest("/admin_dashboard/set_price", "POST", { bookingId, price: numeric });

      if (res.success) {
        const statusRes = await apiRequest(`/admin_dashboard/payment_status/${bookingId}`, "GET");
        if (statusRes.success) {
          const { paymentStatus, totalPrice } = statusRes;
          setRecentBookings((prev) =>
            prev.map((b) => (b._id === bookingId ? { ...b, totalPrice, paymentStatus } : b))
          );
          toast.success("Price set successfully");
        }
      } else toast.error(res.message || "Failed to set price");
    } catch (err) {
      console.error(err);
      toast.error("Error setting price");
    } finally {
      setLoadingBookingId(null);
    }
  };

  const togglePaymentStatus = async (bookingId: string, status: "paid" | "unpaid") => {
    try {
      setLoadingPaymentId(bookingId);
      const res = await apiRequest("/admin_dashboard/toggle_payment_status", "POST", { bookingId, status });

      if (res.success) {
        toast.success(res.message || "Payment status updated");
        setRecentBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, paymentStatus: status } : b))
        );
      } else {
        toast.error(res.message || "Failed to update payment status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating payment status");
    } finally {
      setLoadingPaymentId(null);
    }
  };

  const onRiderAssigned = (bookingId: string, rider: any) => {
    setRecentBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, rider } : b))
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] space-y-3">
        <img src={logo} alt="Loading..." className="w-16 animate-pulse" />
        <p className="text-gray-500 animate-pulse">Preparing your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 slim-scrollbar w-full">
      {/* Header */}
      <div className="flex relative justify-center items-center">
        <h1 className="font-extrabold text-lg">Dashboard</h1>
        <div className="flex gap-2 absolute right-1 justify-end">
          <img src={bell} className="w" alt="Notifications" />
          <img src={userLogin} className="w" alt="User" />
        </div>
      </div>

      {/* Search */}
      <Search
        value={searchQuery}
        onChange={(val) => setSearchQuery(val)}
        onFocus={() => setIsSearching(true)}
        onBlur={() => {
          if (searchQuery.trim() === "") setIsSearching(false);
        }}
      />

      {/* Cards */}
      <DashboardCards
        stats={stats}
        navigate={navigate}
        isSearching={isSearching}
        icons={icons}
      />

      {/* Table */}
      <BookingsTable
        bookings={recentBookings}
        filteredBookings={recentBookings.filter((b) =>
          `${b.user?.firstName} ${b.user?.lastName} ${b.pickupLocation} ${b.dropoffLocation} ${b._id}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )}
        loadingBookingId={loadingBookingId}
        loadingPaymentId={loadingPaymentId}
        handlePriceSubmit={handlePriceSubmit}
        togglePaymentStatus={togglePaymentStatus}
        openAssignModal={(id: string) => {
          setSelectedBookingForAssign(id);
          setAssignModalOpen(true);
        }}
        refreshBookings={fetchDashboardData} // ✅ now properly passed
      />

      {/* Modal */}
      <AssignRiderModal
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setSelectedBookingForAssign(null);
        }}
        bookingId={selectedBookingForAssign || ""}
        onAssigned={onRiderAssigned}
      />
    </div>
  );
};

export default Dashboard;
