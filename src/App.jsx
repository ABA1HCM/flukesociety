import { useState, useRef } from "react";
import { Gamepad2, Monitor, Smartphone, Joystick, MapPin, Plus, X, Youtube, Play, Utensils, User, ExternalLink, Film, Link2, Upload, Star, Trash2 } from "lucide-react";

// ---------- helpers ----------
const getYouTubeId = (url) => {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
};
const isTikTok = (url) => /tiktok\.com/.test(url);

const PLATFORMS = [
  { id: "pc", label: "PC", icon: Monitor },
  { id: "console", label: "Console", icon: Joystick },
  { id: "mobile", label: "Mobile", icon: Smartphone },
];

// ---------- seed data ----------
const seedGaming = [
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

const seedFood = [
  {
    id: 1, type: "tiktok",
    title: "ก๋วยเตี๋ยวเรือเจ้าเด็ด ย่านเมืองเก่า",
    url: "https://www.tiktok.com/@example/video/456",
    desc: "City Run วันนี้ เดินมา 5 กม. มาจบที่ร้านนี้ น้ำซุปเข้มข้นมาก ⭐ 9/10",
    location: "ย่านเมืองเก่า",
  },
];

// ---------- thumbnail card ----------
function MediaCard({ item, onDelete }) {
  const ytId = item.type === "youtube" ? getYouTubeId(item.url) : null;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-emerald-100 hover:border-emerald-300 hover:-translate-y-1">
      {/* thumbnail area */}
      <div className="relative aspect-video bg-emerald-50">
        {item.type === "upload" && item.src ? (
          <video src={item.src} controls className="w-full h-full object-cover" />
        ) : ytId ? (
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
        <button onClick={() => onDelete(item.id)} className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white text-gray-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow" title="ลบ">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* info */}
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

// ---------- add content modal ----------
function AddModal({ section, onClose, onAdd }) {
  const [mode, setMode] = useState("link");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [platform, setPlatform] = useState("pc");
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);

  const ytId = getYouTubeId(url);
  const tiktok = isTikTok(url);

  const submit = () => {
    if (!title.trim()) return alert("กรุณาใส่ชื่อคลิป/หัวข้อก่อนครับ");
    if (mode === "link" && !ytId && !tiktok) return alert("กรุณาวางลิงก์ YouTube หรือ TikTok ที่ถูกต้อง");
    if (mode === "upload" && !file) return alert("กรุณาเลือกไฟล์วิดีโอก่อนครับ");

    const item = {
      id: Date.now(),
      title: title.trim(),
      desc: desc.trim(),
      type: mode === "upload" ? "upload" : ytId ? "youtube" : "tiktok",
      url,
      src: mode === "upload" && file ? URL.createObjectURL(file) : null,
      ...(section === "gaming" ? { platform } : { location: location.trim() }),
    };
    onAdd(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-green-500 text-white p-5 rounded-t-3xl flex items-center justify-between">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" /> เพิ่มคอนเทนต์ — {section === "gaming" ? "🎮 Gaming" : "🍜 City Run"}
          </h2>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* mode switch */}
          <div className="grid grid-cols-2 gap-2 bg-emerald-50 p-1.5 rounded-xl">
            <button onClick={() => setMode("link")} className={`py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition ${mode === "link" ? "bg-white shadow text-emerald-700" : "text-gray-500"}`}>
              <Link2 className="w-4 h-4" /> ลิงก์ YouTube / TikTok
            </button>
            <button onClick={() => setMode("upload")} className={`py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition ${mode === "upload" ? "bg-white shadow text-emerald-700" : "text-gray-500"}`}>
              <Upload className="w-4 h-4" /> อัพโหลดวิดีโอ
            </button>
          </div>

          {mode === "link" ? (
            <div>
              <label className="text-sm font-semibold text-gray-700">วางลิงก์ *</label>
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=... หรือ https://www.tiktok.com/..." className="w-full mt-1 px-4 py-2.5 border-2 border-emerald-100 rounded-xl focus:border-emerald-400 focus:outline-none text-sm" />
              {ytId && (
                <div className="mt-3 rounded-xl overflow-hidden border-2 border-emerald-200">
                  <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt="preview" className="w-full" />
                  <p className="text-xs text-emerald-600 font-medium p-2 bg-emerald-50">✅ ดึง Thumbnail จาก YouTube สำเร็จ</p>
                </div>
              )}
              {tiktok && !ytId && <p className="text-xs text-emerald-600 font-medium mt-2">✅ ตรวจพบลิงก์ TikTok — จะแสดงเป็นการ์ด TikTok</p>}
            </div>
          ) : (
            <div>
              <label className="text-sm font-semibold text-gray-700">เลือกไฟล์วิดีโอ *</label>
              <div onClick={() => fileRef.current?.click()} className="mt-1 border-2 border-dashed border-emerald-300 rounded-xl p-6 text-center cursor-pointer hover:bg-emerald-50 transition">
                <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">{file ? `📹 ${file.name}` : "คลิกเพื่อเลือกไฟล์วิดีโอ (mp4, webm)"}</p>
                <p className="text-xs text-gray-400 mt-1">* วิดีโอจะแสดงชั่วคราวในหน้านี้ (เดโม่)</p>
              </div>
              <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-gray-700">ชื่อคลิป / หัวข้อ *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={section === "gaming" ? "เช่น RE6 Walkthrough Part 5" : "เช่น ร้านข้าวมันไก่เจ้าดัง"} className="w-full mt-1 px-4 py-2.5 border-2 border-emerald-100 rounded-xl focus:border-emerald-400 focus:outline-none text-sm" />
          </div>

          {section === "gaming" ? (
            <div>
              <label className="text-sm font-semibold text-gray-700">แพลตฟอร์ม</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {PLATFORMS.map((p) => (
                  <button key={p.id} onClick={() => setPlatform(p.id)} className={`py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 border-2 transition ${platform === p.id ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-500"}`}>
                    <p.icon className="w-4 h-4" /> {p.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm font-semibold text-gray-700">พิกัด / ย่าน</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="เช่น เยาวราช, ย่านเมืองเก่า" className="w-full mt-1 px-4 py-2.5 border-2 border-emerald-100 rounded-xl focus:border-emerald-400 focus:outline-none text-sm" />
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-gray-700">คำอธิบายสั้นๆ</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} placeholder="เล่าสั้นๆ เกี่ยวกับคลิปนี้..." className="w-full mt-1 px-4 py-2.5 border-2 border-emerald-100 rounded-xl focus:border-emerald-400 focus:outline-none text-sm resize-none" />
          </div>

          <button onClick={submit} className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> เพิ่มคอนเทนต์
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- main ----------
export default function App() {
  const [gaming, setGaming] = useState(seedGaming);
  const [food, setFood] = useState(seedFood);
  const [tab, setTab] = useState("all");
  const [modal, setModal] = useState(null); // "gaming" | "food" | null

  const filteredGaming = tab === "all" ? gaming : gaming.filter((g) => g.platform === tab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 font-sans text-gray-800">
      {/* nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-emerald-700 text-lg">
            <Gamepad2 className="w-6 h-6" /> flukesociety<span className="text-green-500">.com</span>
          </div>
          <div className="hidden sm:flex gap-5 text-sm font-semibold text-gray-600">
            <a href="#gaming" className="hover:text-emerald-600 transition">🎮 Gaming</a>
            <a href="#cityrun" className="hover:text-emerald-600 transition">🍜 City Run</a>
            <a href="#about" className="hover:text-emerald-600 transition">👤 About</a>
          </div>
        </div>
      </nav>

      {/* hero */}
      <header className="max-w-5xl mx-auto px-4 pt-14 pb-10 text-center">
        <div className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wide">
          PERSONAL WEBSITE
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">Gamer</span>
          <span className="text-gray-700"> & </span>
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">City Runner</span>
        </h1>
        <p className="text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
          เล่นเกมทุกแพลตฟอร์ม PC · Console · Mobile 🎮<br />
          แล้วออกวิ่งเดินเมืองตามหาร้านอร่อยแบบ City Run 🏃‍♂️🍜
        </p>
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          {PLATFORMS.map((p) => (
            <span key={p.id} className="flex items-center gap-1.5 bg-white border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
              <p.icon className="w-4 h-4" /> {p.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5 bg-white border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
            <Utensils className="w-4 h-4" /> Food Journey
          </span>
        </div>
      </header>

      {/* gaming zone */}
      <section id="gaming" className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <h2 className="text-2xl font-extrabold flex items-center gap-2 text-gray-800">
            <span className="bg-emerald-600 text-white rounded-xl p-2"><Gamepad2 className="w-5 h-5" /></span>
            Gaming Zone
          </h2>
          <button onClick={() => setModal("gaming")} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-emerald-200 transition">
            <Plus className="w-4 h-4" /> เพิ่มคลิปเกม
          </button>
        </div>

        {/* platform tabs */}
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
            ยังไม่มีคลิปในหมวดนี้ — กด "เพิ่มคลิปเกม" ได้เลย!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGaming.map((item) => (
              <MediaCard key={item.id} item={item} onDelete={(id) => setGaming(gaming.filter((g) => g.id !== id))} />
            ))}
          </div>
        )}
      </section>

      {/* city run */}
      <section id="cityrun" className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <h2 className="text-2xl font-extrabold flex items-center gap-2 text-gray-800">
            <span className="bg-green-500 text-white rounded-xl p-2"><Utensils className="w-5 h-5" /></span>
            City Run · Food Journey
          </h2>
          <button onClick={() => setModal("food")} className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-green-200 transition">
            <Plus className="w-4 h-4" /> เพิ่มร้าน / คลิปรีวิว
          </button>
        </div>

        {food.length === 0 ? (
          <div className="text-center py-14 bg-white rounded-2xl border-2 border-dashed border-emerald-200 text-gray-400">
            <MapPin className="w-10 h-10 mx-auto mb-2 text-emerald-200" />
            ยังไม่มีบันทึกการเดินกิน — เริ่ม City Run แรกกันเลย!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {food.map((item) => (
              <MediaCard key={item.id} item={item} onDelete={(id) => setFood(food.filter((f) => f.id !== id))} />
            ))}
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
            นอกจากเกมแล้ว ผมยังชอบออกไป City Run เดินสำรวจเมืองตามหาร้านอาหารเด็ดๆ มาแชร์ให้ทุกคนได้ตามรอยกันครับ 🎮🏃‍♂️🍜
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <a href="#" className="flex items-center gap-2 bg-white text-emerald-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow">
              <Youtube className="w-4 h-4 text-red-600" /> YouTube
            </a>
            <a href="#" className="flex items-center gap-2 bg-white text-emerald-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow">
              ♪ TikTok
            </a>
            <a href="#" className="flex items-center gap-2 bg-white text-emerald-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow">
              📸 Reels
            </a>
          </div>
        </div>
        <p className="text-center text-gray-400 text-xs mt-8">© 2026 flukesociety.com — Gamer & City Runner 💚</p>
      </section>

      {modal && (
        <AddModal
          section={modal}
          onClose={() => setModal(null)}
          onAdd={(item) => (modal === "gaming" ? setGaming([item, ...gaming]) : setFood([item, ...food]))}
        />
      )}
    </div>
  );
}
