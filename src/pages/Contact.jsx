import { contact } from '../content.js'

export default function Contact() {
  return (
    <section className="panel panel--split">
      <p className="contact__intro">{contact.intro}</p>
      <dl className="contact__list">
        {contact.links.map(({ label, href, text }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>
              <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                {text}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
