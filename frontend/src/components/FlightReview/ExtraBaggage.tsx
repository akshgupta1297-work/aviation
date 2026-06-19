"use client";
import React, { useState, useMemo } from "react";
import { PiTrolleySuitcase } from "react-icons/pi";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FlightInstance {
  flightInstanceId: string;
  sourceAirportCode: string;
  destinationAirportCode: string;
}

export interface BaggageOption {
  id: string;
  weight: number; // kg
  price: number;
  label: string;
}

interface ExtraBaggageProps {
  flightInstances: FlightInstance[];
  passengers: number[]; // [adults, children, infants]
  baggageSelections?: Record<string, Record<number, BaggageOption | null>>;
  setBaggageCharges?: (charges: number) => void;
  onContinue: (selections: Record<string, Record<number, BaggageOption | null>>) => void;
  onSkip: () => void;
}

// ─── Baggage options catalogue ────────────────────────────────────────────────
const BAGGAGE_OPTIONS: BaggageOption[] = [
  { id: "5kg", weight: 5, price: 500, label: "5 kg" },
  { id: "10kg", weight: 10, price: 800, label: "10 kg" },
  { id: "15kg", weight: 15, price: 1000, label: "15 kg" },
  { id: "20kg", weight: 20, price: 1400, label: "20 kg" },
];

// ─── Baggage icon SVG ─────────────────────────────────────────────────────────
const BaggageIcon: React.FC<{ selected: boolean }> = ({ selected }) => (
  <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
    <rect x="10" y="16" width="28" height="26" rx="3" fill={selected ? "#fef3c7" : "#f3f4f6"} stroke={selected ? "#f59e0b" : "#d1d5db"} strokeWidth="2" />
    <rect x="18" y="10" width="12" height="8" rx="2" fill={selected ? "#fde68a" : "#e5e7eb"} stroke={selected ? "#f59e0b" : "#d1d5db"} strokeWidth="2" />
    <line x1="24" y1="22" x2="24" y2="36" stroke={selected ? "#f59e0b" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="29" x2="32" y2="29" stroke={selected ? "#f59e0b" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" />
    <circle cx="13" cy="42" r="2" fill={selected ? "#f59e0b" : "#9ca3af"} />
    <circle cx="35" cy="42" r="2" fill={selected ? "#f59e0b" : "#9ca3af"} />
  </svg>
);

// ─── Included baggage info ────────────────────────────────────────────────────
const IncludedBaggage: React.FC = () => (
  <div className="flex gap-4 p-4 rounded-xl bg-green-50 border border-green-200 mb-5">
    <svg className="w-8 h-8 text-green-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div>
      <p className="text-sm font-semibold text-green-800">Included Baggage (Free)</p>
      <div className="flex gap-4 mt-1">
        <div className="text-xs text-green-700">
          <span className="font-bold">7 kg</span> Cabin Baggage
        </div>
        <div className="text-xs text-green-700">
          <span className="font-bold">15 kg</span> Check-in Baggage
        </div>
      </div>
    </div>
  </div>
);

// ─── Option card ──────────────────────────────────────────────────────────────
const BaggageOptionCard: React.FC<{
  option: BaggageOption;
  isSelected: boolean;
  onToggle: () => void;
}> = ({ option, isSelected, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer group hover:shadow-md ${isSelected
      ? "border-amber-400 bg-amber-50 shadow-md"
      : "border-gray-200 bg-white hover:border-amber-200"
      }`}
  >
    {isSelected && (
      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    )}
    <BaggageIcon selected={isSelected} />
    <div className="text-center">
      <p className={`text-base font-bold ${isSelected ? "text-amber-700" : "text-gray-800"}`}>
        +{option.label}
      </p>
      <p className={`text-sm font-semibold ${isSelected ? "text-amber-600" : "text-gray-500"}`}>
        ₹{option.price}
      </p>
    </div>
    <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isSelected ? "bg-amber-200 text-amber-800" : "bg-gray-100 text-gray-500"
      }`}>
      {option.weight + 15} kg total
    </div>
  </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ExtraBaggage: React.FC<ExtraBaggageProps> = ({
  flightInstances,
  passengers,
  baggageSelections,
  setBaggageCharges,
  onContinue,
  onSkip,
}) => {
  const [activeLegIdx, setActiveLegIdx] = useState(0);
  const [activeTraveller, setActiveTraveller] = useState(0);
  // selections[legId][travellerIdx] = BaggageOption | null
  const [selections, setSelections] = useState<Record<string, Record<number, BaggageOption | null>>>(baggageSelections ?? {});

  React.useEffect(() => {
    if (setBaggageCharges) {
      let total = 0;
      for (const tMap of Object.values(selections)) {
        for (const choice of Object.values(tMap)) {
          if (choice) total += choice.price;
        }
      }
      setBaggageCharges(total);
    }
  }, [selections, setBaggageCharges]);

  const [adults, children] = passengers;
  const totalPassengers = adults + children;

  const activeLeg = flightInstances[activeLegIdx];
  const legId = activeLeg?.flightInstanceId ?? "";
  const legSelections = selections[legId] ?? { 0: 0 };
  const selectedCount = Object.keys(legSelections) ?? {};
  const currentChoice = legSelections[activeTraveller] ?? null;
  console.log(selectedCount, "  const selectedCount = Object.keys(legSelections).length;");

  const totalExtraCost = useMemo(() => {
    let total = 0;
    for (const legSel of Object.values(selections)) {
      for (const choice of Object.values(legSel)) {
        if (choice) total += choice.price;
      }
    }
    return total;
  }, [selections]);

  const handleToggle = (option: BaggageOption) => {
    setSelections((prev) => {
      const legSel = { ...(prev[legId] ?? {}) };
      // Toggle: deselect if already selected
      if (legSel[activeTraveller]?.id === option.id) {
        delete legSel[activeTraveller];
      } else {
        legSel[activeTraveller] = option;
        if (activeTraveller < totalPassengers - 1) {
          setActiveTraveller(activeTraveller + 1);
        }
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
    onContinue(selections);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Leg tabs */}
      {flightInstances.length > 1 && (
        <div className="flex gap-2 flex-wrap">
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

      <IncludedBaggage />

      <p className="text-sm font-semibold text-gray-700">Add Extra Check-in Baggage</p>

      {/* Traveller tabs */}
      {totalPassengers > 1 && (
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: totalPassengers }).map((_, i) => {
            const choice = legSelections[i];
            return (
              <button
                key={i}
                onClick={() => setActiveTraveller(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${activeTraveller === i
                  ? "bg-blue-600 text-white border-blue-600"
                  : choice
                    ? "bg-green-50 text-green-700 border-green-400"
                    : "bg-white text-gray-500 border-gray-300 hover:border-blue-300"
                  }`}
              >
                {choice && activeTraveller !== i && (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                Traveller {i + 1}
                {choice ? ` (+${choice.label})` : ""}
              </button>
            );
          })}
        </div>
      )}

      {/* Baggage options grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BAGGAGE_OPTIONS.map((option) => (
          <BaggageOptionCard
            key={option.id}
            option={option}
            isSelected={currentChoice?.id === option.id}
            onToggle={() => handleToggle(option)}
          />
        ))}
      </div>

      {/* Note */}
      <p className="text-xs text-gray-400 mt-1">
        * Extra baggage price is per traveller per leg. Included 15 kg check-in baggage applies on all legs.
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm flex items-center gap-1 text-gray-600">
          <PiTrolleySuitcase size={20} />
          <span className="font-semibold">({selectedCount.length}/{totalPassengers})</span>
          {totalExtraCost > 0 ? (
            <span>
              Extra baggage:{" "}
              <span className="font-bold text-amber-600">+₹{totalExtraCost}</span>
            </span>
          ) : (
            <span className="text-gray-400">No extra baggage selected</span>
          )}
        </div>
        <div className="flex gap-3">
          {Object.keys(baggageSelections || {}).length === 0 && totalExtraCost === 0 && <button
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
};

export default ExtraBaggage;
