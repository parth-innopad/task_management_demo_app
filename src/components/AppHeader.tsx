import React from "react";
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../utils/theme";
import { fs, hs, vs } from "../utils/stylesUtils";

interface Props {
    title: string;
    leftIcon?: any;
    rightIcon?: any;
    rightIconOnly?: any;
}

const AppHeader: React.FC<Props> = ({
    title,
    leftIcon,
    rightIcon,
    rightIconOnly
}) => {
    return (
        <SafeAreaView style={styles.container}>
            {leftIcon && (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: hs(20), paddingBottom: vs(15) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 30 }}>
                        {leftIcon}
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    {rightIconOnly && rightIconOnly}
                </View>
            )}
            {!leftIcon && !rightIcon && <Text style={[styles.title, { marginHorizontal: hs(20), paddingBottom: vs(20) }]}>{title}</Text>}
            {rightIcon && (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 30, marginHorizontal: hs(20), paddingBottom: vs(20) }}>
                    <Text style={styles.title}>{title}</Text>
                    {rightIcon}
                </View>
            )}
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.card,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    title: {
        fontSize: fs(20),
        fontWeight: '700',
        color: '#1B1D28',
    }
})

export default AppHeader;