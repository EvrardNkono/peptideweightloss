// src/components/WeightChart.jsx
import React from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const WeightChart = ({ data }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">📉 Weight Evolution</h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="date" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderColor: '#2563EB',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#2563EB"
            strokeWidth={3}
            fill="url(#weightGradient)"
            name="Weight (kg)"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="#F59E0B"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Target"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChart;