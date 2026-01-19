import React from 'react';
import { Alert } from 'react-native';

// Create a ref for the navigator
export const navigationRef = React.createRef<any>();

// Navigation service with common navigation actions
const navigate = (name: string, params?: any) => {
    navigationRef.current?.navigate(name, params);
};

const goBack = () => {
    navigationRef.current?.goBack();
};

const reset = (index: any, routes: any) => {
    navigationRef.current?.reset({
        index,
        routes,
    });
};

// Other possible actions
const replace = (name: any, params?: any) => {
    navigationRef.current?.replace(name, params);
};

const getCurrentRoute = () => {
    return navigationRef.current?.getCurrentRoute();
};

const popToTop = () => {
    navigationRef.current?.popToTop();
};

const nativeAlertwithAction = async (title: string, msg: string, callback = (result: boolean) => { }) => {
    Alert.alert(title, msg, [{
        text: 'Cancel',
        onPress: () => callback(false),
        style: 'cancel',
    }, { text: 'OK', onPress: () => callback(true) },
    ]);
};

export const NavAction = {
    navigate,
    goBack,
    reset,
    getCurrentRoute,
    replace,
    popToTop,
    nativeAlertwithAction
};