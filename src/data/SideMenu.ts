
import { admin, booking, dash, logout, report, rider,  users } from '../assets'


export const side_menu = [
    {
        icon: dash,
        label: 'Dashboard',
        href: '',
    },
    {
        icon: booking,
        label: 'Bookings',
        href: 'bookings',
    },

    {
        icon: users,
        label: 'Users',
        href: 'users',
    },
    {
        icon: rider,
        label: 'Rider',
        href: 'rider',
    },
    {
        icon: admin,
        label: 'Administrators',
        href: 'admin',
    },
    {
        icon: report,
        label: 'Reports',
        href: 'reports',
    },
    // {
    //     icon: settings,
    //     label: 'Settings',
    //     href: 'settings',
    // },
    {
        icon: logout,
        label: 'Log out',
        href: 'logout',
        custom: true,   // add this so Sidebar knows this is a special action
    }
]
