import store from "../store";

export type UserRole = 'admin' | 'employee';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    file?: string;
    phoneNumber?: string;
    fieldLocation?: string;
}

export const ADMIN_USERS: AdminUser =
{
    id: '1',
    name: 'Admin User',
    email: 'admin@company.com',
    password: 'Admin@123',
    role: 'admin',
}

export const loginUser = (email: string, password: string): AdminUser | null => {
    const state = store.getState();
    const employees = state.appData.createEmployee;
    if (ADMIN_USERS.email.toLowerCase() === email.toLowerCase() && ADMIN_USERS.password === password) {
        return ADMIN_USERS;
    }
    const employee = employees.find(emp => emp.email.toLowerCase() === email.toLowerCase() && emp.password === password);
    if (employee) {
        return {
            id: employee.id,
            file: employee.file,
            name: employee.name,
            email: employee.email,
            password: employee.password,
            phoneNumber: employee.phoneNumber,
            role: 'employee',
            fieldLocation: employee.fieldLocation,
        }
    }
    return null;
}