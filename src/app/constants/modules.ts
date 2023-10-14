export const MODULES = {
  userInfo: {
    id: 'userInfo',
    name: 'Perfil',
    type: 'module',
    icon: 'fas fa-user-circle',
    redirectPath: '/dashboard/profile',
  },
  personalProgress: {
    id: 'personalProgress',
    name: 'Progreso personal',
    type: 'module',
    icon: 'fas fa-tasks',
    redirectPath: '/dashboard/users',
  },
  userManagement: {
    id: 'userManagement',
    name: 'Administración de usuarios',
    type: 'module',
    icon: 'fas fa-users',
    redirectPath: '/dashboard/users',
  },
  budgetManagement: {
    id: 'budgetManagement',
    name: 'Administración de presupuestos',
    type: 'module',
    icon: 'fas fa-hand-holding-usd',
    redirectPath: '/dashboard/budgets',
  },
  audit: {
    id: 'audit',
    name: 'Auditoría',
    type: 'module',
    icon: 'fas fa-star',
    redirectPath: '/dashboard/audit',
  },
  scriptingTool: {
    id: 'scriptingTool',
    name: 'Scripting tool',
    type: 'module',
    icon: 'fas fa-terminal',
    redirectPath: '/dashboard/scripting-tool',
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
