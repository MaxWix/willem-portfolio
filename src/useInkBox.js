// Measures where the *visible letters* of a line of text sit, so a box can be
// sized to exactly the letters — no empty space above, nothing cut off below —
// whatever the font or browser.
//
// Returns { shift, height } in px:
//   shift  – how far to move the text up so the tops of the capitals touch the box top
//   height – the box height that fits the letters from top of capitals to bottom of serifs

let canvas;
export function measureInk(el) {
  const cs = getComputedStyle(el);
  canvas ??= document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const m = ctx.measureText(el.textContent);
  const ascent = m.actualBoundingBoxAscent; // baseline → top of tallest letter
  const descent = Math.max(0, m.actualBoundingBoxDescent); // baseline → lowest pixel

  // Find the baseline's position inside the element with a zero-height probe.
  const probe = document.createElement("i");
  probe.style.cssText =
    "display:inline-block;width:0;height:0;vertical-align:baseline";
  el.appendChild(probe);
  const baselineY =
    probe.getBoundingClientRect().top - el.getBoundingClientRect().top;
  probe.remove();

  return { shift: baselineY - ascent, height: ascent + descent };
}

// Horizontal version: the empty space a line of text has at each end — the
// side bearing of the first and last letters, plus the letter-spacing browsers
// add after the last letter. Returns { left, right } in px.
export function measureInkX(el) {
  const cs = getComputedStyle(el);
  canvas ??= document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const text = el.textContent;
  const first = ctx.measureText(text[0]);
  const last = ctx.measureText(text[text.length - 1]);
  const spacing = parseFloat(cs.letterSpacing) || 0;
  return {
    left: -first.actualBoundingBoxLeft, // gap before the ink of the first letter
    right: last.width - last.actualBoundingBoxRight + spacing, // gap after the last letter
  };
}
