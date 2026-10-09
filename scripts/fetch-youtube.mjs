// ดึงรายการคลิปล่าสุดจากช่อง YouTube แล้วเขียนลง src/data/youtube-latest.json
// GitHub Actions เรียกสคริปต์นี้ตามรอบเวลา (.github/workflows/youtube-latest.yml)
// ลองรันเองได้: node scripts/fetch-youtube.mjs
//
// ใช้ฟีด RSS สาธารณะของ YouTube ไม่ต้องมีคีย์ API ไม่ต้องติดตั้งแพ็กเกจเพิ่ม (Node 20+)
// ไม่ว่ากรณีไหนที่ดึงหรืออ่านไม่ได้ จะไม่แตะไฟล์เดิม → เว็บยังโชว์ข้อมูลชุดล่าสุดที่ดีอยู่
//   - YouTube ไม่ตอบชั่วคราว (เคยปฏิเสธเซิร์ฟเวอร์ GitHub เป็นช่วง ๆ): ลองซ้ำ 3 ครั้ง
//     ถ้ายังไม่ได้ จบแบบ "เตือน" ไม่นับว่าล้ม รอบถัดไปค่อยลองใหม่ (ไม่มีอีเมลแจ้งกากบาทแดงทุกวัน)
//   - ฟีดตอบมาแต่อ่านแล้วไม่มีคลิปเลย: จบแบบ "ล้ม" เพราะแปลว่ารูปแบบฟีดเปลี่ยน ต้องมีคนมาดู

import { readFile, writeFile } from "node:fs/promises";
import { platformFromDescription } from "./platform-tags.mjs";

// ช่อง @FLUKEGAMEROFFICIAL
const CHANNEL_ID = "UC9djzIDyvWw1XtLFr1VX8LA";
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const OUT = new URL("../src/data/youtube-latest.json", import.meta.url);
const KEEP = 6; // เก็บไว้กี่คลิป (หน้าเว็บตอนนี้ใช้แค่คลิปแรก ที่เหลือเผื่อไว้)

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));

const pick = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return m ? decode(m[1].trim()) : "";
};

// ดึงฟีด ลองซ้ำเมื่อ YouTube ตอบผิดปกติชั่วคราว (รอ 15 และ 45 วินาที)
const TRANSIENT = new Set([403, 404, 408, 429, 500, 502, 503, 504]);
async function fetchFeed() {
  let problem = "";
  for (const wait of [0, 15_000, 45_000]) {
    if (wait) {
      console.log(`ลองใหม่ใน ${wait / 1000} วินาที (${problem})`);
      await new Promise((r) => setTimeout(r, wait));
    }
    try {
      const res = await fetch(FEED, { headers: { "User-Agent": "flukesociety.com youtube-latest" } });
      if (res.ok) return await res.text();
      problem = `HTTP ${res.status}`;
      if (!TRANSIENT.has(res.status)) break;
    } catch (err) {
      problem = `เชื่อมต่อไม่ได้: ${err.message}`;
    }
  }
  return { problem };
}

const feed = await fetchFeed();
if (typeof feed !== "string") {
  // ::warning:: ทำให้ข้อความขึ้นเป็นป้ายเตือนสีเหลืองในหน้าผลการรันของ GitHub
  console.log(`::warning::ดึงฟีด YouTube ไม่ได้ (${feed.problem}) ข้อมูลบนเว็บยังเป็นชุดเดิม จะลองใหม่รอบหน้า`);
  process.exit(0);
}
const xml = feed;

const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
const videos = entries
  .map((e) => {
    const link = (e.match(/<link rel="alternate" href="([^"]+)"/) || [])[1] || "";
    return {
      id: pick(e, "yt:videoId"),
      title: pick(e, "title"),
      published: pick(e, "published"),
      // เครื่องที่เล่นดูจากแท็กในคำอธิบาย เช่น #PS5 → console (รายละเอียดใน platform-tags.mjs)
      platform: platformFromDescription(pick(e, "media:description")),
      url: link,
      isShort: link.includes("/shorts/"),
    };
  })
  // ไม่เอา Shorts: เป็นภาพแนวตั้ง ใส่การ์ดแนวนอนแล้วดูไม่ดี
  .filter((v) => /^[\w-]{11}$/.test(v.id) && v.title && !v.isShort)
  .slice(0, KEEP)
  .map(({ id, title, published, platform }) => ({
    id,
    title,
    published,
    platform,
    url: `https://www.youtube.com/watch?v=${id}`,
  }));

if (videos.length === 0) throw new Error("ฟีดไม่มีคลิปที่ใช้ได้เลย ไม่แก้ไฟล์เดิม");

// เขียนไฟล์เฉพาะตอนรายการคลิปเปลี่ยน — ไม่มีคลิปใหม่ก็ไม่มีคอมมิต ไม่ต้องบิลด์เว็บใหม่
let before = null;
try {
  before = JSON.parse(await readFile(OUT, "utf8"));
} catch {
  /* ยังไม่มีไฟล์ */
}
const sameAsBefore = before && JSON.stringify(before.videos) === JSON.stringify(videos);
if (sameAsBefore) {
  console.log(`ไม่มีคลิปใหม่ (ล่าสุด: ${videos[0].title})`);
} else {
  const data = { channelId: CHANNEL_ID, updatedAt: new Date().toISOString(), videos };
  await writeFile(OUT, JSON.stringify(data, null, 2) + "\n");
  console.log(`อัปเดตแล้ว ${videos.length} คลิป ล่าสุด: ${videos[0].title}`);
}
