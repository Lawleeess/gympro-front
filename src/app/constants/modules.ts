export const MODULES = {

  userManagement: {
    id: 'userManagement', 
    name: 'Administración de usuarios',
    type: 'module',
    icon: 'fas fa-users',
    redirectPath: '/dashboard/users',
  },  
  personalGoals: {
    id: 'personalGoals',
    name: 'Objetivos personales',
    type: 'module',
    icon: 'fas fa-tasks',
    redirectPath: '/dashboard/goals',
  },
  routinesCalendar: {
    id: 'routinesCalendar',
    name: 'Rutina',
    type: 'module',
    icon: 'fas fa-calendar',
    redirectPath: '/dashboard/routine',
  },
  routinesManagement: {
    id: 'routinesManagement',
    name: 'Administración de rutinas',
    type: 'module',
    icon: 'fas fa-calendar',
    redirectPath: '/dashboard/routine-management',
  },
};

export const ROLES = {
  admin: {
    id: 'admin',
    name: 'Admin',
  },
  viewer: {
    id: 'viewer',
    name: 'Viewer',
  },
};

export const PAGES = {
  budgetManagement: {
    init: '/budgets',
    history: '/budgets/history',
  },
  audit: {
    base: '/',
    clients: '/audit',
    accounts: '/audit/accounts',
    history: '/audit/history',
  },
};

export const MODULES_TYPES = {
  Module: 'module',
  Tool: 'tool',
  Customer: 'customer',
};
