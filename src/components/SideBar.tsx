import { TSidebarLinks } from '@/types/general.type';
import { Link, useLocation } from 'react-router-dom';
import { sidebarLinks } from '@/constants/general.const';

const Sidebar = () => {
  const router = useLocation();
  const { pathname } = router;
  return (
    <div className='sidebar'>
      {sidebarLinks.map((link) => (
        <SidebarLink
          isActive={pathname === link.path}
          key={link.title}
          link={link}
        ></SidebarLink>
      ))}
    </div>
  );
};
interface ISidebarLinkProps {
  link: TSidebarLinks;
  isActive: boolean;
}
function SidebarLink({ link, isActive }: ISidebarLinkProps) {
  return (
    <Link
      to={link.path}
      className={`sidebar-link ${isActive ? 'active' : ''}`}
    >
      <span>{link.icon}</span>
      <span>{link.title}</span>
    </Link>
  );
}

export default Sidebar;
