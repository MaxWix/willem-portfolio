import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { site } from "../content.js";
import { measureInk, measureInkX } from "../useInkBox.js";

// The giant name at the bottom of every page (exactly as written in content.js) — real HTML text.
// It sets its font-size so the letters span edge to edge — first letter touching
// the left of the window, last letter touching the right — and sizes
// its box to the letters so they sit flush on the bottom edge without being
// cut off. Re-fits on resize and once the web font has loaded.
//
// <Wordmark jitter /> splits the name into letters that each twitch now and
// then on their own random timing (used on the splash screen).
export default function Wordmark({ jitter = false }) {
  const boxRef = useRef(null);
  const textRef = useRef(null);
  const [fit, setFit] = useState(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const text = textRef.current;
    if (!box || !text) return;

    const measure = () => {
      // Measure at 100px; everything scales in proportion to font size.
      text.style.fontSize = "100px";
      const boxWidth = text.getBoundingClientRect().width;
      if (!boxWidth) return;
      const gap = measureInkX(text);
      const inkWidth = boxWidth - gap.left - gap.right;
      // Size so the letters themselves (not the text box) span the screen,
      // then nudge left so the first letter touches the left edge.
      const scale = box.clientWidth / inkWidth;
      const size = 100 * scale;
      text.style.fontSize = `${size}px`;
      const ink = measureInk(text);
      text.style.fontSize = "";
      setFit({ size, x: gap.left * scale, ...ink });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  const style = fit
    ? {
        "--mark-size": `${fit.size}px`,
        "--ink-x": `${fit.x}px`,
        "--ink-shift": `${fit.shift}px`,
        "--ink-height": `${fit.height}px`,
      }
    : undefined;

  // One set of random settings per letter, picked once.
  const letters = useMemo(
    () =>
      jitter
        ? [...site.name].map((ch) => ({ ch, vars: randomJitter(true) }))
        : null,
    [jitter],
  );

  return (
    <div
      ref={boxRef}
      className={jitter ? "wordmark wordmark--jitter" : "wordmark"}
      style={style}
      aria-hidden="true"
    >
      <span ref={textRef} className="wordmark__text">
        {letters
          ? letters.map(({ ch, vars }, i) => (
              <span
                key={i}
                className="wordmark__letter"
                style={vars}
                // After each twitch, pick a new direction and timing so the
                // movement never settles into a visible pattern.
                onAnimationIteration={(e) => {
                  for (const [k, v] of Object.entries(randomJitter(false)))
                    e.currentTarget.style.setProperty(k, v);
                }}
              >
                {ch}
              </span>
            ))
          : site.name}
      </span>
    </div>
  );
}

// Random twitch for one letter. Distances are in em, so they scale with the
// wordmark. `first` also gives a random start point so letters don't sync up.
function randomJitter(first) {
  const r = (min, max) => min + Math.random() * (max - min);
  const sign = () => (Math.random() < 0.5 ? -1 : 1);
  const duration = r(1.8, 6);
  return {
    "--dx": `${(sign() * r(0.01, 0.045)).toFixed(3)}em`,
    "--dy": `${(sign() * r(0.01, 0.06)).toFixed(3)}em`,
    "--rot": `${(sign() * r(1, 7)).toFixed(1)}deg`,
    "--dur": `${duration.toFixed(2)}s`,
    ...(first ? { "--delay": `${(-r(0, duration)).toFixed(2)}s` } : {}),
  };
}
