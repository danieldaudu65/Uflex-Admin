import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../components/Home";
import Dashboard from "../pages/Dashboard";
import Bookings from "../pages/Bookings";
import Users from "../pages/Users";
import Admins from "../pages/Admins";
import User from "../pages/User";
import Report from "../pages/Report";
import Booking from "../pages/Booking";
import Rider from "../pages/Rider";
import RIderI from "../pages/RIderI";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "dashboard",
        element: <Home />,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: 'bookings',
                element: <Bookings />
            },
            {
                path: 'bookings/books/:_id',
                element: <Booking />
            },
            {
                path: 'users',
                element: <Users />
            },
            {
                path: 'admin',
                element: <Admins />
            },
            {
                path: 'rider',
                element: <Rider />
            },
            {
                path: 'rider/rider',
                element: <RIderI />
            },
            {
                path: 'reports',
                element: <Report />
            },
            {
                path: 'users/user/:_id',
                element: <User />
            },
        ]
    }
])


const Router = () => {
    return <RouterProvider router={router} />;
};

export default Router;
