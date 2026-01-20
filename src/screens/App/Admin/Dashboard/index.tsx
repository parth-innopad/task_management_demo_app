import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, BackHandler } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ScreenContainer from '../../../../components/ScreenContainer'
import AppHeader from '../../../../components/AppHeader'
import { COLORS } from '../../../../utils/theme'
import { CalendarDays, Users, ClipboardList, LogOut } from 'lucide-react-native';
import { NavigationKeys } from '../../../../common/NavigationKeys'
import { fs, hs, vs } from '../../../../utils/stylesUtils'
import { AppString } from '../../../../common/AppString'
import { useDispatch } from 'react-redux'
import { setIsLogin } from '../../../../store/reducers/appDataSlice'
import AppText from '../../../../components/AppText'
import { textStyles } from '../../../../common/CommonStyles'
import ConfirmationModal from '../../../../subviews/ConfirmationModal'
import { _showToast } from '../../../../services/UIS/toastConfig'
import { useFocusEffect } from '@react-navigation/native'

interface DashboardProps {
    navigation?: any;
}

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const [logoutVisible, setLogoutVisible] = useState(false);
    const [exitVisible, setExitVisible] = useState(false);

    const logoutHandler = () => {
        setLogoutVisible(true);
    };

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                setExitVisible(true);
                return true;
            };
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction
            );
            return () => backHandler.remove();
        }, [])
    );

    return (
        <ScreenContainer backgroundColor={COLORS.bg}>
            <AppHeader
                title={NavigationKeys.Dashboard}
                rightIcon={
                    <TouchableOpacity onPress={() => logoutHandler()}>
                        <LogOut size={24} color={COLORS.danger} />
                    </TouchableOpacity>
                }
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: hs(20), paddingBottom: vs(100) }}
            >
                <AppText
                    txt={AppString.QuickActions}
                    style={[textStyles.title, { marginTop: vs(20), marginBottom: vs(10) }]}
                />

                <View style={[styles.grid, { marginTop: vs(20) }]}>
                    <TouchableOpacity style={styles.actionBox} onPress={() => navigation.navigate(NavigationKeys.Attendance)}>
                        <CalendarDays size={32} color={COLORS.secondaryPrimary} />
                        <AppText
                            style={[textStyles.primary15, { marginTop: vs(10) }]}
                            txt={AppString.Attendance}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBox} onPress={() => navigation.navigate(NavigationKeys.EmployeeList)}>
                        <Users size={32} color={COLORS.secondaryPrimary} />
                        <AppText
                            style={[textStyles.primary15, { marginTop: vs(10) }]}
                            txt={AppString.Employees}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.actionBox, { width: '100%', alignSelf: 'center' }]} onPress={() => navigation.navigate(NavigationKeys.Tasks)}>
                    <ClipboardList size={32} color={COLORS.secondaryPrimary} />
                    <AppText
                        style={[textStyles.primary15, { marginTop: vs(10) }]}
                        txt={AppString.EmployeeTasks}
                    />
                </TouchableOpacity>
            </ScrollView>

            <ConfirmationModal
                visible={logoutVisible}
                title={AppString.Logout}
                message={AppString.AreYourSureWantLogout}
                cancel={AppString.Cancel}
                confirm={AppString.Logout}
                onCancel={() => setLogoutVisible(false)}
                onConfirm={() => {
                    setLogoutVisible(false);
                    _showToast(AppString.LogoutSuccessfully, AppString.success);
                    dispatch(setIsLogin(false));
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: NavigationKeys.AuthNavigation,
                                state: {
                                    routes: [{ name: NavigationKeys.Login }],
                                },
                            },
                        ],
                    });
                }}
            />

            <ConfirmationModal
                visible={exitVisible}
                title="Exit App"
                message="Are you sure you want to exit?"
                cancel={AppString.Cancel}
                confirm="Exit"
                onCancel={() => setExitVisible(false)}
                onConfirm={() => {
                    setExitVisible(false);
                    BackHandler.exitApp();
                }}
            />
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    actionBox: {
        width: '48%',
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: vs(14),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 4,
        elevation: 4
    },
    empRow: {
        flexDirection: 'row',
    },
    empName: {
        fontSize: fs(16),
        fontWeight: '700',
        color: '#1B1D28'
    },
    empSub: {
        fontSize: fs(14),
        color: '#7b8ca4',
        marginTop: vs(5)
    }
})

export default Dashboard;