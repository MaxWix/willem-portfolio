import { useEffect, useRef, useState } from "react";
import { work } from "../content.js";
import { useSound } from "../sound.jsx";

// How long the controls stay up after a tap on touch screens (no hover there).
const TOUCH_SHOW_MS = 3000;
// How far the arrow keys skip when the timeline has keyboard focus.
const KEY_SKIP_S = 5;

export default function Work() {
  const { src, poster, title } = work.hero;
  const { entered, soundOn, setSoundOn } = useSound();
  const videoRef = useRef(null);
  const fillRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [touchShown, setTouchShown] = useState(false);
  const touchTimer = useRef(null);

  // React doesn't reliably update the `muted` attribute, so set it directly.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !soundOn;
    if (entered) {
      v.play().catch(() => {
        // Browser refused to play with sound — fall back to muted playback.
        v.muted = true;
        setSoundOn(false);
        v.play().catch(() => {});
      });
    }
  }, [soundOn, entered, setSoundOn]);

  // Move the progress bar every frame while playing, so it glides smoothly.
  // (Written straight to the element instead of through React state.)
  useEffect(() => {
    let frame;
    const tick = () => {
      const v = videoRef.current;
      if (v && fillRef.current && v.duration) {
        fillRef.current.style.setProperty(
          "--progress",
          v.currentTime / v.duration,
        );
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => () => clearTimeout(touchTimer.current), []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const seekTo = (seconds) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    v.currentTime = Math.min(Math.max(seconds, 0), v.duration);
    setTime(v.currentTime);
  };

  // Timeline: click or drag anywhere on the bar to jump there.
  const seekFromPointer = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seekTo(ratio * (videoRef.current?.duration || 0));
  };
  const onBarDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    seekFromPointer(e);
  };
  const onBarMove = (e) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) seekFromPointer(e);
  };
  const onBarKey = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const step = { ArrowRight: KEY_SKIP_S, ArrowLeft: -KEY_SKIP_S }[e.key];
    if (step) {
      e.preventDefault();
      seekTo(v.currentTime + step);
    } else if (e.key === "Home") {
      e.preventDefault();
      seekTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      seekTo(v.duration);
    }
  };

  // Show controls while a mouse is over the video; on touch, a tap shows
  // them for a few seconds (and keeps them up while you keep tapping).
  const onPointerEnter = (e) => e.pointerType === "mouse" && setHovering(true);
  const onPointerLeave = (e) => e.pointerType === "mouse" && setHovering(false);
  const onPointerDown = (e) => {
    if (e.pointerType === "mouse") return;
    setTouchShown(true);
    clearTimeout(touchTimer.current);
    touchTimer.current = setTimeout(() => setTouchShown(false), TOUCH_SHOW_MS);
  };

  const shown = hovering || touchShown;

  return (
    <section
      className={`panel panel--media${shown ? " is-active" : ""}`}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDownCapture={onPointerDown}
    >
      <video
        ref={videoRef}
        className="hero-video"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="auto"
        aria-label={title}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        // Clicking the picture with a mouse also plays/pauses.
        onClick={(e) => e.nativeEvent.pointerType !== "touch" && togglePlay()}
      />

      <div className="video-ui">
        <button
          className="video-play"
          onClick={togglePlay}
          aria-label={playing ? "Pause video" : "Play video"}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div className="video-bar">
          <span className="video-time">
            {formatTime(time)} / {formatTime(duration)}
          </span>
          <div
            className="video-track"
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration) || 0}
            aria-valuenow={Math.round(time)}
            aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
            onPointerDown={onBarDown}
            onPointerMove={onBarMove}
            onKeyDown={onBarKey}
          >
            <div ref={fillRef} className="video-track__fill" />
          </div>
        </div>
      </div>

      {/* Sound toggle stays visible at all times. */}
      <button
        className="sound-toggle"
        onClick={() => setSoundOn(!soundOn)}
        aria-pressed={soundOn}
        aria-label={soundOn ? "Mute video" : "Unmute video"}
      >
        {soundOn ? "sound on" : "sound off"}
      </button>
    </section>
  );
}

function formatTime(s) {
  if (!Number.isFinite(s)) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
    <path d="M7 4.5v15l13-7.5z" fill="currentColor" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
    <path d="M6 4h4.5v16H6zM13.5 4H18v16h-4.5z" fill="currentColor" />
  </svg>
);
