// Dates are generated relative to today so the demo never shows expired events.
const when = (days, time) => {
  const [h, m] = time.split(":");
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(+h, +m, 0, 0);
  return d.toISOString();
};

export const CATEGORIES = ["Tech", "Culture", "Business", "Arts", "Sports"];

export const EVENTS = [
  { id: 1, title: "Hack the Night: 24-hour Codeathon", category: "Tech", date: when(6, "09:00"), venue: "CS Block, Lab 3", price: 0, seats: 120, emoji: "💻", color: "#bfe3d6", seed: "codeathon", featured: true,
    desc: "Ready to turn caffeine, crazy ideas, and a little chaos into something legendary? Grab your team and register now!",
    about: "Teams of up to four build a project from scratch in 24 hours. Mentors from industry review progress at midnight and sunrise, and the top three teams win prizes and interview slots." },
  { id: 2, title: "RoboWars Arena", category: "Tech", date: when(20, "10:00"), venue: "Main Workshop Hall", price: 200, seats: 60, emoji: "🤖", color: "#f6c9bf", seed: "robowars",
    desc: "Bring your bot and battle it out in a knockout bracket.",
    about: "Weight classes of 5 kg and 10 kg. Safety inspection starts at 9:00 and matches run until late afternoon. Spectators are welcome and the arena is fully enclosed." },
  { id: 3, title: "Happiness Concert", category: "Culture", date: when(4, "17:30"), venue: "Campus 6", price: 0, seats: 150, emoji: "🎤", color: "#f2e7a6", seed: "openmic",
    desc: "Poetry, stand-up, music. Sign up on the day or just listen.",
    about: "Five-minute slots for poets, comedians and musicians. Sign-up opens at 5:00 pm at the amphitheatre desk. Acoustic instruments only." },
  { id: 4, title: "Pitch Perfect: Startup Day", category: "Business", date: when(15, "11:00"), venue: "Incubation Centre", price: 150, seats: 90, emoji: "🚀", color: "#cfd8f5", seed: "startupday", featured: true,
    desc: "Pitch your idea to founders and get feedback in real time.",
    about: "Ten shortlisted teams pitch for seed mentorship. Everyone else can join the networking session and workshops on validating ideas and building a first prototype." },
  { id: 5, title: "Frames: Heritage Photography Walk", category: "Arts", date: when(8, "06:30"), venue: "Old Town Heritage Trail", price: 100, seats: 35, emoji: "📷", color: "#e4d3f0", seed: "photowalk",
    desc: "A guided sunrise walk with tips on light and composition.",
    about: "Meet at the old gate at 6:30. A working photographer leads a two-hour walk and reviews a few shots at the end. Phones and cameras are both fine." },
  { id: 6, title: "Sunrise 5K Fun Run", category: "Sports", date: when(11, "06:00"), venue: "Campus Ground", price: 0, seats: 300, emoji: "🏃", color: "#fbd9a8", seed: "funrun",
    desc: "A relaxed 5K loop for runners and walkers, with breakfast after.",
    about: "Run or walk at your own pace. Water points at every kilometre, a finisher badge for all and a breakfast stall at the finish." },
  { id: 7, title: "Inter-College Dance Battle", category: "Culture", date: when(26, "16:00"), venue: "Open Air Theatre", price: 250, seats: 400, emoji: "💃", color: "#f7c3d3", seed: "dancebattle", featured: true,
    desc: "Twelve crews, three rounds and one trophy.",
    about: "Crews from twelve colleges compete across freestyle, choreography and face-off rounds. Judges include professional choreographers. Gates open at 3:00 pm." },
  { id: 8, title: "Ideathon", category: "Tech", date: when(13, "14:00"), venue: "Seminar Hall B", price: 300, seats: 80, emoji: "🧠", color: "#c4e8f0", seed: "aiworkshop",
    desc: "Pitch your ideas and be the shark!! Register now.",
    about: "Start from prompts and end with a deployed mini app. No prior machine learning experience is needed, but you should be comfortable with basic JavaScript or Python." },
  { id: 9, title: "Chess Blitz Championship", category: "Sports", date: when(32, "10:00"), venue: "Games Room", price: 50, seats: 64, emoji: "♟️", color: "#d9d9d2", seed: "chessblitz",
    desc: "Seven rounds of 5+0 blitz. Boards and clocks provided.",
    about: "Swiss format with seven rounds. Pairings are published on the notice board after each round. The top three players receive trophies." },
  { id: 10, title: "Pottery and Chill", category: "Arts", date: when(18, "15:00"), venue: "Craft Studio", price: 400, seats: 25, emoji: "🏺", color: "#f0d2b8", seed: "pottery",
    desc: "Shape, glaze and take home your own clay piece.",
    about: "A potter walks you through wheel basics, hand-building and glazing. Your piece is fired after the session and ready to collect the following week." },
];
