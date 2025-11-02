import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const TemperatureChart = ({ hourly = [], units }) => {
  if (!Array.isArray(hourly) || hourly.length === 0) return null;

  const data = hourly.map(hour => {
    const dateObj = new Date(hour.time || hour.date || 0);
    const timeLabel = !isNaN(dateObj) ? `${dateObj.getHours()}:00` : 'N/A';
    return {
      time: timeLabel,
      temperature: Math.round(hour.temp || hour.temp_max || hour.temp_min || 0),
      feels_like: Math.round(hour.feels_like || hour.temp || 0),
    };
  });

  const tempUnit = units === 'metric' ? '°C' : '°F';

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl border border-white/10 backdrop-blur-xl bg-gradient-to-br from-slate-900/70 via-slate-800/40 to-slate-900/70">
      {/* Subtle background gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.15),transparent_60%)]" />

      <h3 className="relative z-10 text-2xl font-semibold text-slate-100 mb-6 text-center tracking-wide drop-shadow-lg">
        🌤 24-Hour Temperature Forecast
      </h3>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="tempLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="feelsLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="rgba(255,255,255,0.1)"
            vertical={false}
          />

          <XAxis
            dataKey="time"
            tick={{ fill: 'rgba(226,232,240,0.9)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
          />
          <YAxis
            tick={{ fill: 'rgba(226,232,240,0.9)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
            label={{
              value: `Temp (${tempUnit})`,
              angle: -90,
              position: 'insideLeft',
              fill: 'rgba(226,232,240,0.8)',
              fontSize: 12,
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15,23,42,0.9)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#f1f5f9',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(8px)',
            }}
            labelStyle={{ color: '#38bdf8', fontWeight: 600 }}
            formatter={(value) => `${value}${tempUnit}`}
          />

          <Legend
            wrapperStyle={{
              paddingTop: '10px',
              fontSize: '13px',
              color: '#94a3b8',
            }}
          />

          <Line
            type="monotone"
            dataKey="temperature"
            stroke="url(#tempLine)"
            strokeWidth={3}
            name="Temperature"
            dot={{ r: 0 }}
            activeDot={{
              r: 6,
              fill: '#60a5fa',
              stroke: '#f8fafc',
              strokeWidth: 2,
              filter: 'drop-shadow(0 0 6px #3b82f6)',
            }}
          />
          <Line
            type="monotone"
            dataKey="feels_like"
            stroke="url(#feelsLine)"
            strokeWidth={3}
            name="Feels Like"
            dot={{ r: 0 }}
            activeDot={{
              r: 6,
              fill: '#f87171',
              stroke: '#f8fafc',
              strokeWidth: 2,
              filter: 'drop-shadow(0 0 6px #ef4444)',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
