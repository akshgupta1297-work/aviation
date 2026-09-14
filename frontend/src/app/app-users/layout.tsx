import ClientLayoutAdmin from "@/components/admin/admin-layout/ClientLayoutAdmin";

export const metadata = {
  title: "Users | Sky",
  description: "Overview of Users of Aviora",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayoutAdmin>{children}</ClientLayoutAdmin>;
}