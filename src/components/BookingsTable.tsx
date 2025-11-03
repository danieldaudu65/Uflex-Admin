import React, { useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../utils/api";
// import { apiRequest } from "../../../utils/api"; // adjust import path if needed

interface Props {
    bookings: any[];
    filteredBookings: any[];
    loadingBookingId: string | null;
    loadingPaymentId: string | null;
    handlePriceSubmit: (id: string, value: string) => void;
    togglePaymentStatus: (id: string, status: "paid" | "unpaid") => void;
    openAssignModal: (id: string) => void;
    refreshBookings?: () => void;
}

const BookingsTable: React.FC<Props> = ({
    bookings,
    filteredBookings,
    loadingBookingId,
    handlePriceSubmit,
    togglePaymentStatus,
    openAssignModal,
    loadingPaymentId,
    refreshBookings,
}) => {
    const [loadingCancelId, setLoadingCancelId] = useState<string | null>(null);

    if (!bookings.length) return null;

    // ✅ Cancel Booking Function using apiRequest
    const cancelBooking = async (bookingId: string) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            setLoadingCancelId(bookingId);

            const data = await apiRequest("/admin_dashboard/cancel_booking", "POST", { bookingId });

            if (!data.success) throw new Error(data.message || "Failed to cancel booking");

            toast.success("Booking cancelled successfully");
            refreshBookings && refreshBookings();
        } catch (err: any) {
            toast.error(err.message || "Error cancelling booking");
        } finally {
            setLoadingCancelId(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-x-auto slim-scrollbar max-h-[400px] overflow-y-auto mt-4">
            <table className="w-full text-[12px] md:text-lg table-auto">
                <thead className="bg-green-main">
                    <tr>
                        <th className="px-3 py-2 text-left min-w-[80px]">Booking ID</th>
                        <th className="px-3 py-2 text-left min-w-[150px]">Customer</th>
                        <th className="px-3 py-2 text-left min-w-[150px]">From - To</th>
                        <th className="px-3 py-2 text-left min-w-[100px]">Date</th>
                        <th className="px-3 py-2 text-left min-w-[80px]">Time</th>
                        <th className="px-3 py-2 text-left min-w-[100px]">Vehicle</th>
                        <th className="px-3 py-2 text-left min-w-[80px]">Escort</th>
                        <th className="px-3 py-2 text-left min-w-[90px]">Status</th>
                        <th className="px-3 py-2 text-left min-w-[90px]">Payment</th>
                        <th className="px-3 py-2 text-left min-w-[120px]">Rider</th>
                        <th className="px-3 py-2 text-left min-w-[100px]">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.map((booking, idx) => {
                        const isCancelled = booking.bookingStatus === "cancelled";
                        const isCompleted = booking.bookingStatus === "completed";

                        return (
                            <tr
                                key={idx}
                                className={`hover:bg-gray-50 border-b border-gray-400 ${isCancelled ? "opacity-60 bg-gray-100" : "bg-white"}`}
                            >
                                <td className="px-3 py-2">{booking._id.slice(-6)}</td>
                                <td className="px-3 py-2">
                                    {booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : "N/A"}
                                    <br />
                                    <span className="text-xs text-gray-500">{booking.user?.email}</span>
                                </td>
                                <td className="px-3 py-2">
                                    {booking.pickupLocation} → {booking.dropoffLocation}
                                </td>
                                <td className="px-3 py-2">{new Date(booking.createdAt).toLocaleDateString()}</td>
                                <td className="px-3 py-2">
                                    {new Date(booking.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </td>
                                <td className="px-3 py-2">{booking.vehicle}</td>
                                <td className="px-3 py-2">{booking.is_excort ? "Yes" : "No"}</td>
                                <td className={`px-3 py-2 capitalize font-semibold ${isCancelled ? "text-red-600" : ""}`}>
                                    {booking.bookingStatus}
                                </td>

                                {/* 💰 Payment Section */}
                                <td className="px-3 py-2 gap-3 pt-5 flex items-center font-medium">
                                    {isCancelled ? (
                                        <span className="text-gray-500">—</span>
                                    ) : booking.totalPrice && !isNaN(Number(booking.totalPrice)) ? (
                                        <>
                                            <span className="block mb-1">₦{Number(booking.totalPrice).toLocaleString()}</span>
                                            <button
                                                disabled={loadingPaymentId === booking._id}
                                                onClick={() => {
                                                    const nextStatus = booking.paymentStatus === "paid" ? "unpaid" : "paid";
                                                    if (window.confirm(`Mark this payment as "${nextStatus.toUpperCase()}"?`)) {
                                                        togglePaymentStatus(booking._id, nextStatus);
                                                    }
                                                }}
                                                className={`px-3 py-1 rounded font-semibold transition ${
                                                    booking.paymentStatus === "paid"
                                                        ? "bg-green-500 text-white"
                                                        : "bg-gray-300 text-black"
                                                } ${loadingPaymentId === booking._id ? "opacity-70 cursor-not-allowed" : ""}`}
                                            >
                                                {loadingPaymentId === booking._id
                                                    ? "Processing..."
                                                    : booking.paymentStatus === "paid"
                                                    ? "Paid"
                                                    : "Unpaid"}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                placeholder="Enter price"
                                                disabled={loadingBookingId === booking._id || isCancelled}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        const target = e.target as HTMLInputElement;
                                                        handlePriceSubmit(booking._id, target.value);
                                                        target.blur();
                                                    }
                                                }}
                                                className={`border border-gray-300 px-2 py-1 rounded w-20 outline-none ${
                                                    loadingBookingId === booking._id
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : "focus:border-[#65CE00]"
                                                }`}
                                            />
                                            <button
                                                disabled={loadingBookingId === booking._id || isCancelled}
                                                onClick={(e) => {
                                                    const input = e.currentTarget.previousSibling as HTMLInputElement | null;
                                                    if (input && input.value) {
                                                        handlePriceSubmit(booking._id, input.value);
                                                    } else {
                                                        toast.error("Enter a valid price before submitting");
                                                    }
                                                }}
                                                className={`px-3 py-1 rounded font-semibold ${
                                                    loadingBookingId === booking._id
                                                        ? "bg-gray-400 text-white"
                                                        : "bg-[#65CE00] text-black"
                                                }`}
                                            >
                                                {loadingBookingId === booking._id ? "Saving..." : "Enter"}
                                            </button>
                                        </div>
                                    )}
                                </td>

                                {/* 👤 Rider or Assign Button */}
                                <td className="px-3 py-2">
                                    {booking.rider ? (
                                        <div>
                                            <div className="font-medium">
                                                {booking.rider.firstName} {booking.rider.lastName}
                                            </div>
                                        </div>
                                    ) : !isCancelled ? (
                                        <button
                                            onClick={() => openAssignModal(booking._id)}
                                            className="px-2 py-1 bg-[#65CE00] text-black rounded font-medium"
                                        >
                                            Assign Rider
                                        </button>
                                    ) : (
                                        <span className="text-gray-500">—</span>
                                    )}
                                </td>

                                {/* ❌ Cancel Button */}
                                <td className="px-3 py-2">
                                    {!isCancelled && !isCompleted && (
                                        <button
                                            onClick={() => cancelBooking(booking._id)}
                                            disabled={loadingCancelId === booking._id}
                                            className={`px-3 py-1 rounded font-semibold transition ${
                                                loadingCancelId === booking._id
                                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                                    : "bg-red-500 text-white hover:bg-red-600"
                                            }`}
                                        >
                                            {loadingCancelId === booking._id ? "Processing..." : "Cancel"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default BookingsTable;
