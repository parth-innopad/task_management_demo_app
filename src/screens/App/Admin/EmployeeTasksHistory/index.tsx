import {
    View,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
} from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import ScreenContainer from '../../../../components/ScreenContainer';
import { COLORS } from '../../../../utils/theme';
import AppHeader from '../../../../components/AppHeader';
import { AppString } from '../../../../common/AppString';
import {
    ArrowLeft,
    Clock,
    CalendarIcon,
    Zap,
} from 'lucide-react-native';
import { Calendar } from 'react-native-calendars';
import { Constants } from '../../../../common/Constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import AppText from '../../../../components/AppText';
import { hs, vs } from '../../../../utils/stylesUtils';
import { textStyles } from '../../../../common/CommonStyles';
import AppCard from '../../../../components/AppCard';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import AppAvatar from '../../../../components/AppAvatar';

interface EmployeeTasksHistoryProps {
    navigation: any;
}

const EmployeeTasksHistory: React.FC<EmployeeTasksHistoryProps> = ({
    navigation,
}) => {
    const today = Constants.newDateISOStringSplit;
    const [selectedDate, setSelectedDate] = useState(today);
    const [clockRecords, setClockRecords] = useState<any[]>([]);

    const allEmployees = useSelector(
        (state: RootState) => state.appData.createEmployee
    );
    const loginDataEmployeeAttendance = useSelector(
        (state: RootState) => state.appData.employeeLoginStatus
    );

    const getEmployeeById = (id: string) => allEmployees.find(emp => emp.id === id);

    useFocusEffect(
        useCallback(() => {
            const loadRecords = async () => {
                const stored = await AsyncStorage.getItem('clockRecords_v2');
                if (!stored) {
                    setClockRecords([]);
                    return;
                }

                const parsed = JSON.parse(stored);

                // Map tasks with employee info
                const mapped = parsed.map((task: any) => {
                    const attendanceRecords = Object.values(loginDataEmployeeAttendance || {}).flat();
                    const employeeEntry = attendanceRecords.find(
                        (att: any) =>
                            att.date === moment(task.date, 'DD MMM YYYY').format('YYYY-MM-DD')
                    );

                    let employee = employeeEntry?.user || getEmployeeById(task.id);

                    return {
                        ...task,
                        employee,
                        clockInTime: task.checkInTime,
                        clockOutTime: task.checkOutTime,
                        startDate: moment(task.date, 'DD MMM YYYY').format('YYYY-MM-DD'),
                    };
                });

                setClockRecords(mapped);
            };

            loadRecords();
        }, [loginDataEmployeeAttendance, allEmployees])
    );

    const filteredRecords = useMemo(() => {
        return clockRecords.filter(record => record.startDate === selectedDate);
    }, [clockRecords, selectedDate]);

    const dateMap = useMemo(() => {
        const map: Record<string, any[]> = {};
        clockRecords.forEach(record => {
            if (!record.timestamp) return;
            const d = new Date(record.timestamp);
            const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (!map[date]) map[date] = [];
            map[date].push(record);
        });
        return map;
    }, [clockRecords]);

    const markedDates = useMemo(() => {
        const marks: any = {};
        Object.keys(dateMap).forEach(date => {
            marks[date] = {
                dots: [{
                    color: COLORS.success,
                }],
                marked: true,
                dotColor: COLORS.success,
            };
        });
        marks[selectedDate] = {
            ...(marks[selectedDate] || {}),
            selected: true,
            selectedColor: COLORS.secondaryPrimary
        };
        return marks;
    }, [dateMap, selectedDate]);

    const renderItem = ({ item }: any) => {
        const employee = item?.employee;
        return (
            <AppCard style={styles.card}>
                <View style={styles.taskRow}>
                    <CalendarIcon size={14} color={COLORS.secondaryPrimary} />
                    <AppText
                        txt={item?.startDate}
                        style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary }]}
                    />
                </View>
                <View style={styles.employeeRow}>
                    <AppAvatar uri={employee?.file?.uri} />
                    <View style={styles.employeeInfo}>
                        <AppText
                            txt={employee?.name}
                            style={[textStyles.subtitle, { width: '100%', color: COLORS.blackColor }]}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                        />
                        <AppText
                            txt={`${employee?.fieldLocation}`}
                            style={[textStyles.bodySmall, { marginTop: vs(5) }]}
                        />
                    </View>
                </View>

                <AppText
                    txt={item?.taskTitle}
                    style={[textStyles.body, { marginTop: vs(6), color: COLORS.blackColor }]}
                />

                <View style={styles.timeRow}>
                    <View style={styles.timeItem}>
                        <Clock size={16} color={COLORS.success} />
                        <AppText txt={item?.clockInTime} style={textStyles.bodySmall} />
                    </View>
                    {item?.duration && (
                        <View style={styles.durationItem}>
                            <Zap size={16} color={COLORS.secondaryPrimary} />
                            <AppText txt={item?.duration} style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary }]} />
                        </View>
                    )}
                    <View style={styles.timeItem}>
                        <Clock size={16} color={COLORS.danger} />
                        <AppText txt={item?.clockOutTime || 'Working'} style={textStyles.bodySmall} />
                    </View>
                </View>

                {item?.status && (
                    <View style={styles.footerRow}>
                        <View style={[styles.badge, { backgroundColor: Constants.getStatusColor(item?.status) }]}>
                            <AppText txt={Constants.getStatusLabel(item?.status)} style={[textStyles.bodySmall, { color: COLORS.bg }]} />
                        </View>
                    </View>
                )}
            </AppCard>
        );
    };

    return (
        <ScreenContainer backgroundColor={COLORS.bg}>
            <AppHeader
                title={AppString.EmployeeTasksHistory}
                leftIcon={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={25} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                }
            />

            <Calendar
                markedDates={markedDates}
                onDayPress={(day) =>
                    setSelectedDate(day.dateString)
                }
                theme={{
                    todayTextColor: COLORS.secondaryPrimary,
                    arrowColor: COLORS.secondaryPrimary
                }}
            />

            <FlatList
                data={filteredRecords}
                keyExtractor={(_, i) => i.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: vs(40), marginTop: vs(10) }}
                ListEmptyComponent={
                    <AppText
                        txt={AppString.NoResultsFound}
                        style={[textStyles.emptyText, { textAlign: 'center', marginTop: vs(20) }]}
                    />
                }
            />
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: vs(14),
        padding: hs(14),
        borderRadius: 16,
        marginHorizontal: hs(15)
    },
    employeeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    employeeInfo: {
        marginLeft: hs(12),
        flex: 1,
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: vs(5),
        marginBottom: vs(10),
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(12),
        flexWrap: 'wrap',
        gap: hs(12),
    },
    timeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: hs(6),
    },
    durationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: hs(6),
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: vs(12),
    },
    badge: {
        paddingHorizontal: hs(12),
        paddingVertical: vs(4),
        borderRadius: 20,
    },
});

export default EmployeeTasksHistory;
