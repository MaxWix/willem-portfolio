import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'work', end: true },
  { to: '/about', label: 'about' },
  { to: '/contact', label: 'contact' },
]

export default function Nav() {
  return (
    <nav className="nav">
      {links.map(({ to, label, end }) => (
        <NavLink key={to} to={to} end={end} className="nav__link">
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
