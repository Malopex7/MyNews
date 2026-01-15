// User roles
export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Permission definitions
export const PERMISSIONS = {
    // User permissions
    VIEW_PROFILE: 'view_profile',
    EDIT_PROFILE: 'edit_profile',

    // Admin permissions
    VIEW_USERS: 'view_users',
    EDIT_USERS: 'edit_users',
    DELETE_USERS: 'delete_users',
    VIEW_ADMIN_DASHBOARD: 'view_admin_dashboard',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    user: [
        PERMISSIONS.VIEW_PROFILE,
        PERMISSIONS.EDIT_PROFILE,
    ],
    admin: [
        PERMISSIONS.VIEW_PROFILE,
        PERMISSIONS.EDIT_PROFILE,
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.EDIT_USERS,
        PERMISSIONS.DELETE_USERS,
        PERMISSIONS.VIEW_ADMIN_DASHBOARD,
    ],
};

// Permission helpers
export const hasPermission = (role: UserRole, permission: Permission): boolean => {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};

export const hasAnyPermission = (role: UserRole, permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(role, permission));
};

export const hasAllPermissions = (role: UserRole, permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(role, permission));
};
