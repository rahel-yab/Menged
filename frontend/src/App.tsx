import { lazy, Suspense, useEffect, useState, type FormEvent } from "react";
import {
  AlertCircle,
  ArrowLeftRight,
  ArrowRight,
  BusFront,
  Clock3,
  MapPin,
  Navigation,
  Search,
  ShieldCheck,
} from "lucide-react";

import { getTerminals, searchRoutes, type RouteResult, type Terminal } from "./api";
import LanguageSwitcher from "./components/LanguageSwitcher";
import {
  translate,
  type Language,
  type TranslationKey,
} from "./i18n/translations";

import "./App.css";

const TerminalMap = lazy(() => import("./components/map/TerminalMap"));

function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [terminalsLoading, setTerminalsLoading] = useState(true);
  const [terminalsError, setTerminalsError] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [routeMessage, setRouteMessage] = useState<TranslationKey | null>(null);
  const [searching, setSearching] = useState(false);

  const t = (key: TranslationKey) => translate(language, key);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    let active = true;
    getTerminals()
      .then((items) => {
        if (active) setTerminals(items);
      })
      .catch(() => {
        if (active) setTerminalsError(true);
      })
      .finally(() => {
        if (active) setTerminalsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function swapPlaces() {
    setFrom(to);
    setTo(from);
    setRoute(null);
    setRouteMessage(null);
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRoute(null);
    setRouteMessage(null);

    if (!from.trim() || !to.trim()) {
      setRouteMessage("enterBoth");
      return;
    }

    setSearching(true);
    try {
      const response = await searchRoutes(from, to);
      setRoute(response.data[0] ?? null);
      if (response.messageKey) {
        setRouteMessage(response.messageKey as TranslationKey);
      } else if (response.message && response.data.length === 0) {
        setRouteMessage("noConnection");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "apiRequestFailed";
      setRouteMessage(
        message === "apiUnavailable" ? "apiUnavailable" : "apiRequestFailed",
      );
    } finally {
      setSearching(false);
    }
  }

  function chooseTerminal(terminal: Terminal, field: "from" | "to") {
    const name = language === "am" ? terminal.nameAm : terminal.name;
    if (field === "from") setFrom(name);
    else setTo(name);
    setRoute(null);
    setRouteMessage(null);
    document.getElementById("route-finder")?.scrollIntoView({ behavior: "smooth" });
    document.getElementById(field === "from" ? "starting-point" : "destination")?.focus({ preventScroll: true });
  }

  const mapLabels = {
    mapTitle: t("mapTitle"),
    mapHint: t("mapHint"),
    verified: t("verified"),
    unverified: t("unverified"),
  };

  return (
    <div lang={language} className={`menged-app ${language === "am" ? "menged-am" : "menged-en"}`}>
      <header className="site-header">
        <div className="site-header-inner">
          <a href="#home" className="brand" aria-label={t("brand")}>
            <span className="brand-mark"><Navigation size={21} strokeWidth={2.4} /></span>
            <span className="brand-copy">
              <strong>{t("brand")}</strong>
              <small>{t("tagline")}</small>
            </span>
          </a>

          <nav className="main-nav" aria-label={t("navLabel")}>
            <a href="#explore">{t("navExplore")}</a>
            <a href="#how-it-works">{t("navHow")}</a>
            <a href="#about">{t("navAbout")}</a>
          </nav>

          <LanguageSwitcher
            language={language}
            onChange={setLanguage}
            label={t("languageLabel")}
          />
        </div>
      </header>

      <main>
        <section id="home" className="hero-section">
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="eyebrow"><span />{t("heroBadge")}</div>
              <h1>{t("heroTitle")}<br /><span>{t("heroHighlight")}</span></h1>
              <p className="hero-description">{t("heroDescription")}</p>

              <form id="route-finder" className="route-card" onSubmit={handleSearch}>
                <div className="route-card-heading">
                  <h2>{t("routeFinder")}</h2>
                  <span><Search size={13} /> {t("findRoute")}</span>
                </div>

                <div className="route-fields">
                  <div className="route-inputs">
                    <label className="route-input">
                      <span className="origin-dot" aria-hidden="true" />
                      <input
                        id="starting-point"
                        list="terminal-suggestions"
                        value={from}
                        onChange={(event) => setFrom(event.target.value)}
                        placeholder={t("startingPoint")}
                        aria-label={t("startingPoint")}
                        autoComplete="off"
                        required
                      />
                    </label>
                    <label className="route-input">
                      <MapPin size={17} className="destination-icon" aria-hidden="true" />
                      <input
                        id="destination"
                        list="terminal-suggestions"
                        value={to}
                        onChange={(event) => setTo(event.target.value)}
                        placeholder={t("destination")}
                        aria-label={t("destination")}
                        autoComplete="off"
                        required
                      />
                    </label>
                    <datalist id="terminal-suggestions">
                      {terminals.map((terminal) => (
                        <option key={terminal.id} value={language === "am" ? terminal.nameAm : terminal.name} />
                      ))}
                    </datalist>
                  </div>

                  <button
                    type="button"
                    className="swap-button"
                    onClick={swapPlaces}
                    aria-label={t("swapPlaces")}
                    title={t("swapPlaces")}
                  >
                    <ArrowLeftRight size={17} />
                  </button>
                </div>

                <p className="place-examples">{t("placeExamples")}</p>
                <button className="search-button" type="submit" disabled={searching}>
                  <Search size={17} />
                  {searching ? t("searching") : t("findRoute")}
                  <ArrowRight size={17} />
                </button>

                <p className="route-disclaimer">{t("routeHint")}</p>

                {(routeMessage || route) && (
                  <div className={`route-result ${route ? "route-result-success" : "route-result-message"}`} aria-live="polite">
                    {route ? (
                      <>
                        <div className="result-heading">
                          <div className="result-icon"><BusFront size={17} /></div>
                          <div>
                            <strong>{t("routeOptions")}</strong>
                            <span>{route.transfers === 0 ? t("direct") : `${route.transfers} ${t("transfers")}`}</span>
                          </div>
                        </div>
                        <ol className="route-stop-list">
                          {route.stops.map((stop, index) => (
                            <li key={stop.id}>
                              <span className={`stop-marker ${index === 0 ? "stop-origin" : index === route.stops.length - 1 ? "stop-destination" : "stop-transfer"}`} />
                              <span>{language === "am" ? stop.nameAm : stop.name}</span>
                            </li>
                          ))}
                        </ol>
                        <p className="route-warning"><AlertCircle size={15} />{t("unverifiedRoute")}</p>
                      </>
                    ) : (
                      <p className="route-message"><AlertCircle size={16} />{routeMessage ? t(routeMessage) : ""}</p>
                    )}
                  </div>
                )}
              </form>

              <div className="trust-row">
                <span><ShieldCheck size={16} />{t("localInfo")}</span>
                <span><MapPin size={16} />{t("terminalDiscovery")}</span>
              </div>
            </div>

            <div className="hero-map-wrap">
              <div className="map-label">
                <span className="map-label-icon"><BusFront size={18} /></span>
                <span><strong>{t("taxiTerminals")}</strong><small>{t("nearbyStops")}</small></span>
              </div>
              {terminalsError ? (
                <div className="map-unavailable"><AlertCircle size={22} />{t("terminalsUnavailable")}</div>
              ) : (
                <Suspense fallback={<div className="map-unavailable" role="status">{t("mapLoading")}</div>}>
                  <TerminalMap terminals={terminals} language={language} labels={mapLabels} />
                </Suspense>
              )}
            </div>
          </div>
        </section>

        <section id="explore" className="terminals-section">
          <div className="section-inner">
            <div className="section-heading">
              <div>
                <div className="section-kicker">{t("exploreCity")}</div>
                <h2>{t("findTerminal")}</h2>
                <p>{t("terminalDescription")}</p>
              </div>
              <a className="text-link" href="#route-finder">{t("findRoute")} <ArrowRight size={16} /></a>
            </div>

            {terminalsLoading ? (
              <p className="directory-state" role="status">{t("loadingTerminals")}</p>
            ) : terminalsError ? (
              <p className="directory-state directory-error" role="alert">{t("terminalsUnavailable")}</p>
            ) : terminals.length === 0 ? (
              <p className="directory-state">{t("noTerminals")}</p>
            ) : (
              <div className="terminal-grid">
                {terminals.map((terminal) => (
                  <article className="terminal-card" key={terminal.id}>
                    <div className="terminal-card-top">
                      <span className="terminal-icon"><BusFront size={21} /></span>
                      <span className={`data-status ${terminal.verified ? "data-status-verified" : ""}`}>
                        <span />{terminal.verified ? t("verified") : t("unverified")}
                      </span>
                    </div>
                    <h3>{language === "am" ? terminal.nameAm : terminal.name}</h3>
                    <p className="terminal-area"><MapPin size={14} />{language === "am" ? terminal.areaAm : terminal.area}</p>
                    <div className="terminal-details">
                      <div><BusFront size={15} /><span>{t("connectionData")}</span><strong>{terminal.routes.length ? `${terminal.routes.length} ${t("sampleConnections")}` : t("noConnections")}</strong></div>
                      <div><ShieldCheck size={15} /><span>{t("crowdData")}</span><strong>{terminal.crowdLevel === "unknown" ? t("noCrowdData") : terminal.crowdLevel}</strong></div>
                      <div><Clock3 size={15} /><span>{t("waitData")}</span><strong>{terminal.estimatedWaitMinutes === null ? t("noWaitData") : `${terminal.estimatedWaitMinutes} min`}</strong></div>
                    </div>
                    <div className="terminal-actions">
                      <button type="button" onClick={() => chooseTerminal(terminal, "from")}>{t("useAsStart")}</button>
                      <button type="button" onClick={() => chooseTerminal(terminal, "to")}>{t("useAsDestination")}</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
            <p className="sample-notice">{t("sampleNotice")}</p>
          </div>
        </section>

        <section id="how-it-works" className="how-section">
          <div className="section-inner">
            <div className="center-heading">
              <div className="section-kicker">{t("howLabel")}</div>
              <h2>{t("howTitle")}</h2>
            </div>
            <div className="steps-grid">
              {([
                ["01", "step1Title", "step1Description", <Search size={21} key="search" />],
                ["02", "step2Title", "step2Description", <Navigation size={21} key="navigation" />],
                ["03", "step3Title", "step3Description", <BusFront size={21} key="bus" />],
              ] as const).map(([number, title, description, icon]) => (
                <article className="step-card" key={number}>
                  <div className="step-card-top"><span>{icon}</span><strong>{number}</strong></div>
                  <h3>{t(title)}</h3>
                  <p>{t(description)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="about-section">
          <div className="about-card">
            <div className="section-kicker">{t("aboutLabel")}</div>
            <h2>{t("aboutTitle")}</h2>
            <p>{t("aboutDescription")}</p>
            <a href="#explore" className="about-link">{t("navExplore")} <ArrowRight size={16} /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a href="#home" className="footer-brand"><Navigation size={17} />{t("brand")}</a>
        <span>{t("footerTagline")}</span>
      </footer>
    </div>
  );
}

export default App;
