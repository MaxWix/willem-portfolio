import { createContext, useContext, useState } from "react";

// Site-wide sound state. Browsers block video *with sound* from autoplaying
// until the visitor has clicked something, so the splash screen asks first;
// that click is what lets the video play unmuted.

const SoundContext = createContext(null);
const KEY = "willem-sound"; // remembered for this browser tab only

function readSaved() {
  try {
    return sessionStorage.getItem(KEY); // 'on' | 'off' | null
  } catch {
    return null;
  }
}

export function SoundProvider({ children }) {
  const saved = readSaved();
  // After a reload the earlier click no longer counts, so a saved "on"
  // still has to start muted — the toggle on the video turns it back on.
  const [entered, setEntered] = useState(saved !== null);
  const [soundOn, setSoundOnState] = useState(false);

  const setSoundOn = (on) => {
    setSoundOnState(on);
    try {
      sessionStorage.setItem(KEY, on ? "on" : "off");
    } catch {
      /* storage unavailable: fine, just not remembered */
    }
  };

  const enter = (withSound) => {
    setSoundOn(withSound);
    setEntered(true);
  };

  return (
    <SoundContext.Provider value={{ entered, enter, soundOn, setSoundOn }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);
