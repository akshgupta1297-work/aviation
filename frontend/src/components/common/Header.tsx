"use client"

import { Avatar, Dropdown, Separator } from '@heroui/react';
import Image from 'next/image';
import { BiArrowFromLeft, BiChevronDown, BiMenu, BiQuestionMark } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/services/api';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { ChevronDownIcon } from '../user/user-layout/ClientHeader';
import Logo from "../../assets/images/Logo.svg";
import Link from 'next/link';
import { MdEmail } from 'react-icons/md';
import { PiPhone } from 'react-icons/pi';

const Header = () => {
    const router = useRouter()
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.user.user);
    const userName = user?.name ?? "Guest";
    const userRole = user?.role ?? "";
    const userEmail = user?.email ?? "";
    const userAvatar = user?.avatar;

    const logOut = () => {
        router.push("/")

        setTimeout(() => {
            logoutUser(dispatch)
        }, 500);
    }
    return (
        <header className="sticky top-0 left-0 w-full z-50">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-amber-200/50 backdrop-blur-[1px]" />

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
                <div className="h-16 flex items-center justify-between">
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

                    {/* RIGHT */}
                    <div className="hidden lg:flex items-center gap-12 text-white">
                        {/* Support */}
                        <Dropdown>
                            <Dropdown.Trigger>

                                <div className="flex items-center gap-2 text-amber-700 text-md font-bold font-medium hover:opacity-80">
                                    Contact Us
                                    {/* <BiQuestionMark size={20} /> */}
                                </div>
                            </Dropdown.Trigger>
                            <Dropdown.Popover>
                                <Dropdown.Menu>
                                    <Dropdown.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <MdEmail />
                                        <a href="mailto:work.akshgupta@gmail.com">
                                            Email Us
                                        </a>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <PiPhone />
                                        <a href="tel:+919644538164">Call Us Now</a>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown.Popover>
                        </Dropdown>

                        {/* Explore */}
                        {/* <button className="text-xl font-medium hover:opacity-80">
                            Explore
                        </button> */}



                        {/* Profile */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <div className="flex items-center gap-1 lg:gap-2.5 pl-1 pr-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors group">
                                    {/* Avatar */}
                                    <Avatar size="sm" className="shrink-0">
                                        {userAvatar ? (
                                            <Avatar.Image src={userAvatar} alt={userName} />
                                        ) : null}
                                        <Avatar.Fallback className="bg-amber-100 text-amber-700 text-xs font-bold">
                                            {userName
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .slice(0, 2)}
                                        </Avatar.Fallback>
                                    </Avatar>

                                    {/* Name + role */}
                                    <div className="hidden lg:flex flex-col items-start leading-tight">
                                        <span className="text-sm font-semibold text-gray-900">{userName}</span>
                                        <span className="text-xs text-gray-400">{userRole}</span>
                                    </div>
                                    <ChevronDownIcon />
                                </div>
                            </Dropdown.Trigger>

                            {userEmail ? <Dropdown.Popover>
                                <div className="px-3 pt-3 pb-1">
                                    <div className="flex items-center gap-2">
                                        <Avatar size="sm">
                                            {userAvatar ? (
                                                <Avatar.Image src={userAvatar} alt={userName} />
                                            ) : null}
                                            <Avatar.Fallback className="bg-amber-100 text-amber-700 text-xs font-bold">
                                                {userName
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .slice(0, 2)}
                                            </Avatar.Fallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-0">
                                            <p className="text-sm leading-5 font-medium">{userName}</p>
                                            <p className="text-xs leading-none text-muted">{userEmail}</p>
                                        </div>
                                    </div>
                                </div>
                                <Dropdown.Menu>
                                    <Dropdown.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
                                        </svg>
                                        Profile
                                    </Dropdown.Item>
                                    <Separator className="my-1 border-t border-gray-100" />
                                    <Dropdown.Item onClick={() => logOut()}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-50 cursor-pointer">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1" />
                                        </svg>
                                        Sign out
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown.Popover> :
                                <Dropdown.Popover>
                                    <Dropdown.Menu>
                                        <Dropdown.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
                                            </svg>
                                            <div className='flex justify-between items-center'>
                                                <Link href={"/login"}>Login </Link>
                                            </div>
                                            <span><BiArrowFromLeft /></span>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>

                                </Dropdown.Popover>
                            }
                        </Dropdown>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header