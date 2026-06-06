import ClientLayoutAdmin from "@/components/admin/admin-layout/ClientLayoutAdmin";


export const metadata = {
  title: "Dashboard | Sky",
  description: "Overview of flights, ticket sales, revenue, and bookings",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayoutAdmin>{children}</ClientLayoutAdmin>;
}