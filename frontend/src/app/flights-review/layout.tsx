import Image from "next/image";
import Link from "next/link";
import Logo from "../../assets/images/AviorLogo.png";

export const metadata = {
    title: "Flight | Sky",
    description: "Flight to Aviation App",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <header className="sticky top-0 left-0 w-full z-50">
                {/* Background Overlay */}
                <div className="absolute inset-0 bg-amber-200/50 backdrop-blur-[1px]" />

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="h-18 flex items-center justify-between">
                        {/* LEFT */}
                        <Link href={"/"}>
                            <div className="flex items-center gap-4 text-white">
                                <Image
                                    src={Logo}
                                    alt="Logo"
                                    width={150}
                                    priority
                                    fetchPriority="high"
                                />
                            </div>
                        </Link>
                    </div>
                </div>
            </header>
            {children}
        </div>
    )
}