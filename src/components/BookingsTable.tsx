import React from "react";
import toast from "react-hot-toast";

interface Props {
    bookings: any[];
    filteredBookings: any[];
    loadingBookingId: string | null;
    handlePriceSubmit: (id: string, value: string) => void;
    togglePaymentStatus: (id: string, status: "paid" | "unpaid") => void;
    openAssignModal: (id: string) => void;
}

const BookingsTable: React.FC<Props> = ({
    bookings,
    filteredBookings,
    loadingBookingId,
    handlePriceSubmit,
    togglePaymentStatus,
    openAssignModal
}) => {
    if (!bookings.length) return null;

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

                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.map((booking, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 bg-white border-b border-gray-400">
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
                            <td className="px-3 py-2 capitalize">{booking.bookingStatus}</td>
                            <td className="px-3 py-2 gap-3 pt-5 flex items-center font-medium">
                                {booking.totalPrice && !isNaN(Number(booking.totalPrice)) ? (
                                    <>
                                        <span className="block mb-1">₦{Number(booking.totalPrice).toLocaleString()}</span>
                                        <button
                                            onClick={() => {
                                                const nextStatus = booking.paymentStatus === "paid" ? "unpaid" : "paid";
                                                if (window.confirm(`Are you sure you want to mark this payment as "${nextStatus.toUpperCase()}"?`)) {
                                                    togglePaymentStatus(booking._id, nextStatus);
                                                }
                                            }}
                                            className={`px-3 py-1 rounded font-semibold ${booking.paymentStatus === "paid" ? "bg-green-500 text-white" : "bg-gray-300 text-black"
                                                }`}
                                        >
                                            {booking.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="Enter price"
                                            disabled={loadingBookingId === booking._id}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    const target = e.target as HTMLInputElement;
                                                    handlePriceSubmit(booking._id, target.value);
                                                    target.blur();
                                                }
                                            }}
                                            className={`border border-gray-300 px-2 py-1 rounded w-20 outline-none ${loadingBookingId === booking._id ? "opacity-50 cursor-not-allowed" : "focus:border-[#65CE00]"
                                                }`}
                                        />
                                        <button
                                            disabled={loadingBookingId === booking._id}
                                            onClick={(e) => {
                                                const input = (e.currentTarget.previousSibling as HTMLInputElement) || null;
                                                if (input && input.value) {
                                                    handlePriceSubmit(booking._id, input.value);
                                                } else {
                                                    toast.error("Please enter a valid price before submitting");
                                                }
                                            }}
                                            className={`px-3 py-1 rounded font-semibold ${loadingBookingId === booking._id ? "bg-gray-400 text-white" : "bg-[#65CE00] text-black"
                                                }`}
                                        >
                                            {loadingBookingId === booking._id ? "Saving..." : "Enter"}
                                        </button>
                                    </div>
                                )}
                            </td>
                            <td className="px-3 py-2">
                                {booking.rider ? (
                                    <div>
                                        <div className="font-medium">{booking.rider.firstName} {booking.rider.lastName}</div>
                                        {/* <div className="text-xs text-gray-500">{booking.rider.email}</div> */}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => openAssignModal(booking._id)}
                                        className="px-2 py-1 bg-[#65CE00] text-black rounded font-medium"
                                    >
                                        Assign Rider
                                    </button>
                                )}
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookingsTable;
