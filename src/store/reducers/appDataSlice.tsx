import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getDateKey = (iso: string) => new Date(iso).toISOString().split("T")[0];

interface Employee {
    id: string;
    file?: string;
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    designation: string;
    designationId: string;
    fieldLocation: string;
}

interface FieldVisit {
    id: string;
    title: string;
    employeeSelect: string;
    location: string;
    selectStartDate: string; // store ISO string, never Date object
    selectStartTime: string;
    selectEndDate: string;
    selectEndTime: string;
    notes: string;
}

interface AttendanceRulesState {
    officeStart: string; // ISO string
    officeEnd: string; // ISO string
    lateAfterMinutes: number;
    halfDayHours: number;
    autoAbsentTime: string; // ISO string
    autoPresent: boolean;
    allowManualEdit: boolean;
    requireEditReason: boolean;
}

interface Tasks {
    tasksId: string;
    taskTitle: string;
    taskDescription?: string;
    employeeSelect: string;
    employeeSelectId: string;
    location?: string;
    startDateTime: string; // ISO string
    endDateTime: string; // ISO string
    status?: string;
    statusId?: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: 'employee' | 'admin';
    fieldLocation?: string;
    file?: {
        uri: string;
        fileName: string;
        type: string;
        width?: number;
        height?: number;
        fileSize?: number;
    };
}

interface AttendanceDay {
    date: string;
    isActive: boolean;
    isOnBreak: boolean;
    loginTime: string | null; // ISO string
    logoutTime: string | null; // ISO string
    totalWorkSecondsToday: number;
    totalBreakSecondsToday: number;
    breaks: {
        breakIn: string; // ISO string
        breakOut: string | null; // ISO string
        durationSeconds: number;
    }[];
    user: User;
}

interface appDataState {
    isLogin: boolean;
    saveUser: any;
    createEmployee: Employee[];
    deleteEmployee: { id: string | number };
    fieldVisit: FieldVisit[];
    deleteFieldVisit: { id: string | number };
    attendanceRulesState: AttendanceRulesState[];
    tasks: Tasks[];
    deleteTasks: { id: string | number };
    employeeLoginStatus: Record<string, AttendanceDay[]>; // key = employeeId
    showCheckInOption: boolean;
}

const initialState: appDataState = {
    isLogin: false,
    saveUser: {},
    createEmployee: [],
    deleteEmployee: { id: '' },
    fieldVisit: [],
    deleteFieldVisit: { id: '' },
    attendanceRulesState: [],
    tasks: [],
    deleteTasks: { id: '' },
    employeeLoginStatus: {},
    showCheckInOption: false,
}

const appDataSlice = createSlice({
    name: 'appData',
    initialState,
    reducers: {
        setIsLogin: (state, action) => {
            state.isLogin = action.payload;
        },
        setIsSaveUser: (state, action) => {
            state.saveUser = action.payload;
        },
        setIsAddEmployees: (state, action: PayloadAction<Employee>) => {
            state.createEmployee.unshift(action.payload);
        },
        setIsDeleteEmployee: (state, action: PayloadAction<string>) => {
            state.deleteEmployee.id = action.payload;
            state.createEmployee = state.createEmployee.filter(emp => emp.id !== action.payload);
        },
        setIsUpdateEmployee: (state, action: PayloadAction<Employee>) => {
            const index = state.createEmployee.findIndex(emp => emp.id === action.payload.id);
            if (index !== -1) state.createEmployee[index] = action.payload;
        },
        setIsAddFieldVisit: (state, action: PayloadAction<FieldVisit>) => {
            state.fieldVisit.unshift(action.payload);
        },
        setIsDeleteFieldVisit: (state, action: PayloadAction<string>) => {
            state.deleteFieldVisit.id = action.payload;
            state.fieldVisit = state.fieldVisit.filter(fld => fld.id !== action.payload);
        },
        setIsUpdateFieldVisit: (state, action: PayloadAction<FieldVisit>) => {
            const index = state.fieldVisit.findIndex(fld => fld.id === action.payload.id);
            if (index !== -1) state.fieldVisit[index] = action.payload;
        },
        setIsAddTasks: (state, action: PayloadAction<Tasks>) => {
            state.tasks.unshift(action.payload);
        },
        setIsUpdateTasks: (state, action: PayloadAction<Tasks>) => {
            const index = state.tasks.findIndex(tsk => tsk.tasksId === action.payload.tasksId);
            if (index !== -1) state.tasks[index] = action.payload;
        },
        setIsDeleteTasks: (state, action: PayloadAction<string>) => {
            state.deleteTasks.id = action.payload;
            state.tasks = state.tasks.filter(tsk => tsk.tasksId !== action.payload);
        },
        setEmployeeLoginStatus: (
            state,
            action: PayloadAction<{ employeeId: string; isActive: boolean; timestamp: any; user: User }>
        ) => {
            const { employeeId, isActive, timestamp, user } = action.payload;
            const dateKey = getDateKey(timestamp);

            if (!state.employeeLoginStatus[employeeId]) {
                state.employeeLoginStatus[employeeId] = [];
            }

            const list = state.employeeLoginStatus[employeeId];

            // find today
            let today = list.find(d => d.date === dateKey);

            // create today if not exists
            if (!today) {
                today = {
                    date: dateKey,
                    isActive: false,
                    isOnBreak: false,
                    loginTime: null,
                    logoutTime: null,
                    totalWorkSecondsToday: 0,
                    totalBreakSecondsToday: 0,
                    breaks: [],
                    user,
                };
                list.push(today);
            }

            // always update user info
            today.user = user;

            if (isActive) {
                if (!today.isActive) {
                    today.isActive = true;
                    today.loginTime = timestamp;
                    today.logoutTime = null;
                }
            } else {
                if (today.loginTime && today.isActive) {
                    const diffSeconds = (new Date(timestamp).getTime() - new Date(today.loginTime).getTime()) / 1000;
                    today.totalWorkSecondsToday += Math.max(0, diffSeconds);
                }
                today.isActive = false;
                today.isOnBreak = false;
                today.logoutTime = timestamp;
            }

            // ensure previous dates are untouched
            state.employeeLoginStatus[employeeId] = [
                ...list.filter(d => d.date !== dateKey),
                today
            ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        },
        setBreakIn: (
            state,
            action: PayloadAction<{ employeeId: string; timestamp: string }>
        ) => {
            const MAX_BREAKS_PER_DAY = 5;

            const dateKey = getDateKey(action.payload.timestamp);
            const list = state.employeeLoginStatus[action.payload.employeeId];
            if (!list) return;

            const today = list.find(d => d.date === dateKey);
            if (!today || today.isOnBreak || !today.isActive) return;

            if (today.breaks.length >= MAX_BREAKS_PER_DAY) {
                return; // silently block (UI should show toast)
            }

            today.isOnBreak = true;
            today.breaks.push({
                breakIn: action.payload.timestamp,
                breakOut: null,
                durationSeconds: 0
            });
        },
        setBreakOut: (
            state,
            action: PayloadAction<{ employeeId: string; timestamp: string }>
        ) => {
            const dateKey = getDateKey(action.payload.timestamp);
            const list = state.employeeLoginStatus[action.payload.employeeId];
            if (!list) return;

            const today = list.find(d => d.date === dateKey);
            if (!today || !today.isOnBreak) return;

            const lastBreak = today.breaks[today.breaks.length - 1];
            if (!lastBreak || lastBreak.breakOut) return;

            const diffSeconds = (new Date(action.payload.timestamp).getTime() - new Date(lastBreak.breakIn).getTime()) / 1000;

            lastBreak.breakOut = action.payload.timestamp;
            lastBreak.durationSeconds = Math.max(0, diffSeconds);
            today.totalBreakSecondsToday += lastBreak.durationSeconds;
            today.isOnBreak = false;
        },
        setIsShowCheckIn: (state, action) => {
            state.showCheckInOption = action.payload;
        },
        stopEmployeeSession: (
            state,
            action: PayloadAction<{ employeeId: string; timestamp: string }>
        ) => {
            const emp = state.employeeLoginStatus[action.payload.employeeId];
            if (!emp) return;

            const dateKey = action.payload.timestamp.split('T')[0];
            const todayEntry = emp.find(d => d.date === dateKey);
            if (!todayEntry) return;

            const now = action.payload.timestamp;

            if (todayEntry.isOnBreak && todayEntry.breaks.length > 0) {
                const lastBreak = todayEntry.breaks[todayEntry.breaks.length - 1];

                if (lastBreak && !lastBreak.breakOut) {
                    const diffSeconds =
                        (new Date(now).getTime() -
                            new Date(lastBreak.breakIn).getTime()) / 1000;

                    lastBreak.breakOut = now;
                    lastBreak.durationSeconds = Math.max(0, Math.floor(diffSeconds));
                    todayEntry.totalBreakSecondsToday += lastBreak.durationSeconds;
                }

                todayEntry.isOnBreak = false;
            }

            if (todayEntry.isActive && todayEntry.loginTime) {
                const diffSeconds =
                    (new Date(now).getTime() -
                        new Date(todayEntry.loginTime).getTime()) / 1000;

                todayEntry.totalWorkSecondsToday += Math.max(0, Math.floor(diffSeconds));
                todayEntry.logoutTime = now;
                todayEntry.isActive = false;
            }
        },
        adminUpdateAttendance: (
            state,
            action: PayloadAction<{
                employeeId: string;
                date: string;
                loginTime: string | null | any;
                logoutTime: string | null | any;
                breaks: {
                    breakIn: string;
                    breakOut: string | null;
                }[];
                status: 'Present' | 'Absent';
            }>
        ) => {
            const {
                employeeId,
                date,
                loginTime,
                logoutTime,
                breaks,
                status
            } = action.payload;

            const list = state.employeeLoginStatus[employeeId];
            if (!list) return;

            const day = list.find(d => d.date === date);
            if (!day) return;

            if (status === 'Absent') {
                day.loginTime = null;
                day.logoutTime = null;
                day.breaks = [];
                day.totalWorkSecondsToday = 0;
                day.totalBreakSecondsToday = 0;
                day.isActive = false;
                day.isOnBreak = false;
                return;
            }

            day.loginTime = loginTime;
            day.logoutTime = logoutTime;
            day.isActive = false;
            day.isOnBreak = false;

            let breakSeconds = 0;

            day.breaks = breaks.map(b => {
                let durationSeconds = 0;

                if (b.breakIn && b.breakOut) {
                    durationSeconds = Math.max(
                        0,
                        Math.floor(
                            (new Date(b.breakOut).getTime() -
                                new Date(b.breakIn).getTime()) / 1000
                        )
                    );
                }

                breakSeconds += durationSeconds;

                return {
                    breakIn: b.breakIn,
                    breakOut: b.breakOut,
                    durationSeconds
                };
            });

            let workSeconds = 0;

            if (loginTime && logoutTime) {
                workSeconds = Math.max(
                    0,
                    Math.floor(
                        (new Date(logoutTime).getTime() -
                            new Date(loginTime).getTime()) / 1000
                    )
                );
            }

            day.totalBreakSecondsToday = breakSeconds;
            day.totalWorkSecondsToday = Math.max(0, workSeconds - breakSeconds);
        }
    }
});

export const {
    setIsLogin,
    setIsSaveUser,
    setIsAddEmployees,
    setIsDeleteEmployee,
    setIsUpdateEmployee,
    setIsAddFieldVisit,
    setIsUpdateFieldVisit,
    setIsDeleteFieldVisit,
    setIsAddTasks,
    setIsUpdateTasks,
    setIsDeleteTasks,
    setEmployeeLoginStatus,
    setBreakIn,
    setBreakOut,
    setIsShowCheckIn,
    stopEmployeeSession,
    adminUpdateAttendance
} = appDataSlice.actions;

export default appDataSlice.reducer;
