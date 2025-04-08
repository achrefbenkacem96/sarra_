import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Espace Client',
  },
  {
    displayName: 'Accueil',
    iconName: 'home', // 🏠 Home icon for the dashboard
    route: '/user/home',
  },
  {
    displayName: 'Mes Devis',
    iconName: 'file-text', // 📄 Represents documents/quotes
    route: '/user/devis',
  },
  {
    displayName: 'Mes Réclamations',
    iconName: 'message-circle', // 💬 Represents user feedback or complaints
    route: '/user/reclamations',
  },
  {
    displayName: 'Mes Sinistres',
    iconName: 'alert-triangle', // ⚠️ Represents incidents/claims
    route: '/user/sinistres',
  },
  
];
