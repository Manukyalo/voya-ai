import Link from "next/link";
import { ArrowRight, Mountain, ShieldCheck, Zap } from "lucide-react";
import { SignInButton, SignUpButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-earth-sand">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Mountain className="h-8 w-8 text-earth-amber" />
          <span className="text-2xl font-serif font-bold text-earth-forest tracking-tight">Voya AI</span>
        </div>
        <div className="flex items-center gap-6">
          <SignInButton mode="modal">
            <button className="text-sm font-medium text-earth-forest hover:text-earth-amber transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="rounded-full bg-earth-forest px-6 py-2.5 text-sm font-bold text-earth-sand shadow-lg shadow-earth-forest/20 transition-all hover:scale-105">
              Get Started
            </button>
          </SignUpButton>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center rounded-full bg-earth-amber/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-earth-amber mb-8">
          The Future of Lodge Management
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-earth-forest leading-tight mb-8">
          Elevate Your Wilderness <br />
          <span className="text-earth-amber italic">Hospitality Experience</span>
        </h1>
        <p className="text-lg text-earth-muted mb-12 max-w-2xl leading-relaxed">
          Voya AI brings world-class intelligence to safari lodges. Optimize revenue, 
          forecast occupancy, and master guest upsells with our grounded, premium dashboard.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <SignUpButton mode="modal">
            <button className="group inline-flex items-center gap-2 rounded-full bg-earth-forest px-8 py-4 text-base font-bold text-earth-sand shadow-xl shadow-earth-forest/30 transition-all hover:scale-105 active:scale-95">
              Begin Exploration
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </SignUpButton>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 mb-20 text-left">
          <div className="space-y-4 p-6 rounded-2xl bg-white shadow-sm border border-earth-muted/10">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-earth-amber/10 text-earth-amber">
               <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-earth-forest">Revenue Intel</h3>
            <p className="text-sm text-earth-muted leading-relaxed">Modern data viz to track every cent across your property portfolio.</p>
          </div>
          <div className="space-y-4 p-6 rounded-2xl bg-white shadow-sm border border-earth-muted/10">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-earth-forest/10 text-earth-forest">
               <Mountain className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-earth-forest">Local Roots</h3>
            <p className="text-sm text-earth-muted leading-relaxed">Designed specifically for the unique rhythm of safari and wilderness lodges.</p>
          </div>
          <div className="space-y-4 p-6 rounded-2xl bg-white shadow-sm border border-earth-muted/10">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-earth-amber/10 text-earth-amber">
               <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-earth-forest">Secure Core</h3>
            <p className="text-sm text-earth-muted leading-relaxed">Enterprise-grade security with Clerk and Supabase RLS data isolation.</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-earth-muted/10 py-12 px-8 text-center bg-white/50">
        <p className="text-xs font-semibold uppercase tracking-widest text-earth-muted">
          &copy; {new Date().getFullYear()} Voya AI. Premium Hospitality Intelligence.
        </p>
      </footer>
    </div>
  );
}
