"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

const data = [
  { month: "Jan", revenue: 420000 },
  { month: "Feb", revenue: 380000 },
  { month: "Mar", revenue: 510000 },
  { month: "Apr", revenue: 490000 },
  { month: "May", revenue: 620000 },
  { month: "Jun", revenue: 750000 },
];

const roomData = [
  { name: "Luxury Suite", value: 450000, color: "#2D3A2D" },
  { name: "Deluxe Tent", value: 320000, color: "#D4A373" },
  { name: "Standard Room", value: 180000, color: "#4A5D4A" },
  { name: "Family Villa", value: 250000, color: "#D4A373CC" },
];

export default function RevenuePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-serif font-bold text-earth-forest">Revenue Intelligence</h2>
        <p className="mt-1 text-sm text-earth-muted">Deep dive into your lodge's financial health.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-earth-muted/20">
          <h3 className="text-xl font-serif font-semibold text-earth-forest mb-6">Revenue Trends (Last 6 Months)</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D3A2D" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2D3A2D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FAF9F6" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#4A5D4A", fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#4A5D4A", fontSize: 12 }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1A1C1E", 
                    border: "none", 
                    borderRadius: "12px",
                    color: "#FAF9F6"
                  }}
                  itemStyle={{ color: "#D4A373" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2D3A2D" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-earth-muted/20">
          <h3 className="text-xl font-serif font-semibold text-earth-forest mb-6">By Room Type</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "#2D3A2D", fontSize: 12, fontWeight: 500 }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: "transparent" }}
                  contentStyle={{ 
                    backgroundColor: "#1A1C1E", 
                    border: "none", 
                    borderRadius: "12px",
                    color: "#FAF9F6"
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {roomData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {roomData.map((room) => (
                <div key={room.name} className="flex justify-between items-center text-sm">
                    <span className="text-earth-muted">{room.name}</span>
                    <span className="font-semibold">Ksh {room.value.toLocaleString()}</span>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
