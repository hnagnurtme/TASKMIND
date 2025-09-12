import { TSidebarLinks } from '@/types/general.type';
import { Link, useLocation } from 'react-router-dom';
import { sidebarLinks } from '@/constants/general.const';

// ========================= INTERFACES =========================
interface ISidebarLinkProps {
  link: TSidebarLinks;
  isActive: boolean;
}

interface IEnergyFilter {
  label: string;
  value: string;
  color: string;
}

interface IEnergyFilterButtonProps {
  filter: IEnergyFilter;
  onClick: (filterValue: string) => void;
}

// ========================= CONSTANTS =========================
const ENERGY_FILTERS: IEnergyFilter[] = [
  { label: 'High Energy', value: 'high', color: '#ef4444' },
  { label: 'Medium Energy', value: 'medium', color: '#f59e0b' },
  { label: 'Low Energy', value: 'low', color: '#10b981' }
];

// ========================= UTILITY FUNCTIONS =========================
const handleEnergyFilterClick = (filterValue: string) => {
  // TODO: Implement filter logic with state management
  console.log(`Filter by ${filterValue} energy`);
};


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
  );
}

function EnergyFilterButton({ filter, onClick }: IEnergyFilterButtonProps) {
  return (
    <button
      className="energy-filter-btn"
      style={{ '--filter-color': filter.color } as React.CSSProperties}
      onClick={() => onClick(filter.value)}
      aria-label={`Filter tasks by ${filter.label}`}
    >
      <span 
        className="energy-indicator"
        style={{ backgroundColor: filter.color }}
        aria-hidden="true"
      />
      {filter.label}
    </button>
  );
}


function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <button 
      className="logout-btn"
      onClick={onLogout}
      aria-label="Logout from application"
    >
      <span aria-hidden="true">🚪</span>
      Logout
    </button>
  );
}

// ========================= SECTION COMPONENTS =========================
function NavigationSection({ currentPath }: { currentPath: string }) {
  return (
    <div className="sidebar-section">
      <nav className="sidebar-nav" role="navigation" aria-label="Main navigation">
        {sidebarLinks.map((link) => (
          <SidebarLink
            key={link.title}
            isActive={currentPath === link.path}
            link={link}
          />
        ))}
      </nav>
    </div>
  );
}

function EnergyFiltersSection() {
  return (
    <div className="sidebar-section">
      <h3 className="sidebar-section-title">Quick Filters</h3>
      <div className="energy-filters" role="group" aria-label="Energy level filters">
        {ENERGY_FILTERS.map((filter) => (
          <EnergyFilterButton
            key={filter.value}
            filter={filter}
            onClick={handleEnergyFilterClick}
          />
        ))}
      </div>
    </div>
  );
}


// ========================= MAIN COMPONENT =========================
const Sidebar = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <aside 
      className="sidebar" 
      role="complementary"
      aria-label="Application sidebar"
    >
      <NavigationSection currentPath={pathname} />
      <EnergyFiltersSection />
    </aside>
  );
};

export default Sidebar;

// ========================= EXPORTS FOR REUSE =========================
export { 
  SidebarLink, 
  EnergyFilterButton, 
  LogoutButton,
  NavigationSection,
  EnergyFiltersSection,
};