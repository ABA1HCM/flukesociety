// แยกเครื่องที่เล่น (pc / console / mobile) จากแท็กในคำอธิบายคลิป YouTube
//
// ✏️ ใส่แท็กในคำอธิบายตอนอัปโหลด เช่น  #Onimusha #FLUKEGAMER #Gameplay #PS5
//    ตัวพิมพ์เล็ก/ใหญ่ไม่สำคัญ (#ps5 = #PS5) และวางตรงไหนของคำอธิบายก็ได้
//    ถ้าใส่หลายเครื่องในคลิปเดียว ระบบใช้แท็กเครื่องอันแรกที่เจอ
//    ไม่มีแท็กเครื่องเลย → คลิปจะแสดงเฉพาะตอนกดปุ่ม "ทั้งหมด"
//
// แท็กที่ระบบรู้จัก (เพิ่มคำได้ในรายการด้านล่าง ต้องพิมพ์เป็นตัวเล็กไม่มี #)
export const PLATFORM_TAGS = {
  pc: ["pc", "pcgaming", "steam"],
  console: [
    "console",
    "ps5", "ps5pro", "ps4", "playstation", "playstation5", "playstation4",
    "xbox", "xboxseriesx", "xboxseriess",
    "switch", "switch2", "nintendo", "nintendoswitch", "nintendoswitch2",
  ],
  mobile: ["mobile", "mobilegame", "mobilegaming", "android", "ios", "iphone"],
};

const lookup = new Map(
  Object.entries(PLATFORM_TAGS).flatMap(([platform, tags]) => tags.map((t) => [t, platform]))
);

export function platformFromDescription(text = "") {
  // แท็ก = # ตามด้วยตัวอักษร/ตัวเลข (รองรับภาษาไทย) ไล่ตามลำดับที่เขียนในคำอธิบาย
  for (const m of text.matchAll(/#([\p{L}\p{M}\p{N}_]+)/gu)) {
    const platform = lookup.get(m[1].toLowerCase());
    if (platform) return platform;
  }
  return null;
}
