import React, { Fragment, useEffect, useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import { Clock, Trash2, Plus, X } from 'lucide-react-native';
import { COLORS } from '../utils/theme';
import { hs, vs } from '../utils/stylesUtils';
import AppButton from '../components/AppButton';
import { adminUpdateAttendance } from '../store/reducers/appDataSlice';
import AppText from '../components/AppText';
import { textStyles } from '../common/CommonStyles';
import { AppString } from '../common/AppString';
import { Constants } from '../common/Constants';
import ConfirmationModal from './ConfirmationModal';
import { _showToast } from '../services/UIS/toastConfig';
import ErrorModal from './ErrorModal';

const EditAttendanceSheet = ({
    visible,
    data,
    onClose
}: any) => {

    const dispatch = useDispatch();

    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [status, setStatus] = useState<'Present' | 'Absent'>('Present');
    const [openPicker, setOpenPicker] = useState<'in' | 'out' | null>(null);
    const [editableBreaks, setEditableBreaks] = useState<any[]>([]);
    const [editingBreakIndex, setEditingBreakIndex] = useState<number | null>(null);
    const [editingBreakType, setEditingBreakType] = useState<'in' | 'out' | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteBreakIndex, setDeleteBreakIndex] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<any>({ inoutValidation: '', invalidTime: '', breakInOut: '' });
    const [visibleErrModal, setVisibleErrModal] = useState(false);

    useEffect(() => {
        if (data) {
            setCheckIn(data.loginTime ? new Date(data.loginTime) : null);
            setCheckOut(data.logoutTime ? new Date(data.logoutTime) : null);
            setStatus(data.status || 'Present');
            setEditableBreaks(data.breaks ? [...data.breaks] : []);
        }
    }, [data]);

    if (!visible || !data) return null;

    const clearErrors = () => {
        setErrorMessage({
            inoutValidation: '',
            invalidTime: '',
        });
    };

    const handleSave = () => {
        clearErrors();

        if (status === 'Present') {
            if (!checkIn || !checkOut) {
                setErrorMessage({
                    inoutValidation: AppString.CheckInOutRequired,
                    invalidTime: '',
                });
                return;
            }

            if (checkOut <= checkIn) {
                setErrorMessage({
                    inoutValidation: '',
                    invalidTime: AppString.CheckoutTimeMustAfterCheckin,
                });
                return;
            }
        }

        _showToast(AppString.EditAttendanceSheet, AppString.success);

        dispatch(
            adminUpdateAttendance({
                employeeId: data.user.id,
                date: data.date,
                loginTime: status === 'Present' ? checkIn?.toISOString() : null,
                logoutTime: status === 'Present' ? checkOut?.toISOString() : null,
                breaks: editableBreaks,
                status,
            })
        );

        clearErrors();
        onClose();
    };


    const handleDeleteBreak = (index: number) => {
        setDeleteBreakIndex(index);
        setModalVisible(true);
    };

    return (
        <Modal visible={visible} transparent animationType="none">
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.container}>
                    <TouchableOpacity
                        style={{ position: 'absolute', right: 15, top: 10 }}
                        onPress={() => { onClose(), clearErrors() }}
                    >
                        <X size={25} />
                    </TouchableOpacity>
                    <AppText
                        txt={AppString.EditAttendance}
                        style={[textStyles.body, { textAlign: 'center', marginBottom: vs(20) }]}
                    />
                    <View style={styles.statusRow}>
                        {[AppString.Present, AppString.Absent].map(item => (
                            <TouchableOpacity
                                key={item}
                                style={[
                                    styles.statusChip,
                                    status === item && styles.activeChip
                                ]}
                                onPress={() => { setStatus(item as any), clearErrors() }}
                            >
                                <AppText
                                    txt={item}
                                    style={[
                                        [textStyles.bodySmall, { color: COLORS.blackColor }],
                                        status === item && { color: COLORS.secondaryPrimary },
                                    ]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {status === 'Present' && (
                        <Fragment>
                            <TouchableOpacity
                                style={styles.timeBox}
                                onPress={() => setOpenPicker('in')}
                            >
                                <Clock size={18} color={COLORS.secondaryPrimary} />
                                <AppText
                                    style={[textStyles.bodySmall, { color: COLORS.blackColor, marginLeft: hs(10) }]}
                                    txt={`${AppString.CheckIn}: ${checkIn
                                        ? Constants.checkinout(checkIn)
                                        : '--'
                                        }`}
                                />
                            </TouchableOpacity>
                            {errorMessage.inoutValidation ? (
                                <AppText
                                    txt={errorMessage.inoutValidation}
                                    style={[textStyles.error, { margin: 2 }]}
                                />
                            ) : null}

                            <TouchableOpacity
                                style={styles.timeBox}
                                onPress={() => setOpenPicker('out')}
                            >
                                <Clock size={18} color={COLORS.danger} />
                                <AppText
                                    style={[textStyles.bodySmall, { color: COLORS.blackColor, marginLeft: hs(10) }]}
                                    txt={`${AppString.CheckOut}: ${checkOut
                                        ? Constants.checkinout(checkOut)
                                        : '--'
                                        }`}
                                />
                            </TouchableOpacity>
                            {errorMessage.invalidTime ? (
                                <AppText
                                    txt={errorMessage.invalidTime}
                                    style={[textStyles.error, { margin: 2 }]}
                                />
                            ) : null}
                        </Fragment>
                    )}

                    {status === 'Present' && editableBreaks.length > 0 && (
                        <View style={{ marginTop: vs(10) }}>
                            <AppText
                                txt={AppString.Breaks}
                                style={[textStyles.primary15, { marginBottom: vs(8) }]}
                            />
                            {editableBreaks.map((br, index) => (
                                <View key={index} style={styles.breakRow}>
                                    <TouchableOpacity
                                        style={styles.breakBox}
                                        onPress={() => {
                                            setEditingBreakIndex(index);
                                            setEditingBreakType('in');
                                        }}
                                    >
                                        <AppText
                                            style={[textStyles.bodySmall, { color: COLORS.blackColor }]}
                                            txt={`${AppString.In}: ${br.breakIn
                                                ? Constants.breakinout(br.breakIn)
                                                : '--'
                                                }`}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.breakBox}
                                        onPress={() => {
                                            setEditingBreakIndex(index);
                                            setEditingBreakType('out');
                                        }}
                                    >
                                        <AppText
                                            style={[textStyles.bodySmall, { color: COLORS.blackColor }]}
                                            txt={`${AppString.Out}: ${br.breakOut
                                                ?
                                                Constants.breakinout(br.breakOut)
                                                : '--'
                                                }`}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.deleteBtn}
                                        onPress={() => handleDeleteBreak(index)}
                                    >
                                        <Trash2 size={16} color={COLORS.danger} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}

                    {errorMessage.breakInOut ? (
                        <AppText
                            txt={errorMessage.breakInOut}
                            style={[textStyles.error, { margin: 2 }]}
                        />
                    ) : null}

                    {status === 'Present' && (
                        <TouchableOpacity
                            style={styles.addBreakBtn}
                            onPress={() => {
                                if (editableBreaks.length >= 5) {
                                    setVisibleErrModal(true);
                                    return;
                                }
                                const newBreak = {
                                    breakIn: null,
                                    breakOut: null,
                                };

                                setEditableBreaks(prev => [...prev, newBreak]);
                                setEditingBreakIndex(editableBreaks.length);
                                setEditingBreakType('in');
                            }}

                        >
                            <Plus size={16} color={COLORS.secondaryPrimary} />
                            <AppText
                                txt={AppString.AddBreak}
                                style={[textStyles.bodySmall, { color: COLORS.secondaryPrimary, marginLeft: hs(6), }]}
                            />
                        </TouchableOpacity>
                    )}

                    <AppButton
                        label={AppString.SaveChanges}
                        style={styles.saveBtn}
                        onPress={handleSave}
                    />
                </Pressable>
            </Pressable>

            <DatePicker
                modal
                open={!!editingBreakType || !!openPicker}
                date={
                    editingBreakIndex !== null && editingBreakType
                        ? editingBreakType === 'in'
                            ? editableBreaks[editingBreakIndex].breakIn
                                ? new Date(editableBreaks[editingBreakIndex].breakIn)
                                : new Date()
                            : editableBreaks[editingBreakIndex].breakOut
                                ? new Date(editableBreaks[editingBreakIndex].breakOut)
                                : new Date()
                        : openPicker === 'in'
                            ? checkIn || new Date()
                            : checkOut || new Date()
                }
                mode="time"
                onConfirm={(date: Date) => {
                    clearErrors();
                    if (editingBreakIndex !== null && editingBreakType) {
                        setEditableBreaks(prev =>
                            prev.map((br, idx) => {
                                if (idx !== editingBreakIndex) return br;
                                if (editingBreakType === 'in') {
                                    return {
                                        ...br,
                                        breakIn: date.toISOString(),
                                    };
                                }
                                if (br.breakIn && date <= new Date(br.breakIn)) {
                                    setErrorMessage({ breakInOut: AppString.BreakOutMustAfterBreakIn })
                                    return br;
                                }
                                return {
                                    ...br,
                                    breakOut: date.toISOString(),
                                };
                            })
                        );

                        setEditingBreakIndex(null);
                        setEditingBreakType(null);
                        return;
                    }
                    openPicker === 'in' ? setCheckIn(date) : setCheckOut(date);
                    setOpenPicker(null);
                }}
                onCancel={() => {
                    setEditingBreakIndex(null);
                    setEditingBreakType(null);
                    setOpenPicker(null);
                }}
            />

            <ConfirmationModal
                visible={modalVisible}
                title={AppString.DelBreak}
                message={AppString.DelBreakConfirmation}
                cancel={AppString.Cancel}
                confirm={AppString.Delete}
                onCancel={() => {
                    setModalVisible(false)
                }}
                onConfirm={() => {
                    if (deleteBreakIndex !== null) {
                        setEditableBreaks(prev =>
                            prev.filter((_, i) => i !== deleteBreakIndex)
                        );
                    }
                    setModalVisible(false);
                    setDeleteBreakIndex(null);
                }}
            />

            <ErrorModal
                visible={visibleErrModal}
                title={AppString.LimitReached}
                message={AppString.LimitReachedMsg}
                cancel={'OK'}
                onCancel={() => {
                    setVisibleErrModal(false)
                }}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end'
    },
    container: {
        backgroundColor: COLORS.card,
        padding: hs(20),
        paddingVertical: vs(30),
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vs(20)
    },
    statusChip: {
        flex: 1,
        marginHorizontal: 6,
        height: vs(38),
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.greyColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    activeChip: {
        backgroundColor: '#EAF2FF',
        borderColor: COLORS.secondaryPrimary
    },
    timeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: vs(48),
        backgroundColor: '#F1F4F8',
        borderRadius: 12,
        paddingHorizontal: hs(14),
        marginBottom: vs(14)
    },
    addBreakBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: vs(40),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.secondaryPrimary,
        marginBottom: vs(10),
        marginTop: vs(10)
    },
    saveBtn: {
        marginTop: vs(20),
        backgroundColor: COLORS.secondaryPrimary
    },
    breakRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vs(10),
        marginTop: vs(5)
    },
    breakBox: {
        flex: 1,
        height: vs(44),
        backgroundColor: '#F1F4F8',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4
    },
    deleteBtn: {
        width: vs(50),
        height: vs(44),
        borderRadius: 10,
        backgroundColor: '#FDECEC',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: hs(4)
    },
});

export default EditAttendanceSheet;