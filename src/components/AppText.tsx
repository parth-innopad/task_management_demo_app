import * as React from 'react';
import { Pressable, StyleProp, Text, TextStyle } from 'react-native';

interface AppTextProps {
    style?: StyleProp<TextStyle>;
    txt?: string;
    numberOfLines?: number;
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
    onPress?: () => void;
    onTextLayout?: any;
}

const AppText = (props: AppTextProps) => {
    return (
        <Pressable disabled={!props.onPress} onPress={props.onPress}>
            <Text ellipsizeMode={props.ellipsizeMode} numberOfLines={props.numberOfLines} onTextLayout={props.onTextLayout} style={props.style}>{props.txt}</Text>
        </Pressable>
    );
};

export default AppText;