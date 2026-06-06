// ─── Popular Airlines Donut Chart ────────────────────────────────────────────
import ReactECharts from "echarts-for-react";
import GraphPlan from "../../../assets/images/GraphPlan.png";
import { airlineData } from "@/utils/jsonArry";
import Image from "next/image";
import { AIRLINE_COLORS, DARK2, GOLD, WHITE_1 } from "@/utils/colors";
import { DotsMenu } from "@/utils/utilsAVG";

export function PopularAirlinesChart() {
    const option = {
        backgroundColor: "transparent",
        tooltip: {
            trigger: "item",
            backgroundColor: DARK2,
            borderColor: GOLD,
            borderWidth: 1,
            textStyle: { color: WHITE_1, fontSize: 12 },
            formatter: "{b}: <b>{c}%</b>",
        },
        series: [
            {
                type: "pie",
                radius: ["55%", "82%"],
                center: ["50%", "50%"],
                avoidLabelOverlap: false,
                label: { show: false },
                labelLine: { show: false },
                data: airlineData.map((d, i) => ({
                    ...d,
                    itemStyle: {
                        color: AIRLINE_COLORS[i],
                        borderWidth: 2,
                        borderColor: "#fff",
                    },
                })),
                emphasis: {
                    scale: true,
                    scaleSize: 5,
                    itemStyle: { shadowBlur: 10, shadowColor: "rgba(201,168,76,0.35)" },
                },
            },
        ],
    };

    const dotClasses = [
        "bg-amber-200",
        "bg-green-300",
        "bg-green-200",
        "bg-gray-700",
        "bg-gray-400",
    ];

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Popular Airlines
                </p>
                <DotsMenu />
            </div>

            <div className="flex items-center gap-5">
                {/* Donut */}
                <div className="relative shrink-0 w-36 h-36">
                    <ReactECharts option={option} style={{ height: 144, width: 144 }} />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Image src={GraphPlan} alt="GraphPlan" width={50} />
                    </div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-3">
                    {airlineData.map((d, i) => (
                        <div key={d.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 bg ${dotClasses[i]}`} />
                                <span className="text-xs text-gray-600 truncate">{d.name}</span>
                            </div>
                            <span className="text-xs font-bold text-gray-900 ml-2 shrink-0">{d.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}