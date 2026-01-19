import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationKeys } from '../common/NavigationKeys';
import { AuthStack } from './AuthStack';
import { StatusBar } from 'react-native';
import { AdminStack } from './AdminStack';
import { EmployeeStack } from './EmployeeStack';
import BootSplash from "react-native-bootsplash";

const Stack = createNativeStackNavigator();

export const RootStack = () => {
    return (
        <NavigationContainer
            onReady={() => {
                BootSplash.hide();
            }}
        >
            <StatusBar barStyle="dark-content" backgroundColor="transparent" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name={NavigationKeys.AuthNavigation} component={AuthStack} />
                <Stack.Screen name={NavigationKeys.AdminNavigation} component={AdminStack} />
                <Stack.Screen name={NavigationKeys.EmployeeNavigation} component={EmployeeStack} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};