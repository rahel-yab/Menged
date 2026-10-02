
import { useState, type FormEvent } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  BusFront,
  Clock3,
  MapPin,
  Navigation,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import TerminalMap from "./components/map/TerminalMap";
import LanguageSwitcher from "./components/LanguageSwitcher";
import {
  translate,
  type Language,
  type TranslationKey,
} from "./i18n/translations";

import "./App.css";

type Terminal = {
  id: number;
  name: string;
  area: string;
  routes: number;
  crowd: "Low" | "Moderate" | "Busy";
  wait: string;
};

const terminals: Terminal[] = [
  {
    id: 1,
    name: "Bole Medhanialem",
    area: "Bole, Addis Ababa",
    routes: 8,
    crowd: "Low",
    wait: "5–10 min",
  },
  {
    id: 2,
    name: "Mexico Square",
    area: "Kirkos, Addis Ababa",
    routes: 12,
    crowd: "Moderate",
    wait: "10–15 min",
  },
  {
    id: 3,
    name: "Megenagna",
    area: "Yeka, Addis Ababa",
    routes: 15,
    crowd: "Busy",
    wait: "15–25 min",
  },
];

const crowdTranslation = {
  Low: "low",
  Moderate: "moderate",
  Busy: "busy",
} as const;

const crowdClass = {
  Low: "crowd-green",
  Moderate: "crowd-amber",
  Busy: "crowd-red",
} as const;

function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedTerminal, setSelectedTerminal] = useState<number | null>(
    null
  );

  const t = (key: TranslationKey) => translate(language, key);

  const isAmharic = language === "am";

  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!from.trim() || !to.trim()) {
      window.alert(t("enterBoth"));
      return;
    }

    // Route search will be connected to the backend API
    // in the next development stage.
    window.alert(t("searchComingSoon"));
  }

  return (
    <div
      lang={language}
      className={`min-h-screen bg-[#F8FAF7] text-[#17251D] ${
        isAmharic ? "menged-am" : "menged-en"
      }`}
    >
      {/* ================= NAVIGATION ================= */}
      <header className="sticky top-0 z-50 border-b border-[#E8EDE8] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-5 px-8 lg:px-12">
          {/* Logo */}
          <a href="#home" className="flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#176B45] text-white">
              <Navigation size={23} strokeWidth={2.4} />
            </div>

            <div>
              <div className="text-[23px] font-extrabold leading-none tracking-tight">
                {t("brand")}
                {language === "en" && (
                  <span className="text-[#26965F]">.</span>
                )}
              </div>

              <div className="mt-1 text-[10px] font-medium tracking-[0.1em] text-gray-500">
                {t("tagline")}
              </div>
            </div>
          </a>

          {/* Desktop navigation */}
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600 lg:gap-9">
            <a
              href="#explore"
              className="whitespace-nowrap transition hover:text-[#176B45]"
            >
              {t("navExplore")}
            </a>

            <a
              href="#how-it-works"
              className="whitespace-nowrap transition hover:text-[#176B45]"
            >
              {t("navHow")}
            </a>

            <a
              href="#about"
              className="whitespace-nowrap transition hover:text-[#176B45]"
            >
              {t("navAbout")}
            </a>
          </nav>

          {/* Language and account actions */}
          <div className="flex shrink-0 items-center gap-3">
            <LanguageSwitcher
              language={language}
              onChange={setLanguage}
            />

            <button
              type="button"
              onClick={() => window.alert(t("signInComingSoon"))}
              className="whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold text-[#176B45] transition hover:bg-[#F0F7F2]"
            >
              {t("signIn")}
            </button>

            <button
              type="button"
              onClick={() => window.alert(t("registerComingSoon"))}
              className="whitespace-nowrap rounded-xl bg-[#176B45] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#125737]"
            >
              {t("getStarted")}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ================= HERO ================= */}
        <section id="home" className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-40 -top-32 h-[500px] w-[500px] rounded-full bg-[#E6F3E9] opacity-70 blur-3xl" />

          <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-8 pb-20 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:pb-24 lg:pt-24">
            {/* Hero content */}
            <div className="max-w-[650px]">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D8EBDD] bg-white px-3.5 py-2 text-xs font-semibold text-[#176B45] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#26965F]" />
                {t("heroBadge")}
              </div>

              <h1 className="text-[48px] font-extrabold leading-[1.2] tracking-[-0.035em] text-[#17251D] lg:text-[66px]">
                {t("heroTitle")}
                <br />
                <span className="text-[#26965F]">
                  {t("heroHighlight")}
                </span>
              </h1>

              <p className="mt-6 max-w-[540px] text-base leading-8 text-gray-600 lg:text-lg">
                {t("heroDescription")}
              </p>

              {/* Route search */}
              <form
                onSubmit={handleSearch}
                className="mt-9 rounded-[22px] border border-[#E6EAE6] bg-white p-5 shadow-[0_14px_50px_rgba(27,60,39,0.08)]"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <label
                    htmlFor="starting-point"
                    className="text-sm font-bold text-[#17251D]"
                  >
                    {t("routeFinder")}
                  </label>

                  <span className="rounded-full bg-[#F0F7F2] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#176B45]">
                    {t("findRoute")}
                  </span>
                </div>

                <div className="flex items-stretch gap-3">
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    {/* Starting point */}
                    <label className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E6EAE6] bg-[#FAFBF9] px-3.5 py-3.5 transition focus-within:border-[#26965F]">
                      <span className="h-3 w-3 shrink-0 rounded-full border-[3px] border-[#26965F]" />

                      <input
                        id="starting-point"
                        type="text"
                        value={from}
                        onChange={(event) => setFrom(event.target.value)}
                        placeholder={t("startingPoint")}
                        aria-label={t("startingPoint")}
                        autoComplete="off"
                        className="w-full min-w-0 bg-transparent text-sm font-medium outline-none placeholder:font-normal placeholder:text-gray-400"
                      />
                    </label>

                    {/* Destination */}
                    <label className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E6EAE6] bg-[#FAFBF9] px-3.5 py-3.5 transition focus-within:border-[#26965F]">
                      <MapPin
                        size={16}
                        className="shrink-0 text-[#DC5656]"
                      />

                      <input
                        type="text"
                        value={to}
                        onChange={(event) => setTo(event.target.value)}
                        placeholder={t("destination")}
                        aria-label={t("destination")}
                        autoComplete="off"
                        className="w-full min-w-0 bg-transparent text-sm font-medium outline-none placeholder:font-normal placeholder:text-gray-400"
                      />
                    </label>
                  </div>

                  {/* Swap locations */}
                  <button
                    type="button"
                    onClick={handleSwap}
                    aria-label="Swap starting point and destination"
                    className="my-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E6EAE6] bg-white text-gray-500 transition hover:border-[#26965F] hover:text-[#176B45]"
                  >
                    <ArrowLeftRight size={17} />
                  </button>
                </div>

                <button
                  type="submit"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#176B45] px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#125737] active:scale-[0.99]"
                >
                  <Search size={18} />
                  {t("findRoute")}
                  <ArrowRight size={17} />
                </button>

                <p className="mt-3 text-center text-[11px] leading-5 text-gray-400">
                  {t("routeHint")}
                </p>
              </form>

              {/* Trust indicators */}
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-gray-500">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-[#26965F]" />
                  {t("localInfo")}
                </span>

                <span className="flex items-center gap-2">
                  <MapPin size={15} className="text-[#26965F]" />
                  {t("terminalDiscovery")}
                </span>
              </div>
            </div>

            {/* ================= INTERACTIVE MAP ================= */}
            <div className="relative mx-auto w-full max-w-[650px] lg:ml-auto">
              {/* Floating map label */}
              <div className="absolute -left-5 top-10 z-10 hidden rounded-2xl border border-[#E8EDE8] bg-white p-4 shadow-xl sm:block">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F5EC] text-[#176B45]">
                    <BusFront size={18} />
                  </span>

                  <div>
                    <div className="text-xs font-bold">
                      {t("taxiTerminals")}
                    </div>

                    <div className="mt-1 text-[10px] text-gray-500">
                      {t("nearbyStops")}
                    </div>
                  </div>
                </div>
              </div>

              <TerminalMap />

              {/* Floating crowd information */}
              <div className="absolute -bottom-5 -left-2 z-10 rounded-2xl border border-[#E8EDE8] bg-white p-4 shadow-xl sm:-left-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF4DF] text-[#B77B16]">
                    <Users size={19} />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[#17251D]">
                      {t("crowdAware")}
                    </div>

                    <div className="mt-1 text-[10px] text-gray-500">
                      {t("knowBefore")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TERMINALS ================= */}
        <section id="explore" className="bg-white py-20">
          <div className="mx-auto max-w-[1440px] px-8 lg:px-12">
            <div className="flex items-end justify-between gap-5">
              <div>
                <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#26965F]">
                  {t("exploreCity")}
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
                  {t("findTerminal")}
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
                  {t("terminalDescription")}
                </p>
              </div>

              <a
                href="#explore"
                className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#176B45] transition hover:text-[#26965F]"
              >
                {t("viewAll")}
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Terminal cards */}
            <div className="mt-9 grid grid-cols-3 gap-5">
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
                      className={`crowd-badge ${crowdClass[terminal.crowd]}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {t(crowdTranslation[terminal.crowd])}
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

                  <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <BusFront size={15} />
                      {terminal.routes} {t("routes")}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 size={15} />
                      {terminal.wait}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedTerminal((current) =>
                        current === terminal.id ? null : terminal.id
                      )
                    }
                    aria-expanded={selectedTerminal === terminal.id}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#DCE9DE] py-3 text-sm font-bold text-[#176B45] transition hover:bg-[#F0F7F2]"
                  >
                    {selectedTerminal === terminal.id
                      ? t("hideDetails")
                      : t("exploreTerminal")}
                    <ArrowRight size={15} />
                  </button>

                  {selectedTerminal === terminal.id && (
                    <div className="mt-3 rounded-xl bg-[#F5F8F4] p-3 text-xs leading-6 text-gray-600">
                      {t("sampleData")}
                    </div>
                  )}
                </article>
              ))}
            </div>

            <p className="mt-5 text-xs leading-6 text-gray-400">
              {t("sampleNotice")}
            </p>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section id="how-it-works" className="py-20">
          <div className="mx-auto max-w-[1440px] px-8 lg:px-12">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#26965F]">
                {t("howLabel")}
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
                {t("howTitle")}
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                {t("howDescription")}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8">
              {[
                {
                  number: "01",
                  title: "step1Title",
                  description: "step1Description",
                  icon: <Search size={23} />,
                },
                {
                  number: "02",
                  title: "step2Title",
                  description: "step2Description",
                  icon: <Navigation size={23} />,
                },
                {
                  number: "03",
                  title: "step3Title",
                  description: "step3Description",
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
                    {t(step.title as TranslationKey)}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    {t(step.description as TranslationKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section
          id="about"
          className="px-8 pb-20 lg:px-12"
        >
          <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[28px] bg-[#176B45] px-12 py-16 text-white">
            <div className="max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#B9E4C6]">
                {t("aboutLabel")}
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight lg:text-4xl">
                {t("aboutTitle")}
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-8 text-white/80">
                {t("aboutDescription")}
              </p>

              <a
                href="#explore"
                className="about-cta mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-[#176B45] transition hover:bg-[#EAF5EC]"
              >
                {t("exploreButton")}
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#E8EDE8] bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-8 py-8 lg:px-12">
          <div className="flex items-center gap-2">
            <Navigation size={18} className="text-[#176B45]" />

            <span className="font-extrabold tracking-tight">
              {t("brand")}
            </span>

            <span className="ml-2 text-xs text-gray-400">
              መንገድ
            </span>
          </div>

          <p className="text-xs text-gray-400">
            {t("footerTagline")}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;