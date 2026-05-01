import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata = {
  title: "Bookings | Sky",
  description: "Overview of Bookings of flights ticket sales",
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-auto">
      <Sidebar />
      <div className="flex-1">
        <Header title="Bookings" />
        <main className="max-h-screen overflow-auto">{children}</main>
      </div>
    </div>
  );
}