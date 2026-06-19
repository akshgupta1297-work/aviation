const SEAT_PRICING = {
    STRETCH: 0.25,
    UPFRONT: 0.10,
    XL: 0.15,
    STANDARD: 0,
};

const TYPE_PRICE = {
    WINDOW: 0.03,
    AISLE: 0.015,
    MIDDLE: 0,
};

const BASE_CLASS_PRICE = {
    BUSINESS: 2,
    ECONOMY: 0,
};

const BASSINET_PRICE = 0;

function getSeatPrice(seat, routeBaseFare) {
    // if (seat.isBassinet) {
    //     return 0; // keep it free or handle as blocked
    // }

    const classFee = BASE_CLASS_PRICE[seat.class] ?? 0;
    const categoryFee =
        SEAT_PRICING[seat.seatCategory] ?? 0;
    const typeFee = TYPE_PRICE[seat.type] ?? 0;
    const xlFee = seat.isXL ? 0.03 : 0;

    const price = classFee + categoryFee + typeFee + xlFee;

    return Math.max(0, Math.round(price * routeBaseFare));
}

module.exports = {
    getSeatPrice,
};