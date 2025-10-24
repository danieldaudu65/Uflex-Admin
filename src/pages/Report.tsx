import React, { useEffect, useState } from "react";
import { bell, userLogin } from "../assets";
import Search from "../components/Search";
import { apiRequest } from "../utils/api";
import toast from "react-hot-toast";

interface Report {
  _id: string;
  user_name: string;
  user_img_url?: string;
  user_email: string;
  body: string;
  service_type: string;
  timestamp: number;
  is_resolved: boolean;
}

const Report: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // 🟩 Fetch unresolved reports
  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Admin token not found");
        setLoading(false);
        return;
      }

      const res = await apiRequest("/admin_report/users_unresolved", "POST", { token });

      if (res.status === "ok") {
        setReports(res.reports || []);
        setFilteredReports(res.reports || []); // initialize filtered data
      } else {
        toast.error(res.msg || "Failed to load reports");
      }
    } catch (err: any) {
      console.error("Error fetching reports:", err);
      toast.error("Error fetching reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // 🟦 Handle local search filtering
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredReports(reports);
    } else {
      const lower = searchValue.toLowerCase();
      const filtered = reports.filter(
        (r) =>
          r.user_name.toLowerCase().includes(lower) ||
          r.user_email.toLowerCase().includes(lower) ||
          r.body.toLowerCase().includes(lower) ||
          r.service_type.toLowerCase().includes(lower)
      );
      setFilteredReports(filtered);
    }
  }, [searchValue, reports]);

  // 🟩 Resolve locally
  const handleResolve = (id: string) => {
    setReports((prev) => prev.filter((report) => report._id !== id));
    setFilteredReports((prev) => prev.filter((report) => report._id !== id));
    toast.success("Report resolved locally ✅");
  };

  return (
    <div className="p-6 bg-white h-full space-y-6 slim-scrollbar w-full">
      {/* Header */}
      <div className="flex relative justify-center items-center">
        <h1 className="font-extrabold text-lg">Reports</h1>
        <div className="flex gap-2 absolute right-1 justify-end">
          <img src={bell} className="w-6 h-6" alt="Notifications" />
          <img src={userLogin} className="w-6 h-6" alt="User" />
        </div>
      </div>

      {/* Search */}
      <Search
        value={searchValue}
        onChange={setSearchValue}
      />

      {/* Reports List */}
      <div className="space-y-4 max-h-[100vh] overflow-y-auto slim-scrollbar">
        {loading ? (
          <p className="text-center text-gray-500 py-5">Loading reports...</p>
        ) : filteredReports.length === 0 ? (
          <p className="text-center text-gray-500 py-5">
            No reports found 🔍
          </p>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report._id}
              className="bg-gray-50 p-4 border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      report.user_img_url ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt={report.user_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {report.user_name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(report.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-gray-700">{report.body}</p>
                <span className="inline-block text-xs mt-1 font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                  {report.service_type || "General"}
                </span>
              </div>

              <button
                onClick={() => handleResolve(report._id)}
                className="ml-auto mt-4 block px-3 py-1 bg-[#4FA000] text-white text-sm rounded hover:bg-green-700 transition"
              >
                Resolve
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Report;
