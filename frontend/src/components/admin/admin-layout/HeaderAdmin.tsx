"use client";

import { useEffect, useState } from "react";
import { Avatar, Dropdown, Separator } from "@heroui/react";
import { logoutUser, restoreSession } from "@/lib/services/api";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { IoClose, IoMenu } from "react-icons/io5";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeaderProps {
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
  title?: string;
  notificationCount?: number;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 0 0-5-5.917V4a1 1 0 1 0-2 0v1.083A6 6 0 0 0 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ─── Icon Button ──────────────────────────────────────────────────────────────

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
    >
      {children}
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeaderAdmin({
  setIsOpen,
  isOpen,
  title = "Dashboard",
  notificationCount = 3,
}: HeaderProps) {

  console.log(isOpen);

  const dispatch = useAppDispatch();
  const router = useRouter()

  const user = useAppSelector((state) => state.user.user);
  const userName = user?.name ?? "Guest";
  const userRole = user?.role ?? "";
  const userEmail = user?.email ?? "";
  const userAvatar = user?.avatar;


  const [search, setSearch] = useState("");

  useEffect(() => {
    // restoreSession(dispatch)
  }, [])

  const logOut = () => {
    router.push("/")

    setTimeout(() => {
      logoutUser(dispatch)
    }, 500);
  }


  return (
    <header className="w-full bg-white border-b border-gray-100 lg:px-6 px-3 py-3">
      <div className="flex items-center gap-4">

        {/* ── Page Title ── */}
        <div className="lg:hidden flex items-start justify-between bg-white h-content shadow-md sticky top-0 z-50">
          {!isOpen ? <button onClick={() => setIsOpen(true)}>
            <IoMenu size={28} />
          </button> :
            <div className="lg:hidden flex justify-end">
              <button onClick={() => setIsOpen(false)}>
                <IoClose size={28} />
              </button>
            </div>}
        </div>
        <h1 className="lg:block hidden text-xl font-bold text-gray-900 tracking-tight shrink-0 min-w-[120px]">
          {title}
        </h1>

        {/* ── Search ── */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search anything"
              className="w-full pl-9 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-1 shrink-0">

          {/* Notification bell with badge */}
          <div className="relative">
            <IconBtn>
              <BellIcon />
            </IconBtn>
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none pointer-events-none">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </div>

          {/* Help */}
          <IconBtn>
            <HelpIcon />
          </IconBtn>

          {/* Settings */}
          {/* <IconBtn>
            <SettingsIcon />
          </IconBtn> */}

          {/* ── Divider ── */}
          <div className="w-px h-8 bg-gray-200 mx-2" />

          {/* ── User profile dropdown ── */}
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

            <Dropdown.Popover>
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
                {/* <Dropdown.Item className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  </svg>
                  Settings
                </Dropdown.Item> */}
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
            </Dropdown.Popover>
          </Dropdown>

        </div>
      </div>
    </header>
  );
}