import { about } from "../content.js";

export default function About() {
  return (
    <section className="panel panel--split panel--about">
      <p className="bio">
        {about.bio.map((part, i) =>
          typeof part === "string" ? (
            part
          ) : (
            <a
              key={i}
              href={part.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bio-link"
            >
              {part.text}
            </a>
          ),
        )}
      </p>
      <ul className="services">
        {about.services.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </section>
  );
}
