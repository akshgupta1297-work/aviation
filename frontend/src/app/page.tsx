
import Header from "@/components/common/Header";
import FlightSearch from "@/components/home/FlightSearch";
import HeroCarousel from "@/components/home/HeroCarousel";
import PromoCards from "@/components/home/PromoCards";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-gray-100 min-h-screen pb-20">
      <div className="relative">
        <Header />
        <HeroCarousel />

        <div className="px-4 lg:px-10">
          <FlightSearch />
          <PromoCards />
        </div>
      </div>
    </main>
  );
}