"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// import { Menu, X } from "lucide-react";

import Logo from "../../../assets/images/Logo.svg";
import Dashboard from "../../../assets/images/SideDashboard.svg";
import Bookings from "../../../assets/images/SideBook.svg";
import Schedule from "../../../assets/images/SideCalander.svg";
import Payments from "../../../assets/images/SidePayment.svg";
import Messages from "../../../assets/images/SideMessage.svg";
import Flight from "../../../assets/images/SidePlan.svg";
import Deals from "../../../assets/images/SideDeal.svg";
import { IoClose, IoMenu } from "react-icons/io5";
import { BiUser } from "react-icons/bi";

interface SidebarProps {
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
}

export default function SidebarAdmin({
  setIsOpen,
  isOpen
}: SidebarProps) {
  const pathName = usePathname();
  // const [isOpen, setIsOpen] = useState(false);



  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: Dashboard,
    },
    {
      name: "Users",
      path: "/app-users",
      reactIcon: <BiUser />,
    },
    {
      name: "Bookings",
      path: "/bookings",
      icon: Bookings,
    },
    {
      name: "Schedule",
      path: "/schedule",
      icon: Schedule,
    },
    {
      name: "Payments",
      path: "/payments",
      icon: Payments,
    },
    {
      name: "Messages",
      path: "/messages",
      icon: Messages,
    },
    {
      name: "Flight Tracking",
      path: "/flight-tracking",
      icon: Flight,
    },
    {
      name: "Deals",
      path: "/deals",
      icon: Deals,
    },
  ];

  return (
    <>
      {/* Mobile HeaderAdmin */}
      {/* <div className="lg:hidden flex items-start h-16 justify-between bg-white h-content px-4 py-5 shadow-md sticky top-0 z-50">
        <button onClick={() => setIsOpen(true)}>
          <IoMenu size={28} />
        </button>
      </div> */}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SidebarAdmin */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white p-4 shadow-lg z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:sticky lg:block
        `}
      >
        {/* Mobile Close Button */}
        {/* <div className="lg:hidden flex justify-end mb-4">
          <button onClick={() => setIsOpen(false)}>
            <IoClose size={28} />
          </button>
        </div> */}

        <div className="flex flex-col items-center">
          <Image
            src={Logo}
            alt="Logo"
            width={150}
            priority
            fetchPriority="high"
          />

          <nav className="mt-12 gap-2 flex flex-col w-full">
            {menuItems.map((item, index) => (
              <Link
                href={item.path}
                key={index}
                onClick={() => setIsOpen(false)}
              >
                <div
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all
                    ${pathName === item.path
                      ? "bg-[#F2E3BC]"
                      : "hover:bg-gray-100"
                    }`}
                >
                  {
                    item?.icon ?
                      <Image src={item.icon} alt={item.name} />
                      :
                      <span>{item.reactIcon}</span>
                  }

                  <p className="text-gray-600 font-medium">{item.name}</p>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}