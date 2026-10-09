import { about } from "../content.js";

export default function About() {
  return (
    <section className="panel panel--split panel--about">
      <ul className="services">
        {about.services.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <p className="bio">{about.bio}</p>
    </section>
  );
}
