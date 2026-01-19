import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Toast, { ToastConfig as ToastMessageType } from 'react-native-toast-message';

interface ToastConfigParams {
    text1?: string;
    topOffset?: number;
    type?: 'success' | 'warning' | 'error';
}

type ToastView = (params: ToastConfigParams) => React.ReactNode;

const CustomToastView: ToastView = ({ text1, type }) => {

    let backgroundColor;

    switch (type) {
        case 'error': backgroundColor = 'red';
            break;
        case 'warning': backgroundColor = 'orange';
            break;
        case 'success': backgroundColor = 'green';
            break;
        default: break;
    }

    return (
        <View style={[styles.mainViewStyle, { backgroundColor }]}>
            <View style={styles.subViewStyle}>
                <Text numberOfLines={2} style={styles.textStyle}>
                    {text1}
                </Text>
            </View>
        </View>
    );
};

const toastConfig: ToastMessageType = {
    error: (props) => <CustomToastView  {...props} type="error" />,
    success: (props) => <CustomToastView {...props} type="success" />,
    warning: (props) => <CustomToastView {...props} type="warning" />,
};

const styles =
    StyleSheet.create({
        mainViewStyle: {
            borderRadius: 50
        },
        subViewStyle: {
            height: 50,
            minWidth: 200,
            justifyContent: 'center',
            alignItems: 'center',
        },
        iconStyle: {
            tintColor: 'white',
        },
        textStyle: {
            textAlign: 'center',
            color: 'white',
            width: '90%',
            fontSize: 14,
        },
    });

export const _showToast = (msg: string, type: string = 'error') => {
    Toast.show({ type, text1: msg, visibilityTime: 2000 })
};

export default toastConfig;