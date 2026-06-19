// utils/buildSeatMaps.js

const WINDOW = "WINDOW";
const MIDDLE = "MIDDLE";
const AISLE = "AISLE";

const layout33 = ["A", "B", "C", "D", "E", "F"];
const layout22 = ["A", "C", "D", "F"];

const seatType33 = {
    A: WINDOW,
    B: MIDDLE,
    C: AISLE,
    D: AISLE,
    E: MIDDLE,
    F: WINDOW,
};

const seatType22 = {
    A: WINDOW,
    C: AISLE,
    D: AISLE,
    F: WINDOW,
};

function buildRowSeats({
    row,
    layout,
    seatClass,
    seatCategory,
    typeMap,
    bassinetSeats = [],
    xlSeats = [],
}) {
    return layout.map((letter) => {
        const seatNo = `${row}${letter}`;

        return {
            seatNo,
            class: seatClass,
            type: typeMap[letter],
            seatCategory,
            isBassinet: bassinetSeats.includes(seatNo),
            isXL: xlSeats.includes(seatNo),
        };
    });
}

function buildSeatMapA320Neo186Y() {
    const seatMap = [];

    for (let row = 1; row <= 31; row++) {
        let seatCategory = "STANDARD";

        if (row === 1) seatCategory = "UPFRONT";
        if (row === 12 || row === 13) seatCategory = "XL";

        const xlSeats =
            row === 12 || row === 13
                ? [
                    `${row}A`,
                    `${row}B`,
                    `${row}C`,
                    `${row}D`,
                    `${row}E`,
                    `${row}F`,
                ]
                : [];

        seatMap.push(
            ...buildRowSeats({
                row,
                layout: layout33,
                seatClass: "ECONOMY",
                seatCategory,
                typeMap: seatType33,
                xlSeats,
            })
        );
    }

    return seatMap;
}

function buildSeatMapA321232Y() {
    const seatMap = [];

    for (let row = 1; row <= 39; row++) {
        let seatCategory = "STANDARD";

        if (row === 1 || row === 2) seatCategory = "UPFRONT";
        if (row === 18 || row === 19 || row === 28) seatCategory = "XL";
        if (row === 29) seatCategory = "XL"; // row 29 A/F are XL per IndiGo

        const xlSeats =
            row === 18 || row === 19 || row === 28
                ? [
                    `${row}A`,
                    `${row}B`,
                    `${row}C`,
                    `${row}D`,
                    `${row}E`,
                    `${row}F`,
                ]
                : row === 29
                    ? [`29A`, `29F`]
                    : [];

        seatMap.push(
            ...buildRowSeats({
                row,
                layout: layout33,
                seatClass: "ECONOMY",
                seatCategory,
                typeMap: seatType33,
                xlSeats,
            })
        );
    }

    return seatMap;
}

function buildSeatMapA321XLR() {
    const seatMap = [];

    const bassinetStretch = ["1A", "1C", "1D", "1F"];
    const bassinetEconomy = [
        "4A", "4B", "4C", "4D", "4E", "4F",
    ];

    for (let row = 1; row <= 34; row++) {
        // Stretch / Business cabin
        if (row >= 1 && row <= 3) {
            seatMap.push(
                ...buildRowSeats({
                    row,
                    layout: layout22,
                    seatClass: "BUSINESS",
                    seatCategory: "STRETCH",
                    typeMap: seatType22,
                    bassinetSeats: bassinetStretch,
                })
            );
            continue;
        }

        // Economy cabin
        let seatCategory = "STANDARD";
        if (row === 4 || row === 5) seatCategory = "UPFRONT";
        if (row === 14 || row === 15) seatCategory = "XL";

        const xlSeats =
            row === 14 || row === 15
                ? [
                    `${row}A`,
                    `${row}B`,
                    `${row}C`,
                    `${row}D`,
                    `${row}E`,
                    `${row}F`,
                ]
                : [];

        seatMap.push(
            ...buildRowSeats({
                row,
                layout: layout33,
                seatClass: "ECONOMY",
                seatCategory,
                typeMap: seatType33,
                bassinetSeats: bassinetEconomy,
                xlSeats,
            })
        );
    }

    return seatMap;
}

module.exports = {
    buildSeatMapA320Neo186Y,
    buildSeatMapA321232Y,
    buildSeatMapA321XLR,
};