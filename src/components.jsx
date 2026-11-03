import { useEffect, useState } from "react";
import { useCountdown } from "./hooks";

export const fmt = {
  date: iso => new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
  time: iso => new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
  price: p => (p ? `₹${p}` : "Free"),
};

const gcal = t => {
  const start = new Date(t.date);
  const end = new Date(+start + 2 * 3600e3);
  const z = d => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(t.title)}&dates=${z(start)}/${z(end)}&location=${encodeURIComponent(t.venue)}`;
};

/* ---------- Countdown ---------- */
export function Countdown({ to }) {
  const c = useCountdown(to);
  if (c.done) return <p className="live">Happening now</p>;
  return (
    <div className="cd" role="timer" aria-label="Time until the event starts">
      {[["days", c.days], ["hrs", c.hours], ["min", c.mins], ["sec", c.secs]].map(([l, v]) => (
        <div key={l}><b>{String(v).padStart(2, "0")}</b><span>{l}</span></div>
      ))}
    </div>
  );
}

/* ---------- One event in the timeline list ---------- */
export function EventRow({ event: e, left, saved, onSave, onOpen }) {
  const [broken, setBroken] = useState(false);
  const d = new Date(e.date);
  return (
    <article className="row-card" style={{ "--c": e.color }}>
      <div className="dnum" aria-hidden="true"><b>{d.getDate()}</b>{d.toLocaleString("en", { weekday: "short" })}</div>
      <button className="thumb" onClick={() => onOpen(e)} tabIndex={-1} aria-hidden="true">
        <span>{e.emoji}</span>
        {!broken && <img src={`https://picsum.photos/seed/${e.seed}/320/240`} alt="" loading="lazy" onError={() => setBroken(true)} />}
      </button>
      <div className="info">
        <p className="cat">{e.category}</p>
        <h3><button className="linkish" onClick={() => onOpen(e)}>{e.title}</button></h3>
        <p className="muted">{e.desc}</p>
        <p className="meta"><span>{fmt.time(e.date)}</span><span>{e.venue}</span><span>{left > 0 ? `${left} seats left` : "Sold out"}</span></p>
      </div>
      <div className="act">
        <strong>{fmt.price(e.price)}</strong>
        <button className="btn sm" onClick={() => onOpen(e)}>Register</button>
        <button className={`heart ${saved ? "on" : ""}`} onClick={() => onSave(e.id)} aria-pressed={saved} aria-label={saved ? "Remove from saved" : "Save event"}>{saved ? "♥" : "♡"}</button>
      </div>
    </article>
  );
}

/* ---------- Ticket stub (confirmation and My Tickets) ---------- */
export function Stub({ reg, event: t, children }) {
  return (
    <div className="stub">
      <h3>{t.emoji} {t.title}</h3>
      <p>{fmt.date(t.date)}, {fmt.time(t.date)}</p>
      <p className="muted">{t.venue}</p>
      <div className="perf" />
      <p><b>{reg.name}</b><br /><span className="muted">{reg.email}</span></p>
      <code>{reg.id}</code>
      {children}
    </div>
  );
}

export function Tickets({ regs, events, onCancel, onBrowse }) {
  if (!regs.length)
    return (
      <div className="empty">
        <h2>No tickets yet</h2>
        <p className="muted">Register for an event and your ticket will appear here.</p>
        <button className="btn" onClick={onBrowse}>Find an event</button>
      </div>
    );
  return (
    <section className="tickets">
      <h2>My tickets</h2>
      <div className="stubs">
        {regs.map(r => {
          const t = events.find(x => x.id === r.eventId);
          return (
            <Stub key={r.id} reg={r} event={t}>
              <a className="textlink" href={gcal(t)} target="_blank" rel="noreferrer">Add to calendar</a>
              <button className="btn sm alt" onClick={() => onCancel(r.id)}>Cancel registration</button>
            </Stub>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Details + registration drawer ---------- */
const FIELDS = [
  ["name", "Full name", "text", "name", "Aarav Sharma"],
  ["email", "Email address", "email", "email", "you@example.com"],
  ["phone", "Phone number", "tel", "tel", "98765 43210"],
];

const validate = f => {
  const err = {};
  if (!/^[A-Za-z][A-Za-z .'-]{2,49}$/.test(f.name.trim())) err.name = "Enter your full name using letters only (at least 3 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) err.email = "Enter a valid email address, like you@example.com.";
  if (!/^(\+91)?[6-9]\d{9}$/.test(f.phone.replace(/[\s-]/g, ""))) err.phone = "Enter a valid 10-digit mobile number (optionally starting with +91).";
  if (!f.eventId) err.eventId = "Choose the event you want to attend.";
  return err;
};

function Field({ id, label, error, children }) {
  return (
    <div className="fld">
      <label htmlFor={id}>{label}</label>
      {children}
      <span className="err" id={`${id}-err`} role="alert">{error}</span>
    </div>
  );
}

export function Drawer({ event: e, events, regs, left, onClose, onRegister }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", eventId: String(e.id) });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);

  useEffect(() => {
    const onKey = ev => ev.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const set = k => ev => {
    const next = { ...form, [k]: ev.target.value };
    setForm(next);
    if (errors[k]) setErrors(p => ({ ...p, [k]: validate(next)[k] }));
  };
  const blur = k => () => form[k] && setErrors(p => ({ ...p, [k]: validate(form)[k] }));

  const submit = ev => {
    ev.preventDefault();
    const err = validate(form);
    const target = events.find(x => x.id === Number(form.eventId));
    const email = form.email.trim().toLowerCase();
    if (target && left(target) <= 0) err.eventId = "This event is sold out. Choose another event.";
    if (!err.email && target && regs.some(r => r.eventId === target.id && r.email === email)) err.email = "This email is already registered for this event.";
    setErrors(err);
    if (Object.keys(err).length) return;
    const reg = { id: "GTH-" + Math.random().toString(36).slice(2, 8).toUpperCase(), eventId: target.id, name: form.name.trim(), email, phone: form.phone.trim() };
    onRegister(reg);
    setDone({ reg, target });
  };

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={e.title}>
        <button className="icon close" onClick={onClose} aria-label="Close details" autoFocus>✕</button>
        {done ? (
          <div className="done">
            <h2>You are registered</h2>
            <p className="muted">Your ticket is saved under My tickets.</p>
            <Stub reg={done.reg} event={done.target} />
            <div className="actions">
              <a className="btn" href={gcal(done.target)} target="_blank" rel="noreferrer">Add to calendar</a>
              <button className="btn alt" onClick={onClose}>Close</button>
            </div>
          </div>
        ) : (
          <>
            <p className="cat">{e.category}</p>
            <h2 className="d-title">{e.title}</h2>
            <dl className="facts">
              <div><dt>Date</dt><dd>{fmt.date(e.date)}</dd></div>
              <div><dt>Time</dt><dd>{fmt.time(e.date)}</dd></div>
              <div><dt>Venue</dt><dd>{e.venue}</dd></div>
              <div><dt>Price</dt><dd>{fmt.price(e.price)}</dd></div>
              <div><dt>Seats left</dt><dd>{left(e)}</dd></div>
            </dl>
            <Countdown to={e.date} />
            <p className="about">{e.about}</p>
            <form onSubmit={submit} noValidate>
              <h3>Register</h3>
              {FIELDS.map(([k, label, type, ac, ph]) => (
                <Field key={k} id={k} label={label} error={errors[k]}>
                  <input id={k} type={type} autoComplete={ac} placeholder={ph} value={form[k]} onChange={set(k)} onBlur={blur(k)} className={errors[k] ? "bad" : ""} aria-invalid={!!errors[k]} aria-describedby={`${k}-err`} />
                </Field>
              ))}
              <Field id="eventId" label="Event" error={errors.eventId}>
                <select id="eventId" value={form.eventId} onChange={set("eventId")} className={errors.eventId ? "bad" : ""} aria-describedby="eventId-err">
                  {events.map(x => (
                    <option key={x.id} value={x.id} disabled={left(x) <= 0}>{x.title}{left(x) <= 0 ? " (sold out)" : ""}</option>
                  ))}
                </select>
              </Field>
              <button className="btn block" type="submit">Confirm registration</button>
            </form>
          </>
        )}
      </aside>
    </>
  );
}
