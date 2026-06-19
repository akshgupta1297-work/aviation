// ─── Ticket Sales Bar Chart ───────────────────────────────────────────────────
import ReactECharts from "echarts-for-react";
import { DARK2, GOLD, GOLD_LIGHT, GRAY, WHITE_1 } from "@/utils/colors";
import { ticketSalesDataa, ticketSalesDayss } from "@/utils/jsonArry";
import { ChevronDown } from "@/utils/utilsAVG";
import { Dropdown } from "@heroui/react";
import { useEffect, useState } from "react";

export function TicketSalesChart() {
  const [ticketSalesData, setTicketSalesData] = useState(ticketSalesDataa);
  const [ticketSalesDays, setTicketSalesDays] = useState(ticketSalesDayss);
  const [selectedFilter, setSelectedFilter] = useState('This Week');
  const [ticketSold, setTicketSold] = useState(12500);

  useEffect(() => {
    handleFilter(selectedFilter)
  }, [selectedFilter])

  const handleFilter = (type: string) => {
    const newDate = new Date();
    const day = newDate.getDay();

    console.log(day);
    switch (type) {
      case 'This Week':
        setTicketSalesData(ticketSalesDataa.slice(0, day));
        setTicketSalesDays(ticketSalesDayss.slice(0, day));
        calculateTicketSales(ticketSalesDataa.slice(0, day));
        break;
      case 'Last Weeks':
        setTicketSalesData(ticketSalesDataa.slice(7, 14));
        setTicketSalesDays(ticketSalesDayss.slice(7, 14));
        calculateTicketSales(ticketSalesDataa.slice(7, 14));
        break;
      case 'This Month':
        setTicketSalesData(ticketSalesDataa);
        setTicketSalesDays(ticketSalesDayss);
        calculateTicketSales(ticketSalesDataa);
        break;
    }
  }

  const calculateTicketSales = (data: number[]) => {
    console.log(ticketSalesData, data.reduce((sum, num) => sum + num, 0));

    setTicketSold(data.reduce((sum, num) => sum + num, 0));
  }
  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "none" },
      backgroundColor: DARK2,
      borderColor: GOLD,
      borderWidth: 1,
      textStyle: { color: WHITE_1, fontSize: 12 },
      formatter: (params: any[]) => {
        const p = params[0];
        return `<span style="color:${GOLD};font-weight:600">${p.name}</span><br/>${p.value.toLocaleString()} tickets`;
      },
    },
    grid: { left: 8, right: 8, top: 12, bottom: 0, containLabel: true },
    xAxis: {
      type: "category",
      data: ticketSalesDays,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: GRAY, fontSize: 11 },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 4000,
      interval: 1000,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#F3F4F6", type: "dashed" } },
      axisLabel: {
        color: GRAY,
        fontSize: 11,
        formatter: (v: number) => `${v / 1000}k`,
      },
    },
    series: [
      {
        type: "bar",
        data: ticketSalesData.map((v, i) => ({
          value: v,
          itemStyle: {
            color: i === 4 ? GOLD : DARK2,
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barWidth: "50%",
        emphasis: { itemStyle: { color: GOLD_LIGHT } },
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Ticket Sales
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{ticketSold}</span>
            <span className="text-xs text-gray-400">Tickets Sold</span>
          </div>
        </div>
        <Dropdown>
          <Dropdown.Trigger>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 hover:bg-amber-100 transition-colors">
              📅 {selectedFilter} <ChevronDown />
            </div>
          </Dropdown.Trigger>
          <Dropdown.Popover>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSelectedFilter('This Week')}>This Week</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedFilter('Last Weeks')}>Last Weeks</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedFilter('This Month')}>This Month</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
      <ReactECharts option={option} style={{ height: 200 }} />
    </div>
  );
}