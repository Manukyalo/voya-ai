"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TrendingUp, Calendar, ShoppingBag, Settings } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Revenue", href: "/dashboard/revenue", icon: TrendingUp },
  { name: "Occupancy", href: "/dashboard/occupancy", icon: Calendar },
  { name: "Upsells", href: "/dashboard/upsells", icon: ShoppingBag },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const lodgeName = user?.publicMetadata?.lodge_name as string || "Voya AI Lodge";

  return (
    <div className="flex h-full w-64 flex-col bg-earth-forest text-earth-sand">
      <div className="flex h-20 items-center px-6">
        <h1 className="text-2xl font-serif font-bold tracking-tight text-earth-amber">
          {lodgeName}
        </h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-earth-muted text-earth-sand" 
                  : "text-earth-sand/70 hover:bg-earth-muted/50 hover:text-earth-sand"
              )}
            >
              <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-earth-amber" : "text-earth-sand/50")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-earth-muted p-4">
        <div className="flex items-center gap-3 px-2">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col">
            <span className="text-xs font-medium">{user?.fullName || "Manager"}</span>
            <span className="text-[10px] text-earth-sand/50 capitalize">{user?.publicMetadata?.role as string || "Admin"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
