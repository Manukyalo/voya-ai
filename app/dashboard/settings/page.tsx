"use client";

import { useUser } from "@clerk/nextjs";
import { Save, Building2, User, Mail, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-serif font-bold text-earth-forest">Lodge Settings</h2>
        <p className="mt-1 text-sm text-earth-muted">Manage your property details and account preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Lodge Profile */}
        <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-earth-muted/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-earth-amber/10 text-earth-amber">
                <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-earth-forest">Lodge Profile</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-earth-muted">Lodge Name</label>
              <input 
                type="text" 
                defaultValue={user?.publicMetadata?.lodge_name as string || "Voya AI Lodge"}
                className="w-full rounded-xl border-earth-sand bg-earth-sand/20 px-4 py-3 text-sm focus:ring-earth-amber outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-earth-muted">Location</label>
              <input 
                type="text" 
                placeholder="Maasai Mara, Kenya"
                className="w-full rounded-xl border-earth-sand bg-earth-sand/20 px-4 py-3 text-sm focus:ring-earth-amber outline-none transition-all"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-earth-muted">Description</label>
              <textarea 
                rows={3}
                placeholder="Brief description of the luxury experience..."
                className="w-full rounded-xl border-earth-sand bg-earth-sand/20 px-4 py-3 text-sm focus:ring-earth-amber outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Manager Account */}
        <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-earth-muted/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-earth-forest/10 text-earth-forest">
                <User className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-earth-forest">Manager Account</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-earth-muted">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-4 w-4 text-earth-muted" />
                <input 
                  type="text" 
                  defaultValue={user?.fullName || ""}
                  className="w-full rounded-xl border-earth-sand bg-earth-sand/20 pl-11 pr-4 py-3 text-sm focus:ring-earth-amber outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-earth-muted">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-earth-muted" />
                <input 
                  type="email" 
                  disabled
                  defaultValue={user?.primaryEmailAddress?.emailAddress || ""}
                  className="w-full rounded-xl border-earth-sand bg-earth-sand/5 px-11 py-3 text-sm text-earth-muted cursor-not-allowed"
                />
              </div>
            </div>
            <div className="space-y-2">
               <label className="text-xs font-semibold uppercase tracking-wider text-earth-muted">Role</label>
               <div className="relative">
                 <ShieldCheck className="absolute left-4 top-3.5 h-4 w-4 text-earth-muted" />
                 <input 
                   type="text" 
                   disabled
                   defaultValue={user?.publicMetadata?.role as string || "Admin"}
                   className="w-full rounded-xl border-earth-sand bg-earth-sand/5 px-11 py-3 text-sm text-earth-muted cursor-not-allowed"
                 />
               </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button className="inline-flex items-center gap-2 rounded-xl bg-earth-forest px-8 py-4 text-sm font-bold text-earth-sand shadow-lg shadow-earth-forest/20 transition-all hover:scale-105 active:scale-95">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
