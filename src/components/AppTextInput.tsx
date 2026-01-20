import React, { Fragment } from "react";
import {
    TextInput,
    TextInputProps,
    StyleProp,
    TextStyle,
    View,
    StyleSheet,
    ViewStyle,
    TouchableOpacity,
    ImageStyle,
    Text,
} from "react-native";
import { COLORS } from "../utils/theme";
import { fs, hs, vs } from "../utils/stylesUtils";

interface AppTextInputProps extends TextInputProps {
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    placeholder?: any;
    placeholderTextColor?: any;
    leftIcon?: any;
    rightIcon?: any;
    onLeftIconPress?: () => void;
    onRightIconPress?: () => void;
    onRightIconPress2?: () => void;
    iconStyle?: StyleProp<ImageStyle>;
    inputBackgroundColor?: any;
    inputBorderColor?: any;
    inputBorderRadius?: any;
    value?: any,
    onChangeText?: any,
    errorMessage?: any;
    keyboardType?: TextInputProps['keyboardType'];
    hasError?: boolean;
}

const AppTextInput: React.FC<AppTextInputProps> = ({
    containerStyle,
    inputStyle,
    placeholder,
    placeholderTextColor,
    leftIcon,
    rightIcon,
    onLeftIconPress,
    onRightIconPress,
    iconStyle,
    errorMessage,
    inputBackgroundColor,
    inputBorderColor,
    inputBorderRadius,
    value,
    onChangeText,
    multiline,
    numberOfLines,
    keyboardType,
    hasError,
    ...rest
}) => {

    const isMultiline = multiline === true;

    const styles = StyleSheet.create({
        wrapper: {
            flexDirection: 'row',
            alignItems: isMultiline ? 'flex-start' : 'center',
            width: '100%',
            borderWidth: 1,
            borderRadius: inputBorderRadius ?? 10,
            backgroundColor: inputBackgroundColor ?? '#F1F4F8',
            borderColor: hasError
                ? COLORS.danger
                : inputBorderColor ?? '#F1F4F8',
            paddingHorizontal: hs(10),
            paddingVertical: isMultiline ? vs(10) : 0,
            minHeight: isMultiline ? vs(120) : vs(50),
        },
        input: {
            flex: 1,
            fontSize: fs(16),
            color: COLORS.blackColor,
            fontWeight: '400',
            includeFontPadding: false,
            paddingHorizontal: hs(10),
            paddingVertical: 0,
            textAlignVertical: isMultiline ? 'top' : 'center',
        },
        errorText: {
            color: COLORS.danger,
            fontWeight: '400',
            fontSize: fs(13),
            marginTop: vs(5),
            marginLeft: hs(5),
        },
    });

    return (
        <View style={containerStyle}>
            <View style={styles.wrapper}>
                {leftIcon && (
                    onLeftIconPress ? (
                        <TouchableOpacity onPress={onLeftIconPress}>
                            {leftIcon}
                        </TouchableOpacity>
                    ) : (
                        leftIcon
                    )
                )}

                <TextInput
                    {...rest}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    style={[styles.input, inputStyle]}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                />

                {rightIcon && (
                    onRightIconPress ? (
                        <TouchableOpacity onPress={onRightIconPress}>
                            {rightIcon}
                        </TouchableOpacity>
                    ) : (
                        rightIcon
                    )
                )}
            </View>

            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
        </View>
    );
};


export default AppTextInput;
