import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Admin Dashboard',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    route: '/admin/dashboard',
  },
  {
    displayName: 'Agences',
    iconName: 'building',
    route: '/admin/agences',
  },
  {
    displayName: 'Performances',
    iconName: 'chart-bar',
    route: '/admin/performances',
  },
  {
    displayName: 'Utilisateurs',
    iconName: 'user',
    route: '/admin/users', // Updated route
  },
];
