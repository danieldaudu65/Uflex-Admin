// TypeScript type for an Admin
export interface Admin {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: "Super Admin" | "Admin" | "Moderator";
    status: "Active" | "Inactive";
    createdAt: string;
}

// Demo admins data
export const admins: Admin[] = [
    {
        id: "A001",
        fullName: "Alice Johnson",
        email: "alice@example.com",
        phone: "+2348012341111",
        role: "Super Admin",
        status: "Active",
        createdAt: "2025-09-18",
    },
    {
        id: "A002",
        fullName: "Bob Williams",
        email: "bob@example.com",
        phone: "+2348022222222",
        role: "Admin",
        status: "Active",
        createdAt: "2025-09-19",
    },
    {
        id: "A003",
        fullName: "Charlie Brown",
        email: "charlie@example.com",
        phone: "+2348033333333",
        role: "Moderator",
        status: "Inactive",
        createdAt: "2025-09-20",
    },
];
