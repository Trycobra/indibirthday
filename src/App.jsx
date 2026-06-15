/**
 * ═══════════════════════════════════════════════════════════════════
 *  THE PINK LILY GARDEN — thrift shop edition
 *  A tiny retro pixel game for hard days.
 * ═══════════════════════════════════════════════════════════════════
 *
 *  HOW IT PLAYS:
 *  1. Title card: "For the days when being you feels heavy."
 *  2. A cozy pixel thrift shop. On the windowsill: a pot with a
 *     little stem that says TAP ME.
 *  3. Tap, tap, tap — it grows, then BLOOMS. Petals flutter down.
 *  4. Tap a petal → a note appears with a little pixel face in the
 *     corner and a kind message.
 *  5. A friendly black dragon pops up at the window now and then.
 *
 *  ✏️  EDIT YOUR MESSAGES in the MESSAGES array right below.
 *      Write them in your own words — that's what will land.
 *      Add as many as you want; the game spawns petals until
 *      they've all been read.
 * ═══════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════
   ✏️ EDIT ME — your messages
   ═══════════════════════════════════════════════════════════════════ */

const MESSAGES = [
  // ↓↓↓ Replace / add your own. Plain text, one per line. ↓↓↓
  "You do not have to earn rest.",
  "Bad days do not erase your progress.",
  "You are allowed to exist without proving yourself.",
  "You have survived every difficult day so far.",
  "The version of you that struggles is still worthy of love.",
  "You are not a burden for having feelings.",
  "You don't have to be productive to deserve kindness.",
  "Some flowers bloom slowly too.",
  "Being tired doesn't mean you're failing.",
  "You matter even when you don't feel like you do.",
  "People care about you more than you realize.",
  "Your worth is not measured by your output.",
  "You are allowed to take up space.",
  "Today only needs to be today.",
  // ↑↑↑ your words go here ↑↑↑
];

const TITLE = "For the days when being you feels heavy.";
const TAP_LABELS = ["TAP THE FLOWER!", "TAP AGAIN!", "ONE MORE!"]; // shown per growth stage
const ENDING = "be gentle with yourself";

/**
 * ✏️ MUSIC — paste a URL to your own piano track here (for example a
 * purchased/licensed piano cover of "Always") and it will loop instead
 * of the built-in piano. I can't recreate the actual song's melody in
 * code (it's copyrighted music), so this slot makes it one paste away:
 *   const CUSTOM_MUSIC_URL = "/music/always.mp3";
 * Leave it empty ("") to use the built-in soft original piano loop.
 */
const CUSTOM_MUSIC_URL = "/music/always.mp3";

const BIRTHDAY = "HAPPY BIRTHDAY INDI! ♥";

/**
 * ✏️ NOW PLAYING — short lines that phase in and out under the music
 * button while the piano plays (one per chord cycle). I can't put the
 * actual lyrics here (copyrighted, same as the melody) — but the song
 * title + artist is fine, and you can add short lines in YOUR OWN words.
 */
const NOW_PLAYING = [
  "♪ now playing",
  "♪ always — daniel caesar",
  "♪ you know this one",
];

const HAIR_MID = "#5a3a22";  // ✏️ middle of your hair (brown)
const HAIR_SIDE = "#e8c66a"; // ✏️ dyed blonde sides — tweak to match

/* ═══════════════════════════════════════════════════════════════════
   SPRITES — pixel maps. '.' = transparent, letters = palette colors.
   Drawn from scratch (dragon-ish + Dexter-ish, original pixel art).
   ═══════════════════════════════════════════════════════════════════ */

/** Renders a pixel map onto a crisp scaled canvas. */
function Sprite({ map, palette, scale = 4, style, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const h = map.length;
    const w = map[0].length;
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    map.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        const col = palette[ch];
        if (col) {
          ctx.fillStyle = col;
          ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }, [map, palette]);
  return (
    <canvas
      ref={ref}
      className={className}
      style={{
        width: map[0].length * scale,
        height: map.length * scale,
        imageRendering: "pixelated",
        display: "block",
        ...style,
      }}
    />
  );
}

/* — Shared pot rows (15 wide) — */
const POT = [
  "ppppppppppppppp",
  ".PPPPPPPPPPPPP.",
  ".PPPpPPPPPpPPP.",
  "..PPPPPPPPPPP..",
  "..PPPPPPPPPPP..",
  "...ppppppppp...",
];

const PLANT_PALETTE = {
  P: "#c1763f", p: "#8f5226",            // pot
  l: "#4f9e4f", g: "#3d7d3d",            // stem + leaves
  K: "#f79ac0", k: "#d96a9e", Y: "#ffd75e", // petals + gold heart
};

/* — Growth stages (taps move 0 → 1 → 2 → 3=bloom) — */
const STAGE_0 = [
  "...............",
  "...............",
  "...............",
  "...............",
  "...............",
  "...............",
  "...............",
  "...............",
  "...............",
  ".......l.......",
  "......gl.......",
  ".......lg......",
  ".......l.......",
  ...POT,
];

const STAGE_1 = [
  "...............",
  "...............",
  "...............",
  "...............",
  "...............",
  ".......l.......",
  ".......l.......",
  ".....g.l.......",
  "......gl.g.....",
  ".......lgg.....",
  "......gl.......",
  ".......l.......",
  ".......l.......",
  ...POT,
];

const STAGE_2 = [
  "...............",
  "......kKk......",
  ".....kKKKk.....",
  ".....kKKKk.....",
  "......kKk......",
  ".......l.......",
  ".......l.......",
  ".....g.l.......",
  "......gl.g.....",
  ".......lgg.....",
  "......gl.......",
  ".......l.......",
  ".......l.......",
  ...POT,
];

const STAGE_3 = [
  "...kKKKKKKKk...",
  "..KKKKKKKKKKK..",
  "..KKKYYYYYKKK..",
  "..KKKYYYYYKKK..",
  "..KKKKKKKKKKK..",
  "...kKKKKKKKk...",
  "....k..l..k....",
  ".....g.l.......",
  "......gl.g.....",
  ".......lgg.....",
  "......gl.......",
  ".......l.......",
  ".......l.......",
  ...POT,
];

const STAGES = [STAGE_0, STAGE_1, STAGE_2, STAGE_3];

/* — A single falling petal — */
const PETAL_MAP = [
  "..kKK..",
  ".kKKKK.",
  ".KKKKKk",
  ".kKKKK.",
  "..kKk..",
];

/* — Night-fury-ish dragon peeking over the sill (two frames) — */
const DRAGON_PALETTE = {
  X: "#23262e", G: "#8ef05f", B: "#10131a",
  n: "#0c0e13", "-": "#3a3f4a",
};
const DRAGON_OPEN = [
  "..XX..............XX..",
  ".XXXX............XXXX.",
  ".XXXXX..........XXXXX.",
  "..XXXXXXXXXXXXXXXXXX..",
  ".XXXXXXXXXXXXXXXXXXXX.",
  "XXXXXXXXXXXXXXXXXXXXXX",
  "XXGGGGXXXXXXXXXXGGGGXX",
  "XXGBBGXXXXXXXXXXGBBGXX",
  "XXGGGGXXXXXXXXXXGGGGXX",
  "XXXXXXXXXXXXXXXXXXXXXX",
  "XXXXXnXXXXXXXXXXnXXXXX",
  "XXXXXXXXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXXXXXXXX",
];
const DRAGON_BLINK = [
  "..XX..............XX..",
  ".XXXX............XXXX.",
  ".XXXXX..........XXXXX.",
  "..XXXXXXXXXXXXXXXXXX..",
  ".XXXXXXXXXXXXXXXXXXXX.",
  "XXXXXXXXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXXXXXXXX",
  "XX----XXXXXXXXXX----XX",
  "XXXXXXXXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXXXXXXXX",
  "XXXXXnXXXXXXXXXXnXXXXX",
  "XXXXXXXXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXXXXXXXX",
];

/* — Dexter-ish face for the corner of each note — */
const FACE_PALETTE = {
  H: "#4a3326",          // hair
  S: "#eac093",          // skin
  E: "#222428",          // eyes
  n: "#d8a87c",          // nose shading
  M: "#b05c4a",          // small smile
  C: "#3b5a45",          // dark green henley
};
const FACE_MAP = [
  "..HHHHHHHHHH..",
  ".HHHHHHHHHHHH.",
  ".HHHHHHHHHHHH.",
  ".HSSSSSSSSSSH.",
  ".HSSSSSSSSSSH.",
  ".SSEESSSSEESS.",
  ".SSSSSSSSSSSS.",
  ".SSSSSnnSSSSS.",
  ".SSSSSSSSSSSS.",
  ".SSSMMMMMMSSS.",
  "..SSSSSSSSSS..",
  "...SSSSSSSS...",
  ".CCCCCCCCCCCC.",
  ".CCCCCCCCCCCC.",
];

/* — The knife, for "Tonight's the night" — */
const KNIFE_PALETTE = { W: "#d8dde4", w: "#aab2bc", b: "#2b2b3a", H: "#4a3326" };
const KNIFE_MAP = [
  "...........bHHH.",
  ".WWWWWWWWWWbHHH.",
  "wWWWWWWWWWWbHHH.",
  "...........bHHH.",
];

/* — Manatee painting (the canvas inside a wooden frame) — */
const MANATEE_PALETTE = {
  W: "#7fb8d8", M: "#9aa3ad", m: "#7e8791", B: "#22262b", P: "#c9ced4",
};
const MANATEE_MAP = [
  "WWWWWWWWWWWWWWWWWWWW",
  "WWWWWWWWWWWWWWWWWWWW",
  "WWWWWMMMMMMMMMWWWWWW",
  "WWWMMMMMMMMMMMMMWWWW",
  "WWMMBMMMMMMMMMMMMWWW",
  "WPPMMMMMMMMMMMMMMmWW",
  "WPPPMMMMMMMMMMMmmWWW",
  "WWPPMMMMMMMMMMmmmWWW",
  "WWWMMmmMMMMMmmmWWWWW",
  "WWWWWmmWWWWmmmmWWWWW",
  "WWWWWWWWWWWmmWWWWWWW",
  "WWWWWWWWWWWWWWWWWWWW",
  "WWWWWWWWWWWWWWWWWWWW",
];

/* — Spicy noodle cup for the shelf — */
const BULDAK_PALETTE = {
  L: "#f0e6d8", R: "#d4302a", r: "#9e1f1b", K: "#1c1c1c", W: "#fdf3cf",
};
const BULDAK_MAP = [
  ".LLLLLLLLLL.",
  "LLLLLLLLLLLL",
  ".RRRRRRRRRR.",
  ".RRKKRRKKRR.",
  ".RRRRRRRRRR.",
  ".RRWKKKKWRR.",
  ".RRRRRRRRRR.",
  ".rRRRRRRRRr.",
  "..rrrrrrrr..",
];

/* — Surfboards (same shape, two paint jobs) — */
const SURF_MAP = [
  "...CC...",
  "..CCCC..",
  ".CCSSCC.",
  ".CCSSCC.",
  "CCCSSCCC",
  "CCCSSCCC",
  "CCCSSCCC",
  "CCCSSCCC",
  "CCCSSCCC",
  "CCCSSCCC",
  "CCCSSCCC",
  ".CCSSCC.",
  ".CCSSCC.",
  "..CCCC..",
  "...CC...",
];
const SURF_TEAL = { C: "#4fa8a0", S: "#fdf3cf" };
const SURF_CORAL = { C: "#e0795c", S: "#fdf3cf" };

/* — Piles of old clothes (same lumps, two colorways) — */
const CLOTHES_MAP = [
  "......aaaaa.......",
  "....aaaaaaaab.....",
  "...bbbaaabbbbb....",
  "..ccbbbbbbccccc...",
  ".cccccddddcccccc..",
  ".dddddddddddddddd.",
  ".eeedddeeeeeeeeee.",
  "eeeeeeeeeeeeeeeeee",
];
const CLOTHES_A = { a: "#d9a441", b: "#5b7fa6", c: "#c97a8e", d: "#7a8450", e: "#7a5a3a" };
const CLOTHES_B = { a: "#a6c0d4", b: "#b85959", c: "#8a7ab8", d: "#c9b06a", e: "#5a6e5a" };

/* — A little joint burning off the edge of the sill — */
const JOINT_PALETTE = { W: "#efe7d8", O: "#ff7a2a", A: "#9a9a9a" };
const JOINT_MAP = [
  ".AWWWWWWWW",
  "OAWWWWWWWW",
  ".AWWWWWWWW",
];

/* — Pixel you: curly dyed hair, gold chain, band tee, baggy jeans,
     skateboard at your feet. Two frames = waving. — */
const ME_PALETTE = {
  D: HAIR_MID,     // brown middle
  d: HAIR_SIDE,    // blonde sides
  S: "#c98e62",    // skin
  E: "#22262b",    // eyes
  M: "#fdf3cf",    // smile
  T: "#23262e",    // band tee
  V: "#fdf3cf",    // tee graphic
  C: "#ffd75e",    // gold chain
  J: "#9aa0a8",    // baggy grey jeans
  K: "#fdf3cf",    // sneakers
  B: "#8a5a2c", b: "#6e4520", w: "#fdf3cf", // skateboard
};
const ME_WAVE_UP = [
  "....dDDDDd.......",
  "...ddDDDDdd......",
  "..ddDDDDDDdd..SS.",
  "..ddSSSSSSdd..SS.",
  "..dSSESSSESd...S.",
  "...SSSSSSSS....S.",
  "...SSSMMSSS...S..",
  "....SSSSSS....S..",
  "...TTCCCCTT..S...",
  "..TTTTTTTTTTSS...",
  "..TTTTVVTTTT.....",
  ".SSTTTVVTTTT.....",
  ".SS.TTTTTTT......",
  "....TTTTTTT......",
  "....JJJJJJJ......",
  "....JJJJJJJ......",
  "....JJJ.JJJ......",
  "....JJJ.JJJ......",
  "....JJJ.JJJ......",
  "...KKKK.KKKK.....",
];
const ME_WAVE_MID = [
  "....dDDDDd.......",
  "...ddDDDDdd......",
  "..ddDDDDDDdd.....",
  "..ddSSSSSSdd.....",
  "..dSSESSSESd.....",
  "...SSSSSSSS......",
  "...SSSMMSSS..SS..",
  "....SSSSSS...SS..",
  "...TTCCCCTT..S...",
  "..TTTTTTTTTTSS...",
  "..TTTTVVTTTT.....",
  ".SSTTTVVTTTT.....",
  ".SS.TTTTTTT......",
  "....TTTTTTT......",
  "....JJJJJJJ......",
  "....JJJJJJJ......",
  "....JJJ.JJJ......",
  "....JJJ.JJJ......",
  "....JJJ.JJJ......",
  "...KKKK.KKKK.....",
];

/* — Your skateboard, parked next to you (kicked nose + tail) — */
const SKATE_PALETTE = { D: "#d96a9e", d: "#8a3d66", t: "#9aa0a8", w: "#fdf3cf" };
const SKATE_MAP = [
  "D..............D",
  "DD............DD",
  ".DDDDDDDDDDDDDD.",
  ".dddddddddddddd.",
  "..tt........tt..",
  "..ww........ww..",
];

/* ═══════════════════════════════════════════════════════════════════
   STYLES — retro UI, shop scene, animations
   ═══════════════════════════════════════════════════════════════════ */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

.plg-root {
  position: fixed; inset: 0; overflow: hidden;
  background: #caa472;
  font-family: 'Press Start 2P', monospace;
  user-select: none; -webkit-tap-highlight-color: transparent;
  image-rendering: pixelated;
  transform: translateZ(0); /* promote entire scene to its own GPU layer */
}

/* ── Shop scene ── */
.plg-wall {
  position: absolute; inset: 0 0 28% 0;
  background:
    repeating-linear-gradient(0deg, rgba(0,0,0,.03) 0 2px, transparent 2px 26px),
    linear-gradient(180deg, #d6b182, #c39a66);
}
.plg-floor {
  position: absolute; left: 0; right: 0; bottom: 0; height: 28%;
  background:
    repeating-linear-gradient(90deg, transparent 0 54px, rgba(0,0,0,.18) 54px 58px),
    repeating-linear-gradient(0deg, transparent 0 18px, rgba(0,0,0,.10) 18px 20px),
    linear-gradient(180deg, #96642f, #7c4f24);
  border-top: 6px solid #5e3b1a;
}

/* ── Window ── */
.plg-window {
  position: absolute; left: 50%; top: 9%;
  transform: translateX(-50%);
  width: min(74vw, 340px); height: min(46vh, 300px);
  background: linear-gradient(180deg, #131a3a 0%, #1c2752 55%, #2a3566 100%);
  border: 10px solid #6e4520;
  box-shadow: 0 0 0 4px #4d2e12, inset 0 0 30px rgba(0,0,0,.5);
  overflow: hidden;
}
.plg-window::before { /* cross bars */
  content: ''; position: absolute; inset: 0;
  background:
    linear-gradient(90deg, transparent calc(50% - 4px), #6e4520 calc(50% - 4px), #6e4520 calc(50% + 4px), transparent calc(50% + 4px)),
    linear-gradient(0deg, transparent calc(50% - 4px), #6e4520 calc(50% - 4px), #6e4520 calc(50% + 4px), transparent calc(50% + 4px));
  z-index: 3; pointer-events: none;
}
.plg-sill {
  position: absolute; left: 50%; transform: translateX(-50%);
  width: min(82vw, 392px); height: 22px;
  background: linear-gradient(180deg, #8a5a2c, #6e4520);
  box-shadow: 0 6px 0 #4d2e12;
}
.plg-moon {
  position: absolute; top: 12%; right: 14%;
  width: 34px; height: 34px;
  background: #fdf3cf; box-shadow: 0 0 18px 6px rgba(253,243,207,.35);
}
.plg-wstar { position: absolute; width: 3px; height: 3px; background: #f0eaff; animation: plg-blink var(--d,3s) steps(2) infinite; }
@keyframes plg-blink { 50% { opacity: .15; } }

/* ── Dragon peek ── */
.plg-dragon {
  position: absolute; bottom: 0; left: 50%;
  transform: translate(-50%, 105%);
  transition: transform 1.1s steps(7);
  z-index: 2; cursor: pointer; border: none; background: none; padding: 0;
  will-change: transform;
}
.plg-dragon.plg-up { transform: translate(-50%, 18%); }

/* ── Shelf + thrift props ── */
.plg-shelf {
  position: absolute; left: 4%; top: 16%;
  width: 17%; max-width: 110px; height: 12px;
  background: #6e4520; box-shadow: 0 5px 0 #4d2e12;
}
.plg-prop { position: absolute; bottom: 12px; }
.plg-tag {
  position: absolute; font-family: 'VT323', monospace; font-size: 15px;
  background: #fdf3cf; color: #5e3b1a; padding: 1px 5px;
  border: 2px solid #5e3b1a; transform: rotate(-8deg);
}

/* ── Flower on the sill ── */
.plg-flower {
  position: absolute; left: 50%; transform: translateX(-50%);
  z-index: 6; cursor: pointer; border: none; background: none; padding: 0;
}
.plg-flower:active { transform: translateX(-50%) scale(.94); }
.plg-grow { animation: plg-pop .35s steps(3); }
@keyframes plg-pop { 50% { transform: translateX(-50%) scale(1.18); } }

/* ── TAP ME bubble ── */
.plg-bubble {
  position: absolute; left: 50%; transform: translateX(-50%);
  background: #fdf3cf; color: #2b2b3a;
  font-size: 9px; padding: 8px 10px;
  border: 4px solid #2b2b3a; box-shadow: 4px 4px 0 rgba(0,0,0,.35);
  animation: plg-bounce 1s steps(2) infinite;
  z-index: 7; white-space: nowrap; pointer-events: none;
}
.plg-bubble::after {
  content: ''; position: absolute; left: 50%; bottom: -10px;
  transform: translateX(-50%);
  border: 6px solid transparent; border-top-color: #2b2b3a;
}
@keyframes plg-bounce { 50% { translate: 0 -6px; } }

/* ── Tap sparkles ── */
.plg-spark {
  position: absolute; width: 6px; height: 6px; background: #ffd75e;
  animation: plg-spark .5s steps(4) forwards; pointer-events: none; z-index: 8;
  will-change: transform;
}
@keyframes plg-spark {
  from { transform: translate(0,0) scale(1); opacity: 1; }
  to   { transform: translate(var(--sx), var(--sy)) scale(.3); opacity: 0; }
}

/* ── Falling petals ── */
.plg-petal {
  position: absolute; z-index: 20;
  border: none; background: none; padding: 6px; /* generous tap target */
  cursor: pointer;
  animation: plg-fall var(--fd, 2.6s) ease-in forwards;
  will-change: transform;
}
@keyframes plg-fall {
  0%   { transform: translate(0, 0) rotate(0deg); }
  55%  { transform: translate(calc(var(--tx) * .6), calc(var(--ty) * .5)) rotate(300deg); }
  100% { transform: translate(var(--tx), var(--ty)) rotate(540deg); }
}
.plg-petal.plg-rest { animation: plg-wiggle 2.2s steps(2) infinite; }
@keyframes plg-wiggle { 50% { rotate: 8deg; } }

/* ── Title screen ── */
.plg-title {
  position: absolute; inset: 0; z-index: 90;
  background: #15122b;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding: 24px; cursor: pointer;
}
.plg-title h1 {
  color: #f79ac0; font-size: clamp(13px, 3.6vw, 20px);
  line-height: 2; max-width: 560px;
  text-shadow: 3px 3px 0 #5e2244;
}
.plg-press {
  margin-top: 38px; color: #fdf3cf; font-size: 10px;
  animation: plg-blink 1.2s steps(2) infinite;
}

/* ── Note card ── */
.plg-overlay {
  position: fixed; inset: 0; z-index: 60;
  background: rgba(21, 18, 43, .72);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}
.plg-note {
  position: relative; width: 100%; max-width: 400px;
  background: #fdf3cf;
  border: 5px solid #2b2b3a;
  box-shadow: 8px 8px 0 rgba(0,0,0,.4);
  padding: 18px 18px 20px;
  animation: plg-notein .3s steps(4);
}
@keyframes plg-notein { from { transform: scale(.6); } }
.plg-note-head { display: flex; align-items: center; gap: 12px; border-bottom: 3px dashed #b9a978; padding-bottom: 12px; margin-bottom: 14px; }
.plg-note-text {
  font-family: 'VT323', monospace; font-size: 26px; line-height: 1.25;
  color: #2b2b3a;
}
.plg-btn {
  font-family: 'Press Start 2P', monospace; font-size: 9px;
  background: #f79ac0; color: #2b2b3a;
  border: 4px solid #2b2b3a; box-shadow: 4px 4px 0 rgba(0,0,0,.35);
  padding: 10px 14px; cursor: pointer;
}
.plg-btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 rgba(0,0,0,.35); }

/* ── HUD ── */
.plg-hud {
  position: fixed; top: 12px; left: 50%; transform: translateX(-50%);
  z-index: 50; color: #fdf3cf; font-size: 9px;
  text-shadow: 2px 2px 0 rgba(0,0,0,.45);
}
.plg-mute {
  position: fixed; top: 10px; right: 10px; z-index: 50;
  font-family: 'Press Start 2P', monospace; font-size: 9px;
  background: #2b2b3a; color: #fdf3cf;
  border: 3px solid #fdf3cf; padding: 8px 10px; cursor: pointer;
}
.plg-nowplaying {
  position: fixed; top: 52px; right: 12px; z-index: 50;
  font-family: 'VT323', monospace; font-size: 19px;
  color: #fdf3cf; text-shadow: 2px 2px 0 rgba(0,0,0,.45);
  text-align: right; pointer-events: none;
  animation: plg-lyricfade 6.4s ease-in-out forwards;
}
@keyframes plg-lyricfade {
  0%   { opacity: 0; transform: translateY(4px); }
  12%  { opacity: 1; transform: translateY(0); }
  82%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(-4px); }
}

/* ── Ending ── */
.plg-end {
  position: fixed; left: 50%; bottom: 34%;
  transform: translateX(-50%);
  z-index: 55; color: #fdf3cf; font-size: clamp(11px, 3vw, 16px);
  text-shadow: 3px 3px 0 #5e2244; text-align: center;
  animation: plg-endin 2s steps(8) backwards;
}
@keyframes plg-endin { from { opacity: 0; } }

/* ── New decor ── */
.plg-painting {
  position: absolute; right: 4%; top: 12%;
  border: 8px solid #6e4520;
  box-shadow: 0 0 0 3px #4d2e12, 5px 5px 0 rgba(0,0,0,.25);
  z-index: 1; transform: rotate(2deg);
}
.plg-minitag {
  position: absolute; top: -24px; left: 50%; transform: translateX(-50%);
  font-family: 'Press Start 2P', monospace; font-size: 8px;
  background: #fdf3cf; color: #2b2b3a; border: 3px solid #2b2b3a;
  padding: 3px 5px; white-space: nowrap;
  animation: plg-bounce .9s steps(2) infinite;
}
.plg-glowpulse { animation: plg-glowpulse 1.1s steps(2) infinite; }
@keyframes plg-glowpulse {
  0%, 100% { filter: drop-shadow(0 0 0 rgba(255,215,94,0)); }
  50%      { filter: drop-shadow(0 0 14px rgba(255,215,94,.95)); }
}
.plg-smoke {
  position: absolute; width: 5px; height: 5px;
  background: #b9b9c4; opacity: 0;
  animation: plg-smoke 2.6s steps(6) infinite;
  animation-delay: var(--sd, 0s);
  will-change: transform;
}
@keyframes plg-smoke {
  0%   { transform: translate(0, 0); opacity: .85; }
  100% { transform: translate(-12px, -36px); opacity: 0; }
}

/* ── You, waving ── */
.plg-me {
  position: absolute; left: 5%; bottom: 15%; z-index: 4;
  border: none; background: none; padding: 0; cursor: pointer;
}
.plg-skate {
  position: absolute; left: calc(5% + 126px); bottom: 15%; z-index: 4;
}

/* ── Store sign ── */
.plg-sign {
  position: absolute; left: 1%; top: 11%;
  background: #4d2e12;
  border-left: 4px solid #2a1508; border-right: 4px solid #2a1508;
  border-top: 7px solid #3d2409; border-bottom: 7px solid #2a1508;
  padding: 4px 10px; z-index: 3;
  box-shadow: 3px 3px 0 #1a0a02;
  pointer-events: none;
}
.plg-sign-text {
  font-family: 'VT323', monospace; font-size: 16px; line-height: 1.3;
  color: #fdf3cf; text-align: center; white-space: nowrap;
  text-shadow: 1px 1px 0 #2a1508; letter-spacing: 1px; display: block;
}

/* ── Decor placement (classes so phones can shrink/hide them) ── */
.plg-surfA { position: absolute; right: 1%; bottom: 4%; transform: rotate(8deg); z-index: 4; }
.plg-surfB { position: absolute; right: 13%; bottom: 2%; transform: rotate(-7deg); z-index: 3; }
.plg-pileA { position: absolute; left: 20%; bottom: 3%; z-index: 4; }
.plg-pileB { position: absolute; left: 30%; bottom: 1%; z-index: 5; }

/* ── Birthday finale ── */
.plg-bday {
  position: fixed; left: 50%; bottom: 23%;
  transform: translateX(-50%);
  z-index: 56; color: #f79ac0;
  font-size: clamp(13px, 4.4vw, 24px);
  text-shadow: 3px 3px 0 #5e2244; text-align: center; white-space: nowrap;
  animation: plg-endin 1.5s steps(6) backwards, plg-bounce 1s steps(2) infinite 1.6s;
}
.plg-confetti {
  position: fixed; top: -3%; width: 7px; height: 7px; z-index: 54;
  pointer-events: none;
  animation-name: plg-confettifall; animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}
@keyframes plg-confettifall {
  0%   { transform: translate(0, -4vh) rotate(0deg); }
  100% { transform: translate(16px, 108vh) rotate(360deg); }
}

/* ── Phone-size adjustments (she'll likely open this on her phone) ── */
@media (max-width: 480px) {
  .plg-painting { transform: rotate(2deg) scale(.72); transform-origin: top right; }
  .plg-surfA { transform: rotate(8deg) scale(.6); transform-origin: bottom right; }
  .plg-surfB { display: none; }       /* one surfboard is enough on a phone */
  .plg-pileB { display: none; }
  .plg-me { transform: scale(.7); transform-origin: bottom left; bottom: 16%; left: 2%; }
  .plg-skate { transform: scale(.7); transform-origin: bottom left; left: calc(2% + 88px); bottom: 16%; }
  .plg-smoke-extra { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .plg-root * { animation-duration: .01s !important; transition-duration: .01s !important; }
}
`;

/* ═══════════════════════════════════════════════════════════════════
   SOUND — tiny chiptune blips (generated, no files). Off by default.
   ═══════════════════════════════════════════════════════════════════ */

function makeBeeper() {
  let ctx = null;
  const ensure = () => {
    if (!ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) ctx = new Ctx();
    }
    return ctx;
  };
  const blip = (freq = 660, dur = 0.07, vol = 0.08) => {
    const c = ensure();
    if (!c) return;
    const o = c.createOscillator();
    o.type = "square";
    o.frequency.value = freq;
    const g = c.createGain();
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g).connect(c.destination);
    o.start();
    o.stop(c.currentTime + dur + 0.02);
  };
  return {
    tap: () => blip(520 + Math.random() * 120, 0.06),
    bloom: () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => blip(f, 0.12, 0.07), i * 90)),
    note: () => blip(880, 0.09, 0.06),
    dragon: () => [392, 330].forEach((f, i) => setTimeout(() => blip(f, 0.1, 0.05), i * 110)),
  };
}

/* ═══════════════════════════════════════════════════════════════════
   MUSIC — loops your CUSTOM_MUSIC_URL if set; otherwise plays a soft
   original piano progression (Fmaj7 → Am7 → Dm7 → B♭maj7), generated
   in code so no audio files are needed.
   ═══════════════════════════════════════════════════════════════════ */

function useMusic(on) {
  const ref = useRef(null);
  useEffect(() => {
    if (!on) return;

    // Option A — her song: your own hosted piano track
    if (CUSTOM_MUSIC_URL) {
      const a = new Audio(CUSTOM_MUSIC_URL);
      a.loop = true;
      a.volume = 0.55;
      a.play().catch(() => {});
      ref.current = a;
      return () => { a.pause(); ref.current = null; };
    }

    // Option B — built-in gentle piano loop
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.15;
    master.connect(ctx.destination);

    const key = (f, t, dur = 2.4, vol = 0.4) => {
      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + dur + 0.1);
    };

    // "Always"-style progression — chord progressions aren't copyrightable
    // (only the melody is). The top line below is an ORIGINAL melody I wrote
    // in the same key (D♭ major) and same slow, soulful feel, so the piano
    // *sings* without copying the actual song. If you want the real melody,
    // use the CUSTOM_MUSIC_URL slot with a recording instead.
    // mel format: [frequency, startOffsetSeconds, durationSeconds]
    const chords = [
      { bass: 69.3,  keys: [174.61, 207.65, 261.63, 311.13],   // D♭maj9: F A♭ C E♭
        mel: [[415.3, 0.3, 0.6], [523.25, 0.95, 0.5], [554.37, 1.5, 1.5]] },        // A♭ C D♭~
      { bass: 77.78, keys: [196.0, 277.18, 311.13, 349.23],    // E♭9: G D♭ E♭ F
        mel: [[466.16, 0.3, 0.6], [415.3, 0.95, 0.5], [349.23, 1.5, 1.6]] },        // B♭ A♭ F~
      { bass: 92.5,  keys: [233.08, 277.18, 349.23],           // G♭maj7: B♭ D♭ F
        mel: [[554.37, 0.4, 0.7], [466.16, 1.1, 0.6], [415.3, 1.7, 1.4]] },         // D♭ B♭ A♭~
      { bass: 92.5,  keys: [220.0, 277.18, 329.63],            // G♭m7: A D♭ E
        mel: [[349.23, 0.4, 0.6], [311.13, 1.0, 0.6], [277.18, 1.6, 1.7]] },        // F E♭ D♭~ (rest home)
    ];

    // melody voice: soft sine with a touch of vibrato, like a hummed line
    const sing = (f, t, dur) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const vib = ctx.createOscillator();
      vib.frequency.value = 5.2;
      const vibG = ctx.createGain();
      vibG.gain.value = 3.5;
      vib.connect(vibG).connect(o.frequency);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.22, t + 0.06);
      g.gain.setValueAtTime(0.22, t + dur * 0.55);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(master);
      o.start(t); vib.start(t);
      o.stop(t + dur + 0.1); vib.stop(t + dur + 0.1);
    };

    let step = 0;
    const playBar = () => {
      const t = ctx.currentTime + 0.05;
      const ch = chords[step % chords.length];
      // left hand: pulsing root octaves, twice per bar
      key(ch.bass, t, 1.6, 0.42);
      key(ch.bass * 2, t, 1.5, 0.26);
      key(ch.bass, t + 1.6, 1.5, 0.36);
      key(ch.bass * 2, t + 1.6, 1.4, 0.22);
      // right hand: rich rolled voicings
      ch.keys.forEach((f, i) => key(f, t + 0.12 + i * 0.14, 2.7, 0.2));
      ch.keys.forEach((f, i) => key(f, t + 1.72 + i * 0.14, 1.5, 0.13));
      // top line: the original melody
      ch.mel.forEach(([f, off, dur]) => sing(f, t + off, dur));
      step++;
    };
    playBar();
    const timer = setInterval(playBar, 3200);
    ref.current = { ctx, timer };
    return () => {
      clearInterval(timer);
      ctx.close().catch(() => {});
      ref.current = null;
    };
  }, [on]);
}

/* ═══════════════════════════════════════════════════════════════════
   SCENE PIECES
   ═══════════════════════════════════════════════════════════════════ */

/** Night sky inside the window + the dragon that peeks over the sill. */
function WindowScene({ muted, beeper }) {
  const [peek, setPeek] = useState(false);
  const [peekLeft, setPeekLeft] = useState(50); // he pops up in a new spot each time
  const [blink, setBlink] = useState(false);
  const [heart, setHeart] = useState(false);

  // Random peeking: up for ~3.5s every 7–15 seconds, at a random spot.
  useEffect(() => {
    let alive = true;
    let timers = [];
    const popUp = () => {
      setPeekLeft(18 + Math.random() * 64); // left / middle / right of window
      setPeek(true);
    };
    const loop = () => {
      if (!alive) return;
      const wait = 7000 + Math.random() * 8000;
      timers.push(
        setTimeout(() => {
          popUp();
          // a couple of blinks while he's up
          timers.push(setTimeout(() => setBlink(true), 1300));
          timers.push(setTimeout(() => setBlink(false), 1550));
          timers.push(setTimeout(() => setBlink(true), 2400));
          timers.push(setTimeout(() => setBlink(false), 2650));
          timers.push(
            setTimeout(() => {
              setPeek(false);
              loop();
            }, 3600)
          );
        }, wait)
      );
    };
    // first appearance comes fairly soon, so she meets him early
    timers.push(setTimeout(() => { popUp(); timers.push(setTimeout(() => { setPeek(false); loop(); }, 3600)); }, 3500));
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, []);

  const stars = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: (i * 23 + 7) % 92,
        top: 5 + ((i * 31) % 55),
        d: 2 + (i % 4),
      })),
    []
  );

  return (
    <>
      {stars.map((s, i) => (
        <div key={i} className="plg-wstar" style={{ left: `${s.left}%`, top: `${s.top}%`, "--d": `${s.d}s` }} />
      ))}
      <div className="plg-moon" />
      <button
        className={`plg-dragon ${peek ? "plg-up" : ""}`}
        style={{ left: `${peekLeft}%` }}
        aria-label="A friendly dragon at the window"
        onClick={() => {
          if (!muted) beeper.dragon();
          setHeart(true);
          setTimeout(() => setHeart(false), 1100);
        }}
      >
        <Sprite map={blink ? DRAGON_BLINK : DRAGON_OPEN} palette={DRAGON_PALETTE} scale={5} />
        {heart && (
          <span
            style={{
              position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)",
              color: "#f79ac0", fontSize: 16, textShadow: "2px 2px 0 #5e2244",
            }}
          >
            ♥
          </span>
        )}
      </button>
    </>
  );
}

/** Thrift props on the shelf: books, the famous spicy noodle cup, a lamp. */
function Shelf() {
  return (
    <div className="plg-shelf">
      {/* stacked books */}
      <div className="plg-prop" style={{ left: "4%" }}>
        <div style={{ width: 34, height: 8, background: "#a04848", border: "2px solid #5e2424" }} />
        <div style={{ width: 30, height: 8, background: "#4868a0", border: "2px solid #243a5e", marginTop: -2, marginLeft: 3 }} />
        <div style={{ width: 36, height: 8, background: "#5d8a4a", border: "2px solid #2f4a24", marginTop: -2, marginLeft: -1 }} />
      </div>
      {/* spicy noodles, top-left shelf, as requested 🔥 */}
      <div className="plg-prop" style={{ left: "44%" }}>
        <Sprite map={BULDAK_MAP} palette={BULDAK_PALETTE} scale={3} />
      </div>
      {/* lamp */}
      <div className="plg-prop" style={{ right: "4%" }}>
        <div style={{ width: 20, height: 14, background: "#ffd75e", border: "2px solid #8a6a12", boxShadow: "0 0 14px 4px rgba(255,215,94,.35)" }} />
        <div style={{ width: 6, height: 12, background: "#5e3b1a", margin: "0 auto" }} />
      </div>
    </div>
  );
}

/** The rest of the thrift clutter: manatee art, surfboards, clothes piles. */
function Decor() {
  return (
    <>
      {/* manatee painting on the right wall (slightly crooked, as thrift art should be) */}
      <div className="plg-painting">
        <Sprite map={MANATEE_MAP} palette={MANATEE_PALETTE} scale={4} />
        <div className="plg-tag" style={{ bottom: -16, right: -12, top: "auto", left: "auto" }}>5$</div>
      </div>

      {/* surfboards leaning against the right wall */}
      <div className="plg-surfA">
        <Sprite map={SURF_MAP} palette={SURF_TEAL} scale={9} />
      </div>
      <div className="plg-surfB">
        <Sprite map={SURF_MAP} palette={SURF_CORAL} scale={7} />
      </div>

      {/* piles of old clothes on the floor */}
      <div className="plg-pileA">
        <Sprite map={CLOTHES_MAP} palette={CLOTHES_A} scale={5} />
        <div className="plg-tag" style={{ top: -18, left: 6 }}>1$</div>
      </div>
      <div className="plg-pileB">
        <Sprite map={CLOTHES_MAP} palette={CLOTHES_B} scale={4} />
      </div>
    </>
  );
}

/** You — standing under the shelf, smiling, waving at her. Tap for a hello. */
function MeWaving({ muted, beeper }) {
  const [frame, setFrame] = useState(0);
  const [hi, setHi] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setFrame((f) => 1 - f), 450);
    return () => clearInterval(t);
  }, []);
  return (
    <button
      className="plg-me"
      aria-label="That's me, waving at you"
      onClick={() => {
        if (!muted) beeper.tap();
        setHi(true);
        setTimeout(() => setHi(false), 1600);
      }}
    >
      <Sprite map={frame ? ME_WAVE_MID : ME_WAVE_UP} palette={ME_PALETTE} scale={7} />
      {hi && <span className="plg-minitag">HI INDI!</span>}
    </button>
  );
}

/** Phasing "now playing" caption under the music button. Cycles one
    line per chord loop, fading in and out. Edit NOW_PLAYING up top. */
function NowPlaying() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % NOW_PLAYING.length), 6400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="plg-nowplaying" key={idx}>
      {NOW_PLAYING[idx]}
    </div>
  );
}

/** Ending: "be gentle with yourself" → pause → HAPPY BIRTHDAY + confetti. */
function EndSequence() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setStage(1), 3200);
    return () => clearTimeout(t);
  }, []);
  const confetti = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        left: (i * 41 + 13) % 96,
        d: 2.4 + (i % 5) * 0.55,
        delay: (i % 8) * 0.45,
        c: ["#f79ac0", "#ffd75e", "#8ef05f", "#7fb8d8", "#fdf3cf"][i % 5],
      })),
    []
  );
  return (
    <>
      <div className="plg-end">{ENDING} ♥</div>
      {stage === 1 && (
        <>
          <div className="plg-bday">{BIRTHDAY}</div>
          {confetti.map((c, i) => (
            <div
              key={i}
              className="plg-confetti"
              style={{
                left: `${c.left}%`,
                background: c.c,
                animationDuration: `${c.d}s`,
                animationDelay: `${c.delay}s`,
              }}
            />
          ))}
        </>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN GAME
   ═══════════════════════════════════════════════════════════════════ */

export default function PinkLilyThriftShop() {
  const [phase, setPhase] = useState("title");   // title | shop
  const [stage, setStage] = useState(0);         // 0..3 (3 = bloomed)
  const [grew, setGrew] = useState(false);       // pop animation flag
  const [sparks, setSparks] = useState([]);      // tap sparkles
  const [petals, setPetals] = useState([]);      // live petals on screen
  const [opened, setOpened] = useState(0);       // messages read
  const [card, setCard] = useState(null);        // message text | null
  const [sfxMuted, setSfxMuted] = useState(false);  // sound effects: on by default
  const [musicMuted, setMusicMuted] = useState(true); // music: off until toggled
  const spawnedRef = useRef(0);                  // total petals ever spawned
  const lastFlowerTapRef = useRef(0);
  const beeper = useMemo(() => makeBeeper(), []);
  useMusic(!musicMuted);

  // Shuffle the message order once per visit, so every time she opens
  // the shop the petals fall in a different order.
  const order = useMemo(() => {
    const a = MESSAGES.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, []);

  const total = MESSAGES.length;
  const allRead = opened >= total;

  /* — sparkle burst near the flower — */
  const burst = () => {
    const items = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      sx: (Math.random() - 0.5) * 90,
      sy: -30 - Math.random() * 50,
    }));
    setSparks((s) => [...s, ...items]);
    setTimeout(() => setSparks((s) => s.filter((p) => !items.includes(p))), 600);
  };

  /* — spawn one falling petal carrying the next unread message — */
  const spawnPetal = (delay = 0) => {
    if (spawnedRef.current >= total) return;
    const msgIndex = spawnedRef.current++;
    const id = `petal-${msgIndex}`;
    // Fall from the flower (top-center) to a random spot on the floor.
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const startX = vw * 0.5;
    const startY = vh * 0.42;
    const endX = vw * (0.06 + Math.random() * 0.82);
    const endY = vh * (0.74 + Math.random() * 0.16);
    setTimeout(() => {
      setPetals((p) => [
        ...p,
        { id, msgIndex, startX, startY, tx: endX - startX, ty: endY - startY, fd: 2.2 + Math.random() * 1.4 },
      ]);
    }, delay);
  };

  /* — tapping the plant — */
  const handleFlower = () => {
    if (phase !== "shop") return;
    if (stage < 3) {
      if (!sfxMuted) beeper.tap();
      burst();
      setGrew(true);
      setTimeout(() => setGrew(false), 380);
      const next = stage + 1;
      setStage(next);
      if (next === 3) {
        // BLOOM! petals flutter down, staggered
        if (!sfxMuted) beeper.bloom();
        const first = Math.min(window.innerWidth <= 480 ? 4 : 10, total);
        for (let i = 0; i < first; i++) spawnPetal(700 + i * 450);
      }
    } else {
      // tapping the bloomed flower drops another petal if any remain
      const now = Date.now();
      if (now - lastFlowerTapRef.current < 250) return;
      lastFlowerTapRef.current = now;
      if (!sfxMuted) beeper.tap();
      burst();
      spawnPetal(150);
    }
  };

  /* — tapping a petal — */
  const handlePetal = (petal) => {
    if (!sfxMuted) beeper.note();
    setCard(MESSAGES[order[petal.msgIndex]]); // shuffled order, new every visit
    setOpened((n) => n + 1);
    setPetals((p) => p.filter((x) => x.id !== petal.id));
    spawnPetal(900); // keep the shop gently raining petals until all read
  };

  return (
    <div className="plg-root">
      <style>{styles}</style>

      {/* ── Shop scene ── */}
      <div className="plg-wall" />
      <div className="plg-sign">
        <span className="plg-sign-text">* FAMILIARITY *</span>
        <span className="plg-sign-text">THRIFT STORE</span>
      </div>
      <div className="plg-floor" />
      <Shelf />
      <Decor />
      <MeWaving muted={sfxMuted} beeper={beeper} />
      {/* your board, parked right next to you */}
      <div className="plg-skate">
        <Sprite map={SKATE_MAP} palette={SKATE_PALETTE} scale={5} />
      </div>

      {/* Window (sized via CSS); sill sits just below it */}
      <div className="plg-window">
        <WindowScene muted={sfxMuted} beeper={beeper} />
      </div>
      <div className="plg-sill" style={{ top: "calc(9% + min(46vh, 300px) + 10px)" }} />

      {/* a little joint burning off the edge of the sill */}
      <div
        style={{
          position: "absolute",
          left: "calc(50% + min(41vw, 196px) - 26px)",
          top: "calc(9% + min(46vh, 300px) + 4px)",
          transform: "rotate(-18deg)",
          zIndex: 7,
        }}
      >
        <Sprite map={JOINT_MAP} palette={JOINT_PALETTE} scale={3} />
        <div className="plg-smoke" style={{ left: -4, top: -8, "--sd": "0s" }} />
        <div className="plg-smoke plg-smoke-extra" style={{ left: 0, top: -8, "--sd": ".9s" }} />
        <div className="plg-smoke plg-smoke-extra" style={{ left: -7, top: -8, "--sd": "1.7s" }} />
      </div>

      {/* Pot + plant on the sill */}
      <button
        className={`plg-flower ${grew ? "plg-grow" : ""} ${phase === "shop" && stage < 3 ? "plg-glowpulse" : ""}`}
        style={{ top: "calc(9% + min(46vh, 300px) - 84px)" }}
        onClick={handleFlower}
        aria-label="A little plant in a pot. Tap it!"
      >
        <Sprite map={STAGES[stage]} palette={PLANT_PALETTE} scale={6} />
      </button>

      {/* thrift price tag on the pot — because it's a thrift shop :) */}
      <div className="plg-tag" style={{ top: "calc(9% + min(46vh, 300px) - 18px)", left: "calc(50% + 44px)" }}>
        2$ ♥
      </div>

      {/* TAP ME bubble while growing */}
      {phase === "shop" && stage < 3 && (
        <div className="plg-bubble" style={{ top: "calc(9% + min(46vh, 300px) - 140px)" }}>
          {TAP_LABELS[stage]}
        </div>
      )}

      {/* tap sparkles */}
      {sparks.map((s) => (
        <div
          key={s.id}
          className="plg-spark"
          style={{ left: "50%", top: "calc(9% + min(46vh, 300px) - 60px)", "--sx": `${s.sx}px`, "--sy": `${s.sy}px` }}
        />
      ))}

      {/* falling / resting petals */}
      {petals.map((p) => (
        <button
          key={p.id}
          className="plg-petal"
          style={{ left: p.startX, top: p.startY, "--tx": `${p.tx}px`, "--ty": `${p.ty}px`, "--fd": `${p.fd}s` }}
          onClick={() => handlePetal(p)}
          aria-label="A fallen petal with a note"
        >
          <Sprite map={PETAL_MAP} palette={PLANT_PALETTE} scale={5} />
          {opened === 0 && <span className="plg-minitag">TAP ME!</span>}
        </button>
      ))}

      {/* HUD */}
      {phase === "shop" && stage === 3 && !allRead && (
        <div className="plg-hud">✿ {opened}/{total}</div>
      )}
      <button className="plg-mute" onClick={() => setMusicMuted((m) => !m)} aria-pressed={!musicMuted}>
        {musicMuted ? "♪ LISTEN ME!" : "♪ SHH..."}
      </button>
      {!musicMuted && <NowPlaying />}

      {/* ending: be gentle → pause → happy birthday + confetti */}
      {allRead && !card && <EndSequence />}

      {/* ── Note card ── */}
      {card && (
        <div className="plg-overlay" onClick={() => setCard(null)}>
          <div className="plg-note" onClick={(e) => e.stopPropagation()}>
            <div className="plg-note-head">
              <Sprite map={FACE_MAP} palette={FACE_PALETTE} scale={4} />
              <span style={{ fontSize: 9, color: "#6e5a30", lineHeight: 1.9, display: "flex", flexDirection: "column", gap: 4 }}>
                <span>TONIGHT'S</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  THE NIGHT
                  <Sprite map={KNIFE_MAP} palette={KNIFE_PALETTE} scale={2} style={{ display: "inline-block" }} />
                </span>
              </span>
            </div>
            <p className="plg-note-text">{card}</p>
            <div style={{ textAlign: "center", marginTop: 18 }}>
              <button className="plg-btn" onClick={() => setCard(null)}>
                OK ♥
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Title screen ── */}
      {phase === "title" && (
        <div className="plg-title" onClick={() => setPhase("shop")}>
          <Sprite map={STAGE_3} palette={PLANT_PALETTE} scale={5} style={{ marginBottom: 30 }} />
          <h1>{TITLE}</h1>
          <div className="plg-press">▶ TAP TO BEGIN</div>
        </div>
      )}
    </div>
  );
}
