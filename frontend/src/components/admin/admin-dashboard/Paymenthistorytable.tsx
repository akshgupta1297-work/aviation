"use client";

import { useMemo, useState } from "react";
import type { Selection, SortDescriptor } from "@heroui/react";
import { Avatar, Button, Checkbox, Table, Chip, cn } from "@heroui/react";

// "use client";

// import { useMemo, useState } from "react";
// import type { SortDescriptor } from "@heroui/react";
// import { Table, cn } from "@heroui/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentStatus = "Confirmed" | "Pending" | "Cancelled";

interface Payment {
    id: string;
    name: string;
    bookingCode: string;
    date: string;
    route: string;
    airline: string;
    amount: number;
    status: PaymentStatus;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const payments: Payment[] = [
    {
        id: "1",
        name: "Paris Milton",
        bookingCode: "CN-KL2345",
        date: "2028-07-01",
        route: "CDG-JFK",
        airline: "CloudNine Airlines",
        amount: 500,
        status: "Confirmed",
    },
    {
        id: "2",
        name: "Elena Winston",
        bookingCode: "QW-MN6789",
        date: "2028-07-01",
        route: "HKG-LAX",
        airline: "QuickWing Air",
        amount: 750,
        status: "Pending",
    },
    {
        id: "3",
        name: "Roger Piston",
        bookingCode: "SH-OP3456",
        date: "2028-07-01",
        route: "FRA-BKK",
        airline: "SkyHigh Airlines",
        amount: 650,
        status: "Confirmed",
    },
    {
        id: "4",
        name: "Paula Ortega",
        bookingCode: "FF-QR7890",
        date: "2028-07-01",
        route: "LAX-HND",
        airline: "FlyFast Airways",
        amount: 800,
        status: "Cancelled",
    },
    {
        id: "5",
        name: "Jackie Long",
        bookingCode: "AJ-ST0123",
        date: "2028-07-01",
        route: "SIN-LHR",
        airline: "AeroJet",
        amount: 900,
        status: "Confirmed",
    },
    {
        id: "6",
        name: "Marcus Webb",
        bookingCode: "LH-UV4567",
        date: "2028-07-02",
        route: "JFK-CDG",
        airline: "CloudNine Airlines",
        amount: 620,
        status: "Confirmed",
    },
    {
        id: "7",
        name: "Sara Okonkwo",
        bookingCode: "QA-WX8901",
        date: "2028-07-02",
        route: "LAX-NRT",
        airline: "QuickWing Air",
        amount: 1100,
        status: "Pending",
    },
    {
        id: "8",
        name: "David Chen",
        bookingCode: "SK-YZ2345",
        date: "2028-07-03",
        route: "SYD-DXB",
        airline: "SkyHigh Airlines",
        amount: 980,
        status: "Cancelled",
    },
];

// ─── Status chip styles ───────────────────────────────────────────────────────

const statusStyles: Record<PaymentStatus, string> = {
    Confirmed: "bg-amber-100 text-amber-700 border border-amber-300",
    Pending: "bg-gray-100 text-gray-600 border border-gray-300",
    Cancelled: "bg-gray-800 text-white border border-gray-800",
};

// ─── Sort helper ──────────────────────────────────────────────────────────────

function SortableColumnHeader({
    children,
    sortDirection,
}: {
    children: React.ReactNode;
    sortDirection?: "ascending" | "descending";
}) {
    return (
        <span className="flex items-center gap-1">
            {children}
            {sortDirection === "descending" && <span>↓</span>}
            {sortDirection === "ascending" && <span>↑</span>}
        </span>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaymentHistoryTable() {
    const [search, setSearch] = useState("");
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "date",
        direction: "descending",
    });

    // Filter
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return payments.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.airline.toLowerCase().includes(q) ||
                p.bookingCode.toLowerCase().includes(q) ||
                p.route.toLowerCase().includes(q)
        );
    }, [search]);

    // Sort
    const sorted = useMemo(() => {
        const col = sortDescriptor.column as keyof Payment;
        return [...filtered].sort((a, b) => {
            const av = a[col];
            const bv = b[col];
            const cmp =
                typeof av === "number" && typeof bv === "number"
                    ? av - bv
                    : String(av).localeCompare(String(bv));
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [filtered, sortDescriptor]);

    return (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            {/* ── HeaderAdmin bar ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    Payment History
                </h2>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                            />
                        </svg>
                        <input
                            className="pl-9 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent w-56 transition"
                            placeholder="Search name, airline, etc"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Filter button */}
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-300 rounded-xl hover:bg-amber-100 transition">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4h18M7 8h10M10 12h4"
                            />
                        </svg>
                        Latest
                        <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ── HeroUI Table ── */}
            <Table>
                <Table.ScrollContainer >
                    <Table.Content
                        aria-label="Payment History"
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                    >
                        {/* ── Headers ── */}
                        <Table.Header>
                            {sorted.length === 0 ? (
                                <Table.Column allowsSorting isRowHeader id="name">
                                    {({ sortDirection }) => (
                                        <SortableColumnHeader sortDirection={sortDirection}>
                                            No Data
                                        </SortableColumnHeader>
                                    )}
                                </Table.Column>
                            ) : (
                                <>
                                    <Table.Column allowsSorting isRowHeader id="name">
                                        {({ sortDirection }) => (
                                            <SortableColumnHeader sortDirection={sortDirection}>
                                                Name
                                            </SortableColumnHeader>
                                        )}
                                    </Table.Column>
                                    <Table.Column allowsSorting id="bookingCode">
                                        {({ sortDirection }) => (
                                            <SortableColumnHeader sortDirection={sortDirection}>
                                                Booking Code
                                            </SortableColumnHeader>
                                        )}
                                    </Table.Column>
                                    <Table.Column allowsSorting id="date">
                                        {({ sortDirection }) => (
                                            <SortableColumnHeader sortDirection={sortDirection}>
                                                Date
                                            </SortableColumnHeader>
                                        )}
                                    </Table.Column>
                                    <Table.Column id="route">Route</Table.Column>
                                    <Table.Column allowsSorting id="airline">
                                        {({ sortDirection }) => (
                                            <SortableColumnHeader sortDirection={sortDirection}>
                                                Airline
                                            </SortableColumnHeader>
                                        )}
                                    </Table.Column>
                                    <Table.Column allowsSorting id="amount">
                                        {({ sortDirection }) => (
                                            <SortableColumnHeader sortDirection={sortDirection}>
                                                Amount
                                            </SortableColumnHeader>
                                        )}
                                    </Table.Column>
                                    <Table.Column allowsSorting id="status">
                                        {({ sortDirection }) => (
                                            <SortableColumnHeader sortDirection={sortDirection}>
                                                Status
                                            </SortableColumnHeader>
                                        )}
                                    </Table.Column>
                                </>
                            )}
                        </Table.Header>

                        {/* ── Body — static .map() matching working CustomCells pattern ── */}
                        <Table.Body>
                            {sorted.length === 0 ? (
                                <Table.Row id="empty">
                                    <Table.Cell className="py-10 text-center text-sm text-gray-400 col-span-7">
                                        No results found for &ldquo;{search}&rdquo;
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                sorted.map((item) => (
                                    <Table.Row
                                        key={item.id}
                                        id={item.id}
                                        className="hover:bg-amber-50/40 transition-colors"
                                    >
                                        {/* Name */}
                                        <Table.Cell className="py-4 text-sm text-gray-700">
                                            {item.name}
                                        </Table.Cell>

                                        {/* Booking Code */}
                                        <Table.Cell className="py-4 text-sm text-gray-700">
                                            {item.bookingCode}
                                        </Table.Cell>

                                        {/* Date */}
                                        <Table.Cell className="py-4 text-sm text-gray-700">
                                            {item.date}
                                        </Table.Cell>

                                        {/* Route */}
                                        <Table.Cell className="py-4 text-sm text-gray-700">
                                            {item.route}
                                        </Table.Cell>

                                        {/* Airline */}
                                        <Table.Cell className="py-4 text-sm text-gray-700">
                                            {item.airline}
                                        </Table.Cell>

                                        {/* Amount */}
                                        <Table.Cell className="py-4 text-sm font-semibold text-gray-800">
                                            ${item.amount.toFixed(2)}
                                        </Table.Cell>

                                        {/* Status */}
                                        <Table.Cell className="py-4 text-sm">
                                            <span
                                                className={cn(
                                                    "inline-block rounded-lg px-3 py-1 text-xs font-semibold",
                                                    statusStyles[item.status]
                                                )}
                                            >
                                                {item.status}
                                            </span>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        </div>
    );
}