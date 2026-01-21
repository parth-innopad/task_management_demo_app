import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React, { useMemo, useState } from 'react'
import ScreenContainer from '../../../../components/ScreenContainer';
import { COLORS } from '../../../../utils/theme';
import AppHeader from '../../../../components/AppHeader';
import { ArrowLeft, CalendarIcon, Clock, Zap } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import AppCard from '../../../../components/AppCard';
import { Constants } from '../../../../common/Constants';
import { fs, hs, vs } from '../../../../utils/stylesUtils';
import AppText from '../../../../components/AppText';
import { textStyles } from '../../../../common/CommonStyles';
import { AppString } from '../../../../common/AppString';

interface EmployeeTasksSummaryProps {
    navigation: any;
}

const EmployeeTasksSummary: React.FC<EmployeeTasksSummaryProps> = ({ navigation }) => {

    const today = Constants.newDateISOStringSplit;

    const [selectedDate, setSelectedDate] = useState(today);
    const [clockRecords, setClockRecords] = useState<any[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            const loadRecords = async () => {
                const stored = await AsyncStorage.getItem('clockRecords_v2')
                if (stored) {
                    setClockRecords(JSON.parse(stored))
                }
            }
            loadRecords()
        }, [])
    )

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
        const marks: any = {}
        Object.keys(dateMap).forEach(date => {
            marks[date] = {
                dots: [{ color: COLORS.success }]
            }
        })
        marks[selectedDate] = {
            ...(marks[selectedDate] || {}),
            selected: true,
            selectedColor: COLORS.secondaryPrimary
        }
        return marks
    }, [dateMap, selectedDate]);

    const filteredList = useMemo(() => {
        return dateMap[selectedDate] || []
    }, [dateMap, selectedDate]);

    return (
        <ScreenContainer backgroundColor={COLORS.bg}>
            <AppHeader
                title={AppString.TasksSummary}
                leftIcon={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                }
            />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: vs(50) }}>
                <Calendar
                    markingType="multi-dot"
                    markedDates={markedDates}
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                    theme={{
                        todayTextColor: COLORS.secondaryPrimary,
                        arrowColor: COLORS.secondaryPrimary,
                    }}
                />
                {filteredList.length === 0 ? (
                    <AppText
                        txt={AppString.NotFoundAnyTaskSummary}
                        style={[textStyles.emptyText, { textAlign: 'center', marginTop: vs(20) }]}
                    />
                ) : (
                    filteredList.map((item, index) => {
                        // if (!item.taskTitle) return null;
                        return (
                            <AppCard key={index} style={styles.card}>
                                <View style={styles.dateSection}>
                                    <CalendarIcon size={14} color={COLORS.secondaryPrimary} />
                                    <AppText
                                        txt={selectedDate}
                                        style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary }]}
                                    />
                                </View>

                                <View style={styles.rowBetween}>
                                    <Text style={styles.taskTitle}>{item.taskTitle}</Text>
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            { backgroundColor: Constants.getStatusColor(item.status) }
                                        ]}
                                    >
                                        <Text style={styles.statusText}>
                                            {Constants.getStatusLabel(item.status)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.timeRow}>
                                    <View style={styles.timeItem}>
                                        <Clock size={14} color={COLORS.success} />
                                        <AppText
                                            txt={item.checkInTime}
                                            style={textStyles.bodySmall}
                                        />
                                    </View>

                                    <View style={styles.timeItem}>
                                        <Zap size={14} color={COLORS.secondaryPrimary} />
                                        <AppText
                                            txt={item.duration}
                                            style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary }]}
                                        />
                                    </View>

                                    <View style={styles.timeItem}>
                                        <Clock size={14} color={COLORS.danger} />
                                        <AppText
                                            txt={item.checkOutTime}
                                            style={textStyles.bodySmall}
                                        />
                                    </View>
                                </View>
                            </AppCard>
                        )
                    })
                )}
            </ScrollView>
        </ScreenContainer>
    )
}

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
    dateSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: hs(6),
        marginBottom: vs(6),
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: vs(5)
    },
    taskTitle: {
        fontSize: fs(16),
        fontWeight: '700',
        color: '#1B1D28',
        maxWidth: '65%',
    },
    statusBadge: {
        paddingHorizontal: hs(12),
        paddingVertical: vs(5),
        borderRadius: 999,
    },
    statusText: {
        fontSize: fs(12),
        fontWeight: '700',
        color: '#fff',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(12),
    },
    timeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: hs(6),
    },
    durationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: hs(6),
        marginTop: vs(10),
        paddingTop: vs(10),
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
})

export default EmployeeTasksSummary;