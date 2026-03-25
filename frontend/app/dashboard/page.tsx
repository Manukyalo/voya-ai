import { auth } from "@clerk/nextjs/server";
import { getSupabaseClient } from "@/lib/supabase";
import { Bed, Users, IndianRupee, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

async function getStats() {
  const { getToken } = auth();
  const supabase = await getSupabaseClient(getToken);

  // In a real scenario, these would be queries like:
  // const { data: rooms } = await supabase.from('rooms').select('*', { count: 'exact' });
  // const { data: occupancy } = await supabase.rpc('calculate_occupancy_rate');
  
  // For this initial build, even though we use real Supabase client, 
  // we'll structure the queries but wait for the user's schema.
  // I will implement the actual fetch calls.
  
  const { data: stats, error } = await supabase
    .from('lodge_stats')
    .select('*')
    .single();

  if (error || !stats) {
    // Return empty state or fallback if table doesn't exist yet
    return {
      totalRooms: 0,
       occupancyRate: "0%",
       monthlyRevenue: "0",
       pendingUpsells: 0
    };
  }

  return {
    totalRooms: stats.total_rooms,
    occupancyRate: `${stats.occupancy_rate}%`,
    monthlyRevenue: stats.monthly_revenue.toLocaleString(),
    pendingUpsells: stats.pending_upsells
  };
}

export default async function OverviewPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Rooms", value: stats.totalRooms, icon: Bed, color: "text-earth-forest" },
    { label: "Occupancy Rate", value: stats.occupancyRate, icon: Users, color: "text-earth-amber" },
    { label: "Revenue current month", value: `Ksh ${stats.monthlyRevenue}`, icon: IndianRupee, color: "text-earth-forest" },
    { label: "Pending Upsells", value: stats.pendingUpsells, icon: ShoppingCart, color: "text-earth-amber" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-earth-forest">Lodge Overview</h2>
        <p className="mt-1 text-sm text-earth-muted">Real-time performance at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-earth-muted/20 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-earth-muted">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-serif font-bold text-earth-forest">
                  {card.value}
                </p>
              </div>
              <div className={cn("rounded-xl bg-earth-sand/50 p-3", card.color)}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
            {/* Subtle background texture or asymmetry */}
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-earth-amber/5 blur-2xl" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-earth-muted/20">
            <h3 className="text-xl font-serif font-semibold text-earth-forest mb-4">Daily Operations</h3>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-earth-sand rounded-xl bg-earth-sand/20">
                <p className="text-earth-muted text-sm italic">Operational dashboard widgets will appear here.</p>
            </div>
        </div>
        <div className="rounded-2xl bg-earth-forest p-8 shadow-sm text-earth-sand">
            <h3 className="text-xl font-serif font-semibold text-earth-amber mb-4">Lodge Status</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-earth-muted pb-4">
                    <span className="text-sm opacity-70">Check-ins today</span>
                    <span className="text-lg font-bold">12</span>
                </div>
                <div className="flex justify-between items-center border-b border-earth-muted pb-4">
                    <span className="text-sm opacity-70">Check-outs today</span>
                    <span className="text-lg font-bold">8</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm opacity-70">Maintenance alerts</span>
                    <span className="text-lg font-bold text-earth-amber">2</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
