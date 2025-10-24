import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiRequest } from "../utils/api";

interface Rider {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicle?: string;
  profileImage?: string;
  total_assigned_booking: number;
  total_pending_booking: number;
  total_completed_booking: number;
}

const RiderTable: React.FC = () => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRiders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await apiRequest("/admin_rider/riders", "POST", { token });

      if (response.success) {
        setRiders(response.riders);
      } else {
        toast.error(response.msg || "Failed to load riders");
      }
    } catch (err) {
      console.error("Error fetching riders:", err);
      toast.error("Error fetching riders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
      {loading ? (
        <p className="text-center py-4 text-gray-600">Loading riders...</p>
      ) : riders.length === 0 ? (
        <p className="text-center py-4 text-gray-500">No riders found</p>
      ) : (
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-[#65CE00] text-white">
            <tr>
              <th className="px-3 py-2 text-left">S/N</th>
              <th className="px-3 min-w-50 py-2 text-left">Rider</th>
              {/* <th className="px-3 py-2 text-left">Phone Number</th> */}
              <th className="px-3 py-2 text-left">Vehicle</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Assigned</th>
              <th className="px-3 py-2 text-left">Pending</th>
              <th className="px-3 py-2 text-left">Completed</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider, index) => (
              <tr
                key={rider._id}
                onClick={() => navigate(`rider`, { state: rider })}
                className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              >
                <td className="p-3 border-b">{index + 1}</td>
                <td className="p-3 border-b flex items-center gap-3">
                  <img
                    src={
                      rider.profileImage ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt={`${rider.firstName} ${rider.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium">{`${rider.firstName} ${rider.lastName}`}</span>
                </td>
                {/* <td className="p-3 border-b">{rider.phone}</td> */}
                <td className="p-3 border-b">{rider.vehicle || "—"}</td>
                <td className="p-3 border-b text-blue-600">{rider.email}</td>
                <td className="p-3 border-b">{rider.total_assigned_booking}</td>
                <td className="p-3 border-b">{rider.total_pending_booking}</td>
                <td className="p-3 border-b">{rider.total_completed_booking}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RiderTable;
