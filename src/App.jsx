import { useState, useEffect, useRef } from "react";
import youtubeLatest from "./data/youtube-latest.json";
import {
  Gamepad2, Monitor, Smartphone, Joystick, MapPin, Youtube, Play, Utensils,
  User, ExternalLink, Film, Star, Footprints, Flag, Route,
  Image as ImageIcon, Store, ShoppingBag, ChefHat, Clock, Facebook, Music2,
} from "lucide-react";

/* =========================================================
   ✏️  วิธีเพิ่ม/แก้เนื้อหา:
   แก้ข้อมูลใน 3 ก้อนด้านล่างนี้ (GAMING / RUNS / FOOD)
   แล้ว commit ขึ้น GitHub — เว็บจะอัปเดตเองใน 1-2 นาที
   (การ์ดเกม "ล่าสุด" อัปเดตเองจากช่อง YouTube ไม่ต้องแก้)
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
   1) เรื่องเกม — คลิปที่เลือกเอง (ยอดนิยม / แนะนำ)
   platform: "pc" | "console" | "mobile"
   type: "youtube" | "tiktok"

   การ์ด "ล่าสุด" ไม่ต้องแก้เอง: ระบบดึงคลิปใหม่จากช่อง YouTube ให้ทุก 6 ชั่วโมง
   (ไฟล์ src/data/youtube-latest.json — อย่าแก้ไฟล์นั้นด้วยมือ เพราะจะถูกเขียนทับ)
   ========================================================= */
const GAMING = [
  {
    id: 1, platform: "console", type: "youtube", badge: "ยอดนิยม",
    title: "คลิปเกมยอดนิยม",
    url: "https://www.youtube.com/watch?v=oAdGhJzaHFY",
    desc: "คลิปที่คนดูเยอะที่สุด ห้ามพลาด!",
  },
  {
    id: 2, platform: "console", type: "youtube", badge: "แนะนำ",
    title: "คลิปเกมแนะนำ",
    url: "https://www.youtube.com/watch?v=xhUuWHuJzAM",
    desc: "คลิปที่อยากแนะนำให้ลองดู",
  },
];

/* =========================================================
   ✏️ ชื่อเกม → เครื่องที่เล่น (ใช้กับการ์ด "ล่าสุด" ที่ดึงมาเอง)

   ระบบดูว่าชื่อคลิปมีคำใน match ไหม (ตัวพิมพ์เล็ก/ใหญ่ไม่สำคัญ) แล้วใส่หมวดตาม platform
   ตัวอย่าง: คลิปชื่อ "... Game Onimusha Way of the Sword" มีคำว่า Onimusha → Console

   เริ่มเล่นเกมใหม่เมื่อไหร่ ให้เพิ่มหนึ่งบรรทัด เช่น
     { match: "Elden Ring", platform: "pc" },
   เกมที่ยังไม่มีในตารางจะแสดงเฉพาะตอนกดปุ่ม "ทั้งหมด" (ไม่เดาหมวดให้ เพราะเดาผิดแย่กว่า)
   platform: "pc" | "console" | "mobile"
   ========================================================= */
const GAME_PLATFORMS = [
  { match: "Onimusha", platform: "console" },
  { match: "Borderlands", platform: "console" },
];

const platformFromTitle = (title) =>
  GAME_PLATFORMS.find((g) => title.toLowerCase().includes(g.match.toLowerCase()))?.platform || null;

// การ์ดล่าสุด: คลิปใหม่สุดของช่องที่ไม่ซ้ำกับคลิปที่เลือกเองไว้แล้ว วางไว้ใบแรก
const pickedIds = GAMING.map((g) => getYouTubeId(g.url));
const latestVideo = (youtubeLatest.videos || []).find((v) => !pickedIds.includes(v.id));
const postedOn = (iso) =>
  new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Bangkok" });
const GAMING_SHOWN = [
  latestVideo && {
    id: `yt-${latestVideo.id}`,
    platform: platformFromTitle(latestVideo.title),
    type: "youtube",
    badge: "ล่าสุด",
    title: latestVideo.title,
    url: latestVideo.url,
    desc: `คลิปใหม่จากช่อง · ลงเมื่อ ${postedOn(latestVideo.published)}`,
  },
  ...GAMING,
].filter(Boolean);

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
    // ตัวหนังสือบนพื้นส้มใช้สีหมึก: ขาวบนส้มได้ความต่างสีแค่ 3.6:1 อ่านยากกับตัวเล็ก
    // หมึกบนส้มได้ 4.7:1 ผ่านเกณฑ์ 4.5:1 เหมือนการ์ดเขียวที่ใช้ตัวเข้มอยู่แล้ว
    solid: "bg-eat text-ink",
    text: "text-eat",
    accentInk: "text-eat-ink",
    cover: "bg-eat",
    glow: "shadow-[7px_7px_0_#EF5327]",
  },
};

// ---------- โผล่ตามการเลื่อนหน้า ----------
// ห่อส่วนไหนก็ได้ ส่วนนั้นจะค่อย ๆ เลื่อนขึ้นตอนเข้าจอครั้งแรก
// delay = หน่วงเป็นมิลลิวินาที ใช้ไล่ทีละใบในกริดให้ดูเป็นจังหวะ
// ถ้าเครื่องเปิด "ลดการเคลื่อนไหว" หรือเบราว์เซอร์ไม่รองรับ จะแสดงทันทีเลย
// ส่วนที่อยู่ในจออยู่แล้วตอนเปิดหน้า (หรือกดลิงก์มาถึง) แสดงทันทีไม่มีแอนิเมชัน
function Reveal({ delay = 0, className = "", children }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const inViewNow = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    if (calm || !("IntersectionObserver" in window) || inViewNow()) {
      setInstant(true);
      setShown(true);
      return;
    }
    let guard = 0;
    const show = () => {
      setShown(true);
      io.disconnect();
      clearInterval(guard);
    };
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && show(),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    // กันพลาด: ถ้าอยู่ในจอแล้วแต่ตัวตรวจจับไม่ทำงานด้วยเหตุใดก็ตาม ให้แสดงเองภายใน 1.5 วินาที
    // เนื้อหาจะไม่ค้างเป็นช่องว่าง
    guard = setInterval(() => inViewNow() && show(), 1500);
    return () => {
      io.disconnect();
      clearInterval(guard);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ "--d": `${delay}ms` }}
      className={`reveal ${shown ? "is-in" : ""} ${instant ? "is-instant" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// ---------- หยุดแอนิเมชันวนซ้ำเมื่อพ้นจอ ----------
// ใส่ ref ที่ได้ให้กล่องไหนก็ได้ ตอนกล่องเลื่อนพ้นจอจะติด data-offscreen
// แล้ว CSS (index.css) สั่งหยุดแอนิเมชันข้างในให้เอง ประหยัดแบตมือถือ
function usePauseOffscreen() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.removeAttribute("data-offscreen");
      else el.setAttribute("data-offscreen", "");
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

// ---------- แถบข่าววิ่ง ----------
function Ticker() {
  const box = usePauseOffscreen();
  const run = RUNS[0];
  const items = [
    GAMING_SHOWN[0] && `NOW PLAYING — ${GAMING_SHOWN[0].title}`,
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
    <div ref={box} className="overflow-hidden border-y-3 border-ink bg-night py-4 text-paper">
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
    <Reveal className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
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
    </Reveal>
  );
}

// ---------- การ์ดคลิป ----------
// index = ลำดับในกริด ใช้หน่วงให้การ์ดโผล่ทีละใบ (สูงสุด 3 ใบ/แถว จึงวนทุก 3)
function MediaCard({ item, theme, index = 0 }) {
  const ytId = item.type === "youtube" ? getYouTubeId(item.url) : null;
  const hasLink = Boolean(item.url);
  // ภาพปกจาก YouTube โหลดไม่ขึ้น (เน็ตหลุด โดนบล็อก) → ซ่อนภาพเสีย เหลือพื้นสีหมวดกับลายทางแทน
  const [thumbFailed, setThumbFailed] = useState(false);

  return (
    <Reveal delay={(index % 3) * 60} className="h-full">
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border-3 border-ink bg-white shadow-hard-md transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg">
      {/* ภาพปกวางแบบลอย (absolute) ให้กรอบคงสัดส่วน 16:9 ภาพปก YouTube เป็น 4:3 มีแถบดำในตัว
          ถ้าปล่อยให้ภาพดันกรอบ กรอบจะสูงเป็น 4:3 แล้วแถบดำโผล่ — แบบนี้ object-cover ตัดแถบดำออกพอดี */}
      <div className={`relative aspect-video border-b-3 border-ink ${theme.cover}`}>
        {ytId ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 block">
            {thumbFailed ? (
              <span className="absolute inset-0 bg-stripes" />
            ) : (
              <img
                src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                alt={item.title}
                loading="lazy"
                width="480"
                height="360"
                onError={() => setThumbFailed(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
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
            {/* อยู่ในป้ายพื้นครีม: ตัวขาวบนพื้นส้มตรง ๆ อ่านยาก (ความต่างสีไม่ถึงเกณฑ์) */}
            <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full border-2 border-ink bg-paper px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-ink">
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
        {/* ชื่อคลิปจาก YouTube มักยาว ตัดที่ 2 บรรทัดให้การ์ดสูงเท่ากัน ชื่อเต็มดูได้ตอนชี้เมาส์ */}
        <h3 title={item.title} className="line-clamp-2 font-display text-lg font-extrabold leading-thai-tight">{item.title}</h3>
        {item.desc && <p className="text-sm leading-thai text-ink-muted">{item.desc}</p>}
        {item.location && (
          <p className={`mt-auto flex items-center gap-1.5 border-t-2 border-dashed border-paper-hair pt-3.5 font-mono text-[11px] ${theme.accentInk}`}>
            <MapPin className="h-3.5 w-3.5" /> {item.location}
          </p>
        )}
      </div>
    </article>
    </Reveal>
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
      <Reveal className="flex flex-wrap items-center gap-4 rounded-[20px] border-3 border-ink bg-run p-6 text-run-on shadow-hard-md">
        <h3 className="flex-1 text-2xl/[1.35] sm:text-[1.75rem]/[1.35]">{run.title}</h3>
        <span className="flex h-11 items-center gap-2 rounded-full border-3 border-run-on bg-paper px-4 font-mono text-sm font-semibold">
          <Route className="h-4 w-4" /> {run.distance}
        </span>
        <span className="flex h-11 items-center gap-2 rounded-full border-3 border-run-on bg-paper px-4 font-mono text-sm font-semibold">
          <Clock className="h-4 w-4" /> {run.duration}
        </span>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {run.points.map((pt, i) => {
          const st = STAGE[pt.stage] || STAGE.mid;
          const Icon = st.icon;
          return (
            <Reveal key={i} delay={(i % 3) * 60} className="h-full">
            <article className="flex h-full flex-col overflow-hidden rounded-[20px] border-3 border-ink bg-paper shadow-hard-md">
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
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

// ---------- แถวปุ่มติดตาม ----------
function FollowRow({ label, links }) {
  return (
    <Reveal className="mt-8 flex flex-wrap items-center gap-3">
      <span className="pr-1 font-mono text-[11px] tracking-[0.18em] text-ink-faint">{label}</span>
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="press flex h-12 items-center gap-2.5 rounded-full border-3 border-ink bg-paper px-5 text-sm font-semibold shadow-hard-sm transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard"
        >
          <l.icon className="h-4 w-4" />
          {l.label}
        </a>
      ))}
    </Reveal>
  );
}

// ---------- ว่างเปล่า ----------
function Empty({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[20px] border-3 border-dashed border-paper-line bg-paper py-16 text-ink-faint">
      <Icon className="h-10 w-10" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

// ---------- main ----------
// ---------- ลิงก์หมวด (ใช้ทั้งเมนูจอกว้างและแถบชิปมือถือ) ----------
// dot = จุดสีประจำหมวดหน้าชื่อบนมือถือ
const NAV_LINKS = [
  { href: "#gaming", th: "เกม", en: "GAMING", dot: "bg-game" },
  { href: "#running", th: "วิ่ง", en: "RUNNING", dot: "bg-run" },
  { href: "#food", th: "กิน", en: "FOOD", dot: "bg-eat" },
  { href: "#about", th: "เกี่ยวกับ", en: "ABOUT" },
];

export default function App() {
  const [tab, setTab] = useState("all");
  const [foodTab, setFoodTab] = useState("all");
  const heroRef = usePauseOffscreen();

  const filteredGaming = tab === "all" ? GAMING_SHOWN : GAMING_SHOWN.filter((g) => g.platform === tab);
  const filteredFood = foodTab === "all" ? FOOD : FOOD.filter((f) => f.cat === foodTab);

  const jump = [
    { href: "#gaming", theme: THEME.game, note: "PC · Console · Mobile" },
    { href: "#running", theme: THEME.run, note: "วิ่งสำรวจเมืองเก่า" },
    { href: "#food", theme: THEME.eat, note: "ร้านดัง · สะดวกซื้อ · ทำเอง" },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ลิงก์ซ่อนสำหรับคนใช้คีย์บอร์ด/โปรแกรมอ่านหน้าจอ: กด Tab ครั้งแรกจะโผล่ ข้ามเมนูไปที่เนื้อหาได้ */}
      <a
        href="#main"
        className="sr-only z-50 rounded-full border-3 border-ink bg-sun px-5 py-3 font-bold focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        ข้ามไปที่เนื้อหา
      </a>

      {/* ===== แถบบน =====
          จอกว้าง: ติดขอบบนตลอด มีเมนูหมวดในแถบ
          มือถือ: แถวโลโก้เลื่อนหายไปตามปกติ แล้วแถบชิปหมวดด้านล่างติดขอบบนแทน (ประหยัดพื้นที่จอ) */}
      <header className="z-40 bg-paper/95 backdrop-blur-md md:sticky md:top-0 md:border-b-3 md:border-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-3 border-ink bg-game text-paper shadow-hard-sm">
              <Gamepad2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-extrabold">flukesociety.com</span>
              <span className="mt-1 font-mono text-[9px] tracking-[0.22em] text-ink-faint">PLAY / RUN / EAT</span>
            </span>
          </a>

          <nav aria-label="เมนูหลัก" className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="flex flex-col leading-none transition hover:text-game">
                <span className="text-[15px] font-semibold">{l.th}</span>
                <span className="mt-1 font-mono text-[9px] tracking-[0.16em] text-ink-faint">{l.en}</span>
              </a>
            ))}
          </nav>

          <a
            href="#about"
            aria-label="ติดตามช่อง"
            className="press flex h-12 items-center gap-2 rounded-full border-3 border-ink bg-sun px-5 text-sm font-bold shadow-hard-sm transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard"
          >
            <Youtube className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">ติดตามช่อง</span>
          </a>
        </div>
      </header>

      {/* ===== แถบชิปหมวด (เฉพาะมือถือ) ===== */}
      <nav
        aria-label="หมวดหมู่"
        className="sticky top-0 z-40 border-y-3 border-ink bg-paper/95 backdrop-blur-md md:hidden"
      >
        <div className="grid grid-cols-4 gap-2 px-3 py-2.5">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex h-11 items-center justify-center gap-1.5 rounded-full border-2 border-ink bg-paper text-sm font-semibold active:bg-ink active:text-paper"
            >
              {l.dot && <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${l.dot}`} />}
              {l.th}
            </a>
          ))}
        </div>
      </nav>

      <main id="main">
      {/* ===== hero ===== */}
      <section id="top" ref={heroRef} className="bg-dots bg-dot">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-14 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          <div className="flex flex-col gap-6">
            {/* ข้อความและปุ่มหลักแสดงทันทีที่หน้าขึ้น ไม่มีแอนิเมชัน ไม่มีหน่วงเวลา
                (เดิมไล่เข้าฉากนานเกือบ 1.5 วินาที ปุ่มต้องรอกว่าจะกดได้) */}
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
                className="press flex h-14 items-center gap-2.5 rounded-2xl border-3 border-ink bg-game px-7 text-[17px] font-bold text-white shadow-hard-md transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg"
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
                // ชั้นนอกลอยขึ้นลง (bob) ชั้นในเข้าฉาก (rise) แยกกันเพื่อไม่ให้แอนิเมชันทับกัน
                // เข้าฉากสั้น 0.25 วินาที ไล่กันใบละ 60 ms — เป็นของตกแต่ง ไม่บังเนื้อหาหลัก
                <div key={j.href} style={{ "--d": `${400 + i * 500}ms` }} className="bob">
                <a
                  href={j.href}
                  style={{ "--d": `${i * 60}ms` }}
                  className={`rise flex items-center gap-4 rounded-[20px] border-3 border-ink p-5 shadow-hard-md transition hover:rotate-0 hover:-translate-y-1 ${j.theme.solid} ${tilt}`}
                >
                  <Icon className="h-7 w-7 shrink-0" aria-hidden="true" />
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="font-display text-xl font-extrabold leading-thai-tight">{j.theme.label}</span>
                    {/* ไม่ลดความทึบตัวหนังสือเล็ก: เดิม opacity-90 ทำให้ความต่างสีตกต่ำกว่าเกณฑ์ */}
                    <span className="font-mono text-[11px]">{j.note}</span>
                  </span>
                  <span aria-hidden="true" className="font-mono text-[10px] tracking-[0.18em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

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
              {filteredGaming.map((item, i) => (
                <MediaCard key={item.id} item={item} theme={THEME.game} index={i} />
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
              {filteredFood.map((item, i) => (
                <MediaCard key={item.id} item={item} theme={THEME.eat} index={i} />
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
          <Reveal className="relative flex h-64 items-center justify-center overflow-hidden rounded-3xl border-3 border-paper bg-sun shadow-hard-light lg:h-80">
            <span className="absolute inset-0 bg-stripes" />
            <span className="relative flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-4 py-2.5 font-mono text-[11px] tracking-[0.12em] text-ink">
              <User className="h-4 w-4" /> [ใส่รูปตัวเองตรงนี้]
            </span>
          </Reveal>

          <Reveal delay={120} className="flex flex-col gap-5">
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
                // สีประจำช่องอยู่ที่เงาของการ์ด (ring) ตัวหนังสือชื่อแพลตฟอร์มใช้สีครีม
                // เพราะม่วงและส้มบนพื้นเข้มได้ความต่างสีแค่ 2.9:1 และ 4.3:1 อ่านยากที่ตัวขนาดเล็ก
                { platform: "YOUTUBE", label: "ช่องเกมหลัก", handle: "@FLUKEGAMEROFFICIAL", href: SOCIAL_GAME.youtube, ring: "shadow-[7px_7px_0_#6C4AF6]", tint: "text-night-text" },
                { platform: "TIKTOK", label: "คลิปสั้น เกมและของกิน", handle: "@flukegamerofficial", href: SOCIAL_GAME.tiktok, ring: "shadow-[7px_7px_0_#EF5327]", tint: "text-night-text" },
                { platform: "FACEBOOK", label: "เพจเกม", handle: "flukegamerth", href: SOCIAL_GAME.facebook, ring: "shadow-[7px_7px_0_#FFC93C]", tint: "text-night-text" },
                { platform: "FACEBOOK", label: "เพจวิ่ง", handle: "FlukerunnerOfficial", href: SOCIAL_RUN.facebook, ring: "shadow-[7px_7px_0_#0FA37F]", tint: "text-night-text" },
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
          </Reveal>
        </div>
      </section>
      </main>

      <footer className="bg-night bg-dots-light bg-dot">
        <div className="mx-auto max-w-6xl px-5 pb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-night-line pt-6 font-mono text-[11px] tracking-[0.12em] text-night-text">
            <span>© 2026 flukesociety.com — Play · Run · Eat</span>
            <span>PLAY / RUN / EAT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
