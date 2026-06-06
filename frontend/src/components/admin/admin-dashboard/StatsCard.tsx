// ─── Stat Cards ───────────────────────────────────────────────────────────────

import { stats } from "@/utils/jsonArry";
import Image from "next/image";

export function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-gray-400 mb-1 leading-none">{s.label}</p>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
              {s.value}
            </p>
            <span className={`text-xs font-semibold ${s.up ? "text-emerald-500" : "text-red-400"}`}>
              {s.change}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 text-base font-bold shrink-0">
            {/* {s.icon} */}
            <Image src={s.icon} alt="Icons" />
          </div>
        </div>
      ))}
    </div>
  );
}