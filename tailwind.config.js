/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      /* ---------- สีประจำเว็บ ----------
         ink / paper = หมึกกับกระดาษ โทนอุ่น
         game / run / eat = สีประจำสามหมวด คุมความสว่างเท่ากัน ต่างกันแค่เฉดสี
         sun = สีเน้นสำหรับปุ่มรอง                                        */
      colors: {
        ink: {
          DEFAULT: "#241C14",
          soft: "#3B2E22",
          muted: "#52412F",
          faint: "#6B5A48",
          ghost: "#8A7660",
        },
        paper: {
          DEFAULT: "#F6EFE1",
          deep: "#EFE4CF",
          line: "#D8C7AC",
          hair: "#E0D2BB",
        },
        night: {
          DEFAULT: "#241C14",
          card: "#2F241A",
          line: "#4A3A2A",
          text: "#CBB9A2",
        },
        game: "#6C4AF6",
        "game-ink": "#4A2ACB",
        run: "#0FA37F",
        "run-ink": "#0A7357",
        "run-on": "#04241B",
        eat: "#EF5327",
        "eat-ink": "#C33B14",
        sun: "#FFC93C",
      },
      /* ---------- เงาแข็งแบบสติกเกอร์ ไม่มีเบลอ ---------- */
      boxShadow: {
        hard: "5px 5px 0 #241C14",
        "hard-sm": "3px 3px 0 #241C14",
        "hard-md": "7px 7px 0 #241C14",
        "hard-lg": "10px 10px 0 #241C14",
        "hard-light": "5px 5px 0 #F6EFE1",
      },
      borderWidth: {
        3: "3px",
      },
      fontFamily: {
        display: ["Kanit", "Trebuchet MS", "sans-serif"],
        sans: ["IBM Plex Sans Thai", "Tahoma", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "Consolas", "monospace"],
      },
      /* ---------- ภาษาไทยต้องการระยะบรรทัดมากกว่าละติน ---------- */
      lineHeight: {
        thai: "1.85",
        "thai-tight": "1.45",
      },
      backgroundImage: {
        dots: "radial-gradient(rgba(36,28,20,0.18) 1.4px, rgba(36,28,20,0) 1.5px)",
        "dots-light": "radial-gradient(rgba(246,239,225,0.14) 1.4px, rgba(246,239,225,0) 1.5px)",
        stripes:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.16) 0 16px, rgba(255,255,255,0) 16px 32px)",
      },
      backgroundSize: {
        dot: "20px 20px",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 34s linear infinite",
      },
    },
  },
  plugins: [],
};
