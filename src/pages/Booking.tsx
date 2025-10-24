import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { bell, userLogin } from "../assets";
// import Search from "../components/Search";
import { FaChevronDown } from "react-icons/fa";
import { apiRequest } from "../utils/api";

// Rider details
export type Rider = {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  vehicle?: string;
};

// Customer details
export type Customer = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  totalBookings?: number;
};

// Booking details
export type Booking = {
  _id: string;
  fromLocation: string;
  toLocation: string;
  date: string;
  time: string;
  vehicle: string;
  status: string;
  paymentStatus: string;
  customer: Customer;
  rider?: Rider;
  is_excort?: boolean;
  totalPrice?: number;
};

const BookingPage: React.FC = () => {
  const { _id } = useParams();
  const location = useLocation();
  const bookingFromState = location.state as Booking;
  const [booking, setBooking] = useState<Booking | null>(bookingFromState || null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (_id) localStorage.setItem("selectedBookingId", _id);
  }, [_id]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const bookingId = _id || localStorage.getItem("selectedBookingId");

        if (!bookingId || !token) {
          console.error("Missing booking ID or token");
          setLoading(false);
          return;
        }

        const response = await apiRequest(`/get_booking/${bookingId}`, "POST", {
          token,
          id: bookingId,
        });

        if (response.booking) {
          setBooking(response.booking);
        } else {
          console.error("No booking returned from server:", response);
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!bookingFromState) {
      fetchBooking();
    }
  }, [_id]);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] space-y-3">
        <img src="/logo.svg" alt="Loading..." className="w-16 animate-pulse" />
        <p className="text-gray-500 animate-pulse">Preparing your dashboard...</p>
      </div>
    );

  if (!booking)
    return <div className="text-center py-10 text-gray-500">No booking data found</div>;

  return (
    <div className="p-6 bg-white h-full space-y-6 slim-scrollbar w-full">
      {/* Header */}
      <div className="flex relative justify-center items-center">
        <h1 className="font-extrabold text-lg">Booking</h1>
        <div className="flex gap-2 absolute right-1 justify-end">
          <img src={bell} alt="Notifications" />
          <img src={userLogin} alt="User" />
        </div>
      </div>

      {/* <Search /> */}

      {/* Customer Card */}
      <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-bold">
          {booking.customer?.name || "Customer"}
        </h2>
        <p className="text-gray-600">
          {booking.customer?.email || "No email provided"}
        </p>
        <div className="mt-3 space-y-1 text-sm">
          <p className="flex justify-between">
            <span className="font-medium">Phone Number:</span> {booking.customer?.phone}
          </p>
          <p className="flex justify-between">
            <span className="font-medium">Total Bookings:</span>{" "}
            {booking.customer?.totalBookings ?? 1}
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
              className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              open ? "max-h-screen opacity-100 mt-3" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-3">
              <div className="border rounded-md border-gray-200 p-3 text-sm shadow-sm">
                <p className="flex justify-between">
                  <span className="font-medium">Booking ID:</span> {booking._id.slice(-6)}
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">From - To:</span>{" "}
                  {booking.fromLocation} → {booking.toLocation}
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Date:</span> {booking.date}
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Time:</span> {booking.time}
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Vehicle:</span> {booking.vehicle}
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Escort:</span>{" "}
                  {booking.is_excort ? "Yes" : "No"}
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="text-green-600 font-medium">{booking.status}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Payment:</span>
                  <span className="text-green-600 font-medium">{booking.paymentStatus}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Total Price:</span> ₦
                  {booking.totalPrice?.toLocaleString()}
                </p>

                {/* Inline Rider Info */}
                {booking.rider && (
                  <>
                    <hr className="my-3 border-gray-200" />
                    <p className="flex justify-between">
                      <span className="font-medium">Rider Name:</span>{" "}
                      {booking.rider.firstName} {booking.rider.lastName}
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Rider Email:</span> {booking.rider.email}
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Rider Vehicle:</span> {booking.rider.vehicle}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
