import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get('window');

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const isTablet = width >= 768;

const widthScale = isTablet ? width / (BASE_WIDTH * 1.3) : width / width;
const heightScale = isTablet ? height / (BASE_HEIGHT * 1.3) : height / height;

export const hs = (size: number) => Math.round(PixelRatio.roundToNearestPixel(size * widthScale));
export const vs = (size: number) => Math.round(PixelRatio.roundToNearestPixel(size * heightScale));
export const fs = (size: number) => Math.round(PixelRatio.roundToNearestPixel(size * Math.min(widthScale, heightScale)));