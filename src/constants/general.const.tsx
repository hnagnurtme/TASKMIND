import IconDashboard from '@/icon/IconDashboard';
import { TSidebarLinks } from '@/types/general.type';
import {
  BarChart3,
  CalendarDays,
  Brain,
} from 'lucide-react' // icon đẹp từ lucide-react

export const sidebarLinks: TSidebarLinks[] = [
    {
        title: 'Home',
        icon: <IconDashboard />,
        path: '/',
    },
    {
        title: 'DashBoard',
        icon: <IconDashboard />,
        path: '/taskmind',
    },
    {
        title: 'Chart',
        icon: <BarChart3 />,
        path: '/chart',
    },
    {
        title: 'Calendar',
        icon: <CalendarDays />,
        path: '/calendar',
    },
    {
        title: 'AI Assistant',
        icon: <Brain />,
        path: '/ai',
    }

];
