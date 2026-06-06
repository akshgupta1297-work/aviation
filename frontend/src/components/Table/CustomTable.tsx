"use client";

import type { Selection, SortDescriptor } from "@heroui/react";

import { Avatar, Button, Checkbox, Chip, Table, cn } from "@heroui/react";
// import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import { BiChevronUp, BiCopy, BiPencil } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

interface User {
    id: number;
    name: string;
    image_url: string;
    role: string;
    status: "Active" | "Inactive" | "On Leave";
    email: string;
}

const statusColorMap: Record<string, "success" | "danger" | "warning"> = {
    Active: "success",
    Inactive: "danger",
    "On Leave": "warning",
};

export type SortDirection = "ascending" | "descending";

export interface ColumnConfig<T> {
    uid: keyof T | string;
    name: string;
    sortable?: boolean;
    defaultSortDirection?: SortDirection;
    className?: string;
    headerClassName?: string;
    cellClassName?: string;
    width?: string;
    render?: (value: any, row: T) => React.ReactNode;
    hideable?: boolean;
    align?: "start" | "center" | "end";
    isRowHeader?: boolean;
}

interface CustomTableProps<T> {
    data: T[];
    columns: ColumnConfig<T>[];
    initialVisibleColumns?: string[];
    rowKey: keyof T;
    tableClassName?: string;
    headerWrapperClassName?: string;
    emptyContent?: React.ReactNode;
    removeWrapper?: boolean;
}

const data: User[] = [
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

function SortableColumnHeader({
    children,
    sortDirection,
}: {
    children: React.ReactNode;
    sortDirection?: "ascending" | "descending";
}) {
    return (
        <span className="flex items-center justify-between">
            {children}
            {!!sortDirection && (
                // <Icon
                //     icon="gravity-ui:chevron-up"
                //     className={cn(
                //         "size-3 transform transition-transform duration-100 ease-out",
                //         sortDirection === "descending" ? "rotate-180" : "",
                //     )}
                // />
                <BiChevronUp />
            )}
        </span>
    );
}

export function CustomTable<T extends Record<string, any>>({
    data,
    columns,
    rowKey,
    initialVisibleColumns,
    tableClassName,
    headerWrapperClassName,
    emptyContent = "No data available",
    removeWrapper = false,
}: CustomTableProps<T>) {
    const defaultColumns =
        initialVisibleColumns && initialVisibleColumns.length > 0
            ? initialVisibleColumns
            : columns.map((col) => String(col.uid));

    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
        new Set(defaultColumns)
    );
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
    });

    const sortedUsers = useMemo(() => {
        return [...data].sort((a, b) => {
            const col = sortDescriptor.column as keyof User;
            const first = String(a[col]);
            const second = String(b[col]);
            let cmp = first.localeCompare(second);

            if (sortDescriptor.direction === "descending") {
                cmp *= -1;
            }

            return cmp;
        });
    }, [sortDescriptor]);

    const filteredColumns = useMemo(() => {
        return columns.filter((column) =>
            visibleColumns.has(String(column.uid))
        );
    }, [columns, visibleColumns]);
    console.log(filteredColumns);

    return (
        <Table>
            <Table.ScrollContainer>
                <Table.Content
                    aria-label="Table with custom cells"
                    className="min-w-[800px]"
                    selectedKeys={selectedKeys}
                    selectionMode="multiple"
                    sortDescriptor={sortDescriptor}
                    onSelectionChange={setSelectedKeys}
                    onSortChange={setSortDescriptor}
                >
                    <Table.Header columns={filteredColumns}>
                        {(column: any) => {
                            console.log(column);
                            return (
                                <Table.Column
                                    key={String(column.uid)}
                                    id={String(column.uid)}
                                    allowsSorting={column.sortable}
                                    className={column.headerClassName}
                                    isRowHeader={column.isRowHeader}
                                >
                                    {column.name}
                                </Table.Column>
                            )
                        }}
                    </Table.Header>

                    {/* <Table.Header>
                        <Table.Column className="pr-0">
                            <Checkbox aria-label="Select all" slot="selection">
                                <Checkbox.Control>
                                    <Checkbox.Indicator />
                                </Checkbox.Control>
                            </Checkbox>
                        </Table.Column>
                        <Table.Column allowsSorting isRowHeader className="after:hidden" id="id">
                            {({ sortDirection }) => (
                                <SortableColumnHeader sortDirection={sortDirection}>Worker ID</SortableColumnHeader>
                            )}
                        </Table.Column>
                        <Table.Column allowsSorting id="name">
                            {({ sortDirection }) => (
                                <SortableColumnHeader sortDirection={sortDirection}>Member</SortableColumnHeader>
                            )}
                        </Table.Column>
                        <Table.Column allowsSorting id="role">
                            {({ sortDirection }) => (
                                <SortableColumnHeader sortDirection={sortDirection}>Role</SortableColumnHeader>
                            )}
                        </Table.Column>
                        <Table.Column allowsSorting id="status">
                            {({ sortDirection }) => (
                                <SortableColumnHeader sortDirection={sortDirection}>Status</SortableColumnHeader>
                            )}
                        </Table.Column>
                        <Table.Column className="text-end">Actions</Table.Column>
                    </Table.Header> */}
                    <Table.Body>
                        {sortedUsers.map((user) => (
                            <Table.Row key={user.id} id={user.id}>
                                {/* <Table.Cell className="pr-0">
                                    <Checkbox aria-label={`Select ${user.name}`} slot="selection" variant="secondary">
                                        <Checkbox.Control>
                                            <Checkbox.Indicator />
                                        </Checkbox.Control>
                                    </Checkbox>
                                </Table.Cell> */}
                                <Table.Cell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        #{user.id.toString()}{" "}
                                        <Button isIconOnly size="sm" variant="ghost">
                                            <BiCopy />
                                        </Button>
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex items-center gap-3">
                                        <Avatar size="sm">
                                            <Avatar.Image src={user.image_url} />
                                            <Avatar.Fallback>
                                                {user.name
                                                    .split(" ")
                                                    .map((n: string) => n[0])
                                                    .join("")}
                                            </Avatar.Fallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-xs">{user.name}</span>
                                            <span className="text-xs text-muted">{user.email}</span>
                                        </div>
                                    </div>
                                </Table.Cell>
                                <Table.Cell className="min-w-52">{user.role}</Table.Cell>
                                <Table.Cell className="min-w-25">
                                    <Chip color={statusColorMap[user.status]} size="sm" variant="soft">
                                        {user.status}
                                    </Chip>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex items-center gap-1">
                                        <Button isIconOnly size="sm" variant="tertiary">
                                            <BsEye />
                                        </Button>
                                        <Button isIconOnly size="sm" variant="tertiary">
                                            {/* <Icon className="size-4" icon="gravity-ui:pencil" /> */}
                                            <BiPencil />
                                        </Button>
                                        <Button isIconOnly size="sm" variant="danger-soft">
                                            {/* <Icon className="size-4" icon="gravity-ui:trash-bin" /> */}
                                            <MdDelete />
                                        </Button>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
        </Table>
    );
}