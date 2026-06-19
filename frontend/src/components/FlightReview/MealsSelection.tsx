"use client";
import { sendToster } from "@/utils/functions";
import React, { useState, useMemo } from "react";
import { SiMealie } from "react-icons/si";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FlightInstance {
  flightInstanceId: string;
  sourceAirportCode: string;
  destinationAirportCode: string;
}

export interface MealItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  category: "MEAL" | "SNACK" | "BEVERAGE";
}

interface MealsSelectionProps {
  flightInstances: FlightInstance[];
  passengers: number[]; // [adults, children, infants]
  mealSelections?: Record<string, Record<string, MealItem[]>>;
  setMealCharges?: (charges: number) => void;
  onContinue: (selections: Record<string, Record<string, MealItem[]>>) => void;
  onSkip: () => void;
}

// ─── Static meal catalogue (matches reference image) ─────────────────────────
const MEAL_CATALOGUE: MealItem[] = [
  {
    id: "regional-veg",
    name: "Regional Favourite (Veg) + Beverage",
    description: "Chef's special regional recipe with a choice of beverage",
    price: 400,
    isVeg: true,
    category: "MEAL",
  },
  {
    id: "my-veg-day",
    name: "Eats Choice of the Day (Veg) + Beverage",
    description: "Our daily changing veg menu with freshly brewed beverage",
    price: 400,
    isVeg: true,
    category: "MEAL",
  },
  {
    id: "my-nonveg-day",
    name: "Eats Choice of the Day (Non-Veg) + Beverage",
    description: "Daily non-veg special with freshly brewed beverage",
    price: 500,
    isVeg: false,
    category: "MEAL",
  },
  {
    id: "chicken-junglee",
    name: "Chicken Junglee Sandwich + Beverage",
    description: "Spicy chicken sandwich with a choice of beverage",
    price: 500,
    isVeg: false,
    category: "SNACK",
  },
  {
    id: "diabetic-veg",
    name: "Diabetic Veg Special",
    description: "Low-glycaemic vegetarian meal designed for diabetic passengers",
    price: 400,
    isVeg: true,
    category: "MEAL",
  },
  {
    id: "fruit-cake",
    name: "Fruit Cake Slice + Beverage of Choice",
    description: "Moist fruit cake with a complimentary beverage",
    price: 200,
    isVeg: true,
    category: "SNACK",
  },
  {
    id: "veg-wrap",
    name: "Paneer Tikka Wrap + Beverage",
    description: "Grilled paneer tikka in a soft tortilla wrap",
    price: 350,
    isVeg: true,
    category: "SNACK",
  },
  {
    id: "egg-wrap",
    name: "Egg Wrap + Beverage",
    description: "Fluffy egg and cheese wrap with a beverage",
    price: 400,
    isVeg: false,
    category: "SNACK",
  },
];

// ─── Veg / Non-veg icon ───────────────────────────────────────────────────────
const VegIcon: React.FC<{ isVeg: boolean }> = ({ isVeg }) => (
  <div
    className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0"
    style={{ borderColor: isVeg ? "#16a34a" : "#dc2626" }}
  >
    <div
      className="w-2 h-2 rounded-full"
      style={{ background: isVeg ? "#16a34a" : "#dc2626" }}
    />
  </div>
);

// ─── Meal icon (SVG illustration) ─────────────────────────────────────────────
const MealIcon: React.FC<{ isVeg: boolean }> = ({ isVeg }) => {
  if (isVeg) {
    return (
      <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
        <circle cx="40" cy="40" r="38" fill="#EEF2FF" />
        <path
          d="M40 15 C40 15, 20 30, 20 45 C20 57 29 65 40 65 C51 65 60 57 60 45 C60 30 40 15 40 15Z"
          fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5"
        />
        <path d="M40 18 L40 62" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M28 35 Q40 28 52 35" stroke="#93C5FD" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M25 48 Q40 40 55 48" stroke="#93C5FD" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
      <circle cx="40" cy="40" r="38" fill="#EEF2FF" />
      <ellipse cx="38" cy="38" rx="14" ry="10" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
      <line x1="52" y1="30" x2="65" y2="18" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
      <circle cx="65" cy="16" r="4" fill="#BFDBFE" stroke="#93C5FD" strokeWidth="1.5" />
    </svg>
  );
};

// ─── Meal card ────────────────────────────────────────────────────────────────
const MealCard: React.FC<{
  meal: MealItem;
  count: number;
  onAdd: () => void;
  onRemove: () => void;
}> = ({ meal, count, onAdd, onRemove }) => (
  <div className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all duration-150">
    {/* Info */}
    <div className="flex-1 flex flex-col gap-1 min-w-0">
      <div className="flex items-start gap-1.5">
        <VegIcon isVeg={meal.isVeg} />
        <p className="text-sm font-semibold text-gray-800 leading-snug">{meal.name}</p>
      </div>
      <p className="text-xs text-gray-500 leading-snug">{meal.description}</p>
      <p className="text-sm font-bold text-gray-800 mt-0.5">₹{meal.price}</p>
    </div>

    {/* Image + add button */}
    <div className="flex flex-col items-center gap-2 w-20 shrink-0">
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-blue-50">
        <MealIcon isVeg={meal.isVeg} />
      </div>
      {count === 0 ? (
        <button
          onClick={onAdd}
          className="flex items-center gap-1 px-3 py-1 rounded-lg border border-blue-400 text-blue-600 text-xs font-semibold hover:bg-blue-50 transition-colors"
        >
          Add <span className="text-base leading-none">+</span>
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={onRemove}
            className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-base leading-none flex items-center justify-center hover:bg-amber-200 transition-colors"
          >
            −
          </button>
          <span className="text-sm font-bold text-gray-800 min-w-[1ch] text-center">{count}</span>
          <button
            onClick={onAdd}
            className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-base leading-none flex items-center justify-center hover:bg-amber-600 transition-colors"
          >
            +
          </button>
        </div>
      )}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
type FilterType = "ALL" | "VEG" | "NONVEG";

const MealsSelection: React.FC<MealsSelectionProps> = ({
  flightInstances,
  passengers,
  mealSelections,
  setMealCharges,
  onContinue,
  onSkip,
}) => {
  const [activeLegIdx, setActiveLegIdx] = useState(0);
  const [filter, setFilter] = useState<FilterType>("ALL");
  // selections[legId][mealId] = quantity
  const [selections, setSelections] = useState<Record<string, Record<string, number>>>(() => {
    const init: Record<string, Record<string, number>> = {};
    if (mealSelections) {
      for (const [lid, mMap] of Object.entries(mealSelections)) {
        init[lid] = {};
        for (const [mealId, meals] of Object.entries(mMap)) {
          init[lid][mealId] = meals.length;
        }
      }
    }
    return init;
  });

  React.useEffect(() => {
    if (setMealCharges) {
      let total = 0;
      for (const mMap of Object.values(selections)) {
        for (const [mealId, qty] of Object.entries(mMap)) {
          const meal = MEAL_CATALOGUE.find((m) => m.id === mealId);
          if (meal) total += meal.price * qty;
        }
      }
      setMealCharges(total);
    }
  }, [selections, setMealCharges]);

  const [adults, children] = passengers;
  const totalPassengers = adults + children;

  const activeLeg = flightInstances[activeLegIdx];
  const legId = activeLeg?.flightInstanceId ?? "";

  const legSelections = selections[legId] ?? {};

  const filteredMeals = useMemo(() => {
    if (filter === "VEG") return MEAL_CATALOGUE.filter((m) => m.isVeg);
    if (filter === "NONVEG") return MEAL_CATALOGUE.filter((m) => !m.isVeg);
    return MEAL_CATALOGUE;
  }, [filter]);

  const totalMealCost = useMemo(() => {
    return Object.entries(legSelections).reduce((sum, [mealId, qty]) => {
      const meal = MEAL_CATALOGUE.find((m) => m.id === mealId);
      return sum + (meal?.price ?? 0) * qty;
    }, 0);
  }, [legSelections]);

  const totalItems = useMemo(
    () => Object.values(legSelections).reduce((s, q) => s + q, 0),
    [legSelections]
  );

  const handleAdd = (mealId: string) => {
    setSelections((prev) => {
      const totalPassengers = passengers.reduce((a, b) => a + b, 0);
      if (Object.keys(prev[legId] ?? {}).length === totalPassengers) {
        // sendToster({ type: "error", message: `You can only add ${totalPassengers} meals for this flight` })
        return prev;
      }
      const legSel = { ...(prev[legId] ?? {}) };
      legSel[mealId] = (legSel[mealId] ?? 0) + 1;
      return { ...prev, [legId]: legSel };
    });
  };

  const handleRemove = (mealId: string) => {
    setSelections((prev) => {
      const legSel = { ...(prev[legId] ?? {}) };
      if ((legSel[mealId] ?? 0) <= 1) {
        delete legSel[mealId];
      } else {
        legSel[mealId] = legSel[mealId] - 1;
      }
      return { ...prev, [legId]: legSel };
    });
  };

  const handleContinue = () => {
    if (flightInstances.length - 1 > activeLegIdx) {
      setActiveLegIdx(activeLegIdx + 1);
      return;
    }
    // Convert to MealItem arrays per leg
    const result: Record<string, Record<string, MealItem[]>> = {};
    for (const [lid, mMap] of Object.entries(selections)) {
      result[lid] = {};
      for (const [mealId, qty] of Object.entries(mMap)) {
        const meal = MEAL_CATALOGUE.find((m) => m.id === mealId)!;
        result[lid][mealId] = Array(qty).fill(meal);
      }
    }
    onContinue(result);
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

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["ALL", "VEG", "NONVEG"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${filter === f
              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
              : "bg-white text-gray-600 border-gray-300 hover:border-blue-300"
              }`}
          >
            {f === "VEG" && (
              <span className="w-3 h-3 rounded border-2 border-green-500 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              </span>
            )}
            {f === "NONVEG" && (
              <span className="w-3 h-3 rounded border-2 border-red-500 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              </span>
            )}
            {f === "ALL" ? "All" : f === "VEG" ? "Veg" : "Non-veg"}
          </button>
        ))}
      </div>

      {/* Meal grid - 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
        {filteredMeals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            count={legSelections[meal.id] ?? 0}
            onAdd={() => handleAdd(meal.id)}
            onRemove={() => handleRemove(meal.id)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex gap-1 items-center text-sm text-gray-600">
          <SiMealie size={15} />
          <span className="font-semibold">({totalItems}/{totalPassengers})</span>
          {totalItems > 0 ? (
            <span>
              <span className="font-bold text-gray-800">{totalItems} item{totalItems !== 1 ? "s" : ""}</span> selected ·{" "}
              <span className="text-amber-600 font-semibold">+₹{totalMealCost}</span>
            </span>
          ) : (
            <span className="text-gray-400">No meals selected</span>
          )}
        </div>
        <div className="flex gap-3">
          {Object.keys(mealSelections || {}).length === 0 && totalItems === 0 && <button
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

export default MealsSelection;
