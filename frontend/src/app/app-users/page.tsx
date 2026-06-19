"use client";

import { ColumnConfig, CustomTable } from '@/components/Table/CustomTable';
import { Chip } from '@heroui/react';
// import CustomTable, { ColumnConfig } from '@/components/Table/CustomTable';

interface User {
    id: number;
    name: string;
    image_url: string;
    role: string;
    status: "Active" | "Inactive" | "On Leave";
    email: string;
}

const users: User[] = [
    {
        email: "kate@acme.com",
        id: 4586932,
        image_url: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
        name: "Kate Moore",
        role: "Chief Executive Officer",
        status: "Active",
    },
    {
        email: "john@acme.com",
        id: 5273849,
        image_url: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
        name: "John Smith",
        role: "Chief Technology Officer",
        status: "Active",
    },
    {
        email: "sara@acme.com",
        id: 7492836,
        image_url: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
        name: "Sara Johnson",
        role: "Chief Marketing Officer",
        status: "On Leave",
    },
    {
        email: "michael@acme.com",
        id: 8293746,
        image_url: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
        name: "Michael Brown",
        role: "Chief Financial Officer",
        status: "Active",
    },
    {
        email: "emily@acme.com",
        id: 1234567,
        image_url: "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg",
        name: "Emily Davis",
        role: "Product Manager",
        status: "Inactive",
    },
];

const columns: ColumnConfig<User>[] = [
    {
        uid: "id",
        name: "Id",
        sortable: true,
        isRowHeader: true,
        headerClassName: "text-amber-700",
        cellClassName: "font-semibold",
    },
    {
        uid: "name",
        name: "Full Name",
        sortable: true,
    },
    {
        uid: "role",
        name: "User Role",
        sortable: true,
        render: (value: any) => (
            <Chip color="accent" variant="soft">
                {value}
            </Chip>
        ),
    },
    {
        uid: "status",
        name: "Current Status",
        sortable: true,
        render: (value: any) => (
            <Chip
                color={value === "Active" ? "success" : "danger"}
                variant="soft"
            >
                {value}
            </Chip>
        ),
    },
    {
        uid: "action",
        name: "Action",
        sortable: false,
        align: "center",
    },
];

const AppUsers = () => {
    return (
        <div className="p-8">
            <CustomTable
                data={users}
                columns={columns}
                rowKey="id"
                initialVisibleColumns={["id", "name", "role", "status", "action"]}
                tableClassName="min-h-[400px]"
            />
        </div>
    )
}

export default AppUsers