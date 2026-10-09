import { useEffect, useRef } from "react";
import { useSound } from "../sound.jsx";
import Wordmark from "./Wordmark.jsx";

// First-visit screen: lets the visitor choose sound before the video starts.
export default function Splash() {
  const { entered, enter } = useSound();
  const firstButton = useRef(null);

  useEffect(() => {
    if (!entered) firstButton.current?.focus();
  }, [entered]);

  if (entered) return null;

  return (
    <div
      className="splash"
      role="dialog"
      aria-modal="true"
      aria-labelledby="splash-title"
    >
      <p id="splash-title" className="splash__title">
        This site has sound
      </p>
      <div className="splash__actions">
        <button
          ref={firstButton}
          className="splash__btn splash__btn--primary"
          onClick={() => enter(true)}
        >
          enter with sound
        </button>
        <button className="splash__btn" onClick={() => enter(false)}>
          enter muted
        </button>
      </div>

      {/* Same full-width wordmark as the footer, with each letter twitching
          on its own random timing. */}
      <div className="splash__mark">
        <Wordmark jitter />
      </div>
    </div>
  );
}
