import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';
import { COLORS, RADIUS } from '../utils/theme';
import { fs, hs, vs } from '../utils/stylesUtils';
import { TaskData } from '../types/taskTypes';
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle2, X } from 'lucide-react-native';
import AppText from '../components/AppText';
import { textStyles } from '../common/CommonStyles';
import { AppString } from '../common/AppString';
import { Constants } from '../common/Constants';

interface EmployeeTaskDetailModalProps {
    visible: boolean;
    task: TaskData | any;
    onClose: () => void;
}

const EmployeeTaskDetailModal: React.FC<EmployeeTaskDetailModalProps> = ({
    visible,
    task,
    onClose,
}) => {

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'Completed':
                return <CheckCircle2 size={20} color={Constants.getStatusStyle(status).text} />;
            case 'In Progress':
                return <Clock size={20} color={Constants.getStatusStyle(status).text} />;
            default:
                return <AlertCircle size={20} color={Constants.getStatusStyle('').text} />;
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <AppText
                                txt='Task Details'
                                style={[textStyles.subtitle, { color: COLORS.text }]}
                            />
                            <TouchableOpacity onPress={onClose}>
                                <X size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.section}>
                            <AppText
                                txt={task?.taskTitle}
                                style={[textStyles.heading, { color: COLORS.text }]}
                            />
                        </View>

                        <View style={styles.statusPriorityRow}>
                            <View style={[styles.statusBadge, { backgroundColor: Constants.getStatusBgColor(task?.status) }]}>
                                {getStatusIcon(task?.status)}
                                <AppText
                                    txt={task?.status}
                                    style={[textStyles.bodySmall, { color: Constants.getStatusStyle(task?.status).text }]}
                                />
                            </View>
                        </View>

                        {task?.taskDescription && (
                            <View style={styles.section}>
                                <AppText
                                    txt={AppString.Description}
                                    style={[textStyles.primary13, {
                                        color: COLORS.textLight,
                                        marginBottom: vs(10)
                                    }]}
                                />
                                <AppText
                                    txt={task?.taskDescription}
                                    style={[textStyles.bodySmall, {
                                        color: COLORS.text,
                                        lineHeight: 22,
                                    }]}
                                />
                            </View>
                        )}

                        <View style={styles.section}>
                            <AppText
                                txt={AppString.TimeLine}
                                style={[textStyles.primary13, {
                                    color: COLORS.textLight,
                                    marginBottom: vs(10)
                                }]}
                            />
                            <View style={styles.timelineContainer}>
                                <View style={styles.timelineItem}>
                                    <View style={styles.timelineIcon}>
                                        <Calendar size={16} color={COLORS.secondaryPrimary} />
                                    </View>
                                    <View style={styles.timelineContent}>
                                        <AppText
                                            txt={AppString.Start}
                                            style={[textStyles.primary13, {
                                                color: COLORS.textLight,
                                                marginBottom: vs(2),
                                            }]}
                                        />
                                        <AppText
                                            txt={`${Constants.empTaskDetailFormatDate(task?.startDateTime)} at ${Constants.empTaskDetailFormatTime(task?.startDateTime)}`}
                                            style={[textStyles.primary13, { color: COLORS.text }]}
                                        />
                                    </View>
                                </View>

                                <View style={styles.timelineItem}>
                                    <View style={styles.timelineIcon}>
                                        <Clock size={16} color={COLORS.danger} />
                                    </View>
                                    <View style={styles.timelineContent}>
                                        <AppText
                                            txt={AppString.End}
                                            style={[textStyles.primary13, {
                                                color: COLORS.textLight,
                                                marginBottom: vs(2),
                                            }]}
                                        />
                                        <AppText
                                            txt={`${Constants.empTaskDetailFormatDate(task?.endDateTime)} at ${Constants.empTaskDetailFormatTime(task?.endDateTime)}`}
                                            style={[textStyles.primary13, { color: COLORS.text }]}
                                        />
                                    </View>
                                </View>

                                <View style={styles.timelineItem}>
                                    <View style={styles.timelineIcon}>
                                        <Clock size={16} color={Constants.getStatusStyle(task?.status).text} />
                                    </View>
                                    <View style={styles.timelineContent}>
                                        <AppText
                                            txt={AppString.TimeRemaining}
                                            style={[textStyles.primary13, {
                                                color: COLORS.textLight,
                                                marginBottom: vs(2),
                                            }]}
                                        />
                                        <AppText
                                            txt={Constants.calculateTimeRemaining(task?.endDateTime)}
                                            style={[textStyles.primary13, { color: Constants.getStatusStyle(task?.status).text }]}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <AppText
                                txt={AppString.AssignedTo}
                                style={[textStyles.primary13, {
                                    color: COLORS.textLight,
                                    marginBottom: vs(10),
                                }]}
                            />
                            <AppText
                                txt={task?.employeeSelect || 'N/A'}
                                style={[textStyles.bodySmall, {
                                    color: COLORS.text,
                                    paddingHorizontal: hs(12),
                                    paddingVertical: vs(10),
                                    backgroundColor: COLORS.card,
                                    borderRadius: RADIUS.md,
                                }]}
                            />
                        </View>
                        <View style={styles.bottomSpacer} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: COLORS.bg,
        borderTopLeftRadius: RADIUS.lg,
        borderTopRightRadius: RADIUS.lg,
        maxHeight: '90%',
        paddingTop: 0,
    },
    header: {
        paddingHorizontal: hs(20),
        paddingVertical: vs(16),
        backgroundColor: COLORS.card,
        borderTopLeftRadius: RADIUS.lg,
        borderTopRightRadius: RADIUS.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    closeButton: {
        padding: hs(8),
    },
    scrollView: {
        paddingHorizontal: hs(20),
        paddingTop: vs(20),
    },
    section: {
        marginBottom: vs(20),
    },
    statusPriorityRow: {
        flexDirection: 'row',
        gap: hs(12),
        marginBottom: vs(15),
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: hs(12),
        paddingVertical: vs(8),
        borderRadius: RADIUS.md,
        gap: hs(6),
    },
    timelineContainer: {
        gap: vs(12),
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: hs(12),
        paddingHorizontal: hs(12),
        paddingVertical: vs(12),
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.md,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.secondaryPrimary,
    },
    timelineIcon: {
        marginTop: vs(2),
    },
    timelineContent: {
        flex: 1,
    },
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: hs(8),
        marginBottom: vs(8),
    },
    bottomSpacer: {
        height: vs(20),
    },
    closeModalButton: {
        marginHorizontal: hs(20),
        marginVertical: vs(16),
        paddingVertical: vs(14),
        backgroundColor: COLORS.secondaryPrimary,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    closeModalButtonText: {
        fontSize: fs(16),
        fontWeight: '700',
        color: COLORS.card,
    },
});

export default EmployeeTaskDetailModal;
