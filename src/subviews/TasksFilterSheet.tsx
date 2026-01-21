import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { COLORS } from '../utils/theme';
import { fs, hs, vs } from '../utils/stylesUtils';
import { X } from 'lucide-react-native';
import { AppString } from '../common/AppString';

const STATUS = ['all', 'Pending', 'In Progress', 'Completed'];

const TasksFilterSheet = ({
    visible,
    onClose,
    employees = [],
    onApply,
    filters,
    setFilters,
    DEFAULT_FILTERS
}: any) => {

    const [openStartPicker, setOpenStartPicker] = useState(false);
    const [openEndPicker, setOpenEndPicker] = useState(false);

    const Chip = ({ label, active, onPress }: any) => (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.chip, active && styles.chipActive]}
        >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const formatDate = (date: Date | null) =>
        date ? date.toDateString() : 'Select';

    const handleReset = () => {
        const resetFilters = { ...DEFAULT_FILTERS };
        setFilters(resetFilters);
        onApply(resetFilters);
        onClose();
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="none">
            <Pressable style={styles.overLay} onPress={onClose}>
                <Pressable style={styles.container}>
                    <View style={{ marginBottom: vs(18), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.title}>{AppString.FilterTasks}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={25} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.section}>{AppString.Status}</Text>
                    <View style={styles.rowWrap}>
                        {STATUS.map(s => (
                            <Chip
                                key={s}
                                label={s.replace('_', ' ')}
                                active={filters.status === s}
                                onPress={() =>
                                    setFilters((prev: any) => ({ ...prev, status: s }))
                                }
                            />
                        ))}
                    </View>

                    <Text style={styles.section}>{AppString.DateRange}</Text>
                    <View style={styles.dateRow}>
                        <TouchableOpacity
                            style={styles.dateBox}
                            onPress={() => setOpenStartPicker(true)}
                        >
                            <Text style={styles.dateLabel}>{AppString.From}</Text>
                            <Text style={styles.dateValue}>
                                {formatDate(filters.startDate)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.dateBox}
                            onPress={() => setOpenEndPicker(true)}
                        >
                            <Text style={styles.dateLabel}>{AppString.To}</Text>
                            <Text style={styles.dateValue}>
                                {formatDate(filters.endDate)}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.section}>{AppString.Employee}</Text>
                    <View style={styles.rowWrap}>
                        <Chip
                            label={AppString.All}
                            active={filters.employeeId === 'all'}
                            onPress={() =>
                                setFilters((prev: any) => ({
                                    ...prev,
                                    employeeId: 'all',
                                }))
                            }
                        />
                        {employees.map((emp: any) => {
                            return (
                                <Chip
                                    key={emp.id}
                                    label={emp.name}
                                    active={
                                        filters.employeeId === String(emp.id)
                                    }
                                    onPress={() =>
                                        setFilters((prev: any) => ({
                                            ...prev,
                                            employeeId: String(emp.id),
                                        }))
                                    }
                                />
                            )
                        })}
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.resetBtn}
                            onPress={handleReset}
                        >
                            <Text style={styles.resetText}>{AppString.Reset}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.applyBtn}
                            onPress={handleApply}
                        >
                            <Text style={styles.applyText}>{AppString.Apply}</Text>
                        </TouchableOpacity>
                    </View>

                    <DatePicker
                        modal
                        open={openStartPicker}
                        date={filters.startDate || new Date()}
                        mode="date"
                        onConfirm={date => {
                            setFilters((prev: any) => ({ ...prev, startDate: date }));
                            setOpenStartPicker(false);
                        }}
                        onCancel={() => setOpenStartPicker(false)}
                    />

                    <DatePicker
                        modal
                        open={openEndPicker}
                        date={filters.endDate || new Date()}
                        mode="date"
                        onConfirm={date => {
                            setFilters((prev: any) => ({ ...prev, endDate: date }));
                            setOpenEndPicker(false);
                        }}
                        onCancel={() => setOpenEndPicker(false)}
                    />
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default TasksFilterSheet;

const styles = StyleSheet.create({
    overLay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: COLORS.card,
        paddingHorizontal: hs(20),
        paddingTop: vs(20),
        paddingBottom: vs(30),
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
    },
    title: {
        fontSize: fs(20),
        fontWeight: '700',
        color: COLORS.blackColor,
    },
    section: {
        fontSize: fs(14),
        fontWeight: '600',
        color: COLORS.blackColor,
        marginBottom: vs(10),
        marginTop: vs(15),
    },
    rowWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingHorizontal: hs(14),
        paddingVertical: vs(8),
        borderRadius: 20,
        backgroundColor: '#F1F4F8',
    },
    chipActive: {
        backgroundColor: COLORS.secondaryPrimary,
    },
    chipText: {
        fontSize: fs(13),
        color: COLORS.greyColor,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    chipTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(6),
    },
    dateBox: {
        width: '48%',
        backgroundColor: '#F1F4F8',
        borderRadius: 12,
        padding: hs(12),
    },
    dateLabel: {
        fontSize: fs(12),
        color: COLORS.greyColor,
    },
    dateValue: {
        fontSize: fs(14),
        fontWeight: '600',
        marginTop: vs(4),
        color: COLORS.blackColor,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(26),
    },
    resetBtn: {
        width: '45%',
        height: vs(48),
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.greyColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resetText: {
        fontSize: fs(14),
        fontWeight: '600',
        color: COLORS.greyColor,
    },
    applyBtn: {
        width: '45%',
        height: vs(48),
        borderRadius: 12,
        backgroundColor: COLORS.secondaryPrimary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    applyText: {
        fontSize: fs(14),
        fontWeight: '700',
        color: '#fff',
    },
});
