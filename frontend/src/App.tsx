
import { useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  BusFront,
  Clock3,
  MapPin,
  Menu,
  Navigation,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import "./App.css";

const terminals = [
  {
    id: 1,
    name: "Bole Medhanialem",
    area: "Bole, Addis Ababa",
    routes: 8,
    crowd: "Low",
    wait: "5–10 min",
    color: "green",
  },
  {
    id: 2,
    name: "Mexico Square",
    area: "Kirkos, Addis Ababa",
    routes: 12,
    crowd: "Moderate",
    wait: "10–15 min",
    color: "amber",
  },
  {
    id: 3,
    name: "Megenagna",
    area: "Yeka, Addis Ababa",
    routes: 15,
    crowd: "Busy",
    wait: "15–25 min",
    color: "red",
  },
];

function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState<number | null>(
    null
  );

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    if (!from.trim() || !to.trim()) {
      alert("Please enter both your starting point and destination.");
      return;
    }

    alert(
      `Route search from ${from} to ${to} will be connected to the route API.`
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#17251D]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#E8EDE8] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#176B45] text-white">
              <Navigation size={23} strokeWidth={2.4} />
            </div>
            <div>
              <div className="text-[23px] font-extrabold leading-none tracking-tight">
                menged<span className="text-[#26965F]">.</span>
              </div>
              <div className="mt-1 text-[10px] font-medium tracking-[0.17em] text-gray-500">
                መንገድ · YOUR WAY, MADE EASIER
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-9 text-sm font-medium text-gray-600 md:flex">
            <a href="#explore" className="transition hover:text-[#176B45]">
              Explore terminals
            </a>
            <a href="#how-it-works" className="transition hover:text-[#176B45]">
              How it works
            </a>
            <a href="#about" className="transition hover:text-[#176B45]">
              About Menged
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#176B45] transition hover:bg-[#F0F7F2]">
              Sign in
            </button>
            <button className="rounded-xl bg-[#176B45] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#125737]">
              Get started
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            className="rounded-xl p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-4 border-t border-gray-100 bg-white px-6 py-5 text-sm font-medium md:hidden">
            <a href="#explore" onClick={() => setMenuOpen(false)}>
              Explore terminals
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How it works
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About Menged
            </a>
          </nav>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-40 -top-32 h-[500px] w-[500px] rounded-full bg-[#E6F3E9] opacity-70 blur-3xl" />
          <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-5 pb-16 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:pb-24 lg:pt-24">
            <div className="max-w-[650px]">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D8EBDD] bg-white px-3.5 py-2 text-xs font-semibold text-[#176B45] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#26965F]" />
                A smarter way to move around Ethiopia
              </div>

              <h1 className="text-[43px] font-extrabold leading-[1.12] tracking-[-0.045em] text-[#17251D] sm:text-[56px] lg:text-[68px]">
                Find your route.
                <br />
                <span className="text-[#26965F]">Skip the guesswork.</span>
              </h1>

              <p className="mt-6 max-w-[540px] text-base leading-8 text-gray-600 sm:text-lg">
                Discover taxi terminals, explore routes, and get a better idea
                of how busy your journey might be. Getting around starts here.
              </p>

              {/* Route search */}
              <div className="mt-9 rounded-[22px] border border-[#E6EAE6] bg-white p-4 shadow-[0_14px_50px_rgba(27,60,39,0.08)] sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#17251D]">
                    Where are you going?
                  </span>
                  <span className="rounded-full bg-[#F0F7F2] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#176B45]">
                    Route finder
                  </span>
                </div>

                <div className="flex items-stretch gap-3">
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <label className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E6EAE6] bg-[#FAFBF9] px-3.5 py-3.5 focus-within:border-[#26965F]">
                      <span className="h-3 w-3 shrink-0 rounded-full border-[3px] border-[#26965F]" />
                      <input
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        placeholder="Starting point"
                        aria-label="Starting point"
                        className="w-full min-w-0 bg-transparent text-sm font-medium outline-none placeholder:font-normal placeholder:text-gray-400"
                      />
                    </label>

                    <label className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E6EAE6] bg-[#FAFBF9] px-3.5 py-3.5 focus-within:border-[#26965F]">
                      <MapPin size={16} className="shrink-0 text-[#DC5656]" />
                      <input
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="Your destination"
                        aria-label="Destination"
                        className="w-full min-w-0 bg-transparent text-sm font-medium outline-none placeholder:font-normal placeholder:text-gray-400"
                      />
                    </label>
                  </div>

                  <button
                    onClick={handleSwap}
                    aria-label="Swap locations"
                    className="my-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E6EAE6] bg-white text-gray-500 transition hover:border-[#26965F] hover:text-[#176B45]"
                  >
                    <ArrowLeftRight size={17} />
                  </button>
                </div>

                <button
                  onClick={handleSearch}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#176B45] px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#125737] active:scale-[0.99]"
                >
                  <Search size={18} />
                  Find my route
                  <ArrowRight size={17} />
                </button>

                <p className="mt-3 text-center text-[11px] text-gray-400">
                  Transport information will be based on verified local data.
                </p>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-gray-500">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-[#26965F]" />
                  Local transport information
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={15} className="text-[#26965F]" />
                  Terminal discovery
                </span>
              </div>
            </div>

            {/* Map preview */}
            <div className="relative mx-auto w-full max-w-[650px] lg:ml-auto">
              <div className="absolute -left-5 top-10 z-10 hidden rounded-2xl border border-[#E8EDE8] bg-white p-4 shadow-xl sm:block">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F5EC] text-[#176B45]">
                    <BusFront size={18} />
                  </span>
                  <div>
                    <div className="text-xs font-bold">Taxi terminals</div>
                    <div className="mt-1 text-[10px] text-gray-500">
                      Explore nearby stops
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[28px] border border-[#E0E8E0] bg-[#E8EFE7] shadow-[0_25px_70px_rgba(29,66,40,0.13)]">
                <div className="relative aspect-[4/4.1] overflow-hidden">
                  <div className="map-grid absolute inset-0 opacity-60" />

                  <svg
                    viewBox="0 0 520 540"
                    className="absolute inset-0 h-full w-full"
                    role="img"
                    aria-label="Illustrative taxi terminal route map"
                  >
                    <g fill="none" stroke="#D1DCD1" strokeWidth="14" strokeLinecap="round">
                      <path d="M-20 110 L140 175 L255 140 L380 210 L540 160" />
                      <path d="M-20 345 L125 300 L255 360 L385 315 L540 390" />
                      <path d="M70 -20 L110 120 L80 250 L165 390 L120 560" />
                      <path d="M300 -20 L275 130 L320 240 L285 370 L340 560" />
                      <path d="M465 -20 L400 110 L440 260 L395 410 L470 560" />
                    </g>
                    <g fill="none" stroke="#F9FCF8" strokeWidth="7" strokeLinecap="round">
                      <path d="M-20 110 L140 175 L255 140 L380 210 L540 160" />
                      <path d="M-20 345 L125 300 L255 360 L385 315 L540 390" />
                      <path d="M70 -20 L110 120 L80 250 L165 390 L120 560" />
                      <path d="M300 -20 L275 130 L320 240 L285 370 L340 560" />
                      <path d="M465 -20 L400 110 L440 260 L395 410 L470 560" />
                    </g>
                    <g fill="none" stroke="#26965F" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M110 120 L140 175 L255 140 L320 240 L385 315 L395 410" strokeDasharray="1 0"/>
                    </g>
                    <g fill="#DCE8DA" opacity=".75">
                      <rect x="15" y="25" width="55" height="45" rx="8"/>
                      <rect x="175" y="20" width="65" height="62" rx="9"/>
                      <rect x="345" y="20" width="85" height="48" rx="8"/>
                      <rect x="175" y="220" width="70" height="65" rx="8"/>
                      <rect x="30" y="420" width="95" height="50" rx="8"/>
                      <rect x="350" y="440" width="70" height="60" rx="8"/>
                    </g>
                    <g>
                      <circle cx="110" cy="120" r="17" fill="#176B45" stroke="white" strokeWidth="5"/>
                      <circle cx="110" cy="120" r="5" fill="white"/>
                      <circle cx="255" cy="140" r="17" fill="#176B45" stroke="white" strokeWidth="5"/>
                      <circle cx="255" cy="140" r="5" fill="white"/>
                      <circle cx="385" cy="315" r="17" fill="#176B45" stroke="white" strokeWidth="5"/>
                      <circle cx="385" cy="315" r="5" fill="white"/>
                      <circle cx="395" cy="410" r="19" fill="#DC5656" stroke="white" strokeWidth="5"/>
                      <circle cx="395" cy="410" r="5" fill="white"/>
                    </g>
                  </svg>

                  <div className="absolute left-[8%] top-[10%] rounded-xl border border-white/70 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
                    <div className="text-[10px] font-bold text-[#176B45]">
                      Terminal A
                    </div>
                    <div className="mt-0.5 text-[9px] text-gray-500">
                      Example location
                    </div>
                  </div>

                  <div className="absolute right-[5%] top-[23%] rounded-xl border border-white/70 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
                    <div className="text-[10px] font-bold text-[#176B45]">
                      Terminal B
                    </div>
                    <div className="mt-0.5 text-[9px] text-gray-500">
                      Example location
                    </div>
                  </div>

                  <div className="absolute bottom-[12%] right-[6%] rounded-xl border border-white/70 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
                    <div className="text-[10px] font-bold text-[#DC5656]">
                      Destination
                    </div>
                    <div className="mt-0.5 text-[9px] text-gray-500">
                      Illustrative route
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-[10px] font-semibold text-gray-600 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-[#26965F]" />
                    Sample route visualization
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-2 rounded-2xl border border-[#E8EDE8] bg-white p-4 shadow-xl sm:-left-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF4DF] text-[#B77B16]">
                    <Users size={19} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#17251D]">
                      Crowd-aware journeys
                    </div>
                    <div className="mt-1 text-[10px] text-gray-500">
                      Know before you go
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Terminal discovery */}
        <section id="explore" className="bg-white py-20">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#26965F]">
                  Explore your city
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Find a terminal near you
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
                  Explore taxi terminal locations and discover routes
                  connecting different parts of the city.
                </p>
              </div>
              <a
                href="#explore"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#176B45] hover:text-[#26965F]"
              >
                View all terminals <ArrowRight size={16} />
              </a>
            </div>

            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {terminals.map((terminal) => (
                <article
                  key={terminal.id}
                  className="rounded-2xl border border-[#E9EDE9] bg-white p-5 transition hover:-translate-y-1 hover:border-[#B8D9C1] hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF7F0] text-[#176B45]">
                      <BusFront size={23} />
                    </div>
                    <span
                      className={`crowd-badge crowd-${terminal.color}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {terminal.crowd}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#17251D]">
                    {terminal.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin size={14} />
                    {terminal.area}
                  </div>

                  <div className="my-5 h-px bg-[#EDF0ED]" />

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <BusFront size={15} />
                      {terminal.routes} sample routes
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock3 size={15} />
                      {terminal.wait}*
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedTerminal(
                        selectedTerminal === terminal.id
                          ? null
                          : terminal.id
                      )
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#DCE9DE] py-3 text-sm font-bold text-[#176B45] transition hover:bg-[#F0F7F2]"
                  >
                    {selectedTerminal === terminal.id
                      ? "Hide details"
                      : "Explore terminal"}
                    <ArrowRight size={15} />
                  </button>

                  {selectedTerminal === terminal.id && (
                    <div className="mt-3 rounded-xl bg-[#F5F8F4] p-3 text-xs leading-6 text-gray-600">
                      This is a design preview using sample information.
                      Verified terminal details and live crowd estimates
                      will be added when the transport dataset is ready.
                    </div>
                  )}
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-400">
              *All terminal details, routes, crowd levels, and waiting
              times above are illustrative sample data, not verified
              operational information.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#26965F]">
                Simple by design
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Your journey, made simpler
              </h2>
              <p className="mt-4 text-sm leading-7 text-gray-500">
                Find your starting point, explore taxi connections, and
                make informed decisions about your trip.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Choose your destination",
                  description:
                    "Enter where you are and where you want to go to explore possible taxi connections.",
                  icon: <Search size={23} />,
                },
                {
                  number: "02",
                  title: "Explore taxi routes",
                  description:
                    "Compare connected terminals, journey estimates, and transfer options.",
                  icon: <Navigation size={23} />,
                },
                {
                  number: "03",
                  title: "Travel with more insight",
                  description:
                    "Check recent crowd reports and make a more informed travel decision.",
                  icon: <BusFront size={23} />,
                },
              ].map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-[#E8EDE8] bg-white p-7"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF5EC] text-[#176B45]">
                      {step.icon}
                    </div>
                    <span className="text-3xl font-extrabold text-[#E1EAE2]">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="px-5 pb-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[28px] bg-[#176B45] px-7 py-12 text-white sm:px-12 sm:py-16">
            <div className="max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#B9E4C6]">
                Built for Ethiopian journeys
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                A better way to navigate our cities.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-8 text-white/80">
                Menged is a transport information platform designed to
                make taxi terminals, local routes, and travel conditions
                easier to discover.
              </p>
              <a
  href="#explore"
  style={{
    color: "#176B45",
    backgroundColor: "#FFFFFF",
  }}
  className="about-cta mt-8 inline-flex items-center
    gap-2 rounded-xl px-5 py-3.5 text-sm font-bold
    transition hover:bg-[#EFF7F0]"
>
  Explore terminals
  <ArrowRight size={17} />
</a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8EDE8] bg-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div className="flex items-center gap-2">
            <Navigation size={18} className="text-[#176B45]" />
            <span className="font-extrabold tracking-tight">
              menged<span className="text-[#26965F]">.</span>
            </span>
            <span className="ml-2 text-xs text-gray-400">
              መንገድ
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Your way, made easier. · A transport information project
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;