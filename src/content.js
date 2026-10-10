// All site copy and media lives here, so content can be edited (or later
// swapped for a CMS fetch) without touching the components.

export const site = {
  name: "WIlLEmWiLLeM",
  email: "hello@example.com",
};

export const work = {
  // Home page hero video. Drop files in /public/videos and point here.
  hero: {
    src: "/videos/reel.mov",
    poster: "/videos/concerts-poster.jpg",
    title: "Concerts — video + sound",
  },
};

export const about = {
  services: [
    "Long-form video storytelling",
    "Video capture",
    "Sound capture",
    "Video editing",
  ],
  bio: `Willem Cousineau is an ambitious student, producer, and composer with an emphasis on artistic and interdisciplinary collaboration. He is half of the electronic R&B duo "Fool's Argot." They released their debut EP September 30th, 2022. Willem Cousineau continues to work with artists in the Philadelphia region and beyond, constantly branching out to explore new aesthetics and work with artists across mediums and genres.`,
};

export const contact = {
  intro: "Get in touch",
  links: [
    {
      label: "Email",
      href: "mailto:hello@example.com",
      text: "hello@example.com",
    },
    { label: "Instagram", href: "https://instagram.com/", text: "@handle" },
    { label: "Vimeo", href: "https://vimeo.com/", text: "vimeo.com/handle" },
  ],
};
