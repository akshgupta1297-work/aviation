// ─── Flights Schedule Area Chart ─────────────────────────────────────────────
import ReactECharts from "echarts-for-react";
import { DARK2, GOLD, GRAY, WHITE_1 } from "@/utils/colors";
import { domesticFlightss, flightScheduleMonthss, internationalFlightss } from "@/utils/jsonArry";
import { ChevronDown } from "@/utils/utilsAVG";
import { Dropdown } from "@heroui/react";
import { useEffect, useState } from "react";

export function FlightsScheduleChart() {
  const [selectedFilter, setSelectedFilter] = useState('First Quarter');
  const [domesticFlightsCount, setDomesticFlightsCount] = useState(0);
  const [internationalFlightsCount, setInternationalFlightsCount] = useState(0);
  const [flightScheduleMonths, setFlightScheduleMonths] = useState(flightScheduleMonthss);
  const [domesticFlights, setDomesticFlights] = useState(domesticFlightss);
  const [internationalFlights, setInternationalFlights] = useState(internationalFlightss);


  useEffect(() => {
    handleFilterChange(selectedFilter)
  }, [selectedFilter])

  const calculateFlightCounts = (domesticFlights: number[], internationalFlights: number[]) => {
    let domesticCount = 0;
    let internationalCount = 0;
    for (const flight of domesticFlights) {
      domesticCount += flight;
    }
    for (const flight of internationalFlights) {
      internationalCount += flight;
    }
    console.log(domesticCount, internationalCount);

    setDomesticFlightsCount(domesticCount);
    setInternationalFlightsCount(internationalCount);
  }

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    switch (filter) {
      case 'First Quarter': {
        setFlightScheduleMonths(flightScheduleMonthss.slice(0, 3));
        setDomesticFlights(domesticFlightss.slice(0, 3));
        setInternationalFlights(internationalFlightss.slice(0, 3));
        calculateFlightCounts(domesticFlightss.slice(0, 3), internationalFlightss.slice(0, 3));
        break;
      }
      case 'Second Quarter': {
        setFlightScheduleMonths(flightScheduleMonthss.slice(3, 6));
        setDomesticFlights(domesticFlightss.slice(3, 6));
        setInternationalFlights(internationalFlightss.slice(3, 6));
        calculateFlightCounts(domesticFlightss.slice(3, 6), internationalFlightss.slice(3, 6));
        break;
      }
      case 'Third Quarter': {
        setFlightScheduleMonths(flightScheduleMonthss.slice(6, 9));
        setDomesticFlights(domesticFlightss.slice(6, 9));
        setInternationalFlights(internationalFlightss.slice(6, 9));
        calculateFlightCounts(domesticFlightss.slice(6, 9), internationalFlightss.slice(6, 9));
        break;
      }
      case 'Fourth Quarter': {
        setFlightScheduleMonths(flightScheduleMonthss.slice(9, 12));
        setDomesticFlights(domesticFlightss.slice(9, 12));
        setInternationalFlights(internationalFlightss.slice(9, 12));
        calculateFlightCounts(domesticFlightss.slice(9, 12), internationalFlightss.slice(9, 12));
        break;
      }
      case 'This Year': {
        setFlightScheduleMonths(flightScheduleMonthss);
        setDomesticFlights(domesticFlightss);
        setInternationalFlights(internationalFlightss);
        calculateFlightCounts(domesticFlightss, internationalFlightss);
        break;
      }
    }
  }



  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: DARK2,
      borderColor: GOLD,
      borderWidth: 1,
      textStyle: { color: GOLD, fontSize: 12 },
      formatter: (params: any[]) =>
        `<span style="color:${GOLD};font-weight:600">${params[0].name}</span><br/>` +
        params.map((p) => `${p.marker} ${p.seriesName}: <b>${p.value}</b> flights`).join("<br/>"),
    },
    legend: {
      data: ["Domestic", "International"],
      top: 0,
      right: 0,
      itemWidth: 16,
      itemHeight: 3,
      textStyle: { color: GRAY, fontSize: 11 },
    },
    grid: { left: 8, right: 8, top: 28, bottom: 0, containLabel: true },
    xAxis: {
      type: "category",
      data: flightScheduleMonths,
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: GRAY, fontSize: 11 },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 200,
      interval: 50,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#F3F4F6", type: "dashed" } },
      axisLabel: { color: GRAY, fontSize: 11 },
    },
    series: [
      {
        name: "Domestic",
        type: "line",
        data: domesticFlights,
        smooth: true,
        symbol: "x",
        lineStyle: { color: GOLD, width: 2.5 },
        areaStyle: {
          color: {
            type: "linear", x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(201,168,76,0.28)" },
              { offset: 1, color: "rgba(201,168,76,0.01)" },
            ],
          },
        },
      },
      {
        name: "International",
        type: "line",
        data: internationalFlights,
        smooth: true,
        symbol: "o",
        lineStyle: { color: DARK2, width: 2 },
        areaStyle: {
          color: {
            type: "linear", x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(209,213,219,0.45)" },
              { offset: 1, color: "rgba(209,213,219,0.01)" },
            ],
          },
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Flights Schedule
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">{domesticFlightsCount}</span>
            <span className="text-xs text-gray-400">Domestic Flights</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">{internationalFlightsCount}</span>
            <span className="text-xs text-gray-400">International Flights</span>
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
              <Dropdown.Item onClick={() => setSelectedFilter('First Quarter')}>First Quarter</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedFilter('Second Quarter')}>Second Quarter</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedFilter('Third Quarter')}>Third Quarter</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedFilter('Fourth Quarter')}>Fourth Quarter</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedFilter('This Year')}>This Year</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
      <ReactECharts option={option} style={{ height: 200 }} />
    </div>
  );
}