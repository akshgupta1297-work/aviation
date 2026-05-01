import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata = {
  title: "Schedule | Sky",
  description: "Overview of Schedule of flights",
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-auto">
      <Sidebar />
      <div className="flex-1">
        <Header title="Schedule" />
        <main className="max-h-screen overflow-auto">{children}</main>
      </div>
    </div>
  );
}