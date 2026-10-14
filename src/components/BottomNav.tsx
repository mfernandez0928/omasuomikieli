import { NavLink } from 'react-router-dom';
import { Icon, type IconName } from './Icon';

const ITEMS: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/grammar', label: 'Grammar', icon: 'book' },
  { to: '/vocabulary', label: 'Vocabulary', icon: 'cards' },
  { to: '/practice', label: 'Practice', icon: 'target' },
  { to: '/more', label: 'More', icon: 'dots' },
];

export function BottomNav() {
  return (
    <nav className="nav" aria-label="Main">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `nav__item ${isActive ? 'nav__item--active' : ''}`}
        >
          <Icon name={item.icon} size={21} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
