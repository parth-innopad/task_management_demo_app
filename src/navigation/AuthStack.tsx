import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationKeys } from '../common/NavigationKeys';
import SplashScreen from '../screens/Auth/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={NavigationKeys.Splash} component={SplashScreen} />
            <Stack.Screen name={NavigationKeys.Login} component={LoginScreen} options={{ animation: 'fade' }} />
        </Stack.Navigator>
    );
};