import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationKeys } from '../common/NavigationKeys';
import Dashboard from '../screens/App/Admin/Dashboard';
import EmployeesListScreen from '../screens/App/Admin/EmployeeListScreen';
import CreateEditEmployee from '../screens/App/Admin/CreateEditEmployee';
import EmployeeDetails from '../screens/App/Admin/EmployeeDetails';
import Attendance from '../screens/App/Admin/Attendance';
import AttendanceRules from '../screens/App/Admin/AttendanceRules';
import Tasks from '../screens/App/Admin/Tasks';
import CreateEditTasks from '../screens/App/Admin/CreateEditTasks';
import TasksDetails from '../screens/App/Admin/TasksDetails';
import EmployeeTasksHistory from '../screens/App/Admin/EmployeeTasksHistory';

const Stack = createNativeStackNavigator();

export const AdminStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={NavigationKeys.Dashboard} component={Dashboard} options={{ animation: 'fade' }} />
            <Stack.Screen name={NavigationKeys.EmployeeList} component={EmployeesListScreen} />
            <Stack.Screen name={NavigationKeys.CreateEditEmployee} component={CreateEditEmployee as React.ComponentType<any>} />
            <Stack.Screen name={NavigationKeys.EmployeeDetails} component={EmployeeDetails as React.ComponentType<any>} />
            <Stack.Screen name={NavigationKeys.Attendance} component={Attendance as React.ComponentType<any>} />
            <Stack.Screen name={NavigationKeys.AttendanceRules} component={AttendanceRules as React.ComponentType<any>} />
            <Stack.Screen name={NavigationKeys.Tasks} component={Tasks as React.ComponentType<any>} />
            <Stack.Screen name={NavigationKeys.CreateEditTasks} component={CreateEditTasks as React.ComponentType<any>} />
            <Stack.Screen name={NavigationKeys.TasksDetails} component={TasksDetails as React.ComponentType<any>} />
            <Stack.Screen name={NavigationKeys.EmployeeTasksHistory} component={EmployeeTasksHistory as React.ComponentType<any>} />
        </Stack.Navigator>
    );
};