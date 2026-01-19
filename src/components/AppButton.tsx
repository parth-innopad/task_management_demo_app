import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface AppButtonProps {
    label: string;
    onPress?: () => void;
    style?: ViewStyle;
    icon?: React.ReactNode;
}

const AppButton: React.FC<AppButtonProps> = ({
    label,
    onPress,
    style,
    icon
}) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.btn, style]}>
            {icon}
            <Text style={styles.lable}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#4B7BEC',
        paddingVertical: 15,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    lable: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
        marginLeft: 6
    }
})

export default AppButton;