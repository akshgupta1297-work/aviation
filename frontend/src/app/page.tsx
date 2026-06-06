
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
        <Image width={400} height={600} className="w-full h-full"
          src="https://www.goindigo.in/content/dam/s6web/in/en/assets/static-pages/aircraft-and-fleet/ATR_Aircraft-78Y.png" alt="IndiGo Airbus A320neo aircraft seat map  A320neo V.2" loading="lazy" />
        <Image width={400} height={600} className="w-full h-full"
          src="https://www.goindigo.in/content/dam/s6web/in/en/assets/static-pages/aircraft-and-fleet/A320-NEO-186Y.svg" alt="IndiGo Airbus A320neo aircraft seat map  A320neo V.2" loading="lazy" />
        <Image width={400} height={400} className="w-full h-full"
          src="https://www.goindigo.in/content/dam/s6web/in/en/assets/static-pages/aircraft-and-fleet/Norse-787.svg" alt="IndiGo Airbus A320neo aircraft seat map  A320neo V.2" loading="lazy" />

        <iframe id="seat-map-iframe" title="Seat map" className="w-1/2 h-screen" data-uid="f7ae58c7f1a1cc4abe9273a0f971ba2a"
          src="https://seatmaps.com/seatmaps/f7ae58c7f1a1cc4abe9273a0f971ba2a.html?seatbar=hide&amp;tooltip_on_hover=true">
        </iframe>
      </div>
    </main>
  );
}