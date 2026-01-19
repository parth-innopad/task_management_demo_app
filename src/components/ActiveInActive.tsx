import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { COLORS } from '../utils/theme'
import { setBreakIn, setBreakOut, setEmployeeLoginStatus, setIsShowCheckIn } from '../store/reducers/appDataSlice'
import { Coffee, LogIn, LogOut, PauseCircle, PlayCircle, Power, PowerOff, Timer } from 'lucide-react-native'
import { Constants } from '../common/Constants'
import { RootState } from '../store'
import { fs, vs } from '../utils/stylesUtils'
import AppCard from './AppCard'
import AppText from './AppText'
import { textStyles } from '../common/CommonStyles'
import ConfirmationModal from '../subviews/ConfirmationModal'
import { _showToast } from '../services/UIS/toastConfig'
import { AppString } from '../common/AppString'

const ActiveInActive = ({ onBreakInBefore }: any) => {

    const dispatch = useDispatch();

    const todayKey = Constants.newDateISOStringSplit;
    const MAX_BREAKS_PER_DAY = 5;

    const [modalVisible, setModalVisible] = useState(false);

    const currentUser = useSelector((state: RootState) => state.appData.saveUser);
    const loginData = useSelector((state: RootState) => {
        const empData = state.appData.employeeLoginStatus[currentUser?.id];
        if (!empData) return null;
        return empData.find(d => d.date === todayKey) || null;
    });
    const isShownCheckIn = useSelector((state: RootState) => state.appData.showCheckInOption);
    const isBreakLimitReached =
        loginData?.isActive &&
        !loginData?.isOnBreak &&
        (loginData?.breaks?.length || 0) >= MAX_BREAKS_PER_DAY;

    const liveSeconds =
        loginData?.isActive && loginData?.loginTime
            ? (Date.now() - new Date(loginData.loginTime).getTime()) / 1000
            : 0;
    const totalTodaySeconds = (loginData?.totalWorkSecondsToday || 0) + (liveSeconds || 0);

    const lastBreak =
        loginData?.breaks?.length
            ? loginData.breaks[loginData.breaks.length - 1]
            : null;

    const liveBreakSeconds =
        loginData?.isOnBreak && lastBreak?.breakIn
            ? (Date.now() - new Date(lastBreak.breakIn).getTime()) / 1000
            : 0;

    const totalBreakSeconds =
        (loginData?.totalBreakSecondsToday || 0) + liveBreakSeconds;

    const handleLogoutPress = () => {
        if (loginData?.isActive) {
            setModalVisible(true);
        } else {
            dispatch(
                setEmployeeLoginStatus({
                    employeeId: currentUser?.id,
                    isActive: true,
                    timestamp: new Date().toISOString(),
                    user: currentUser,
                })
            );
        }
    };

    const checkoutHandler = () => {
        setModalVisible(false);
        if (loginData?.isOnBreak) {
            dispatch(
                setBreakOut({
                    employeeId: currentUser.id,
                    timestamp: new Date().toISOString(),
                })
            );
        }
        dispatch(setIsShowCheckIn(true));
        dispatch(
            setEmployeeLoginStatus({
                employeeId: currentUser?.id,
                isActive: false,
                timestamp: new Date().toISOString(),
                user: currentUser,
            })
        );
    };

    return (
        <AppCard>
            <View style={styles.statusHeader}>
                <View style={styles.statusTitleWrap}>
                    <View
                        style={[
                            styles.statusDot,
                            { backgroundColor: loginData?.isActive ? COLORS.success : COLORS.danger },
                        ]}
                    />
                    <AppText
                        txt="Today's Status"
                        style={[textStyles.body, { color: '#1B1D28' }]}
                    />
                </View>

                {isShownCheckIn == true ? null :
                    <TouchableOpacity
                        style={[
                            styles.powerButton,
                            {
                                backgroundColor: loginData?.isActive
                                    ? COLORS.activeRGBA
                                    : COLORS.inActiveRGBA,
                            },
                        ]}
                        onPress={() => handleLogoutPress()}
                    >
                        {loginData?.isActive ? (
                            <Power size={20} color={COLORS.success} />
                        ) : (
                            <PowerOff size={20} color={COLORS.danger} />
                        )}
                    </TouchableOpacity>
                }
            </View>

            <AppText
                txt={loginData?.isActive ? 'Active (Working)' : 'In active'}
                style={[textStyles.bodySmall, { color: loginData?.isActive ? COLORS.success : COLORS.danger, marginTop: vs(5) }]}
            />

            <View style={styles.infoRow}>
                <LogIn size={20} color={COLORS.secondaryPrimary} />
                <Text style={styles.infoLabel}>Login</Text>
                <Text style={styles.infoValue}>
                    {loginData?.loginTime ? Constants.startEndTime(loginData.loginTime) : '--'}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <LogOut size={18} color={COLORS.danger} />
                <Text style={styles.infoLabel}>Logout</Text>
                <Text style={styles.infoValue}>
                    {loginData?.logoutTime ? Constants.startEndTime(loginData.logoutTime) : '--'}
                </Text>
            </View>

            {loginData?.isActive && (
                <Fragment>
                    <View style={styles.divider} />
                    <TouchableOpacity
                        disabled={isBreakLimitReached}
                        style={[
                            styles.breakButton,
                            {
                                backgroundColor: isBreakLimitReached
                                    ? COLORS.LightGrayDisable
                                    : loginData?.isOnBreak
                                        ? COLORS.activeRGBA
                                        : COLORS.inActiveRGBA,
                                opacity: isBreakLimitReached ? 0.6 : 1,
                            },
                        ]}

                        onPress={async () => {
                            const isBreakIn = !loginData?.isOnBreak;
                            const breakCount = loginData?.breaks?.length || 0;

                            if (isBreakIn && breakCount >= MAX_BREAKS_PER_DAY) {
                                _showToast(
                                    'You have reached the maximum 5 breaks for today',
                                    AppString.error
                                );
                                return;
                            }

                            if (isBreakIn) {
                                await onBreakInBefore?.();
                            }

                            dispatch(
                                isBreakIn
                                    ? setBreakIn({
                                        employeeId: currentUser.id,
                                        timestamp: new Date().toISOString(),
                                    })
                                    : setBreakOut({
                                        employeeId: currentUser.id,
                                        timestamp: new Date().toISOString(),
                                    })
                            );
                        }}

                    >
                        {loginData?.isOnBreak ? (
                            <Fragment>
                                <PlayCircle size={20} color={COLORS.success} />
                                <AppText
                                    txt='Break Out'
                                    style={[textStyles.bodySmall, { color: COLORS.blackColor }]}
                                />
                            </Fragment>
                        ) : (
                            <Fragment>
                                <PauseCircle size={20} color={COLORS.warning} />
                                <AppText
                                    txt='Break In'
                                    style={[textStyles.bodySmall, { color: COLORS.blackColor }]}
                                />
                            </Fragment>
                        )}
                    </TouchableOpacity>

                    <View style={[styles.infoRow]}>
                        <Coffee size={20} color={COLORS.warning} />
                        <Text style={styles.infoLabel}>Total Break</Text>
                        <Text style={styles.infoValue}>
                            {/* {Constants.formatHours(loginData?.totalBreakSecondsToday || 0)} */}
                            {Constants.formatHours(totalBreakSeconds)}
                        </Text>
                    </View>
                </Fragment>
            )}

            <View style={styles.divider} />

            <View style={[styles.infoRow]}>
                <Timer size={25} color={COLORS.secondaryPrimary} />
                <Text style={[styles.infoLabel, { color: COLORS.secondaryPrimary, fontWeight: '700' }]}>
                    Total Hours
                </Text>
                <Text style={[styles.totalValue, { color: COLORS.secondaryPrimary }]}>
                    {Constants.formatHours(totalTodaySeconds)}
                </Text>
            </View>

            <ConfirmationModal
                visible={modalVisible}
                title="Checkout"
                message="Are you sure you want to checkout ?"
                cancel="No"
                confirm="Yes"
                onCancel={() => setModalVisible(false)}
                onConfirm={checkoutHandler}
            />
        </AppCard>
    )
}

const styles = StyleSheet.create({
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusTitleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 100,
    },
    powerButton: {
        padding: 8,
        borderRadius: 100,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: vs(12),
    },
    infoLabel: {
        marginLeft: 8,
        fontSize: fs(14),
        fontWeight: '600',
        color: COLORS.textLight,
        flex: 1,
    },
    infoValue: {
        fontSize: fs(14),
        fontWeight: '600',
        color: COLORS.text,
    },
    totalValue: {
        fontSize: fs(14),
        fontWeight: '800',
        color: COLORS.primary,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: vs(15),
    },
    breakButton: {
        marginTop: vs(10),
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
})

export default ActiveInActive;