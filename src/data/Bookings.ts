// src/data/dashboardData.ts

export interface RecentBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  fromLocation: string;
  toLocation: string;
  date: string;
  time: string;
  vehicle: string;
  status: 'Successful' | 'Pending' | 'Cancelled';
  paymentStatus: 'Paid' | 'Unpaid';
}

export interface DashboardStats {
  totalBookings: number;
  completed: number;
  pending: number;
  cancelled: number;
  totalRevenue: number;
}

// Demo stats
export const stats: DashboardStats = {
  totalBookings: 120,
  completed: 85,
  pending: 15,
  cancelled: 5,
  totalRevenue: 1000,
};

// Demo recent bookings
export const recentBookings: RecentBooking[] = [
  {
    id: 'B001',
    customerName: 'John Doe',
    customerPhone: '+2348012345678',
    fromLocation: 'Lagos',
    toLocation: 'Abuja',
    date: '2025-09-22',
    time: '10:30 AM',
    vehicle: 'Bike',
    status: 'Successful',
    paymentStatus: 'Paid',
  },
  {
    id: 'B002',
    customerName: 'Mary Jane',
    customerPhone: '+2348022222222',
    fromLocation: 'Port Harcourt',
    toLocation: 'Lagos',
    date: '2025-09-21',
    time: '2:00 PM',
    vehicle: 'Car',
    status: 'Pending',
    paymentStatus: 'Unpaid',
  },
  {
    id: 'B003',
    customerName: 'Peter Parker',
    customerPhone: '+2348033333333',
    fromLocation: 'Ibadan',
    toLocation: 'Lagos',
    date: '2025-09-20',
    time: '1:15 PM',
    vehicle: 'Van',
    status: 'Cancelled',
    paymentStatus: 'Unpaid',
  },
];
