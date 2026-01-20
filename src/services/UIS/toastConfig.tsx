import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { hasNotch } from 'react-native-device-info';
import Toast, {
    ToastConfig as ToastMessageType,
} from 'react-native-toast-message';
import { fs, vs } from '../../utils/stylesUtils';
import { COLORS } from '../../utils/theme';

interface ToastConfigParams {
    text1?: string;
    topOffset?: number;
    type?: 'success' | 'warning' | 'error' | 'info';
}

type ToastView = (params: ToastConfigParams) => React.ReactNode;

export const has_Notch = hasNotch();

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
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.textStyle}>
                    {text1}
                </Text>
            </View>
        </View>
    );
};
const toastConfig: ToastMessageType = {
    error: props => <CustomToastView {...props} type="error" />,
    success: props => <CustomToastView {...props} type="success" />,
    warning: props => <CustomToastView {...props} type="warning" />,
    info: props => <CustomToastView {...props} type="info" />,
};
const styles = StyleSheet.create({
    mainViewStyle: {
        minHeight: vs(50),
        width: '100%',
        justifyContent: 'center',
        paddingVertical: vs(10),
    },
    subViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    textStyle: {
        color: COLORS.card,
        fontSize: fs(14),
        flex: 1,
    },
});

export const _showToast = (msg: string, type: string = 'error') => {
    Toast.show({ type, text1: msg, visibilityTime: 3000, position: 'top' });
};
export default toastConfig;