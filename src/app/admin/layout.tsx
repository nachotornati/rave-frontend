import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backoffice · Rave Agenda",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-zinc-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold tracking-tight">Rave Agenda</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">
              Admin
            </span>
          </div>
          <a
            href="/"
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            ← Public view
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
