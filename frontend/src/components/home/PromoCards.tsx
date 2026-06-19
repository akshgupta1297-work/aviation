"use client";
import Image from "next/image";
import Plan1 from "../../assets/images/Plan-1.png"
import Plan2 from "../../assets/images/Paln-2.png"
import Plan3 from "../../assets/images/Plan-3.png"

const cards = [
    {
        title: "International Flights",
        price: "Starting at ₹4,999",
        bg: "bg-sky-500",
        img: Plan3
    },
    {
        title: "Domestic Flights",
        price: "Starting at ₹1,299",
        bg: "bg-purple-500",
        img: Plan2
    },
    {
        title: "Holiday Packages",
        price: "Best Deals Available",
        bg: "bg-orange-500",
        img: Plan1
    },
];


const PromoCards = () => {
    return (
        <div className="grid md:grid-cols-3 gap-6 mt-10">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className="relative overflow-hidden rounded-3xl h-[220px]"
                >
                    {/* Background Image */}
                    <Image
                        src={card.img}
                        alt="plane"
                        fill
                        className="object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30" />

                    {/* Content */}
                    <div className="relative z-10 p-8 text-white h-full flex flex-col justify-between">
                        <div>
                            <h3 className="text-3xl font-bold mb-2">
                                {card.title}
                            </h3>

                            <p className="text-xl">
                                {card.price}
                            </p>
                        </div>

                        <button className="bg-white text-black px-5 py-2 rounded-xl w-fit font-semibold hover:bg-gray-100 transition">
                            Book Now
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PromoCards