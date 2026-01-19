import React from "react";
import { View, StyleSheet } from 'react-native';
import { COLORS } from "../utils/theme";

interface ScreenContainerProps {
    children: React.ReactNode;
    backgroundColor?: string;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
    children,
    backgroundColor = COLORS.card
}) => {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: backgroundColor,
        }
    })

    return (
        <View style={styles.container}>
            {children}
        </View>
    )
}

export default ScreenContainer;