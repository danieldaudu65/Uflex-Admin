import React, { useEffect, useState } from "react";
import { bell, userLogin, logo } from "../assets";
import Search from "../components/Search";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

interface Rider {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  vehicle?: string;
}

interface Booking {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  fromLocation: string;
  toLocation: string;
  date: string;
  time: string;
  vehicle: string;
  status: string;
  paymentStatus: string;
  totalPrice: number | string;
  is_excort: boolean;
  rider?: Rider;
}

const Bookings: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const filterType = location.state?.filter || "all"; // default

  // ✅ Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await apiRequest("/admin_booking/all_bookings", "GET");

        if (data?.data) {
          const mapped = data.data.map((b: any) => {
            const formattedDate = b.bookingDate
              ? new Date(b.bookingDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              : "--";

            return {
              _id: b._id,
              customerName:
                `${b.user?.firstName || ""} ${b.user?.lastName || ""}`.trim() ||
                "Unknown",
              customerEmail: b.user?.email || "No email",
              customerPhone: b.user?.phoneNumber || "",
              fromLocation: b.pickupLocation || "-",
              toLocation: b.dropoffLocation || "-",
              date: formattedDate,
              time: b.bookingTime || "--",
              vehicle: b.vehicle || "N/A",
              status: b.bookingStatus || "Pending",
              paymentStatus: b.paymentStatus || "unpaid",
              totalPrice:
                typeof b.totalPrice === "number" && b.totalPrice > 0
                  ? b.totalPrice
                  : "--",
              is_excort: b.is_excort || false,
              rider: b.rider
                ? {
                  _id: b.rider._id,
                  firstName: b.rider.firstName,
                  lastName: b.rider.lastName,
                  email: b.rider.email,
                  vehicle: b.rider.vehicle,
                }
                : null,
            };
          });

          setBookings(mapped);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  //  Apply filters
  useEffect(() => {
    let filtered = bookings;

    if (filterType === "completed") {
      filtered = bookings.filter((b) => b.status === "completed");
    } else if (filterType === "pending") {
      filtered = bookings.filter((b) => b.status !== "completed");
    }

    if (searchTerm.trim() !== "") {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b._id.toLowerCase().includes(lower) ||
          b.customerName.toLowerCase().includes(lower) ||
          b.customerEmail.toLowerCase().includes(lower) ||
          b.fromLocation.toLowerCase().includes(lower) ||
          b.toLocation.toLowerCase().includes(lower) ||
          b.status.toLowerCase().includes(lower)
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, filterType, searchTerm]);

  // ✅ Loading screen
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] space-y-3">
        <img src={logo} alt="Loading..." className="w-16 animate-pulse" />
        <p className="text-gray-500 animate-pulse">Preparing your Bookings...</p>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <div className="p-6 bg-white h-[100vh] space-y-6 slim-scrollbar w-full">
      {/* Header */}
      <div className="flex relative justify-center items-center">
        <h1 className="font-extrabold text-lg">Bookings</h1>
        <div className="flex gap-2 absolute right-1 justify-end">
          <img src={bell} alt="Notifications" />
          <img src={userLogin} alt="User" />
        </div>
      </div>

      {/* Search */}
      <Search
        value={searchTerm}
        onChange={(val) => setSearchTerm(val)}
      />
      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-300 shadow-md overflow-x-auto slim-scrollbar max-h-[100vh] overflow-y-auto">
        <table className="w-full text-[12px] md:text-lg table-auto">
          <thead className="bg-[#65CE00] text-white">
            <tr>
              <th className="px-3 py-2 text-left min-w-[80px]">Booking ID</th>
              <th className="px-3 py-2 text-left min-w-[150px]">Customer</th>
              <th className="px-3 py-2 text-left min-w-[150px]">Email</th>
              <th className="px-3 py-2 text-left min-w-[150px]">From - To</th>
              <th className="px-3 py-2 text-left min-w-[100px]">Date</th>
              <th className="px-3 py-2 text-left min-w-[80px]">Time</th>
              <th className="px-3 py-2 text-left min-w-[100px]">Vehicle</th>
              <th className="px-3 py-2 text-left min-w-[100px]">Escort</th>
              <th className="px-3 py-2 text-left min-w-[100px]">Rider</th>
              <th className="px-3 py-2 text-left min-w-[90px]">Status</th>
              <th className="px-3 py-2 text-left min-w-[120px]">Payment</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b, i) => (
                <tr
                  key={i}
                  onClick={() =>
                    navigate(`books/${b._id}`, {
                      state: {
                        ...b,
                        customer: {
                          name: b.customerName,
                          email: b.customerEmail,
                          phone: b.customerPhone || "",
                        },
                        rider: b.rider || null,
                      },
                    })
                  }
                  className="hover:bg-gray-50 bg-white cursor-pointer"
                >
                  <td className="px-3 py-2">{b._id.slice(-6)}</td>
                  <td className="px-3 py-2">{b.customerName}</td>
                  <td className="px-3 py-2">{b.customerEmail}</td>
                  <td className="px-3 py-2">
                    {b.fromLocation} - {b.toLocation}
                  </td>
                  <td className="px-3 py-2">{b.date}</td>
                  <td className="px-3 py-2">{b.time}</td>
                  <td className="px-3 py-2">{b.vehicle}</td>

                  {/* ✅ Escort info */}
                  <td
                    className={`px-3 py-2 font-semibold ${b.is_excort ? "text-green-600" : "text-red-500"
                      }`}
                  >
                    {b.is_excort ? "With Escort" : "No Escort"}
                  </td>

                  {/* ✅ Rider info */}
                  <td className="px-3 py-2">
                    {b.rider
                      ? `${b.rider.firstName} ${b.rider.lastName}`
                      : "No Rider"}
                  </td>

                  <td className="px-3 py-2 capitalize">{b.status}</td>

                  {/* ✅ Payment */}
                  <td className="px-3 py-2">
                    {b.paymentStatus === "paid"
                      ? `Paid (₦${b.totalPrice?.toLocaleString?.() || "--"})`
                      : `Unpaid (₦${b.totalPrice?.toLocaleString?.() || "--"})`}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="text-center py-4 text-gray-500 font-medium"
                >
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
