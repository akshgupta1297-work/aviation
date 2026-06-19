import Header from "@/components/common/Header";

export const metadata = {
  title: "Login | Aviora",
  description: "Login to Aviora",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      {children}
    </div>
  )
}