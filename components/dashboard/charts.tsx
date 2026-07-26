"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCompact } from "@/lib/utils";

const AXIS = { stroke: "#6b7385", fontSize: 11 };
const GRID = "#1c2130";

const tooltipStyle = {
  backgroundColor: "#0e111c",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  fontSize: "12px",
  color: "#c7ccd8",
} as const;

function shortDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Single-metric area chart — the main "how are we trending" view. */
export function TrendChart({
  data,
  label = "Streams",
}: {
  data: Array<{ date: string; value: number }>;
  label?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={shortDate}
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          minTickGap={28}
        />
        <YAxis
          tickFormatter={(v: number) => formatCompact(v)}
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          width={52}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(v: string) => shortDate(v)}
          formatter={(v: number) => [formatCompact(v), label]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#a78bfa"
          strokeWidth={2}
          fill="url(#trendFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Multi-series line chart — one line per platform, brand-coloured. */
export function PlatformComparisonChart({
  data,
  series,
}: {
  data: Array<Record<string, string | number>>;
  series: Array<{ key: string; name: string; color: string }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={shortDate}
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          minTickGap={28}
        />
        <YAxis
          tickFormatter={(v: number) => formatCompact(v)}
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          width={52}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(v: string) => shortDate(v)}
          formatter={(v: number) => formatCompact(v)}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
          iconType="circle"
          iconSize={8}
        />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/** Horizontal bar chart — used for top countries. */
export function GeoChart({
  data,
}: {
  data: Array<{ countryName: string; value: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
      >
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(v: number) => formatCompact(v)}
          tick={AXIS}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="countryName"
          tick={AXIS}
          tickLine={false}
          axisLine={false}
          width={112}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
          formatter={(v: number) => [formatCompact(v), "Listeners"]}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#7c3aed" barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Donut — revenue split by platform. */
export function RevenueDonut({
  data,
}: {
  data: Array<{ name: string; value: number; color: string }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={64}
          outerRadius={104}
          paddingAngle={2}
          stroke="none"
        >
          {data.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
        />
        <Legend
          wrapperStyle={{ fontSize: 12 }}
          iconType="circle"
          iconSize={8}
          verticalAlign="bottom"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
