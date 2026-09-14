"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  FaRegUser,
  FaCheckCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaSuitcaseRolling,
  FaShieldAlt,
  FaCrown,
  FaSignOutAlt,
  FaCopy,
  FaCheck,
  FaTicketAlt,
  FaTimesCircle,
} from "react-icons/fa";
import { MdAirlineSeatReclineExtra, MdRestaurantMenu, MdNotificationsActive } from "react-icons/md";
import { BiChevronRight } from "react-icons/bi";
import { Tabs } from "@heroui/react";

import Header from "@/components/common/Header";
import Card from "@/components/common/Card";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getBookingsByUserId, getUserProfile, logoutUser } from "@/lib/services/api";

interface UserProfileData {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  number?: string;
  role?: string;
  isVerified?: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

function ProfileContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const reduxUser = useAppSelector((state) => state.user.user);
  const token = reduxUser?.token;

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [bookings, setBookings] = useState<{
    upcomingBooking: any[];
    pastBookings: any[];
    cancelledBookings: any[];
  }>({
    upcomingBooking: [],
    pastBookings: [],
    cancelledBookings: [],
  });
  const [copied, setCopied] = useState(false);

  // Preference mock states (persisted in local state)
  const [seatPref, setSeatPref] = useState("Window");
  const [mealPref, setMealPref] = useState("Asian Vegetarian");
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

      if (!activeToken) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [profileData, bookingsData] = await Promise.all([
          getUserProfile(activeToken),
          getBookingsByUserId(activeToken),
        ]);

        if (profileData) {
          setProfile(profileData);
        } else if (reduxUser) {
          // Fallback to redux user info
          const [first, ...last] = (reduxUser.name || "").split(" ");
          setProfile({
            firstName: first || "",
            lastName: last.join(" ") || "",
            email: reduxUser.email || "",
            role: reduxUser.role || "User",
            avatar: reduxUser.avatar,
          });
        }

        if (bookingsData?.data) {
          setBookings(bookingsData.data);
        }
      } catch (err) {
        console.error("Error loading profile data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token, reduxUser]);

  const handleCopyUserId = (id?: string) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    logoutUser(dispatch);
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center py-32">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <p className="text-sm font-medium text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile && !reduxUser) {
    return (
      <div className="flex-1 max-w-xl mx-auto px-4 py-20 text-center">
        <Card className="p-8 shadow-sm">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <FaRegUser />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your profile</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Access your passenger details, flight history, travel preferences, and loyalty miles.
          </p>
          <Link
            href="/login?callbackUrl=/profile"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-xl transition shadow-sm"
          >
            Sign In to Aviora
          </Link>
        </Card>
      </div>
    );
  }

  const fullName = `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() || reduxUser?.name || "Passenger";
  const userInitials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const totalBookingsCount =
    (bookings.upcomingBooking?.length || 0) +
    (bookings.pastBookings?.length || 0) +
    (bookings.cancelledBookings?.length || 0);

  const memberSince = profile?.createdAt
    ? format(new Date(profile.createdAt), "MMMM d, yyyy")
    : "Recently Joined";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── Top Hero Profile Banner Card ── */}
      <div className="relative rounded-3xl overflow-hidden bg-white shadow-lg border border-amber-100/60">
        {/* Background Aviation Gradient Banner */}
        <div className="h-40 sm:h-48 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
          <div className="absolute top-4 right-6 flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-amber-900 shadow-sm">
            <FaCrown className="text-amber-600" />
            Aviora Club Member
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 sm:-mt-20">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-amber-100 border-4 border-white shadow-md flex items-center justify-center text-amber-800 text-3xl font-bold overflow-hidden">
                {profile?.avatar || reduxUser?.avatar ? (
                  <Image
                    src={profile?.avatar || reduxUser?.avatar || ""}
                    alt={fullName}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{userInitials}</span>
                )}
              </div>
              <div
                className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow"
                title="Verified Account"
              >
                <FaCheckCircle className="text-xs" />
              </div>
            </div>

            {/* Name & Basic Info */}
            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{fullName}</h1>
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {profile?.role || "Passenger"}
                </span>
              </div>
              <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1.5">
                <FaEnvelope className="text-xs text-gray-400" /> {profile?.email || reduxUser?.email}
              </p>
              {profile?.userId && (
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                    ID: {profile.userId.slice(0, 16)}...
                  </span>
                  <button
                    onClick={() => handleCopyUserId(profile.userId)}
                    className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer font-medium"
                    title="Copy full User ID"
                  >
                    {copied ? <FaCheck className="text-emerald-500" /> : <FaCopy />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/user-bookings"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-semibold rounded-xl transition shadow-sm"
            >
              <FaTicketAlt /> My Bookings
            </Link>
            <Link
              href="/#book-flight"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-xl transition"
            >
              <FaPlaneDeparture /> Book Flight
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition border border-red-200 font-medium cursor-pointer"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick Stats Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
            <FaPlaneDeparture />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Upcoming Flights</p>
            <p className="text-2xl font-bold text-gray-900">{bookings.upcomingBooking?.length || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
            <FaTicketAlt />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{totalBookingsCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <FaCrown />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Aviora Tier</p>
            <p className="text-base font-bold text-emerald-700">Silver Member</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
            <FaCalendarAlt />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Member Since</p>
            <p className="text-sm font-semibold text-gray-800">{memberSince}</p>
          </div>
        </div>
      </div>

      {/* ── Main Tabbed Content Card ── */}
      <Card className="p-6 md:p-8 shadow-md border border-gray-100">
        <Tabs className="w-full">
          <Tabs.ListContainer className="w-full mb-6">
            <Tabs.List
              aria-label="Profile Sections"
              className="bg-amber-50 p-1.5 rounded-2xl flex flex-wrap sm:flex-nowrap gap-1 w-full max-w-2xl *:data-[selected=true]:bg-amber-400 *:data-[selected=true]:text-gray-900 *:data-[selected=true]:font-bold"
            >
              <Tabs.Tab id="personal" className="rounded-xl px-4 py-2 text-sm text-gray-700 transition cursor-pointer md:flex-1 text-center">
                Personal Info
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="flights" className="rounded-xl px-4 py-2 text-sm text-gray-700 transition cursor-pointer md:flex-1 text-center">
                Travel Summary
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="preferences" className="rounded-xl px-4 py-2 text-sm text-gray-700 transition cursor-pointer md:flex-1 text-center">
                Preferences
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="security" className="rounded-xl px-4 py-2 text-sm text-gray-700 transition cursor-pointer md:flex-1 text-center">
                Security & Account
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>

          {/* ── TAB 1: Personal Details ── */}
          <Tabs.Panel id="personal" className="pt-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                <p className="text-xs text-gray-500">Your passenger profile details used for flight bookings and check-in</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">First Name</span>
                  <p className="text-base font-medium text-gray-900">{profile?.firstName || "—"}</p>
                </div>

                <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Last Name</span>
                  <p className="text-base font-medium text-gray-900">{profile?.lastName || "—"}</p>
                </div>

                <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <FaEnvelope className="text-amber-500" /> Email Address
                  </span>
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium text-gray-900">{profile?.email || reduxUser?.email || "—"}</p>
                    {profile?.isVerified ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <FaCheckCircle className="text-[10px]" /> Verified
                    </span> : <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                      <FaTimesCircle className="text-[10px]" /> Unerified
                    </span>}
                  </div>
                </div>

                <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <FaPhoneAlt className="text-amber-500" /> Phone Number
                  </span>
                  <p className="text-base font-medium text-gray-900">{profile?.number || "Not provided"}</p>
                </div>

                <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Account Role</span>
                  <p className="text-base font-medium text-gray-900">{profile?.role || "Passenger"}</p>
                </div>

                <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Member Since</span>
                  <p className="text-base font-medium text-gray-900">{memberSince}</p>
                </div>
              </div>
            </div>
          </Tabs.Panel>

          {/* ── TAB 2: Travel Summary ── */}
          <Tabs.Panel id="flights" className="pt-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Your Recent & Upcoming Trips</h3>
                  <p className="text-xs text-gray-500">Quick preview of your flight bookings with Aviora</p>
                </div>
                <Link
                  href="/user-bookings"
                  className="text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  View All Bookings <BiChevronRight size={18} />
                </Link>
              </div>

              {bookings.upcomingBooking && bookings.upcomingBooking.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Next Upcoming Flight</h4>
                  {bookings.upcomingBooking.slice(0, 2).map((booking: any) => (
                    <Link
                      key={booking.bookingId}
                      href={`/user-booking-details/${booking.bookingId}`}
                      className="block p-5 bg-linear-to-r from-amber-50/60 to-orange-50/40 rounded-2xl border border-amber-200 hover:border-amber-400 transition shadow-sm group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-amber-400 text-gray-900 flex items-center justify-center text-xl shrink-0 font-bold">
                            <FaPlaneDeparture />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-base">
                                {booking?.flightInstanceId?.flightId?.airlineId?.name || "Aviora Flight"}
                              </span>
                              <span className="text-xs bg-amber-200 text-amber-900 font-semibold px-2 py-0.5 rounded">
                                {booking?.flightInstanceId?.flightId?.flightNumber || "Flight"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-0.5">
                              Booking Ref: <span className="font-mono font-medium">{booking.bookingId}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 text-sm">
                          <div>
                            <span className="text-xs text-gray-500 block">Depart Date & Time</span>
                            <span className="inline-flex items-center gap-1 text-black font-semibold text-xs py-0.5 rounded-full">
                              {format(new Date(booking?.journeyDate || new Date()), "dd MMM yyyy")} at {format(new Date(booking?.journeyDate || new Date()), "h:mm a")}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Status</span>
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs bg-emerald-100 px-2 py-0.5 rounded-full">
                              <FaCheckCircle className="text-[10px]" /> Confirmed
                            </span>
                          </div>
                          <div className="text-amber-700 font-semibold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            View Details <BiChevronRight size={16} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50/80 rounded-2xl border border-dashed border-gray-200 p-6 space-y-3">
                  <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                    <FaSuitcaseRolling />
                  </div>
                  <h4 className="text-base font-semibold text-gray-800">No upcoming flights scheduled</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Ready for your next adventure? Search flights and book your tickets in just a few clicks.
                  </p>
                  <Link
                    href="/#book-flight"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-semibold rounded-xl transition shadow-sm mt-2"
                  >
                    <FaPlaneDeparture /> Explore Flights
                  </Link>
                </div>
              )}
            </div>
          </Tabs.Panel>

          {/* ── TAB 3: Travel Preferences ── */}
          <Tabs.Panel id="preferences" className="pt-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Travel Preferences</h3>
                <p className="text-xs text-gray-500">Customize your in-flight comfort, seat choice, and notification settings</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Seat Preference */}
                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <MdAirlineSeatReclineExtra className="text-xl text-amber-600" />
                    <h4 className="font-semibold text-sm text-gray-900">Preferred Seating</h4>
                  </div>
                  <p className="text-xs text-gray-500">Select your preferred seat location for automatic seat suggestions</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["Window", "Aisle", "Extra Legroom"].map((seat) => (
                      <button
                        key={seat}
                        type="button"
                        onClick={() => setSeatPref(seat)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border transition cursor-pointer ${seatPref === seat
                          ? "bg-amber-400 border-amber-500 text-gray-900 shadow-sm"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meal Preference */}
                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <MdRestaurantMenu className="text-xl text-amber-600" />
                    <h4 className="font-semibold text-sm text-gray-900">In-Flight Meal Preference</h4>
                  </div>
                  <p className="text-xs text-gray-500">Pre-select your special meal request for long-haul flights</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Asian Vegetarian", "Standard Meal", "Vegan / Fruit", "Diabetic Meal"].map((meal) => (
                      <button
                        key={meal}
                        type="button"
                        onClick={() => setMealPref(meal)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border transition cursor-pointer text-left truncate ${mealPref === meal
                          ? "bg-amber-400 border-amber-500 text-gray-900 shadow-sm"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        {meal}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* In-Flight Notifications */}
              <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-4">
                <div className="flex items-center gap-2">
                  <MdNotificationsActive className="text-xl text-amber-600" />
                  <h4 className="font-semibold text-sm text-gray-900">Flight Status & Updates</h4>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-gray-800">SMS Flight Delay & Gate Alerts</p>
                      <p className="text-xs text-gray-500">Receive real-time departure and gate change notifications via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={(e) => setSmsAlerts(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>
                  <div className="border-t border-gray-200" />
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Email Itinerary & Invoices</p>
                      <p className="text-xs text-gray-500">Automatically receive e-tickets and payment receipts in your inbox</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          </Tabs.Panel>

          {/* ── TAB 4: Security & Account ── */}
          <Tabs.Panel id="security" className="pt-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Security & Credentials</h3>
                <p className="text-xs text-gray-500">Manage account authentication, password, and active sessions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex items-center gap-2 text-gray-900">
                    <FaShieldAlt className="text-amber-600" />
                    <h4 className="font-semibold text-sm">Account Password</h4>
                  </div>
                  <p className="text-xs text-gray-500">Password is encrypted and protected with bcrypt hashing</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm text-gray-700 font-mono tracking-widest">••••••••••••</span>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                      Active
                    </span>
                  </div>
                </div>

                <div className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex items-center gap-2 text-gray-900">
                    {profile?.isVerified ? <FaCheckCircle className="text-emerald-600" />
                      : <FaTimesCircle className="text-red-600" />}
                    <h4 className="font-semibold text-sm">Two-Factor & Verification</h4>
                  </div>
                  <p className="text-xs text-gray-500">Email verification and session tokens are strictly validated</p>
                  <div className="flex items-center justify-between pt-1">
                    {profile?.isVerified ? <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                      Verified Session
                    </span>
                      : <span className="text-xs font-semibold text-red-800 bg-red-100 px-2.5 py-1 rounded-lg">
                        Email Not Verified
                      </span>}
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-5 bg-red-50/60 rounded-2xl border border-red-100 space-y-3">
                <h4 className="font-bold text-sm text-red-900">Account Actions</h4>
                <p className="text-xs text-red-700">
                  Signing out will clear your authentication from this browser.
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition shadow-sm cursor-pointer"
                >
                  <FaSignOutAlt /> Sign Out of All Sessions
                </button>
              </div>
            </div>
          </Tabs.Panel>
        </Tabs>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<div className="p-8 text-center">Loading profile...</div>}>
          <ProfileContent />
        </Suspense>
      </main>
    </div>
  );
}
