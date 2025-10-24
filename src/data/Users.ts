// TypeScript type for a user
export interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    status: "Active" | "Inactive";
    createdAt: string;
}

// Demo user data
export const users: User[] = [
    {
        id: "U001",
        fullName: "John Doe",
        email: "johndoe@example.com",
        phone: "+2348012345678",
        role: "Customer",
        status: "Active",
        createdAt: "2025-09-22",
    },
    {
        id: "U002",
        fullName: "Mary Jane",
        email: "maryjane@example.com",
        phone: "+2348023456789",
        role: "Admin",
        status: "Active",
        createdAt: "2025-09-21",
    },
    {
        id: "U003",
        fullName: "Peter Parker",
        email: "peterparker@example.com",
        phone: "+2348034567890",
        role: "Customer",
        status: "Inactive",
        createdAt: "2025-09-20",
    },
];
