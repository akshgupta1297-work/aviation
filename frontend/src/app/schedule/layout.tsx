import ClientLayoutAdmin from "@/components/admin/admin-layout/ClientLayoutAdmin";

export const metadata = {
  title: "Schedule | Sky",
  description: "Overview of Schedule of flights",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayoutAdmin>{children}</ClientLayoutAdmin>;
}