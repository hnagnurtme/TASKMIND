import { TSidebarLinks } from '@/types/general.type';
import { Link, useLocation } from 'react-router-dom';
import { sidebarLinks } from '@/constants/general.const';
import { useTasks } from '@/contexts/tasks.context';

// ========================= INTERFACES =========================
interface ISidebarLinkProps {
  link: TSidebarLinks;
  isActive: boolean;
}

interface IComplexityFilter {
  label: string;
  value: string;
  color: string;
}

interface IComplexityFilterButtonProps {
  filter: IComplexityFilter;
  onClick: (filterValue: string) => void;
}

// ========================= CONSTANTS =========================
const COMPLEXITY_FILTERS: IComplexityFilter[] = [
  { label: 'All', value: 'All', color: ''},
  { label: 'Today', value: 'Today', color: '#3b82f6' },
  // Priority filters (separate from complexity)
  { label: 'High Priority', value: 'priority_high', color: '#ef4444' },
  { label: 'Medium Priority', value: 'priority_medium', color: '#f59e0b' },
  { label: 'Low Priority', value: 'priority_low', color: '#10b981' },
  // Complexity filters
  { label: 'High Complexity', value: 'high', color: '#ef4444' },
  { label: 'Medium Complexity', value: 'medium', color: '#f59e0b' },
  { label: 'Low Complexity', value: 'low', color: '#10b981' },
];

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

function ComplexityFiltersSection() {
  const { updateSelectedComplexity, updateSelectedPriority } = useTasks();

  return (
    <div className="sidebar-section">
      <h3 className="sidebar-section-title">Quick Filters</h3>
      <div className="complexity-filters" role="group" aria-label="Complexity and priority filters">
        {COMPLEXITY_FILTERS.map((filter) => (
          <ComplexityFilterButton
            key={filter.value}
            filter={filter}
            onClick={(value) => {
              if (value === 'All') {
                updateSelectedComplexity(null);
                updateSelectedPriority(null);
                return;
              }

              // Today is a special complexity-like filter
              if (value === 'Today' || ['high', 'medium', 'low'].includes(value)) {
                updateSelectedComplexity(value === 'Today' ? 'Today' : value);
                // clear priority when selecting complexity
                updateSelectedPriority(null);
                return;
              }

              // Priority filters use the prefix 'priority_<level>'
              if (value.startsWith('priority_')) {
                const level = value.replace('priority_', '');
                updateSelectedPriority(level);
                // clear complexity when selecting priority
                updateSelectedComplexity(null);
                return;
              }
            }}
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
      <NavigationSection currentPath={pathname.replace('/home', '/dashboard')} />
      <ComplexityFiltersSection />
    </aside>
    
  );
};

export default Sidebar;

// ========================= EXPORTS FOR REUSE =========================
export { 
  SidebarLink, 
  ComplexityFilterButton, 
  LogoutButton,
  NavigationSection,
  ComplexityFiltersSection,
};
