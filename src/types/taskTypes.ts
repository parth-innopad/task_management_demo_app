export enum TaskStatus {
    PENDING = 'Pending',
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed'
}

export interface TaskData {
    tasksId: string;
    taskTitle: string;
    taskDescription?: string;
    employeeSelect: string;
    employeeSelectId: string;
    location?: string;
    startDateTime: string;
    endDateTime: string;
    status?: string;
    statusId?: string;
    priority?: 'Low' | 'Medium' | 'High';
}

export type TaskStatus_Type = 'Pending' | 'In Progress' | 'Completed';
