"use client";
import React, { useState, useMemo } from "react";
import { FaCheck } from "react-icons/fa";
import { MdAirlineSeatReclineExtra } from "react-icons/md";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SeatData {
  isBooked: boolean;
  price: number;
  seatNo: string;
  class: "ECONOMY" | "BUSINESS";
  type: "WINDOW" | "AISLE" | "MIDDLE";
  seatCategory: "STRETCH" | "STANDARD" | "XL" | "UPFRONT";
  isBassinet: boolean;
  isXL: boolean;
}

interface FlightInstance {
  flightInstanceId: string;
  sourceAirportCode: string;
  destinationAirportCode: string;
  seatAvailability: SeatData[];
  totalSeats?: { economy: number; business: number };
}

interface SeatSelectionProps {
  flightInstances: FlightInstance[];
  passengers: number[]; // [adults, children, infants]
  seatSelections: Record<string, Record<string, string>>;
  setSeatCharges: (seatCharges: number) => void;
  onContinue: (selections: Record<string, Record<string, string>>) => void;
  onSkip: () => void;
}

// ─── Colour palette for price tiers (ordered: free→green, then beige→pink→cream→teal) ──

const TIER_COLORS = [
  { bg: "#d2ffd9", border: "#99f7a8", label: "Free", text: "#065f46" },
  { bg: "#fefaeb", border: "#efdfa7", label: "", text: "#92400e" },
  { bg: "#fce7f3", border: "#f9a8d4", label: "", text: "#9d174d" },
  { bg: "#fef9c3", border: "#fde047", label: "", text: "#713f12" },
  { bg: "#cce1fb", border: "#acc6e6", label: "", text: "#122071" },
  { bg: "#98bbe6", border: "#5c9eee", label: "", text: "#122071" },
  { bg: "#ccfbf1", border: "#5eead4", label: "", text: "#134e4a" },
];
const assignColor = (i: number) => {
  return TIER_COLORS[Math.min(i, TIER_COLORS.length - 1)]
};
// ─── Helper: parse seat number into row + col ─────────────────────────────────
function parseSeat(seatNo: string): { row: number; col: string } {
  const match = seatNo.match(/^(\d+)([A-Z]+)$/);
  if (!match) return { row: 0, col: "" };
  return { row: parseInt(match[1], 10), col: match[2] };
}

// ─── Helper: build price tiers from unique prices ────────────────────────────
function buildPriceTiers(seats: SeatData[]): { price: number; color: (typeof TIER_COLORS)[0] }[] {
  const uniquePrices = [...new Set(seats.map((s) => s.price))].sort((a, b) => a - b);
  return uniquePrices.map((price, i) => ({
    price,
    color: assignColor(i),
  }));
}

// ─── Helper: detect columns from seat data and build layout config ──────────
function getLayoutConfig(seats: SeatData[]): {
  cols: string[];
  aisleAfter: string[];
  exitRows: number[];
} {
  const colSet = new Set<string>();
  seats.forEach((s) => {
    const { col } = parseSeat(s.seatNo);
    if (col) colSet.add(col);
  });
  const cols = [...colSet].sort();
  const totalCols = cols.length;

  // Standard configurations
  // 3+3 (A B C | D E F)
  // 2+2 (A B | C D)
  // 3+4+3 (A B C | D E F G | H J K) — wide body

  let aisleAfter: string[] = [];
  let exitRows: number[] = [];

  if (totalCols === 6) {
    // 3+3 narrow body
    aisleAfter = [cols[2]]; // after C
    exitRows = [1, 12, 26];
  } else if (totalCols === 4) {
    // 2+2
    aisleAfter = [cols[1]]; // after B
    exitRows = [1, 10, 20];
  } else if (totalCols >= 9) {
    // wide body 3+3+3 or similar
    aisleAfter = [cols[2], cols[5]];
    exitRows = [1, 20, 40];
  } else {
    aisleAfter = [cols[Math.floor(totalCols / 2) - 1]];
    exitRows = [1, 15, 30];
  }

  return { cols, aisleAfter, exitRows };
}

// ─── Seat Cell Component ──────────────────────────────────────────────────────
const SeatCell: React.FC<{
  seat: SeatData | undefined;
  isSelected: boolean;
  priceTiers: { price: number; color: (typeof TIER_COLORS)[0] }[];
  onClick: () => void;
}> = ({ seat, isSelected, priceTiers, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!seat) {
    return <div className="w-9 h-9 rounded-md" />;
  }

  const tier = priceTiers.find((t) => t.price === seat.price);
  const color = tier?.color ?? TIER_COLORS[0];

  if (seat.isBooked) {
    return (
      <div className="relative w-9 h-9 rounded-md bg-gray-200 border border-gray-300 flex items-center justify-center cursor-not-allowed">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="relative w-9 h-9 rounded-md flex items-center justify-center cursor-pointer transition-all duration-150 hover:scale-110 hover:shadow-md select-none text-[10px] font-semibold"
      style={
        isSelected
          ? { background: "green", border: "2px solid green", color: "#fff" }
          : { background: color.bg, border: `1.5px solid ${color.border}`, color: color.text }
      }
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {!isSelected ? seat.seatNo : <FaCheck size={10} />}
      {showTooltip && (
        <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl pointer-events-none">
          <span className="font-bold">{seat.seatNo}</span>
          {seat.price === 0 ? " · Free" : ` · ₹${seat.price}`}
          <br />
          <span className="text-gray-300 capitalize">{seat.seatCategory.toLowerCase()} · {seat.type.toLowerCase()}</span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const SeatSelection = React.memo(({
  flightInstances,
  passengers,
  seatSelections,
  setSeatCharges,
  onContinue,
  onSkip,
}: SeatSelectionProps) => {
  const [activeLegIdx, setActiveLegIdx] = useState(0);
  const [activeTraveller, setActiveTraveller] = useState(0);
  // selections[legInstanceId][travellerIdx] = seatNo
  const [selections, setSelections] = useState<Record<string, Record<number, string>>>({ ...seatSelections });

  React.useEffect(() => {
    let total = 0;
    for (const [legId, tMap] of Object.entries(selections)) {
      const leg = flightInstances.find(f => f.flightInstanceId === legId);
      if (leg && leg.seatAvailability) {
        for (const seatNo of Object.values(tMap)) {
          const seat = leg.seatAvailability.find(s => s.seatNo === seatNo);
          if (seat) total += seat.price;
        }
      }
    }
    if (setSeatCharges) {
      setSeatCharges(total);
    }
  }, [selections, flightInstances, setSeatCharges]);

  const [adults, children] = passengers;
  const totalPassengers = adults + children; // infants don't get seats

  const activeLeg = flightInstances[activeLegIdx];
  const seats = activeLeg?.seatAvailability ?? [];
  const legId = activeLeg?.flightInstanceId ?? "";

  const priceTiers = useMemo(() => buildPriceTiers(seats), [seats]);
  const layout = useMemo(() => getLayoutConfig(seats), [seats]);

  // Build row→col→seat map
  const seatMap = useMemo(() => {
    const map: Record<number, Record<string, SeatData>> = {};
    seats.forEach((s) => {
      const { row, col } = parseSeat(s.seatNo);
      if (!map[row]) map[row] = {};
      map[row][col] = s;
    });
    return map;
  }, [seats]);

  const allRows = useMemo(() => Object.keys(seatMap).map(Number).sort((a, b) => a - b), [seatMap]);

  const legSelections = selections[legId] ?? {};
  const selectedByThisLeg = Object.values(legSelections);
  const currentTravellerSeat = legSelections[activeTraveller];

  const selectedCount = Object.keys(legSelections).length;

  const handleSeatClick = (seat: SeatData) => {
    if (seat.isBooked) return;
    const seatNo = seat.seatNo;


    setSelections((prev) => {
      const legSel = { ...(prev[legId] ?? {}) };

      // If this traveller already has this seat selected, deselect
      if (legSel[activeTraveller] === seatNo) {
        delete legSel[activeTraveller];
        return { ...prev, [legId]: legSel };
      }

      // If another traveller has this seat, don't allow
      const takenByOther = Object.entries(legSel).find(
        ([t, s]) => s === seatNo && Number(t) !== activeTraveller
      );
      if (takenByOther) return prev;

      legSel[activeTraveller] = seatNo;
      console.log(activeTraveller, totalPassengers);

      // Auto advance to next traveller if not last
      if (activeTraveller < totalPassengers - 1) {
        setActiveTraveller(activeTraveller + 1);
      }

      return { ...prev, [legId]: legSel };
    });
  };

  const handleContinue = () => {
    if (flightInstances.length - 1 > activeLegIdx) {
      setActiveTraveller(0);
      setActiveLegIdx(activeLegIdx + 1);
      return;
    }
    // Convert to string-keyed record for parent
    const result: Record<string, Record<string, string>> = {};
    for (const [lid, tMap] of Object.entries(selections)) {
      result[lid] = {};
      for (const [tidx, seatNo] of Object.entries(tMap)) {
        result[lid][tidx] = seatNo;
      }
    }
    // console.log(Object.keys(result[Object.keys(result)[0]]).length);

    if (Object?.keys(result)?.[0]?.length && Object?.keys(result[Object?.keys(result)[0]]).length) {
      onContinue(result);
    } else {
      onContinue({})
    }
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Leg tabs */}
      {flightInstances.length > 1 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          {flightInstances.map((leg, i) => (
            <button
              key={leg.flightInstanceId}
              onClick={() => setActiveLegIdx(i)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${activeLegIdx === i
                ? "bg-amber-500 text-white border-amber-500 shadow"
                : "bg-white text-gray-600 border-gray-300 hover:border-amber-400"
                }`}
            >
              {leg.sourceAirportCode} → {leg.destinationAirportCode}
            </button>
          ))}
        </div>
      )}

      {/* Traveller switcher */}
      {totalPassengers > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {Array.from({ length: totalPassengers }).map((_, i) => {
            const hasSeat = !!legSelections[i];
            return (
              <button
                key={i}
                onClick={() => setActiveTraveller(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${activeTraveller === i
                  ? "bg-blue-600 text-white border-blue-600"
                  : hasSeat
                    ? "bg-green-50 text-green-700 border-green-400"
                    : "bg-white text-gray-500 border-gray-300 hover:border-blue-300"
                  }`}
              >
                {hasSeat && activeTraveller !== i && (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                Traveller {i + 1}
                {hasSeat ? ` (${legSelections[i]})` : ""}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex gap-4 max-h-[480px] overflow-y-auto">
        {/* Legend */}
        <div className="lg:w-52 shrink-0 flex flex-col gap-2 pt-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Legend</p>
          {priceTiers.map((tier) => (
            <div key={tier.price} className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded"
                style={{ background: tier.color.bg, border: `1.5px solid ${tier.color.border}` }}
              />
              <span className="text-xs text-gray-600">
                {tier.price === 0 ? "Free" : `₹${tier.price}`}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-1">
            <div className="w-5 h-5 rounded bg-gray-200 border border-gray-300 flex items-center justify-center">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span className="text-xs text-gray-500">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-green-700 border border-green-700 flex justify-center items-center text-white" ><FaCheck size={10} /></div>
            <span className="text-xs text-gray-600">Selected</span>
          </div>
        </div>

        {/* Seat map */}
        <div className="flex-1 overflow-x-auto">
          <div className="inline-block min-w-max">
            {/* Column headers */}
            <div className="flex gap-1.5 mb-2 ml-10">
              {layout.cols.map((col, ci) => (
                <React.Fragment key={col}>
                  <div className="w-9 text-center text-xs font-semibold text-gray-400">{col}</div>
                  {layout.aisleAfter.includes(col) && <div className="w-5" />}
                </React.Fragment>
              ))}
            </div>

            {/* Exit row at top */}
            {layout.exitRows.includes(allRows[0] - 1) || layout.exitRows.includes(allRows[0]) ? (
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-8 text-right">
                  <span className="text-[10px] font-bold text-red-500">EXIT</span>
                </div>
                <div className="flex gap-1.5">
                  {layout.cols.map((col) => (
                    <React.Fragment key={col}>
                      <div className="w-9 h-1 bg-red-400 rounded-full" />
                      {layout.aisleAfter.includes(col) && <div className="w-5" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Rows */}
            {allRows.map((row) => {
              const isExit = layout.exitRows.includes(row);
              return (
                <React.Fragment key={row}>
                  {isExit && row !== allRows[0] && (
                    <div className="flex items-center gap-1.5 my-1.5">
                      <div className="w-8 text-right">
                        <span className="text-[10px] font-bold text-red-500">EXIT</span>
                      </div>
                      <div className="flex gap-1.5">
                        {layout.cols.map((col) => (
                          <React.Fragment key={col}>
                            <div className="w-9 h-0.5 bg-red-400 rounded-full" />
                            {layout.aisleAfter.includes(col) && <div className="w-5" />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-8 text-right text-xs text-gray-400 font-medium">{row}</div>
                    <div className="flex gap-1.5">
                      {layout.cols.map((col) => {
                        const seat = seatMap[row]?.[col];
                        const isSelected = currentTravellerSeat === seat?.seatNo ||
                          Object.values(legSelections).includes(seat?.seatNo ?? "____");
                        return (
                          <React.Fragment key={col}>
                            <SeatCell
                              seat={seat}
                              isSelected={!!seat && isSelected}
                              priceTiers={priceTiers}
                              onClick={() => seat && handleSeatClick(seat)}
                            />
                            {layout.aisleAfter.includes(col) && <div className="w-5" />}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MdAirlineSeatReclineExtra size={20} />
          <span className="font-semibold">({selectedCount}/{totalPassengers})</span>
          {selectedCount > 0 && (
            <span className="text-amber-600 font-medium">
              +₹{Object.values(legSelections).reduce((sum, sno) => {
                const s = seats.find((x) => x.seatNo === sno);
                return sum + (s?.price ?? 0);
              }, 0)} seat charges {legSelections?.[0]}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          {Object.keys(seatSelections).length === 0 && selectedCount === 0 && <button
            onClick={onSkip}
            className="px-5 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>}
          <button
            onClick={handleContinue}
            className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold shadow transition-colors"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
});

export default SeatSelection;
