"use client"
import { useState } from "react";
import ClientHeader from "./ClientHeader";
import ClientSidebar from "./ClientSidebar";

export const metadata = {
    title: "Dashboard | Sky",
    description: "Overview of flights, ticket sales, revenue, and bookings",
};

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-auto">
            {/* <ClientSidebar setIsOpen={setIsOpen} isOpen={isOpen} /> */}
            <div className="flex-1">
                {/* <ClientHeader setIsOpen={setIsOpen} isOpen={isOpen} /> */}
                <main className="max-h-screen overflow-auto">{children}</main>
            </div>
        </div>
    );
}