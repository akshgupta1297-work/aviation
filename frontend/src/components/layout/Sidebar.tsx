"use client"
import Image from "next/image";
import Logo from "../../assets/images/Logo.svg";
import Dashboard from "../../assets/images/SideDashboard.svg";
import Bookings from "../../assets/images/SideBook.svg";
import Schedule from "../../assets/images/SideCalander.svg";
import Payments from "../../assets/images/SidePayment.svg";
import Messages from "../../assets/images/SideMessage.svg";
import Flight from "../../assets/images/SidePlan.svg";
import Deals from "../../assets/images/SideDeal.svg";
import { usePathname, useRouter } from "next/navigation";
import { GOLD } from "@/utils/colors";
import Link from "next/link";

export default function Sidebar() {
  const pathName = usePathname()
  console.log(pathName);

  return (
    <aside className="w-64 bg-white p-4 shadow sticky top-0">

      <div className="flex flex-col items-center">
        <Image src={Logo} alt="Logo" width={150} priority fetchPriority="high" />

        <nav className="mt-12 gap-2 flex flex-col">
          <Link href={"/dashboard"}>
            <div className={`flex gap-1 w-46 rounded pl-2 py-3 ${pathName === "/dashboard" && "bg-[#F2E3BC]"}`}>
              <Image src={Dashboard} alt="Dashboard" />
              <p className="text-gray-600">Dashboard</p>
            </div>
          </Link>
          <Link href={"/bookings"}>
            <div className={`flex gap-1 w-46 rounded pl-2 py-3 ${pathName === "/bookings" && "bg-[#F2E3BC]"}`}>
              <Image src={Bookings} alt="Bookings" />
              <p className="text-gray-600">Bookings</p>
            </div>
          </Link>
          <Link href={"/schedule"}>
            <div className={`flex gap-1 w-46 rounded pl-2 py-3 ${pathName === "/schedule" && "bg-[#F2E3BC]"}`}>
              <Image src={Schedule} alt="Schedule" />
              <p className="text-gray-600">Schedule</p>
            </div>
          </Link>
          <Link href={"/payments"}>
            <div className={`flex gap-1 w-46 rounded pl-2 py-3 ${pathName === "/payments" && "bg-[#F2E3BC]"}`}>
              <Image src={Payments} alt="Payments" />
              <p className="text-gray-600">Payments</p>
            </div>
          </Link>
          <Link href={"/messages"}>
            <div className={`flex gap-1 w-46 rounded pl-2 py-3 ${pathName === "/messages" && "bg-[#F2E3BC]"}`}>
              <Image src={Messages} alt="Messages" />
              <p className="text-gray-600">Messages</p>
            </div>
          </Link>
          <Link href={"/flight-tracking"}>
            <div className={`flex gap-1 w-46 rounded pl-2 py-3 ${pathName === "/flight-tracking" && "bg-[#F2E3BC]"}`}>
              <Image src={Flight} alt="Flight Tracking" />
              <p className="text-gray-600">Flight Tracking</p>
            </div>
          </Link>
          <Link href={"/deals"}>
            <div className={`flex gap-1 w-46 rounded pl-2 py-3 ${pathName === "/deals" && "bg-[#F2E3BC]"}`}>
              <Image src={Deals} alt="Deals" />
              <p className="text-gray-600">Deals</p>
            </div>
          </Link>
        </nav>
      </div>
    </aside>
  );
}