import { useState } from "react";
import {
  Gamepad2, Monitor, Smartphone, Joystick, MapPin, Youtube, Play, Utensils,
  User, ExternalLink, Film, Star, Footprints, Flag, Route,
  Image as ImageIcon, Store, ShoppingBag, ChefHat, Clock, Facebook, Music2,
} from "lucide-react";

/* =========================================================
   ✏️  วิธีเพิ่ม/แก้เนื้อหา:
   แก้ข้อมูลใน 3 ก้อนด้านล่างนี้ (GAMING / RUNS / FOOD)
   แล้ว commit ขึ้น GitHub — เว็บจะอัปเดตเองใน 1-2 นาที
   ========================================================= */

// ---------- helpers ----------
const getYouTubeId = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
};

const PLATFORMS = [
  { id: "pc", label: "PC", icon: Monitor },
  { id: "console", label: "Console", icon: Joystick },
  { id: "mobile", label: "Mobile", icon: Smartphone },
];

const FOOD_CATS = [
  { id: "restaurant", label: "ร้านอาหาร", icon: Store },
  { id: "conv", label: "ร้านสะดวกซื้อ", icon: ShoppingBag },
  { id: "diy", label: "เมนูทำเอง", icon: ChefHat },
];

/* =========================================================
   1) เรื่องเกม — เพิ่มคลิปเกมตรงนี้
   platform: "pc" | "console" | "mobile"
   type: "youtube" | "tiktok"
   ========================================================= */
const GAMING = [
  {
    id: 1, platform: "pc", type: "youtube", badge: "ยอดนิยม",
    title: "คลิปเกมยอดนิยม",
    url: "https://www.youtube.com/watch?v=oAdGhJzaHFY",
    desc: "คลิปที่คนดูเยอะที่สุด ห้ามพลาด!",
  },
  {
    id: 2, platform: "pc", type: "youtube", badge: "แนะนำ",
    title: "คลิปเกมแนะนำ",
    url: "https://www.youtube.com/watch?v=xhUuWHuJzAM",
    desc: "คลิปที่อยากแนะนำให้ลองดู",
  },
  {
    id: 3, platform: "pc", type: "youtube", badge: "ล่าสุด",
    title: "คลิปเกมล่าสุด",
    url: "https://www.youtube.com/watch?v=KiiT9IgnKb4",
    desc: "คอนเทนต์เกมใหม่ล่าสุดจากช่อง!",
  },
];

/* =========================================================
   2) เรื่องวิ่ง — เพิ่มเส้นทางวิ่งตรงนี้
   แต่ละจุด stage: "start" | "mid" | "finish"
   img: ใส่ลิงก์รูป (https://...) เว้นว่างถ้ายังไม่มี
   ========================================================= */
const RUNS = [
  {
    id: 1,
    title: "City Run รอบเมืองเก่า",
    distance: "5.2 กม.",
    duration: "42 นาที",
    points: [
      { stage: "start", place: "หน้าวัดเก่า", img: "", note: "ออกตัวเช้าตรู่ อากาศกำลังดี" },
      { stage: "mid", place: "ริมคลอง", img: "", note: "วิวสวย แวะถ่ายรูปนิดหน่อย" },
      { stage: "finish", place: "ลานกิจกรรม", img: "", note: "จบทริปด้วยความฟิน!" },
    ],
  },
];

/* =========================================================
   3) เรื่องกิน — เพิ่มเมนู/ร้านตรงนี้
   cat: "restaurant" | "conv" (7-11) | "diy"
   type: "youtube" | "tiktok"
   url: ถ้ายังไม่ได้อัปคลิป ให้เว้นเป็น "" ไว้
        การ์ดจะขึ้นว่า "ยังไม่มีคลิป" และกดไม่ได้ แทนที่จะพาไปหน้าเสีย
   ========================================================= */
const FOOD = [
  {
    id: 1, cat: "restaurant", type: "tiktok",
    title: "ก๋วยเตี๋ยวเรือเจ้าเด็ด ย่านเมืองเก่า",
    url: "",
    desc: "น้ำซุปเข้มข้นมาก ⭐ 9/10",
    location: "ย่านเมืองเก่า",
  },
  {
    id: 2, cat: "conv", type: "tiktok",
    title: "รีวิวเมนูใหม่ 7-11 ต้องลอง!",
    url: "",
    desc: "ของกินใหม่ในเซเว่น อร่อยเกินราคา",
    location: "7-Eleven",
  },
];

/* =========================================================
   ช่องทางติดตาม — แยกตามหมวด
   ========================================================= */
const SOCIAL_GAME = {
  youtube: "https://www.youtube.com/@FLUKEGAMEROFFICIAL",
  tiktok: "https://www.tiktok.com/@flukegamerofficial",
  facebook: "https://www.facebook.com/flukegamerth/",
};
const SOCIAL_RUN = {
  facebook: "https://www.facebook.com/FlukerunnerOfficial/",
};

/* =========================================================
   ธีมสามหมวด — เขียนคลาสเต็มไว้ทุกตัว
   (Tailwind สแกนหาคลาสจากซอร์ส ห้ามต่อสตริงเอาเอง)
   ========================================================= */
const THEME = {
  game: {
    label: "เกม", en: "GAMING", icon: Gamepad2,
    solid: "bg-game text-white",
    text: "text-game",
    accentInk: "text-game-ink",
    cover: "bg-game",
    glow: "shadow-[7px_7px_0_#6C4AF6]",
  },
  run: {
    label: "วิ่ง", en: "RUNNING", icon: Footprints,
    solid: "bg-run text-run-on",
    text: "text-run-ink",
    accentInk: "text-run-ink",
    cover: "bg-run",
    glow: "shadow-[7px_7px_0_#0FA37F]",
  },
  eat: {
    label: "กิน", en: "FOOD", icon: Utensils,
    solid: "bg-eat text-white",
    text: "text-eat",
    accentInk: "text-eat-ink",
    cover: "bg-eat",
    glow: "shadow-[7px_7px_0_#EF5327]",
  },
};

// ---------- แถบข่าววิ่ง ----------
function Ticker() {
  const run = RUNS[0];
  const items = [
    GAMING[0] && `NOW PLAYING — ${GAMING[0].title}`,
    run && `CITY RUN — ${run.distance} / ${run.duration}`,
    FOOD[0] && `LAST MEAL — ${FOOD[0].title}`,
    "PLAY / RUN / EAT",
  ].filter(Boolean);

  const strip = (
    <div className="flex shrink-0 gap-7 pr-7">
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-7 whitespace-nowrap font-mono text-xs sm:text-sm tracking-[0.16em]">
          {t}
          <span className="text-sun">//</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y-3 border-ink bg-night py-4 text-paper">
      <div className="flex w-max animate-marquee">
        {strip}
        {strip}
      </div>
    </div>
  );
}

// ---------- ชิปกรอง ----------
function FilterRow({ options, value, onChange }) {
  return (
    <div className="mb-7 flex flex-wrap items-center gap-2.5">
      <span className="pr-1 font-mono text-[10px] tracking-[0.2em] text-ink-faint">กรอง</span>
      {options.map((o) => {
        const on = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`flex h-11 items-center gap-2 rounded-full border-2 border-ink px-4 text-sm font-semibold transition ${
              on ? "bg-ink text-paper" : "bg-transparent text-ink hover:bg-ink/5"
            }`}
          >
            <o.icon className="h-4 w-4" />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------- หัวข้อหมวด ----------
function SectionHead({ theme, title, lead }) {
  const Icon = theme.icon;
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] tracking-[0.22em] text-ink-faint">{theme.en}</span>
        <h2 className="flex items-center gap-3 text-3xl/[1.3] sm:text-4xl/[1.3] lg:text-[2.75rem]/[1.3]">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-3 border-ink shadow-hard-sm ${theme.solid}`}>
            <Icon className="h-6 w-6" />
          </span>
          {title}
        </h2>
      </div>
      {lead && <p className="max-w-sm text-[15px] leading-thai text-ink-muted">{lead}</p>}
    </div>
  );
}

// ---------- การ์ดคลิป ----------
function MediaCard({ item, theme }) {
  const ytId = item.type === "youtube" ? getYouTubeId(item.url) : null;
  const hasLink = Boolean(item.url);

  return (
    <article className="group flex flex-col overflow-hidden rounded-[20px] border-3 border-ink bg-white shadow-hard-md transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg">
      <div className={`relative aspect-video border-b-3 border-ink ${theme.cover}`}>
        {ytId ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
            <img
              src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-ink/25 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-3 border-ink bg-paper shadow-hard-sm">
                <Play className="h-6 w-6 fill-ink text-ink" />
              </span>
            </span>
            <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-paper">
              <Youtube className="h-3.5 w-3.5" /> YOUTUBE
            </span>
          </a>
        ) : item.type === "tiktok" && hasLink ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="relative block h-full w-full">
            <span className="absolute inset-0 bg-stripes" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-3 border-ink bg-paper shadow-hard-sm">
                <Play className="h-6 w-6 fill-ink text-ink" />
              </span>
            </span>
            <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-paper">
              <Music2 className="h-3.5 w-3.5" /> TIKTOK
            </span>
            <span className="absolute bottom-3 right-3 flex items-center gap-1 font-mono text-[10px] tracking-[0.14em] text-white">
              แตะเพื่อรับชม <ExternalLink className="h-3 w-3" />
            </span>
          </a>
        ) : (
          /* ยังไม่มีลิงก์คลิป — แสดงสถานะไว้เฉย ๆ ไม่ทำเป็นลิงก์ที่กดแล้วเจอหน้าเสีย */
          <span className="relative flex h-full w-full items-center justify-center">
            <span className="absolute inset-0 bg-stripes" />
            <span className="relative flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-4 py-2.5 font-mono text-[11px] tracking-[0.12em] text-ink">
              <Film className="h-4 w-4" /> ยังไม่มีคลิป
            </span>
          </span>
        )}

        {item.badge && (
          <span className="absolute bottom-3 left-3 rounded-full border-2 border-ink bg-paper px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-ink">
            {item.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-extrabold leading-thai-tight">{item.title}</h3>
        {item.desc && <p className="text-sm leading-thai text-ink-muted">{item.desc}</p>}
        {item.location && (
          <p className={`mt-auto flex items-center gap-1.5 border-t-2 border-dashed border-paper-hair pt-3.5 font-mono text-[11px] ${theme.accentInk}`}>
            <MapPin className="h-3.5 w-3.5" /> {item.location}
          </p>
        )}
      </div>
    </article>
  );
}

// ---------- ไทม์ไลน์เส้นทางวิ่ง ----------
const STAGE = {
  start: { icon: Footprints, label: "จุดเริ่มต้น", en: "START" },
  mid: { icon: Route, label: "ระหว่างทาง", en: "MIDWAY" },
  finish: { icon: Flag, label: "เส้นชัย", en: "FINISH" },
};

function RunCard({ run }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-4 rounded-[20px] border-3 border-ink bg-run p-6 text-run-on shadow-hard-md">
        <h3 className="flex-1 text-2xl/[1.35] sm:text-[1.75rem]/[1.35]">{run.title}</h3>
        <span className="flex h-11 items-center gap-2 rounded-full border-3 border-run-on bg-paper px-4 font-mono text-sm font-semibold">
          <Route className="h-4 w-4" /> {run.distance}
        </span>
        <span className="flex h-11 items-center gap-2 rounded-full border-3 border-run-on bg-paper px-4 font-mono text-sm font-semibold">
          <Clock className="h-4 w-4" /> {run.duration}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {run.points.map((pt, i) => {
          const st = STAGE[pt.stage] || STAGE.mid;
          const Icon = st.icon;
          return (
            <article key={i} className="flex flex-col overflow-hidden rounded-[20px] border-3 border-ink bg-paper shadow-hard-md">
              <div className="relative h-44 border-b-3 border-ink bg-run">
                <span className="absolute inset-0 bg-stripes" />
                {pt.img ? (
                  <img src={pt.img} alt={pt.place} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-3.5 py-2 font-mono text-[11px] tracking-[0.12em] text-ink">
                      <ImageIcon className="h-4 w-4" /> ยังไม่มีรูป
                    </span>
                  </span>
                )}
                <span className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border-3 border-ink bg-paper font-display text-base font-black">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-col gap-2.5 p-5">
                <span className={`flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-run-ink`}>
                  <Icon className="h-3.5 w-3.5" /> {st.label} / {st.en}
                </span>
                <h4 className="text-xl/[1.4]">{pt.place}</h4>
                {pt.note && <p className="text-[15px] leading-thai text-ink-muted">{pt.note}</p>}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// ---------- แถวปุ่มติดตาม ----------
function FollowRow({ label, links }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <span className="pr-1 font-mono text-[11px] tracking-[0.18em] text-ink-faint">{label}</span>
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center gap-2.5 rounded-full border-3 border-ink bg-paper px-5 text-sm font-semibold shadow-hard-sm transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard"
        >
          <l.icon className="h-4 w-4" />
          {l.label}
        </a>
      ))}
    </div>
  );
}

// ---------- ว่างเปล่า ----------
function Empty({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[20px] border-3 border-dashed border-paper-line bg-paper py-16 text-ink-ghost">
      <Icon className="h-10 w-10" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

// ---------- main ----------
export default function App() {
  const [tab, setTab] = useState("all");
  const [foodTab, setFoodTab] = useState("all");

  const filteredGaming = tab === "all" ? GAMING : GAMING.filter((g) => g.platform === tab);
  const filteredFood = foodTab === "all" ? FOOD : FOOD.filter((f) => f.cat === foodTab);

  const jump = [
    { href: "#gaming", theme: THEME.game, note: "PC · Console · Mobile" },
    { href: "#running", theme: THEME.run, note: "วิ่งสำรวจเมืองเก่า" },
    { href: "#food", theme: THEME.eat, note: "ร้านดัง · สะดวกซื้อ · ทำเอง" },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ===== nav ===== */}
      <nav className="sticky top-0 z-40 border-b-3 border-ink bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-3 border-ink bg-game text-paper shadow-hard-sm">
              <Gamepad2 className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-extrabold">flukesociety.com</span>
              <span className="mt-1 font-mono text-[9px] tracking-[0.22em] text-ink-faint">PLAY / RUN / EAT</span>
            </span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {[
              { href: "#gaming", th: "เกม", en: "GAMING" },
              { href: "#running", th: "วิ่ง", en: "RUNNING" },
              { href: "#food", th: "กิน", en: "FOOD" },
              { href: "#about", th: "เกี่ยวกับ", en: "ABOUT" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="flex flex-col leading-none transition hover:text-game">
                <span className="text-[15px] font-semibold">{l.th}</span>
                <span className="mt-1 font-mono text-[9px] tracking-[0.16em] text-ink-faint">{l.en}</span>
              </a>
            ))}
          </div>

          <a
            href="#about"
            className="flex h-12 items-center gap-2 rounded-full border-3 border-ink bg-sun px-5 text-sm font-bold shadow-hard-sm transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard"
          >
            <Youtube className="h-4 w-4" />
            <span className="hidden sm:inline">ติดตามช่อง</span>
          </a>
        </div>
      </nav>

      {/* ===== hero ===== */}
      <header id="top" className="bg-dots bg-dot">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-14 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          <div className="flex flex-col gap-6">
            <span className="flex w-fit items-center gap-2.5 rounded-full bg-ink px-4 py-2.5 text-paper">
              <span className="h-2.5 w-2.5 rounded-full bg-run" />
              <span className="font-mono text-[11px] tracking-[0.18em]">PERSONAL BLOG — flukesociety.com</span>
            </span>

            {/* ไทยมีสระบน-ล่างและวรรณยุกต์ ต้องกำหนด line-height ทุก breakpoint
                ไม่งั้น utility ของ font-size จะรีเซ็ตกลับเป็น 1.0 แล้วสระบนโดนตัด */}
            <h1 className="text-6xl/[1.12] tracking-tight sm:text-7xl/[1.12] lg:text-[6rem]/[1.12]">
              <span className="block text-game">เล่นเกม</span>
              <span className="block text-run">ออกวิ่ง</span>
              <span className="block text-eat">แล้วไปกิน</span>
            </h1>

            <p className="font-mono text-sm tracking-[0.14em] text-ink-faint">PLAY. RUN. EAT.</p>

            <p className="max-w-xl text-lg leading-thai text-ink-soft">
              บล็อกส่วนตัวรวมความชอบ — เล่นเกมทุกแพลตฟอร์ม ออกเดินวิ่งสำรวจเมือง
              แล้วตามหาของอร่อยทั้งร้านดัง ร้านสะดวกซื้อ และเมนูทำเอง
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={SOCIAL_GAME.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 items-center gap-2.5 rounded-2xl border-3 border-ink bg-game px-7 text-[17px] font-bold text-white shadow-hard-md transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
              >
                <Youtube className="h-5 w-5" /> ติดตามช่องเกม
              </a>
              <a href="#gaming" className="flex h-14 items-center border-b-3 border-ink px-1 text-[17px] font-semibold">
                ดูคลิปล่าสุด
              </a>
            </div>

            <p className="font-mono text-xs tracking-[0.1em] text-ink-faint">
              YouTube · TikTok · Facebook — คลิปใหม่ทุกสัปดาห์
            </p>
          </div>

          {/* การ์ดสามหมวด — กดแล้วเลื่อนไปที่ section */}
          <div className="flex flex-col gap-4 pt-2">
            {jump.map((j, i) => {
              const Icon = j.theme.icon;
              const tilt = ["-rotate-2", "rotate-2 lg:ml-6", "-rotate-1 lg:ml-2"][i];
              return (
                <a
                  key={j.href}
                  href={j.href}
                  className={`flex items-center gap-4 rounded-[20px] border-3 border-ink p-5 shadow-hard-md transition hover:rotate-0 hover:-translate-y-1 ${j.theme.solid} ${tilt}`}
                >
                  <Icon className="h-7 w-7 shrink-0" />
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="font-display text-xl font-extrabold leading-thai-tight">{j.theme.label}</span>
                    <span className="font-mono text-[11px] opacity-90">{j.note}</span>
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.18em] opacity-80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </header>

      <Ticker />

      {/* ===== 1. GAMING ===== */}
      <section id="gaming" className="border-b-3 border-ink bg-paper-deep">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <SectionHead
            theme={THEME.game}
            title="เรื่องเกม"
            lead="คลิป Walkthrough และคอนเทนต์เกมทุกแพลตฟอร์ม กรองตามเครื่องที่เล่นได้"
          />

          <FilterRow
            options={[{ id: "all", label: "ทั้งหมด", icon: Star }, ...PLATFORMS]}
            value={tab}
            onChange={setTab}
          />

          {filteredGaming.length === 0 ? (
            <Empty icon={Gamepad2} text="ยังไม่มีคลิปในหมวดนี้" />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGaming.map((item) => (
                <MediaCard key={item.id} item={item} theme={THEME.game} />
              ))}
            </div>
          )}

          <FollowRow
            label="ติดตามช่องเกม"
            links={[
              { href: SOCIAL_GAME.youtube, label: "YouTube", icon: Youtube },
              { href: SOCIAL_GAME.tiktok, label: "TikTok", icon: Music2 },
              { href: SOCIAL_GAME.facebook, label: "Facebook", icon: Facebook },
            ]}
          />
        </div>
      </section>

      {/* ===== 2. RUNNING ===== */}
      <section id="running" className="border-b-3 border-ink bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <SectionHead
            theme={THEME.run}
            title="เรื่องวิ่ง · City Run"
            lead="วิ่งสำรวจเมืองเก่าเป็นเส้นทาง เก็บภาพและบันทึกไว้ทีละช่วง"
          />

          {RUNS.length === 0 ? (
            <Empty icon={Footprints} text="ยังไม่มีเส้นทางวิ่ง" />
          ) : (
            <div className="flex flex-col gap-12">
              {RUNS.map((run) => (
                <RunCard key={run.id} run={run} />
              ))}
            </div>
          )}

          <FollowRow
            label="ติดตามช่องวิ่ง"
            links={[{ href: SOCIAL_RUN.facebook, label: "Facebook", icon: Facebook }]}
          />
        </div>
      </section>

      {/* ===== 3. FOOD ===== */}
      <section id="food" className="border-b-3 border-ink bg-paper-deep">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <SectionHead
            theme={THEME.eat}
            title="เรื่องกิน · Food Journey"
            lead="ร้านดัง ของกินใหม่ในร้านสะดวกซื้อ และเมนูที่ทำเองที่บ้าน"
          />

          <FilterRow
            options={[{ id: "all", label: "ทั้งหมด", icon: Star }, ...FOOD_CATS]}
            value={foodTab}
            onChange={setFoodTab}
          />

          {filteredFood.length === 0 ? (
            <Empty icon={Utensils} text="ยังไม่มีเมนูในหมวดนี้" />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFood.map((item) => (
                <MediaCard key={item.id} item={item} theme={THEME.eat} />
              ))}
            </div>
          )}

          <FollowRow
            label="ดูคลิปกินได้ที่"
            links={[{ href: SOCIAL_GAME.tiktok, label: "TikTok", icon: Music2 }]}
          />
        </div>
      </section>

      {/* ===== about ===== */}
      <section id="about" className="bg-night bg-dots-light bg-dot text-paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
          <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-3xl border-3 border-paper bg-sun shadow-hard-light lg:h-80">
            <span className="absolute inset-0 bg-stripes" />
            <span className="relative flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-4 py-2.5 font-mono text-[11px] tracking-[0.12em] text-ink">
              <User className="h-4 w-4" /> [ใส่รูปตัวเองตรงนี้]
            </span>
          </div>

          <div className="flex flex-col gap-5">
            <span className="font-mono text-[11px] tracking-[0.22em] text-sun">ABOUT ME — เกี่ยวกับผม</span>
            <h2 className="text-4xl/[1.3] lg:text-[2.75rem]/[1.3]">สวัสดีครับ</h2>
            <p className="text-[17px] leading-thai text-night-text">
              ผมเป็นเกมเมอร์ที่หลงใหลการเล่นเกมทุกแพลตฟอร์ม ตั้งแต่ PC, Console ไปจนถึง Mobile
              ทำคลิป Walkthrough และคอนเทนต์เกมลง YouTube, TikTok และ Facebook
            </p>
            <p className="text-[17px] leading-thai text-night-text">
              นอกจากเกมแล้ว ผมยังชอบออกไปวิ่งสำรวจเมืองแบบ City Run และตามหาของอร่อย
              ทั้งร้านดัง เมนูใหม่ในร้านสะดวกซื้อ ไปจนถึงเมนูทำเองที่บ้าน มาแชร์ให้ทุกคนได้ตามรอยกันครับ
            </p>

            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              {[
                { platform: "YOUTUBE", label: "ช่องเกมหลัก", handle: "@FLUKEGAMEROFFICIAL", href: SOCIAL_GAME.youtube, ring: "shadow-[7px_7px_0_#6C4AF6]", tint: "text-game" },
                { platform: "TIKTOK", label: "คลิปสั้น เกมและของกิน", handle: "@flukegamerofficial", href: SOCIAL_GAME.tiktok, ring: "shadow-[7px_7px_0_#EF5327]", tint: "text-eat" },
                { platform: "FACEBOOK", label: "เพจเกม", handle: "flukegamerth", href: SOCIAL_GAME.facebook, ring: "shadow-[7px_7px_0_#FFC93C]", tint: "text-sun" },
                { platform: "FACEBOOK", label: "เพจวิ่ง", handle: "FlukerunnerOfficial", href: SOCIAL_RUN.facebook, ring: "shadow-[7px_7px_0_#0FA37F]", tint: "text-run" },
              ].map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col gap-2.5 rounded-[20px] border-3 border-paper bg-night-card p-5 transition hover:-translate-y-1 ${s.ring}`}
                >
                  <span className="flex items-center justify-between">
                    <span className={`font-mono text-[10px] tracking-[0.2em] ${s.tint}`}>{s.platform}</span>
                    <ExternalLink className="h-4 w-4" />
                  </span>
                  <span className="font-display text-lg font-extrabold leading-thai-tight">{s.label}</span>
                  <span className="break-all font-mono text-xs text-night-text">{s.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-5 pb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-night-line pt-6 font-mono text-[11px] tracking-[0.12em] text-night-text">
            <span>© 2026 flukesociety.com — Play · Run · Eat</span>
            <span>PLAY / RUN / EAT</span>
          </div>
        </div>
      </section>
    </div>
  );
}
