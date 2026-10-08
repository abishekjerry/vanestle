import React, { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, } from "recharts";

const PPieChart = ({ data = [], onSliceClick }) => {
  const consolidatedData = useMemo(() => {
    const map = new Map();
    data.forEach((item) => {
      const existing = map.get(item.name);
      if (existing) {
        existing.value += item.value;
      } else {
        map.set(item.name, { ...item });
      }
    });

    return Array.from(map.values());
  }, [data]);

  const handleSliceClick = (data) => {
    if (!data || !data.payload) return;

    if (onSliceClick) {
      onSliceClick({ ...data.payload });
    }
  };

  const colorMap = [
    "#555AE8", "#22c55e", "#FAB01B", "#DF493F", "#49C9E9", "#944EEF", "#60a5fa", "#f87171", "#22d3ee", "#c084fc", "#fb923c",
    "#4ade80", "#f97316", "#EB982A", "#10b981", "#3b82f6", "#8b5cf6", "#14b8a6", "#f472b6", "#fcd34d", "#f43f5e",
  ];

  const total = consolidatedData.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercent = consolidatedData.map((item) => ({
    ...item,
    percent: total > 0 ? Number(item.value || 0) / total : 0,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, percent } = payload[0].payload;

      return (
        <div
          style={{
            background: "#fff",
            padding: "6px 10px",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontSize: "12px",
            color: "#111827",
          }}
        >
          {`${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
        </div>
      );
    }

    return null;
  };
  return (
    <div
      style={{
        width: "100%",
        height: 600,
        background: "#ffffff",
        padding: "5px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%" >
        <PieChart>
          <Pie
            data={dataWithPercent}
            dataKey="value"
            nameKey="name"
            innerRadius={100}
            outerRadius={120}
            paddingAngle={5}
            cornerRadius={4}
            cx="50%"
            cy="60%"
            startAngle={80}
            endAngle={450}
            labelLine={true}
            onClick={handleSliceClick}
          >
            {dataWithPercent.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={colorMap[index % colorMap.length]}
              />
            ))}
          </Pie>

          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" pointerEvents="none">
            <tspan x="50%" dy="-8" fontSize={String(total).length > 3 ? 22 : 28} fontWeight="bold" fill="#171717">
              {total}
            </tspan>

            <tspan x="50%" dy="24" fontSize="14" fill="#171717">
              Total
            </tspan>
          </text>

          <Tooltip content={<CustomTooltip />} />

          <Legend verticalAlign="bottom" align="left" iconType="circle" iconSize={8}
            wrapperStyle={{
              paddingTop: "5px",
              fontSize: "14px",
              paddingLeft: "10px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
export default PPieChart;