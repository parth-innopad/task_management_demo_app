import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native'
import React, { Fragment, useMemo, useState } from 'react'
import { Calendar } from 'react-native-calendars'
import ScreenContainer from '../../../../components/ScreenContainer'
import AppHeader from '../../../../components/AppHeader'
import { COLORS } from '../../../../utils/theme'
import { fs, hs, vs } from '../../../../utils/stylesUtils'
import { ArrowLeft, Clock } from 'lucide-react-native'
import AppCard from '../../../../components/AppCard'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../store'
import { Constants } from '../../../../common/Constants'
import AppText from '../../../../components/AppText'
import { textStyles } from '../../../../common/CommonStyles'
import { AppString } from '../../../../common/AppString'

interface EmployeeAttendanceProps {
    navigation: any;
}

const EmployeeAttendance: React.FC<EmployeeAttendanceProps> = ({ navigation }: any) => {
    const today = Constants.newDateISOStringSplit;

    const [selectedDate, setSelectedDate] = useState(today);
    const [showBreaks, setShowBreaks] = useState(false);
    const [showTotalHours, setShowTotalHours] = useState(false);

    const currentUser = useSelector(
        (state: RootState) => state.appData.saveUser
    )
    const loginData = useSelector(
        (state: RootState) =>
            state.appData.employeeLoginStatus[currentUser?.id]
    )

    const dateMap = useMemo(() => {
        if (!Array.isArray(loginData)) return {}
        return loginData.reduce((acc: any, item: any) => {
            acc[item.date] = item
            return acc
        }, {})
    }, [loginData]);

    const markedDates = useMemo(() => {
        const marks: any = {}
        Object.keys(dateMap).forEach(date => {
            marks[date] = {
                marked: true,
                dotColor: COLORS.success,
            }
        })
        if (selectedDate) {
            marks[selectedDate] = {
                ...(marks[selectedDate] || {}),
                selected: true,
                selectedColor: COLORS.secondaryPrimary,
            }
        }
        return marks;
    }, [dateMap, selectedDate]);

    const dayAttendance = dateMap[selectedDate];

    const totalBreakSecondsToday = useMemo(() => {
        if (!dayAttendance || !dayAttendance.breaks?.length) return 0;

        return dayAttendance.breaks.reduce((sum: number, b: any) => {
            if (!b.breakOut || !b.breakIn) return sum;

            const breakInMs = new Date(b.breakIn).getTime();
            const breakOutMs = new Date(b.breakOut).getTime();

            const diffSeconds = Math.floor((breakOutMs - breakInMs) / 1000);

            return diffSeconds > 0 ? sum + diffSeconds : sum;
        }, 0);
    }, [dayAttendance]);

    return (
        <ScreenContainer backgroundColor={COLORS.bg}>
            <AppHeader
                title={AppString.MyAttendance}
                leftIcon={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                }
            />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: vs(50) }}>
                <Calendar
                    markedDates={markedDates}
                    onDayPress={day => {
                        setSelectedDate(day.dateString)
                        setShowBreaks(false)
                        setShowTotalHours(false)
                    }}
                    theme={{
                        todayTextColor: COLORS.secondaryPrimary,
                        arrowColor: COLORS.secondaryPrimary,
                    }}
                />
                {!dayAttendance ? (
                    <AppText
                        txt={AppString.NoAttendanceFoundForThisDate}
                        style={[textStyles.body, {
                            textAlign: 'center',
                            marginTop: vs(30),
                            color: COLORS.greyColor
                        }]}
                    />
                ) : (
                    <AppCard style={styles.card}>
                        <AppText
                            txt={dayAttendance.user?.name}
                            style={[textStyles.subtitle, {
                                color: COLORS.secondaryPrimary,
                                marginBottom: vs(12),
                            }]}
                        />

                        <View style={styles.rowBetween}>
                            <View style={styles.timeBlock}>
                                <AppText
                                    txt={AppString.CheckIn}
                                    style={textStyles.bodySmall}
                                />
                                <AppText
                                    txt={Constants.formatTime(dayAttendance.loginTime)}
                                    style={[textStyles.primary15, { marginTop: vs(4), color: '#1B1D28' }]}
                                />
                            </View>

                            <View style={styles.timeBlock}>
                                <AppText
                                    txt={AppString.CheckOut}
                                    style={textStyles.bodySmall}
                                />
                                <AppText
                                    txt={Constants.formatTime(dayAttendance.logoutTime)}
                                    style={[textStyles.primary15, { marginTop: vs(4), color: '#1B1D28' }]}
                                />
                            </View>
                        </View>

                        <View style={styles.summaryRow}>
                            <View style={styles.summaryItem}>
                                <AppText
                                    txt={AppString.TotalWorking}
                                    style={textStyles.bodySmall}
                                />
                                <AppText
                                    txt={Constants.formatHours(dayAttendance.totalWorkSecondsToday)}
                                    style={[textStyles.primary15, { marginTop: vs(4), color: COLORS.secondaryPrimary }]}
                                />
                            </View>

                            <View style={styles.summaryItem}>
                                <AppText
                                    txt={AppString.BreakHours}
                                    style={textStyles.bodySmall}
                                />
                                <AppText
                                    // txt={Constants.formatHours(dayAttendance.totalBreakSecondsToday)}
                                    txt={Constants.formatHours(totalBreakSecondsToday)}
                                    style={[textStyles.primary15, { marginTop: vs(4), color: COLORS.secondaryPrimary }]}
                                />
                            </View>
                        </View>

                        {dayAttendance.sessions?.length > 0 && (
                            <Fragment>
                                <TouchableOpacity
                                    style={styles.breakToggle}
                                    onPress={() =>
                                        setShowTotalHours(prev => !prev)
                                    }>
                                    <AppText
                                        txt={`${AppString.TotalWorkingHoursDetails} (${dayAttendance.sessions.length})`}
                                        style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary }]}
                                    />
                                    <AppText
                                        txt={showTotalHours ? '▲' : '▼'}
                                        style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary }]}
                                    />
                                </TouchableOpacity>

                                {showTotalHours &&
                                    dayAttendance.sessions?.map(
                                        (s: any, i: number) => (
                                            <View key={i} style={styles.breakRow}>
                                                <View style={styles.breakLeft}>
                                                    <Clock
                                                        size={15}
                                                        color={COLORS.secondaryPrimary}
                                                    />
                                                    <AppText
                                                        txt={`${Constants.formatTime(s.loginTime)} → ${Constants.formatTime(s.logoutTime)}`}
                                                        style={[textStyles.bodySmall, { color: '#1B1D28' }]}
                                                    />
                                                </View>
                                                <AppText
                                                    txt={`${Constants.formatHours(s.durationSeconds)}`}
                                                    style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary }]}
                                                />
                                            </View>
                                        )
                                    )}
                            </Fragment>
                        )}

                        {dayAttendance.breaks?.length > 0 && (
                            <Fragment>
                                <TouchableOpacity
                                    style={styles.breakToggle}
                                    onPress={() =>
                                        setShowBreaks(prev => !prev)
                                    }>
                                    <AppText
                                        txt={`${AppString.BreakDetails} (${dayAttendance.breaks.length})`}
                                        style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary }]}
                                    />
                                    <AppText
                                        txt={showBreaks ? '▲' : '▼'}
                                        style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary }]}
                                    />
                                </TouchableOpacity>

                                {showBreaks &&
                                    dayAttendance.breaks.map(
                                        (b: any, i: number) => (
                                            <View key={i} style={styles.breakRow}>
                                                <View style={styles.breakLeft}>
                                                    <Clock
                                                        size={15}
                                                        color={COLORS.secondaryPrimary}
                                                    />
                                                    <AppText
                                                        txt={`${Constants.formatTime(b.breakIn)} → ${Constants.formatTime(b.breakOut)}`}
                                                        style={[textStyles.bodySmall, { color: '#1B1D28' }]}
                                                    />
                                                </View>
                                                <AppText
                                                    // txt={`${Constants.formatHours(b.durationSeconds)}`}
                                                    txt={Constants.formatHours(Constants.getBreakSeconds(b))}
                                                    style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary }]}
                                                />
                                            </View>
                                        )
                                    )}
                            </Fragment>
                        )}
                    </AppCard>
                )}
            </ScrollView>
        </ScreenContainer>
    )
}

export default EmployeeAttendance;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: hs(15),
        marginTop: vs(10),
        paddingBottom: vs(50),
    },
    card: {
        marginHorizontal: hs(15),
        marginTop: vs(20),
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeBlock: {
        width: '48%',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(14),
        paddingTop: vs(12),
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    summaryItem: {
        width: '48%',
    },
    breakToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: vs(16),
        paddingTop: vs(12),
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    breakRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: vs(8),
        padding: hs(10),
        backgroundColor: '#F8FAFC',
        borderRadius: 10,
    },
    breakLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: hs(6),
    }
});