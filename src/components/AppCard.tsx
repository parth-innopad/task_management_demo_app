import React from "react";
import { ViewStyle, View, StyleSheet, TouchableOpacity } from "react-native";

interface AppCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
}

const AppCard: React.FC<AppCardProps> = ({
    children,
    style,
    onPress
}) => {
    if (onPress) {
        return (
            <TouchableOpacity
                style={[styles.card, style]}
                onPress={onPress}
            >
                {children}
            </TouchableOpacity>
        )
    } else {
        return (
            <View style={[styles.card, style]}>
                {children}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 4,
        elevation: 4
    }
})

export default AppCard;