import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationKeys } from '../common/NavigationKeys';
import EmployeeDashboard from '../screens/App/Employee/EmployeeDashboard';
import EmployeeAttendance from '../screens/App/Employee/EmployeeAttendance';
import Profile from '../screens/App/Profile';
import EmployeeTasks from '../screens/App/Employee/EmployeeTasks';
import EmployeeTasksSummary from '../screens/App/Employee/EmployeeTasksSummary';

const Stack = createNativeStackNavigator();

export const EmployeeStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={NavigationKeys.EmployeeDashboard} component={EmployeeDashboard} options={{ animation: 'fade' }} />
            <Stack.Screen name={NavigationKeys.EmployeeAttendance} component={EmployeeAttendance as React.ComponentType<any>} />
            <Stack.Screen name={NavigationKeys.Profile} component={Profile as React.ComponentType<any>} />
            <Stack.Screen name={NavigationKeys.EmployeeTasks} component={EmployeeTasks as React.ComponentType<any>} />
            <Stack.Screen name={NavigationKeys.EmployeeTasksSummary} component={EmployeeTasksSummary as React.ComponentType<any>} />
        </Stack.Navigator>
    );
};