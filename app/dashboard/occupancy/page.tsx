"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

const forecastData = [
  { date: "Mar 25", booked: 18, available: 2 },
  { date: "Mar 26", booked: 15, available: 5 },
  { date: "Mar 27", booked: 19, available: 1 },
  { date: "Mar 28", booked: 20, available: 0 },
  { date: "Mar 29", booked: 14, available: 6 },
  { date: "Mar 30", booked: 12, available: 8 },
  { date: "Mar 31", booked: 16, available: 4 },
];

export default function OccupancyPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold text-earth-forest">Occupancy Forecast</h2>
          <p className="mt-1 text-sm text-earth-muted">Predictive availability for the coming week.</p>
        </div>
        <div className="flex gap-2">
            <span className="inline-flex items-center rounded-full bg-earth-forest px-3 py-1 text-xs font-medium text-earth-sand">
                High Demand Season
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Availability Trend */}
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-earth-muted/20">
          <h3 className="text-xl font-serif font-semibold text-earth-forest mb-6">Upcoming Occupancy</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData} stackOffset="expand">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FAF9F6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#4A5D4A", fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#4A5D4A", fontSize: 12 }}
                  tickFormatter={(value) => `${Math.round(value * 100)}%`}
                />
                <Tooltip 
                  cursor={{ fill: "#FAF9F6" }}
                  contentStyle={{ 
                    backgroundColor: "#1A1C1E", 
                    border: "none", 
                    borderRadius: "12px",
                    color: "#FAF9F6"
                  }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="booked" stackId="a" fill="#2D3A2D" radius={[0, 0, 0, 0]} name="Booked Rooms" />
                <Bar dataKey="available" stackId="a" fill="#D4A373" radius={[4, 4, 0, 0]} name="Available Rooms" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calendar Grid View (Simplified Visual) */}
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-earth-muted/20">
            <h3 className="text-xl font-serif font-semibold text-earth-forest mb-6">Quick Status Grid</h3>
            <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: 14 }).map((_, i) => {
                    const isBooked = Math.random() > 0.3;
                    return (
                        <div 
                            key={i} 
                            className={`aspect-square rounded-xl p-3 flex flex-col justify-between transition-all hover:scale-105 cursor-pointer ${
                                isBooked ? 'bg-earth-forest text-earth-sand' : 'bg-earth-sand text-earth-forest border border-earth-muted/20'
                            }`}
                        >
                            <span className="text-xs opacity-60">Room {101 + i}</span>
                            <span className="text-sm font-bold">{isBooked ? 'Occupied' : 'Free'}</span>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
}
