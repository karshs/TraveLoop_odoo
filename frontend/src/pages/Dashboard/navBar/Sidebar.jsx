import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, MapPin, CalendarDays, Wallet,
  Users, UserCircle2,
} from 'lucide-react';
import './Sidebar.css';

const NAV_MAIN = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard'         },
  { to: '/trips',      icon: MapPin,           label: 'My Trips'          },
  { to: '/itinerary',  icon: CalendarDays,     label: 'Itinerary Builder' },
  { to: '/budget',     icon: Wallet,           label: 'Budget Planner'    },
];

const NAV_SOCIAL = [
  { to: '/community', icon: Users, label: 'Community' },
];

const NAV_BOTTOM = [
  { to: '/profile', icon: UserCircle2, label: 'Profile / Settings' },
];

function SidebarItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
    >
      <Icon size={15} strokeWidth={2} />
      {label}
    </NavLink>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-scroll">

        <span className="sidebar-section">Main</span>
        {NAV_MAIN.map(item => <SidebarItem key={item.to} {...item} />)}

        <span className="sidebar-section">Social</span>
        {NAV_SOCIAL.map(item => <SidebarItem key={item.to} {...item} />)}

        <div className="sidebar-spacer" />

        <div className="sidebar-bottom">
          {NAV_BOTTOM.map(item => <SidebarItem key={item.to} {...item} />)}
        </div>

      </div>
    </aside>
  );
}

export default Sidebar;
