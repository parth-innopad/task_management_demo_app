import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Fragment, useState, useEffect } from 'react'
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

const ActiveInActive = ({ isClockedIn, onBreakInBefore }: any) => {

    const dispatch = useDispatch();

    const todayKey = Constants.newDateISOStringSplit;
    const MAX_BREAKS_PER_DAY = 5;

    const [modalVisible, setModalVisible] = useState(false);
    const [currentSessionData, setCurrentSessionData] = useState<{
        startTime: string | null;
        endTime: string | null;
        breaks: any[];
    }>({
        startTime: null,
        endTime: null,
        breaks: []
    });

    const currentUser = useSelector((state: RootState) => state.appData.saveUser);
    const loginData: any = useSelector((state: RootState) => {
        const empData = state.appData.employeeLoginStatus[currentUser?.id];
        if (!empData) return null;
        return empData.find(d => d.date === todayKey) || null;
    });

    // Track current session
    useEffect(() => {
        if (loginData) {
            if (loginData.isActive && !loginData.logoutTime) {
                // Active session - check if we need to start a new session
                if (!currentSessionData.startTime) {
                    // New session starting
                    setCurrentSessionData({
                        startTime: loginData.loginTime,
                        endTime: null,
                        breaks: []
                    });
                } else {
                    // Update breaks for current session
                    if (loginData.breaks) {
                        const sessionBreaks = loginData.breaks.filter((breakItem: any) => {
                            const breakTime = new Date(breakItem.breakIn).getTime();
                            const sessionStart = new Date(currentSessionData.startTime!).getTime();
                            return breakTime >= sessionStart;
                        });
                        setCurrentSessionData(prev => ({
                            ...prev,
                            breaks: sessionBreaks
                        }));
                    }
                }
            } else if (loginData.logoutTime && currentSessionData.startTime) {
                // Session has ended - set end time
                setCurrentSessionData(prev => ({
                    ...prev,
                    endTime: loginData.logoutTime
                }));
            } else if (!loginData.isActive && !currentSessionData.startTime) {
                // Not logged in and no session data - reset
                setCurrentSessionData({
                    startTime: null,
                    endTime: null,
                    breaks: []
                });
            }
        }
    }, [loginData, currentSessionData.startTime]);

    // Count all breaks (including ongoing ones) for limit checking
    const isBreakLimitReached =
        loginData?.isActive &&
        !loginData?.isOnBreak &&
        (loginData?.breaks?.length || 0) >= MAX_BREAKS_PER_DAY;

    // Total hours for CURRENT SESSION only 
    const totalTodaySeconds = React.useMemo(() => {
        // If no current session, show 0
        if (!currentSessionData.startTime) return 0;

        const sessionStartTime = new Date(currentSessionData.startTime).getTime();

        // If user is active but no end time yet, return 0 (no live updates)
        if (loginData?.isActive && !currentSessionData.endTime) {
            return 0; // Don't calculate live time
        }

        // If session has ended, compute from session start to end time
        if (currentSessionData.endTime) {
            const sessionEndTime = new Date(currentSessionData.endTime).getTime();
            return Math.floor((sessionEndTime - sessionStartTime) / 1000);
        }

        return 0;
    }, [currentSessionData.startTime, currentSessionData.endTime, loginData?.isActive]);

    // Total break seconds for CURRENT SESSION only - FIXED PRECISION
    const totalBreakSeconds = React.useMemo(() => {
        if (!currentSessionData.breaks?.length) return 0;

        return currentSessionData.breaks.reduce((sum: number, b: any) => {
            if (!b.breakOut) return sum;

            // Normalize timestamps to seconds FIRST
            const breakInSec = Math.floor(new Date(b.breakIn).getTime() / 1000);
            const breakOutSec = Math.floor(new Date(b.breakOut).getTime() / 1000);

            const diffSeconds = breakOutSec - breakInSec;

            return diffSeconds > 0 ? sum + diffSeconds : sum;
        }, 0);
    }, [currentSessionData.breaks]);

    const handleLogoutPress = () => {
        if (isClockedIn) {
            _showToast(
                AppString.YourWorkSessionIsRunning,
                AppString.error
            );
            return;
        }

        if (loginData?.isOnBreak) {
            _showToast(
                AppString.YourBreakInStillRunning,
                AppString.error
            );
            return;
        }

        if (loginData?.isActive) {
            setModalVisible(true);
        } else {
            // Reset current session when starting new session
            setCurrentSessionData({
                startTime: null,
                endTime: null,
                breaks: []
            });

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

        // First end break if currently on break **
        // if (loginData?.isOnBreak) {
        //     dispatch(
        //         setBreakOut({
        //             employeeId: currentUser.id,
        //             timestamp: new Date().toISOString(),
        //         })
        //     );
        // }

        // Then logout
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

    // Get current session login/logout times
    const currentSessionLoginTime = currentSessionData.startTime;
    const currentSessionLogoutTime = currentSessionData.endTime;

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
            </View>

            <AppText
                txt={loginData?.isActive ? 'Active (Working)' : 'In active'}
                style={[textStyles.bodySmall, { color: loginData?.isActive ? COLORS.success : COLORS.danger, marginTop: vs(5) }]}
            />

            <View style={styles.infoRow}>
                <LogIn size={20} color={COLORS.secondaryPrimary} />
                <Text style={styles.infoLabel}>Login</Text>
                <Text style={styles.infoValue}>
                    {currentSessionLoginTime
                        ? Constants.startEndTime(currentSessionLoginTime)
                        : '--'}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <LogOut size={18} color={COLORS.danger} />
                <Text style={styles.infoLabel}>Logout</Text>
                <Text style={styles.infoValue}>
                    {currentSessionLogoutTime
                        ? Constants.startEndTime(currentSessionLogoutTime)
                        : '--'}
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
                                backgroundColor: loginData?.isOnBreak
                                    ? COLORS.activeRGBA
                                    : isBreakLimitReached
                                        ? COLORS.LightGrayDisable
                                        : COLORS.inActiveRGBA,
                                opacity: (isBreakLimitReached && !loginData?.isOnBreak) ? 0.6 : 1,
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
                </Fragment>
            )}

            {/* Always show total hours - it will show session total when inactive */}
            {loginData?.isActive && currentSessionData.startTime && (
                <Fragment>
                    <View style={[styles.infoRow]}>
                        <Coffee size={20} color={COLORS.warning} />
                        <Text style={styles.infoLabel}>Total Break</Text>
                        <Text style={styles.infoValue}>
                            {totalBreakSeconds > 0 ? Constants.formatHours(totalBreakSeconds) : '0h 0m 0s'}
                        </Text>
                    </View>
                </Fragment>
            )}

            <View style={styles.divider} />

            <View style={styles.infoRow}>
                <Timer size={25} color={COLORS.secondaryPrimary} />
                <Text style={[styles.infoLabel, { color: COLORS.secondaryPrimary, fontWeight: '700' }]}>
                    Total Hours
                </Text>
                <Text style={[styles.totalValue, { color: COLORS.secondaryPrimary }]}>
                    {totalTodaySeconds > 0 ? Constants.formatHours(totalTodaySeconds) : '0h 0m 0s'}
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
    breakToggle: {
        marginTop: vs(12),
        paddingVertical: vs(10),
        paddingHorizontal: fs(12),
        backgroundColor: COLORS.inActiveRGBA,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    breakRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(8),
        paddingHorizontal: fs(12),
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
})

export default ActiveInActive;