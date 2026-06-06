import ClientLayoutAdmin from "@/components/admin/admin-layout/ClientLayoutAdmin";
import ClientLayout from "@/components/user/user-layout/ClientLayout";

export const metadata = {
  title: "Bookings | Sky",
  description: "Overview of Bookings of flights ticket sales",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}