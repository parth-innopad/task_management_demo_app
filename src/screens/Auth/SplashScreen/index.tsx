import { View, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'
import { COLORS } from '../../../utils/theme'
import { AppIcons } from '../../../common/AppIcons'
import { NavigationKeys } from '../../../common/NavigationKeys';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface SplashProps {
    navigation: any;
}

const SplashScreen: React.FC<SplashProps> = ({ navigation }) => {

    const isLogin = useSelector((state: RootState) => state.appData.isLogin);
    const userApp = useSelector((state: RootState) => state.appData.saveUser);

    useEffect(() => {
        setTimeout(() => {
            if (isLogin) {
                if (userApp.role == "admin") {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: NavigationKeys.AdminNavigation }]
                    });
                } else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: NavigationKeys.EmployeeNavigation }]
                    });
                }
            } else {
                navigation.navigate(NavigationKeys.Login);
            }
        }, 1000);
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={AppIcons.splashLogo}
                style={styles.splashLogoStyle}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.card,
        justifyContent: 'center',
        alignItems: 'center'
    },
    splashLogoStyle: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    }
})

export default SplashScreen;