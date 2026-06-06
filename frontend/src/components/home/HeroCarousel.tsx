"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import Plan1 from "../../assets/images/Plan-1.png";
import Plan2 from "../../assets/images/Paln-2.png";
import Plan3 from "../../assets/images/Plan-3.png";

const images = [
    Plan1,
    Plan3,
    Plan2,
    "https://rukminim2.flixcart.com/www/2000/2000/promos/06/01/2021/276bd352-f8b3-49cf-87e9-c853e6dbd5ac.jpg?q=50",
];

const HeroCarousel = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
            );
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative xl:h-[580px] lg:h-[400px] h-[300px] w-full overflow-hidden">
            {/* SLIDER */}
            <div
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{
                    transform: `translateX(-${current * 100}%)`,
                }}
            >
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="relative min-w-full h-full"
                    >
                        <Image
                            src={image}
                            alt={`banner-${index}`}
                            fill
                            className="object-fill"
                            priority={index === 0}
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/25" />
                    </div>
                ))}
            </div>

            {/* CONTENT */}
            <div className="absolute inset-0 flex pt-16 justify-center z-20">
                <h1 className="text-amber-200 text-5xl font-bold drop-shadow-lg">
                    Get. Set. Travel.
                </h1>
            </div>

            {/* DOTS */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-3 w-3 rounded-full transition-all ${current === index
                            ? "bg-white w-8"
                            : "bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;