import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Wordmark from "./components/Wordmark.jsx";
import Splash from "./components/Splash.jsx";
import { SoundProvider } from "./sound.jsx";
import Work from "./pages/Work.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

export default function App() {
  return (
    <SoundProvider>
      <div className="page">
        <Nav />
        <main className="stage">
          <Routes>
            <Route path="/" element={<Work />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Wordmark />
      </div>
      <Splash />
    </SoundProvider>
  );
}
