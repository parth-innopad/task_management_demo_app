import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS } from '../utils/theme';
import { fs, hs, vs } from '../utils/stylesUtils';
import { TaskData, TaskStatus_Type } from '../types/taskTypes';
import AppCard from './AppCard';
import { Constants } from '../common/Constants';

interface TaskItemProps {
    task: TaskData;
    onPress?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onPress }) => {
    const status = task.status as TaskStatus_Type;

    const getTaskOpacity = (status: TaskStatus_Type): number => {
        return status === 'Completed' ? 0.6 : 1;
    };

    const getDateDisplay = (): string => {
        if (task.startDateTime && task.endDateTime) {
            return `${Constants.taskItemFormatDate(task.startDateTime)} - ${Constants.taskItemFormatDate(task.endDateTime)}`;
        } else if (task.startDateTime) {
            return Constants.taskItemFormatDate(task.startDateTime);
        }
        return '';
    };

    const cardStyle: ViewStyle = {
        opacity: getTaskOpacity(status),
    };

    return (
        <AppCard style={cardStyle} onPress={onPress}>
            <View style={styles.container}>
                {/* Title and Status Badge */}
                <View style={styles.headerRow}>
                    <View style={styles.titleContainer}>
                        <Text
                            style={[
                                styles.title,
                                status === 'Completed' && styles.completedText
                            ]}
                            numberOfLines={2}
                        >
                            {task.taskTitle}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: Constants.getStatusBgColor(status) }
                        ]}
                    >
                        <Text
                            style={[
                                styles.statusText,
                                { color: Constants.getStatusStyle(status).text }
                            ]}
                        >
                            {status}
                        </Text>
                    </View>
                </View>

                {/* Description */}
                {task.taskDescription && (
                    <Text
                        style={[
                            styles.description,
                            status === 'Completed' && { color: COLORS.textLight }
                        ]}
                        numberOfLines={2}
                    >
                        {task.taskDescription}
                    </Text>
                )}

                {/* Details Row */}
                <View style={styles.detailsRow}>
                    {/* Date */}
                    {getDateDisplay() && (
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Date</Text>
                            <Text style={[styles.detailValue, status === 'Completed' && { color: COLORS.textLight }]}>
                                {getDateDisplay()}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Location */}
                {task.location && (
                    <View style={styles.locationRow}>
                        <Text style={styles.detailLabel}>Location</Text>
                        <Text
                            style={[
                                styles.locationText,
                                status === 'Completed' && { color: COLORS.textLight }
                            ]}
                            numberOfLines={1}
                        >
                            📍 {task.location}
                        </Text>
                    </View>
                )}
            </View>
        </AppCard>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: vs(10),
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: hs(15),
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: fs(18),
        fontWeight: '600',
        color: COLORS.text,
    },
    completedText: {
        color: COLORS.textLight,
        textDecorationLine: 'line-through',
    },
    statusBadge: {
        paddingVertical: vs(5),
        paddingHorizontal: hs(10),
        borderRadius: 20,
        minWidth: hs(90),
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        fontSize: fs(14),
        fontWeight: '600',
    },
    description: {
        fontSize: fs(14),
        color: COLORS.textLight,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: hs(16),
        flexWrap: 'wrap',
    },
    detailItem: {
        gap: vs(4),
    },
    detailLabel: {
        fontSize: fs(14),
        color: COLORS.textLight,
        fontWeight: '500',
        textTransform: 'uppercase',
    },
    priorityBadge: {
        borderWidth: 1,
        paddingVertical: vs(3),
        paddingHorizontal: hs(8),
        borderRadius: RADIUS.sm,
    },
    priorityText: {
        fontSize: fs(14),
        fontWeight: '600',
    },
    detailValue: {
        fontSize: fs(14),
        color: COLORS.text,
        fontWeight: '500',
    },
    locationRow: {
        gap: vs(4),
    },
    locationText: {
        fontSize: fs(14),
        color: COLORS.text,
        fontWeight: '500',
    },
});

export default TaskItem;
