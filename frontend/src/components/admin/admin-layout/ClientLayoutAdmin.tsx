"use client"
import SidebarAdmin from "@/components/admin/admin-layout/SidebarAdmin";
import HeaderAdmin from "@/components/admin/admin-layout/HeaderAdmin";
import { useState } from "react";

export const metadata = {
    title: "Dashboard | Sky",
    description: "Overview of flights, ticket sales, revenue, and bookings",
};

export default function ClientLayoutAdmin({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-auto">
            <SidebarAdmin setIsOpen={setIsOpen} isOpen={isOpen} />
            <div className="flex-1">
                <HeaderAdmin setIsOpen={setIsOpen} isOpen={isOpen} />
                <main className="max-h-screen overflow-auto">{children}</main>
            </div>
        </div>
    );
}