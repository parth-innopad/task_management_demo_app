import { Dimensions } from "react-native"
import { COLORS } from "../utils/theme"
import { TaskStatus_Type } from "../types/taskTypes"

export const Constants = {
    getStatusStyle: (status: string) => {
        switch (status) {
            case 'Pending':
                return {
                    bg: '#E3F2FD',
                    text: '#1565C0'
                }
            case 'In Progress':
                return {
                    bg: '#FFF8E1',
                    text: '#F9A825'
                }
            case 'Completed':
                return {
                    bg: '#E8F5E9',
                    text: '#2E7D32'
                }
            default:
                return {
                    bg: '#E3F2FD',
                    text: '#1565C0'
                }
        }
    },
    getAttendanceStatusStyle: (status: string) => {
        switch (status) {
            case 'Late':
                return {
                    bg: '#F9A825',
                    text: '#FFF8E1'
                }
            case 'Present':
                return {
                    bg: '#2E7D32',
                    text: '#FFF8E1'
                }
            case 'Absent':
                return {
                    bg: '#C62828',
                    text: '#FFF8E1'
                }
            default:
                return {
                    bg: '#1565C0',
                    text: '#FFF8E1'
                }
        }
    },
    getStatusBgColor: (status: TaskStatus_Type) => {
        switch (status) {
            case 'Pending':
                return '#E3F2FD';
            case 'In Progress':
                return '#FFF8E1';
            case 'Completed':
                return '#E8F5E9';
            default:
                return '#E3F2FD';
        }
    },
    formatDate: (date: any) => {
        if (!date) return '';
        return new Date(date).toDateString();
    },
    formatTime: (time: any) => {
        if (!time) return '';
        return new Date(time).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    },
    formatHours: (seconds = 0) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs}h ${mins}m ${secs?.toFixed(0)}s`;
    },
    isoFormatTime: (iso?: string | null) =>
        iso
            ? new Date(iso).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            })
            : '--',
    formatDuration: (seconds = 0) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    },
    selectView: [
        {
            id: 1,
            select: 'Camera'
        },
        {
            id: 2,
            select: 'Gallery'
        }
    ],
    width: Math.round(Dimensions.get('window').width),
    height: Math.round(Dimensions.get('window').height),
    taskStatus: [
        {
            id: 2,
            status: 'In Progress'
        },
        {
            id: 3,
            status: 'Completed'
        }
    ],
    getTimeBasedGreeting: () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            return 'Good Morning 🌅';
        }
        if (hour >= 12 && hour < 17) {
            return 'Good Afternoon ☀️';
        }
        if (hour >= 17 && hour < 21) {
            return 'Good Evening 🌇';
        }
        return 'Good Night 🌙';
    },
    getStatusColor: (status: string) => {
        return status === 'Completed' ? COLORS.success : '#FBBF24';
    },
    getStatusLabel: (status: string) => {
        return status === 'Completed' ? 'Completed' : 'In Progress';
    },
    employeeDesignation: [
        {
            id: 1,
            designationName: 'React Native Developer'
        },
        {
            id: 2,
            designationName: 'Mern Stack Developer'
        },
        {
            id: 3,
            designationName: '.Net Developer'
        },
        {
            id: 4,
            designationName: 'Python Developer'
        },
        {
            id: 5,
            designationName: 'UI/UX Designer'
        }
    ],
    STORAGE_KEY: "clockInTime_v2",
    CLOCK_RECORDS_KEY: "clockRecords_v2",
    formatTimeHMClockCard: (ts: number) => {
        const d = new Date(ts);
        let hrs = d.getHours();
        const mins = String(d.getMinutes()).padStart(2, "0");
        const ampm = hrs >= 12 ? "PM" : "AM";
        hrs = hrs % 12 || 12;
        return `${hrs}:${mins} ${ampm}`;
    },
    formatDurationClockCard: (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    },
    millisecondsToHHMMSSClockCard: (ms: number) => {
        if (!ms || ms < 0) return "00:00:00";
        const totalSeconds = Math.floor(ms / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    },
    liveSeconds: (val: any) => {
        return (Date.now() - new Date(val).getTime()) / 1000
    },
    newDateISOString: new Date().toISOString(),
    startEndTime: (val: any) => {
        return new Date(val).toLocaleTimeString()
    },
    newDateISOStringSplit: new Date().toISOString().split('T')[0],
    newDateDMY: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }),
    taskItemFormatDate: (date: string): string => {
        try {
            const parsedDate = new Date(date);
            return parsedDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return date;
        }
    },
    checkinout: (str: any) => {
        return str.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        })
    },
    breakinout: (str: any) => {
        return new Date(str).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        })
    },
    calculateTimeRemaining: (endDate?: string) => {
        if (!endDate) return 'N/A';

        const deadline = new Date(endDate);
        if (isNaN(deadline.getTime())) return 'N/A';

        const now = new Date();
        const diff = deadline.getTime() - now.getTime();

        if (diff <= 0) return 'Overdue';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
            (diff % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor(
            (diff % (1000 * 60)) / 1000
        );
        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ${hours}h ${minutes}m left`;
        }
        if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ${minutes}m ${seconds}s left`;
        }
        return `${minutes}m ${seconds}s left`;
    },
    empTaskDetailFormatDate: (date?: string) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        if (isNaN(d.getTime())) return 'N/A';

        return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    },
    empTaskDetailFormatTime: (date?: string) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        if (isNaN(d.getTime())) return 'N/A';
        return d.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    },
    getDateOnly: (value: string | Date) => {
        const d = new Date(value);
        return d.toISOString().split('T')[0];
    },
    getBreakSeconds: (b: any) => {
        if (!b.breakIn || !b.breakOut) return 0;
        return Math.floor(
            (new Date(b.breakOut).getTime() - new Date(b.breakIn).getTime()) / 1000
        );
    }
}