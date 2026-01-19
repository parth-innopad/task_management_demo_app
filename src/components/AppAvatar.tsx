import React from "react";
import { Image } from 'react-native';
import { AppIcons } from "../common/AppIcons";
import { hs, vs } from "../utils/stylesUtils";

interface AppAvatarProps {
    uri: string;
    size?: number;
}

const AppAvatar: React.FC<AppAvatarProps> = ({
    uri,
    size = 50
}) => {

    if (uri) {
        return (
            <Image
                source={{ uri }}
                style={{ width: hs(size), height: vs(size), borderRadius: 100 }}
            />
        )
    } else {
        return (
            <Image
                source={AppIcons.placeholderLogo}
                style={{ width: hs(size), height: vs(size), resizeMode: 'contain' }}
            />
        )
    }
}

export default AppAvatar;