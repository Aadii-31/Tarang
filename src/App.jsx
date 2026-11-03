import { useEffect, useMemo, useState } from "react";
import { EVENTS, CATEGORIES } from "./data";
import { useLocalStorage } from "./hooks";
import { Countdown, Drawer, EventRow, Tickets, fmt } from "./components";

const byDate = (a, b) => new Date(a.date) - new Date(b.date);
const month = iso => new Date(iso).toLocaleString("en", { month: "long", year: "numeric" });

export default function App() {
  const [theme, setTheme] = useLocalStorage("gatherly.theme", "light");
  const [regs, setRegs] = useLocalStorage("gatherly.regs", []);
  const [saved, setSaved] = useLocalStorage("gatherly.saved", []);
  const [tab, setTab] = useState("discover");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [range, setRange] = useState("any");
  const [freeOnly, setFreeOnly] = useState(false);
  const [open, setOpen] = useState(null);

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  const seatsLeft = e => e.seats - regs.filter(r => r.eventId === e.id).length;
  const toggleSave = id => setSaved(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));
  const spot = useMemo(() => EVENTS.filter(e => e.featured).sort(byDate)[0], []);

  const list = useMemo(() => {
    const days = { week: 7, month: 30 }[range];
    const term = q.trim().toLowerCase();
    return EVENTS.filter(e =>
      (cat === "All" || (cat === "Saved" ? saved.includes(e.id) : e.category === cat)) &&
      (!freeOnly || e.price === 0) &&
      (!days || new Date(e.date) - Date.now() <= days * 864e5) &&
      `${e.title} ${e.venue} ${e.category} ${e.desc}`.toLowerCase().includes(term)
    ).sort(byDate);
  }, [q, cat, range, freeOnly, saved]);

  const groups = list.reduce((m, e) => {
    (m[month(e.date)] ||= []).push(e);
    return m;
  }, {});

  const clear = () => { setQ(""); setCat("All"); setRange("any"); setFreeOnly(false); };
  const count = c => (c === "All" ? EVENTS.length : c === "Saved" ? saved.length : EVENTS.filter(e => e.category === c).length);

  return (
    <>
      <header className="top">
        <div className="wrap">
          <a className="logo" href="#top" onClick={() => setTab("discover")}>Tarang</a>
          <nav className="tabs" aria-label="Main">
            <button className={`tab ${tab === "discover" ? "on" : ""}`} onClick={() => setTab("discover")}>Discover</button>
            <button className={`tab ${tab === "tickets" ? "on" : ""}`} onClick={() => setTab("tickets")}>My tickets{regs.length > 0 && ` (${regs.length})`}</button>
          </nav>
          <button className="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Switch between light and dark theme">{theme === "light" ? "☾" : "☀"}</button>
        </div>
      </header>

      {tab === "discover" ? (
        <main id="top">
          <section className="hero">
            <div className="wrap">
              <h1>Everything happening on campus, in one place.</h1>
              <p className="lead">Workshops, fests and competitions. Search, pick one and register in under a minute.</p>
              <input className="big-search" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search events, venues or categories" aria-label="Search events" />
            </div>
          </section>

          {spot && (
            <div className="spot">
              <div className="wrap">
                <div><p className="small">Starting soon</p><h2>{spot.title}</h2><p>{fmt.date(spot.date)} at {spot.venue}</p></div>
                <Countdown to={spot.date} />
                <button className="btn alt" onClick={() => setOpen(spot)}>Register now</button>
              </div>
            </div>
          )}

          <div className="wrap layout">
            <aside className="side" aria-label="Filters">
              <div>
                <h3>Category</h3>
                <div className="cats">
                  {["All", ...CATEGORIES, "Saved"].map(c => (
                    <button key={c} className={cat === c ? "on" : ""} aria-pressed={cat === c} onClick={() => setCat(c)}>
                      <span>{c === "Saved" ? "♥ Saved" : c}</span><span>{count(c)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3>When</h3>
                <select value={range} onChange={e => setRange(e.target.value)} aria-label="Date range">
                  <option value="any">Any date</option>
                  <option value="week">Next 7 days</option>
                  <option value="month">Next 30 days</option>
                </select>
              </div>
              <label className="check"><input type="checkbox" checked={freeOnly} onChange={e => setFreeOnly(e.target.checked)} /> Free events only</label>
            </aside>

            <section aria-label="Events">
              <p className="muted" aria-live="polite">{list.length} event{list.length === 1 ? "" : "s"} found</p>
              {list.length ? (
                Object.entries(groups).map(([m, items]) => (
                  <div key={m}>
                    <h2 className="month">{m}</h2>
                    {items.map(e => (
                      <EventRow key={e.id} event={e} left={seatsLeft(e)} saved={saved.includes(e.id)} onSave={toggleSave} onOpen={setOpen} />
                    ))}
                  </div>
                ))
              ) : (
                <div className="empty">
                  <h2>No events match your filters</h2>
                  <p className="muted">Try a different keyword or clear the filters.</p>
                  <button className="btn" onClick={clear}>Clear filters</button>
                </div>
              )}
            </section>
          </div>
        </main>
      ) : (
        <main className="wrap page">
          <Tickets regs={regs} events={EVENTS} onCancel={id => setRegs(r => r.filter(x => x.id !== id))} onBrowse={() => setTab("discover")} />
        </main>
      )}

      {open && (
        <Drawer key={open.id} event={open} events={EVENTS} regs={regs} left={seatsLeft} onClose={() => setOpen(null)} onRegister={r => setRegs(x => [...x, r])} />
      )}

      <footer className="foot">
        <div className="wrap">Made with ❤️ by Aaditya Kumar Singh (24051750)</div>
      </footer>
    </>
  );
}
