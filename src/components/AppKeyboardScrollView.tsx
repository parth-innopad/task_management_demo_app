import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { COLORS } from "../utils/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface AppKeyboardScrollViewProps {
    enabled?: boolean;
    horizontal?: boolean;
    bounces?: boolean;
    children?: ReactNode;
    extraHeight?: number;
    customStyle?: any;
    contentContainerStyle?: any;
    backgroundColor?: any;
}

const AppKeyboardScrollView: React.FC<AppKeyboardScrollViewProps> = ({
    enabled = true,
    horizontal,
    extraHeight = 120,
    children,
    bounces = true,
    backgroundColor,
    ...props
}) => {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: backgroundColor ? backgroundColor : COLORS.bg
        }
    });

    return (
        <KeyboardAwareScrollView
            enableOnAndroid={enabled}
            contentContainerStyle={{ flexGrow: 1, ...props.contentContainerStyle }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={[styles.container, { ...props.customStyle }]}
            extraHeight={extraHeight || 150}
            extraScrollHeight={extraHeight}
            bounces={bounces}
            enableResetScrollToCoords={false}
            resetScrollToCoords={undefined}
        >
            {children}
        </KeyboardAwareScrollView>
    )
}

export default AppKeyboardScrollView;