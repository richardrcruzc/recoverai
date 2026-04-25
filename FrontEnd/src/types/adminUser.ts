export type AdminUserRole = 'Admin' | 'Sales' | 'Operations' | 'Viewer' | number;

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: AdminUserRole;
  isActive: boolean;
  createdAtUtc: string;
  lastLoginAtUtc?: string | null;
};

export type CreateAdminUserRequest = {
  fullName: string;
  email: string;
  password: string;
  role: string;
};
