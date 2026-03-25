"use client";

import { CheckCircle2, Clock, MoreHorizontal, User } from "lucide-react";

const upsells = [
  { id: 1, guest: "John Mwangi", room: "102", offer: "Bush Dinner Experience", status: "Pending", value: 12000, date: "Mar 26" },
  { id: 2, guest: "Sarah Thompson", room: "205", offer: "Room Upgrade (Pool View)", status: "Accepted", value: 4500, date: "Mar 25" },
  { id: 3, guest: "Robert Kimani", room: "108", offer: "Guided Safari Walk", status: "Pending", value: 8000, date: "Mar 27" },
  { id: 4, guest: "Emma Wilson", room: "301", offer: "Spa Treatment Package", status: "Declined", value: 15000, date: "Mar 25" },
];

export default function UpsellsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-serif font-bold text-earth-forest">Upsell Opportunities</h2>
        <p className="mt-1 text-sm text-earth-muted">Optimize guest experience and maximize revenue.</p>
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-earth-muted/20 overflow-hidden">
        <table className="min-w-full divide-y divide-earth-sand">
          <thead className="bg-earth-sand/30">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-earth-muted">Guest</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-earth-muted">Offer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-earth-muted">Value</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-earth-muted">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-earth-muted">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-earth-muted">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-earth-sand bg-white">
            {upsells.map((upsell) => (
              <tr key={upsell.id} className="hover:bg-earth-sand/10 transition-colors">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-earth-amber/10 flex items-center justify-center text-earth-amber">
                        <User className="h-4 w-4" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-earth-forest">{upsell.guest}</div>
                      <div className="text-xs text-earth-muted">Room {upsell.room}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-earth-forest truncate max-w-xs">{upsell.offer}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-earth-forest">Ksh {upsell.value.toLocaleString()}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-earth-muted">{upsell.date}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    upsell.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    upsell.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {upsell.status === 'Accepted' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                    {upsell.status === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
                    {upsell.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <button className="text-earth-muted hover:text-earth-forest transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Cards for Upsells */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-earth-forest p-6 text-earth-sand shadow-sm">
              <h4 className="text-sm opacity-60 uppercase tracking-widest font-semibold mb-2">Total Value</h4>
              <p className="text-3xl font-serif font-bold text-earth-amber">Ksh 39,500</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-earth-muted/20">
              <h4 className="text-sm text-earth-muted uppercase tracking-widest font-semibold mb-2">Conversion Rate</h4>
              <p className="text-3xl font-serif font-bold text-earth-forest">25%</p>
          </div>
          <div className="rounded-2xl bg-earth-amber p-6 text-earth-forest shadow-sm">
              <h4 className="text-sm opacity-60 uppercase tracking-widest font-semibold mb-2">Pending Value</h4>
              <p className="text-3xl font-serif font-bold">Ksh 20,000</p>
          </div>
      </div>
    </div>
  );
}
