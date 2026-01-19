import { TextStyle } from "react-native";
import { fs } from "../utils/stylesUtils";
import { COLORS } from "../utils/theme";

const textStyle = <T extends TextStyle>(style: T) => style;

const baseText: TextStyle = {
    fontWeight: '600',
    color: COLORS.blackColor,
};

const createText = (
    fontSize: number,
    color = COLORS.blackColor,
    fontWeight: TextStyle['fontWeight'] = '600'
): TextStyle => ({
    ...baseText,
    fontSize: fs(fontSize),
    color,
    fontWeight,
});

export const textStyles = {
    caption: createText(12, COLORS.secondaryPrimary),
    bodySmall: createText(14, COLORS.greyColor),
    body: createText(16),
    subtitle: createText(18, COLORS.subGreyColor),
    title: createText(20),
    heading: createText(24),
    error: createText(13, COLORS.danger, '400'),
    emptyText: createText(18, COLORS.greyColor, '600'),
    primary15: createText(15, '#1b1d28ff', '600'),
    primary13: createText(13, COLORS.textLight)
};

const textPrimary17 = textStyle({
    fontSize: fs(17),
    fontWeight: '600',
    color: '#1B1D28'
});

export {
    textPrimary17,
}