import { useState } from "react";
import { Gamepad2, Monitor, Smartphone, Joystick, MapPin, Youtube, Play, Utensils, User, ExternalLink, Film, Star, Footprints, Flag, Route, Image as ImageIcon, Store, ShoppingBag, ChefHat, Clock } from "lucide-react";

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
    id: 1, platform: "console", type: "youtube",
    title: "Resident Evil 6 — Walkthrough Part 1 (Leon Campaign)",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    desc: "เริ่มต้นการเดินทางสุดระทึกกับลีออน ฉากเปิดเกมสุดมันส์!",
  },
  {
    id: 2, platform: "pc", type: "tiktok",
    title: "Clip เด็ด! บอสไฟต์สุดโหด 🔥",
    url: "https://www.tiktok.com/@example/video/123",
    desc: "ช็อตเด็ดตัดมาให้ดูกันสั้นๆ ใน TikTok",
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
    title: "City Run Round Trip แสมสาร - ท่าเรือสัตหีบ",
    distance: "19.66 กม.",
    duration: "2.30 ชั่วโมง",
    points: [
      { stage: "start", place: "ครัวแสมสารซีฟู๊ด", img: "https://scontent.fbkk29-5.fna.fbcdn.net/v/t39.30808-6/723586175_10239964996197189_886605665806948748_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1536&ctp=s2048x1536&_nc_cat=109&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeE79jBK22xszHgndBARjGAxp-Qgv0TMOwmn5CC_RMw7CYtMBw9Lyb_9OFjNqcjW92Q&_nc_ohc=XNfefVqGJHcQ7kNvwHYYkvw&_nc_oc=Adr3KavpGIIKHo3mN9bY58JvJ0tCXa4pIumyn_WFWH9coNcmnL2krwVUm96BNDriiHu4RP3BNrG0_FpdygP5oPQd&_nc_zt=23&_nc_ht=scontent.fbkk29-5.fna&_nc_gid=MjCen7Bih_qfAg9lDOofEw&_nc_ss=7b2a8&oh=00_AQCdP5rG5k4YtGaBY3iJU5LX4fSvL7MLMEYBF0pay_PM3Q&oe=6A4EB277", note: "ออกตัวเช้าตรู่ เวลาตี 5.15 อากาศกำลังดี" },
      { stage: "mid", place: "เส้นทางสวยในค่ายหน่วยบัญชาการสงครามพิเศษทางเรือ", img: "https://scontent.fbkk29-8.fna.fbcdn.net/v/t39.30808-6/723042555_10239965000477296_2384131687942038959_n.jpg?stp=dst-jpg_tt6&cstp=mx960x720&ctp=s960x720&_nc_cat=103&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGMz6S5fg9mHy6kpdDPix2kCvMMutkdLGIK8wy62R0sYtEjT7HvRwGFbZ63lBz17u8&_nc_ohc=ywmXCqdCM18Q7kNvwF4Qifx&_nc_oc=AdpFgA8Y2w2EQ8wX9AyTNy_0-qfyXWyA4W7zH27QkjyA4U7tbpTiUOLTMV33MK_F2d_lntHa3ywVjGBF6o2O-B5J&_nc_zt=23&_nc_ht=scontent.fbkk29-8.fna&_nc_gid=aSybsg00IpYuAF6uQ4KzMQ&_nc_ss=7b2a8&oh=00_AQA8bYF_kxpHoQ7zNeq5paqHq3Wz7nY65k8GiWARi6Hk8A&oe=6A4E9C65", note: "วิวสวย แวะถ่ายรูปนิดหน่อย" },
      { stage: "finish", place: "ร้านข้าวมันไก่", img: "https://scontent.fbkk29-2.fna.fbcdn.net/v/t39.30808-6/472756993_122180382656251444_8828403763584209303_n.jpg?stp=dst-jpg_tt6&cstp=mx960x720&ctp=s960x720&_nc_cat=101&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGFTJAOrS6VKfAcYLLUBxmaeAeh6fFihsR4B6Hp8WKGxAsKB13wfe8m2LRexsVuue0&_nc_ohc=hPnjenmvNp0Q7kNvwGcld8G&_nc_oc=AdoZa5nICciqDUEzdJsMtDAAmICTFwtQnsQa1A67LOr7bCMtka6HuwsFAlezCr7JqrYoKSwhjgcE96LKoIwnVJVa&_nc_zt=23&_nc_ht=scontent.fbkk29-2.fna&_nc_gid=b9BsLGgHPgCwjgqLT2Ic6A&_nc_ss=7b2a8&oh=00_AQDehCJfM7vf2rmUi7jUYRDKC63_m0iCtqW7K7XAgfGe-A&oe=6A4EB179", note: "จบทริปด้วยความฟิน!" },
    ],
  },
];

/* =========================================================
   3) เรื่องกิน — เพิ่มเมนู/ร้านตรงนี้
   cat: "restaurant" | "conv" (7-11) | "diy"
   type: "youtube" | "tiktok"
   ========================================================= */
const FOOD = [
  {
    id: 1, cat: "restaurant", type: "tiktok",
    title: "ก๋วยเตี๋ยวเรือเจ้าเด็ด ย่านเมืองเก่า",
    url: "https://www.tiktok.com/@example/video/456",
    desc: "น้ำซุปเข้มข้นมาก ⭐ 9/10",
    location: "ย่านเมืองเก่า",
  },
  {
    id: 2, cat: "conv", type: "tiktok",
    title: "รีวิวเมนูใหม่ 7-11 ต้องลอง!",
    url: "https://www.tiktok.com/@example/video/789",
    desc: "ของกินใหม่ในเซเว่น อร่อยเกินราคา",
    location: "7-Eleven",
  },
];

/* =========================================================
   ช่องทางติดตาม — ใส่ลิงก์ช่องจริงของคุณตรงนี้
   ========================================================= */
const SOCIALS = {
  youtube: "#",
  tiktok: "#",
  reels: "#",
};

// ---------- media thumbnail card (ดูอย่างเดียว) ----------
function MediaCard({ item }) {
  const ytId = item.type === "youtube" ? getYouTubeId(item.url) : null;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-emerald-100 hover:border-emerald-300 hover:-translate-y-1">
      <div className="relative aspect-video bg-emerald-50">
        {ytId ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
            <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-red-600 rounded-full p-3 shadow-lg"><Play className="w-6 h-6 text-white fill-white" /></div>
            </div>
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1"><Youtube className="w-3.5 h-3.5" /> YouTube</span>
          </a>
        ) : item.type === "tiktok" ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🎵</div>
              <span className="text-white font-bold text-lg tracking-wide">TikTok</span>
              <p className="text-emerald-300 text-xs mt-1 flex items-center justify-center gap-1">แตะเพื่อรับชม <ExternalLink className="w-3 h-3" /></p>
            </div>
            <span className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1 rounded-md">♪ TikTok</span>
          </a>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-emerald-300"><Film className="w-10 h-10" /></div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 leading-snug line-clamp-2">{item.title}</h3>
        {item.location && (
          <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1 font-medium"><MapPin className="w-3.5 h-3.5" /> {item.location}</p>
        )}
        {item.desc && <p className="text-gray-500 text-sm mt-1.5 line-clamp-2">{item.desc}</p>}
      </div>
    </div>
  );
}

// ---------- run timeline card (ดูอย่างเดียว) ----------
const STAGE_STYLE = {
  start: { icon: Footprints, color: "bg-emerald-500", ring: "ring-emerald-200", label: "จุดเริ่มต้น" },
  mid: { icon: Route, color: "bg-green-500", ring: "ring-green-200", label: "ระหว่างทาง" },
  finish: { icon: Flag, color: "bg-emerald-700", ring: "ring-emerald-300", label: "เส้นชัย" },
};

function RunCard({ run }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition border border-emerald-100 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-5 text-white">
        <h3 className="font-extrabold text-lg flex items-center gap-2"><Footprints className="w-5 h-5" /> {run.title}</h3>
        <div className="flex gap-4 mt-2 text-emerald-50 text-sm font-medium">
          <span className="flex items-center gap-1"><Route className="w-4 h-4" /> {run.distance}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {run.duration}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="relative">
          {run.points.map((pt, i) => {
            const st = STAGE_STYLE[pt.stage] || STAGE_STYLE.mid;
            const Icon = st.icon;
            const isLast = i === run.points.length - 1;
            return (
              <div key={i} className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                  <div className={`${st.color} text-white rounded-full p-2 ring-4 ${st.ring} z-10 shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {!isLast && <div className="w-0.5 flex-1 bg-emerald-200 my-1" />}
                </div>
                <div className={`flex-1 ${isLast ? "" : "pb-6"}`}>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">{st.label}</span>
                  <p className="font-bold text-gray-800 leading-tight">{pt.place}</p>
                  {pt.img ? (
                    <img src={pt.img} alt={pt.place} className="w-full rounded-xl mt-2 border border-emerald-100 object-cover max-h-56" />
                  ) : (
                    <div className="w-full h-24 rounded-xl mt-2 border-2 border-dashed border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-300 text-sm gap-1">
                      <ImageIcon className="w-5 h-5" /> ยังไม่มีรูป
                    </div>
                  )}
                  {pt.note && <p className="text-gray-500 text-sm mt-1.5">{pt.note}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------- main ----------
export default function App() {
  const [tab, setTab] = useState("all");
  const [foodTab, setFoodTab] = useState("all");

  const filteredGaming = tab === "all" ? GAMING : GAMING.filter((g) => g.platform === tab);
  const filteredFood = foodTab === "all" ? FOOD : FOOD.filter((f) => f.cat === foodTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 font-sans text-gray-800">
      {/* nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-emerald-700 text-lg">
            <Gamepad2 className="w-6 h-6" /> flukesociety<span className="text-green-500">.com</span>
          </div>
          <div className="hidden sm:flex gap-5 text-sm font-semibold text-gray-600">
            <a href="#gaming" className="hover:text-emerald-600 transition">🎮 เกม</a>
            <a href="#running" className="hover:text-emerald-600 transition">🏃 วิ่ง</a>
            <a href="#food" className="hover:text-emerald-600 transition">🍜 กิน</a>
            <a href="#about" className="hover:text-emerald-600 transition">👤 About</a>
          </div>
        </div>
      </nav>

      {/* hero */}
      <header className="max-w-5xl mx-auto px-4 pt-14 pb-10 text-center">
        <div className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wide">
          PERSONAL BLOG
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">Play</span>
          <span className="text-gray-700"> · </span>
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Run</span>
          <span className="text-gray-700"> · </span>
          <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">Eat</span>
        </h1>
        <p className="text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
          บล็อกส่วนตัวรวมความชอบ — เล่นเกมทุกแพลตฟอร์ม 🎮 ออกเดินวิ่งสำรวจเมือง 🏃‍♂️<br />
          แล้วตามหาของอร่อยทั้งร้านดัง ร้านสะดวกซื้อ และเมนูทำเอง 🍜
        </p>
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          <a href="#gaming" className="flex items-center gap-1.5 bg-white border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full shadow-sm hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:-translate-y-0.5 transition cursor-pointer"><Gamepad2 className="w-4 h-4" /> เกม</a>
          <a href="#running" className="flex items-center gap-1.5 bg-white border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full shadow-sm hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:-translate-y-0.5 transition cursor-pointer"><Footprints className="w-4 h-4" /> วิ่ง</a>
          <a href="#food" className="flex items-center gap-1.5 bg-white border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full shadow-sm hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:-translate-y-0.5 transition cursor-pointer"><Utensils className="w-4 h-4" /> กิน</a>
        </div>
      </header>

      {/* ===== 1. GAMING ===== */}
      <section id="gaming" className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-extrabold flex items-center gap-2 text-gray-800 mb-5">
          <span className="bg-emerald-600 text-white rounded-xl p-2"><Gamepad2 className="w-5 h-5" /></span>
          เรื่องเกม
        </h2>

        <div className="flex gap-2 mb-6 flex-wrap">
          {[{ id: "all", label: "ทั้งหมด", icon: Star }, ...PLATFORMS].map((p) => (
            <button key={p.id} onClick={() => setTab(p.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 transition ${tab === p.id ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-white border-emerald-200 text-gray-600 hover:border-emerald-400"}`}>
              <p.icon className="w-4 h-4" /> {p.label}
            </button>
          ))}
        </div>

        {filteredGaming.length === 0 ? (
          <div className="text-center py-14 bg-white rounded-2xl border-2 border-dashed border-emerald-200 text-gray-400">
            <Gamepad2 className="w-10 h-10 mx-auto mb-2 text-emerald-200" />
            ยังไม่มีคลิปในหมวดนี้
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGaming.map((item) => <MediaCard key={item.id} item={item} />)}
          </div>
        )}
      </section>

      {/* ===== 2. RUNNING ===== */}
      <section id="running" className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-extrabold flex items-center gap-2 text-gray-800 mb-6">
          <span className="bg-green-500 text-white rounded-xl p-2"><Footprints className="w-5 h-5" /></span>
          เรื่องวิ่ง · City Run
        </h2>

        {RUNS.length === 0 ? (
          <div className="text-center py-14 bg-white rounded-2xl border-2 border-dashed border-emerald-200 text-gray-400">
            <Footprints className="w-10 h-10 mx-auto mb-2 text-emerald-200" />
            ยังไม่มีเส้นทางวิ่ง
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RUNS.map((run) => <RunCard key={run.id} run={run} />)}
          </div>
        )}
      </section>

      {/* ===== 3. FOOD ===== */}
      <section id="food" className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-extrabold flex items-center gap-2 text-gray-800 mb-5">
          <span className="bg-emerald-600 text-white rounded-xl p-2"><Utensils className="w-5 h-5" /></span>
          เรื่องกิน · Food Journey
        </h2>

        <div className="flex gap-2 mb-6 flex-wrap">
          {[{ id: "all", label: "ทั้งหมด", icon: Star }, ...FOOD_CATS].map((c) => (
            <button key={c.id} onClick={() => setFoodTab(c.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 transition ${foodTab === c.id ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200" : "bg-white border-emerald-200 text-gray-600 hover:border-emerald-400"}`}>
              <c.icon className="w-4 h-4" /> {c.label}
            </button>
          ))}
        </div>

        {filteredFood.length === 0 ? (
          <div className="text-center py-14 bg-white rounded-2xl border-2 border-dashed border-emerald-200 text-gray-400">
            <Utensils className="w-10 h-10 mx-auto mb-2 text-emerald-200" />
            ยังไม่มีเมนูในหมวดนี้
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFood.map((item) => <MediaCard key={item.id} item={item} />)}
          </div>
        )}
      </section>

      {/* about */}
      <section id="about" className="max-w-5xl mx-auto px-4 py-10 pb-16">
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-emerald-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-white/20 rounded-xl p-2"><User className="w-6 h-6" /></span>
            <h2 className="text-2xl font-extrabold">About Me</h2>
          </div>
          <p className="leading-relaxed text-emerald-50 max-w-2xl">
            สวัสดีครับ! ผมเป็นเกมเมอร์ที่หลงใหลการเล่นเกมทุกแพลตฟอร์ม ตั้งแต่ PC, Console ไปจนถึง Mobile
            ทำคลิป Walkthrough และคอนเทนต์เกมลง YouTube, TikTok และ Reels
            นอกจากเกมแล้ว ผมยังชอบออกไปวิ่งสำรวจเมืองแบบ City Run และตามหาของอร่อย
            ทั้งร้านดัง เมนูใหม่ในร้านสะดวกซื้อ ไปจนถึงเมนูทำเองที่บ้าน มาแชร์ให้ทุกคนได้ตามรอยกันครับ 🎮🏃‍♂️🍜
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <a href={SOCIALS.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-emerald-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow">
              <Youtube className="w-4 h-4 text-red-600" /> YouTube
            </a>
            <a href={SOCIALS.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-emerald-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow">
              ♪ TikTok
            </a>
            <a href={SOCIALS.reels} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-emerald-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow">
              📸 Reels
            </a>
          </div>
        </div>
        <p className="text-center text-gray-400 text-xs mt-8">© 2026 flukesociety.com — Play · Run · Eat 💚</p>
      </section>
    </div>
  );
}
