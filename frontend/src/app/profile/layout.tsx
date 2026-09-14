import ClientLayout from "@/components/user/user-layout/ClientLayout";

export const metadata = {
  title: "Profile | Aviora",
  description: "User profile, account settings, and travel summary",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
