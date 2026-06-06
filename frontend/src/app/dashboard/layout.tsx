import ClientLayout from "@/components/user/user-layout/ClientLayout";


export const metadata = {
  title: "Dashboard | Sky",
  description: "Overview of flights, ticket sales, revenue, and bookings",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}