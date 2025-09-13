import IconDashboard from '@/icon/IconDashboard';
import { TSidebarLinks } from '@/types/general.type';


export const sidebarLinks: TSidebarLinks[] = [
    {
        title: 'Home',
        icon: <IconDashboard />,
        path: '/',
    },
    {
        title: 'Dashboard',
        icon: <IconDashboard />,
        path: '/taskmind',
    },

];
