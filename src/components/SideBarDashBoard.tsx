import { TSidebarLinks } from '@/types/general.type'
import { Link, useLocation } from 'react-router-dom'

import {
  BarChart3,
  CalendarDays,
  Brain,
  LayoutDashboard,
} from 'lucide-react' // icon đẹp từ lucide-react

// ========================= INTERFACES =========================
interface ISidebarLinkProps {
  link: TSidebarLinks
  isActive: boolean
}

interface IComplexityFilter {
  label: string
  value: string
  color: string
}

interface IComplexityFilterButtonProps {
  filter: IComplexityFilter
  onClick: (filterValue: string) => void
}

const DASHBOARD_LINKS: TSidebarLinks[] = [
  { title: 'Home', path: '/', icon: <LayoutDashboard size={18} /> },
  { title: 'Chart', path: '/chart', icon: <BarChart3 size={18} /> },
  { title: 'Calendar', path: '/calendar', icon: <CalendarDays size={18} /> },
  { title: 'AI Assistant', path: '/ai', icon: <Brain size={18} /> },
]

// ========================= SUB COMPONENTS =========================
function SidebarLink({ link, isActive }: ISidebarLinkProps) {
  return (
    <Link
      to={link.path}
      className={`sidebar-link ${isActive ? 'active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="sidebar-link-icon" aria-hidden="true">
        {link.icon}
      </span>
      <span className="sidebar-link-title">{link.title}</span>
    </Link>
  )
}

function ComplexityFilterButton({ filter, onClick }: IComplexityFilterButtonProps) {
  return (
    <button
      className={`complexity-filter-btn complexity-filter-btn-${filter.value}`}
      onClick={() => onClick(filter.value)}
      aria-label={`Filter tasks by ${filter.label}`}
    >
      {filter.color && (
        <span
          className="complexity-indicator"
          style={{ backgroundColor: filter.color }}
          aria-hidden="true"
        />
      )}
      {filter.label}
    </button>
  )
}

function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <button className="logout-btn" onClick={onLogout} aria-label="Logout from application">
      <span aria-hidden="true">🚪</span>
      Logout
    </button>
  )
}

// ========================= SECTION COMPONENTS =========================
function NavigationSection({ currentPath }: { currentPath: string }) {
  return (
    <div className="sidebar-section">
      <nav className="sidebar-nav" role="navigation" aria-label="Dashboard navigation">
        {DASHBOARD_LINKS.map((link) => (
          <SidebarLink key={link.title} isActive={currentPath === link.path} link={link} />
        ))}
      </nav>
    </div>
  )
}



// ========================= MAIN COMPONENT =========================
const SidebarDashBoard = () => {
  const location = useLocation()
  const { pathname } = location

  return (
    <aside className="sidebar" role="complementary" aria-label="Dashboard sidebar">
      <NavigationSection currentPath={pathname} />
    </aside>
  )
}

export default SidebarDashBoard

// ========================= EXPORTS =========================
export { SidebarLink, ComplexityFilterButton, LogoutButton, NavigationSection }
