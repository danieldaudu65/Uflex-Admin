import React from "react";
import { motion } from "framer-motion";

interface Props {
    stats: any;
    navigate: any;
    isSearching: boolean;
    icons: { [key: string]: string }; // mapping of key to icon image
}

const home_pages = [
    { label: "Total Bookings", key: "total_bookings", bg: "#A6B8AC" },
    { label: "Completed", key: "total_completed_bookings", bg: "#B38080" },
    { label: "Pending", key: "total_pending", bg: "#A9A3D1" },
    { label: "Cancelled", key: "total_cancelled_bookings", bg: "#B3A26D" },
    { label: "Total Revenue", key: "total_revenue", bg: "#6FA0A3" },
];

const DashboardCards: React.FC<Props> = ({ stats, navigate, isSearching, icons }) => {
    if (isSearching) return null;

    return (
        <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full"
        >
            {home_pages.map((item, idx) => (
                <div
                    key={idx}
                    onClick={() => navigate("/dashboard/bookings", { state: { filter: item.key } })}
                    className="bg-white cursor-pointer rounded-xl relative shadow-md p-6 h-48 flex flex-col justify-between"
                >
                    {/* Icon Circle */}
                    <div
                        className="absolute top-4 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-md"
                        style={{ backgroundColor: item.bg }}
                    >
                        {icons && icons[item.key] ? (
                            <img src={icons[item.key]} alt={item.label} className="w-7 h-7 object-contain" />
                        ) : (
                            <span className="font-bold text-white">{item.label[0]}</span>
                        )}
                    </div>

                    {/* Card Content */}
                    {/* Card Content */}
                    <div className="mt-auto flex flex-col h-full justify-center">
                        <p className="text-sm font-extrabold md:text-lg text-gray-500 capitalize">
                            {item.label}
                        </p>
                        <p className="text-4xl font-bold text-[#65CE00]">
                            {item.key === "total_revenue" && stats[item.key] != null
                                ? `₦${Number(stats[item.key]).toLocaleString()}`
                                : stats[item.key] || 0}
                        </p>
                    </div>

                </div>
            ))}
        </motion.div>

    );
};

export default DashboardCards;
