import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Switch,
    Alert,
} from 'react-native';
import ScreenContainer from '../../../../components/ScreenContainer';
import AppHeader from '../../../../components/AppHeader';
import AppButton from '../../../../components/AppButton';
import DatePicker from 'react-native-date-picker';
import { ArrowLeft, Clock } from 'lucide-react-native';
import { COLORS } from '../../../../utils/theme';
import { fs, hs, vs } from '../../../../utils/stylesUtils';

type PickerType = 'start' | 'end' | 'absent' | null;

interface AttendanceRulesProps {
    navigation: any;
}

const AttendanceRules: React.FC<AttendanceRulesProps> = ({ navigation }: any) => {

    const [rules, setRules] = useState({
        officeStart: new Date(),
        officeEnd: new Date(),
        lateAfterMinutes: 15,
        halfDayHours: 4,
        autoAbsentTime: new Date(),
        autoPresent: true,
        allowManualEdit: true,
        requireEditReason: false,
    });

    const [pickerType, setPickerType] = useState<PickerType>(null);

    const formatTime = (date: Date) =>
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const openPicker = (type: PickerType) => setPickerType(type);
    const closePicker = () => setPickerType(null);

    const onSaveRules = () => {
        Alert.alert('Success', 'Attendance rules saved successfully');
        navigation.goBack();
    };

    const renderTimeRow = (
        label: string,
        value: Date,
        type: PickerType
    ) => (
        <TouchableOpacity style={styles.row} onPress={() => openPicker(type)}>
            <Text style={styles.rowLabel}>{label}</Text>
            <View style={styles.rowRight}>
                <Clock size={16} color={COLORS.greyColor} />
                <Text style={styles.rowValue}>{formatTime(value)}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderSwitchRow = (
        label: string,
        value: boolean,
        onChange: (v: boolean) => void
    ) => (
        <View style={styles.switchRow}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ true: COLORS.secondaryPrimary }}
            />
        </View>
    );

    return (
        <ScreenContainer backgroundColor={COLORS.bg}>
            <AppHeader
                title="Attendance Rules"
                leftIcon={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={25} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                }
            />

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.section}>Work Hours</Text>
                {renderTimeRow('Office Start Time', rules.officeStart, 'start')}
                {renderTimeRow('Office End Time', rules.officeEnd, 'end')}

                <Text style={styles.section}>Late & Half Day Rules</Text>

                <View style={styles.inputRow}>
                    <Text style={styles.rowLabel}>Late After (mins)</Text>
                    <Text style={styles.rowValue}>
                        {rules.lateAfterMinutes}
                    </Text>
                </View>

                <View style={styles.inputRow}>
                    <Text style={styles.rowLabel}>Half Day After (hrs)</Text>
                    <Text style={styles.rowValue}>
                        {rules.halfDayHours}
                    </Text>
                </View>

                <Text style={styles.section}>Auto Attendance</Text>

                {renderSwitchRow(
                    'Auto Mark Present on Check-in',
                    rules.autoPresent,
                    v => setRules(p => ({ ...p, autoPresent: v }))
                )}

                {renderTimeRow(
                    'Auto Mark Absent After',
                    rules.autoAbsentTime,
                    'absent'
                )}

                <Text style={styles.section}>Admin Controls</Text>

                {renderSwitchRow(
                    'Allow Manual Edit',
                    rules.allowManualEdit,
                    v => setRules(p => ({ ...p, allowManualEdit: v }))
                )}

                {renderSwitchRow(
                    'Require Reason for Edit',
                    rules.requireEditReason,
                    v => setRules(p => ({ ...p, requireEditReason: v }))
                )}

                <AppButton
                    label="Save Attendance Rules"
                    style={{ marginTop: vs(30) }}
                    onPress={onSaveRules}
                />
            </ScrollView>

            {pickerType && (
                <DatePicker
                    modal
                    open
                    mode="time"
                    date={
                        pickerType === 'start'
                            ? rules.officeStart
                            : pickerType === 'end'
                                ? rules.officeEnd
                                : rules.autoAbsentTime
                    }
                    onConfirm={date => {
                        if (pickerType === 'start')
                            setRules(p => ({ ...p, officeStart: date }));
                        if (pickerType === 'end')
                            setRules(p => ({ ...p, officeEnd: date }));
                        if (pickerType === 'absent')
                            setRules(p => ({ ...p, autoAbsentTime: date }));
                        closePicker();
                    }}
                    onCancel={closePicker}
                />
            )}
        </ScreenContainer>
    );
};

export default AttendanceRules;

const styles = StyleSheet.create({
    container: {
        padding: hs(16),
        paddingBottom: vs(40),
    },
    section: {
        fontSize: fs(14),
        fontWeight: '700',
        color: COLORS.blackColor,
        marginTop: vs(20),
        marginBottom: vs(10),
    },
    row: {
        height: vs(52),
        backgroundColor: COLORS.card,
        borderRadius: 12,
        paddingHorizontal: hs(14),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    inputRow: {
        height: vs(52),
        backgroundColor: COLORS.card,
        borderRadius: 12,
        paddingHorizontal: hs(14),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    switchRow: {
        height: vs(52),
        backgroundColor: COLORS.card,
        borderRadius: 12,
        paddingHorizontal: hs(14),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    rowLabel: {
        fontSize: fs(14),
        color: COLORS.blackColor,
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    rowValue: {
        fontSize: fs(14),
        color: COLORS.greyColor,
    },
});
