import { View, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native'
import React, { useMemo, useState } from 'react'
import ScreenContainer from '../../../../components/ScreenContainer';
import { COLORS } from '../../../../utils/theme';
import AppHeader from '../../../../components/AppHeader';
import { ArrowLeft, Edit, Settings } from 'lucide-react-native';
import { Calendar } from 'react-native-calendars';
import { hs, vs } from '../../../../utils/stylesUtils';
import { Constants } from '../../../../common/Constants';
import AppCard from '../../../../components/AppCard';
import EditAttendanceSheet from '../../../../subviews/EditAttendanceSheet';
import { NavigationKeys } from '../../../../common/NavigationKeys';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import AppText from '../../../../components/AppText';
import { textStyles } from '../../../../common/CommonStyles';
import { AppString } from '../../../../common/AppString';

interface AttendanceProps {
    navigation: any;
}

const Attendance: React.FC<AttendanceProps> = ({ navigation }) => {

    const [state, setState] = useState({
        selectedDate: Constants.newDateISOStringSplit,
        editVisible: false,
        selectedAttendance: null,
    });
    const [expandedBreaks, setExpandedBreaks] = useState<Record<string, boolean>>({});
    const [expandedTotalHours, setExpandedTotalHours] = useState<Record<string, boolean>>({});

    const loginDataEmployeeAttendance = useSelector((state: RootState) => state.appData.employeeLoginStatus);

    const markedDates = React.useMemo(() => {
        const dates: any = {};
        Object.values(loginDataEmployeeAttendance || {}).forEach((records: any[]) => {
            records.forEach(record => {
                dates[record.date] = {
                    marked: true,
                    dotColor: COLORS.success,
                };
            });
        });
        dates[state.selectedDate] = {
            ...(dates[state.selectedDate] || {}),
            selected: true,
            selectedColor: COLORS.secondaryPrimary,
        };
        return dates;
    }, [loginDataEmployeeAttendance, state.selectedDate]);

    const attendanceByDate = React.useMemo(() => {
        const result: any[] = [];
        Object.values(loginDataEmployeeAttendance || {}).forEach((records: any[]) => {
            records.forEach(record => {
                if (record.date === state.selectedDate) {
                    result.push(record);
                }
            });
        });
        return result;
    }, [loginDataEmployeeAttendance, state.selectedDate]);

    const toggleBreaks = (key: string) => {
        setExpandedBreaks(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const toggleTotalHours = (key: string) => {
        setExpandedTotalHours(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const _renderAttendanceItem = ({ item }: any) => {
        const key = `${item.user.id}-${item.date}`;
        const isExpanded = expandedBreaks[key];
        const isExpandedTotalHrs = expandedTotalHours[key];
        const totalBreakSeconds = Constants.getTotalBreakSeconds(item.breaks);
        return (
            <AppCard style={styles.card}>
                <View style={styles.headerRow}>
                    <View style={{ flex: 1 }}>
                        <AppText
                            txt={item.user.name}
                            numberOfLines={1}
                            style={[textStyles.emptyText, {
                                flex: 1,
                                marginRight: hs(8),
                                marginTop: vs(10),
                                marginBottom: vs(5),
                                color: COLORS.blackColor
                            }]}
                        />
                        <AppText
                            txt={item.user.email}
                            style={[textStyles.bodySmall, { marginTop: vs(2) }]}
                        />
                    </View>

                    <View
                        style={[
                            styles.badge,
                            { backgroundColor: item.isActive ? COLORS.success : COLORS.danger }
                        ]}
                    >
                        <AppText style={[textStyles.bodySmall, { color: COLORS.bg }]} txt={item.isActive ? AppString.Active : AppString.InActive} />
                    </View>
                </View>

                <View style={[styles.metaRow, { marginTop: vs(5) }]}>
                    <AppText
                        txt={`📞 +91 ${item.user.phoneNumber}`}
                        style={[textStyles.bodySmall, { marginTop: vs(2) }]}
                    />
                    <AppText
                        txt={`${item.user.role}`}
                        style={[textStyles.bodySmall, { marginTop: vs(2) }]}
                    />
                </View>

                <AppText
                    txt={`${item.user.fieldLocation}`}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    style={[textStyles.bodySmall, { width: '100%', marginTop: vs(15) }]}
                />

                <View style={styles.timeRow}>
                    <View>
                        <AppText txt={AppString.CheckIn} style={[textStyles.bodySmall, { color: COLORS.success }]} />
                        <AppText
                            txt={item.loginTime ? Constants.formatTime(item.loginTime) : '--'}
                            style={[textStyles.bodySmall, { color: COLORS.blackColor, marginTop: vs(5) }]}
                        />
                    </View>

                    <View>
                        <AppText txt={AppString.CheckOut} style={[textStyles.bodySmall, { color: COLORS.danger }]} />
                        <AppText
                            txt={item.logoutTime ? Constants.formatTime(item.logoutTime) : '--'}
                            style={[textStyles.bodySmall, { color: COLORS.blackColor, marginTop: vs(5) }]}
                        />
                    </View>
                </View>

                {item.sessions?.length > 0 && (
                    <View style={[styles.breakSection, { marginTop: vs(20) }]}>
                        <TouchableOpacity
                            style={styles.breakHeader}
                            onPress={() => toggleTotalHours(key)}
                        >
                            <AppText
                                txt={`${AppString.TotalWorkingHoursDetails} (${item.sessions?.length})`}
                                style={[textStyles.bodySmall, { color: COLORS.blackColor }]}
                            />
                            <AppText
                                txt={isExpandedTotalHrs ? '▲' : '▼'}
                                style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary }]}
                            />
                        </TouchableOpacity>

                        {isExpandedTotalHrs &&
                            item.sessions.map((hr: any, index: number) => (
                                <View key={index} style={styles.breakRow}>
                                    <AppText
                                        style={textStyles.bodySmall}
                                        txt={`${Constants.formatTime(hr.loginTime)} → ${Constants.formatTime(hr.logoutTime)}`}
                                    />
                                    <AppText
                                        style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary }]}
                                        txt={`${Constants.formatHours(hr.durationSeconds)}`}
                                    />
                                </View>
                            ))}
                    </View>
                )}

                {item.breaks?.length > 0 && (
                    <View style={styles.breakSection}>
                        <TouchableOpacity
                            style={styles.breakHeader}
                            onPress={() => toggleBreaks(key)}
                        >
                            <AppText
                                txt={`${AppString.BreakDetails} (${item.breaks?.length})`}
                                style={[textStyles.bodySmall, { color: COLORS.blackColor }]}
                            />
                            <AppText
                                txt={isExpanded ? '▲' : '▼'}
                                style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary }]}
                            />
                        </TouchableOpacity>

                        {isExpanded &&
                            item.breaks.map((br: any, index: number) => (
                                <View key={index} style={styles.breakRow}>
                                    <AppText
                                        style={textStyles.bodySmall}
                                        txt={`${Constants.formatTime(br.breakIn)} → ${Constants.formatTime(br.breakOut)}`}
                                    />
                                    <AppText
                                        style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary }]}
                                        txt={Constants.formatHours(Constants.getBreakSeconds(br))}
                                    />
                                </View>
                            ))}
                    </View>
                )}
                <AppText
                    style={[textStyles.bodySmall, { marginTop: vs(15), color: COLORS.secondary }]}
                    txt={`${AppString.BreakHours} :- ${Constants.formatHours(totalBreakSeconds)}`}
                />
                <View style={styles.footerRow}>
                    <AppText
                        style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary }]}
                        txt={`${AppString.TotalWorking} :- ${Constants.formatHours(item.totalWorkSecondsToday)}`}
                    />
                    <TouchableOpacity
                        onPress={() =>
                            setState(prev => ({
                                ...prev,
                                selectedAttendance: item,
                                editVisible: true
                            }))
                        }
                    >
                        <Edit
                            size={18}
                            color={COLORS.secondaryPrimary}
                        />
                    </TouchableOpacity>
                </View>
            </AppCard>
        );
    };

    return (
        <ScreenContainer backgroundColor={COLORS.bg}>
            <AppHeader
                title={AppString.Attendance}
                leftIcon={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={25} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                }
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: vs(50) }}>
                <Calendar
                    markedDates={markedDates}
                    onDayPress={(day) =>
                        setState(prev => ({ ...prev, selectedDate: day.dateString }))
                    }
                    theme={{
                        todayTextColor: COLORS.secondaryPrimary,
                        arrowColor: COLORS.secondaryPrimary
                    }}
                />
                <FlatList
                    data={attendanceByDate}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={_renderAttendanceItem}
                    contentContainerStyle={{ marginTop: vs(10), paddingBottom: vs(50) }}
                    scrollEnabled={false}
                    ListEmptyComponent={
                        <AppText
                            style={[textStyles.emptyText, {
                                textAlign: 'center', marginTop: vs(20)
                            }]}
                            txt={AppString.NoResultsFound}
                        />
                    }
                />
            </ScrollView>

            <EditAttendanceSheet
                visible={state.editVisible}
                data={state.selectedAttendance}
                onClose={() => setState((prev) => ({ ...prev, editVisible: false }))}
            />
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: hs(15),
        paddingTop: vs(10),
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(15)
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: vs(15)
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(10)
    },
    badge: {
        paddingHorizontal: hs(10),
        paddingVertical: vs(4),
        borderRadius: 20
    },
    breakSection: {
        marginTop: vs(15),
        backgroundColor: COLORS.bg,
        padding: hs(10),
        borderRadius: 8
    },
    breakRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(2),
        marginBottom: vs(5)
    },
    breakHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: vs(5),
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(4),
    },
});

export default Attendance;