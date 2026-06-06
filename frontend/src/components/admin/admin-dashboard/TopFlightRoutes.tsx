// ─── Top Flight Routes ────────────────────────────────────────────────────────

import { routeData } from "@/utils/jsonArry";
import { DotsMenu } from "@/utils/utilsAVG";

export function TopFlightRoutesChart() {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Top Flight Routes
                </p>
                <DotsMenu />
            </div>

            <div className="space-y-4">
                {routeData.map((r, i) => (
                    <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-gray-700 truncate pr-3 font-medium">{r.route}</span>
                            <span className="text-xs text-gray-400 shrink-0">{r.km}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-amber-500 transition-all duration-700"
                                    style={{ width: `${r.pct}%` }}
                                />
                            </div>
                            <span className="text-xs font-semibold text-gray-700 w-20 text-right shrink-0">
                                {r.passengers.toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}