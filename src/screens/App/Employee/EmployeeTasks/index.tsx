import React, { useMemo, useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import ScreenContainer from "../../../../components/ScreenContainer";
import AppHeader from "../../../../components/AppHeader";
import TaskItem from "../../../../components/TaskItem";
import EmployeeTaskDetailModal from "../../../../subviews/EmployeeTaskDetailModal";
import { COLORS, SPACING, RADIUS } from "../../../../utils/theme";
import { fs, hs, vs } from "../../../../utils/stylesUtils";
import { TaskData, TaskStatus_Type } from "../../../../types/taskTypes";
import { RootState } from "../../../../store";
import { ArrowLeft } from "lucide-react-native";
import AppText from "../../../../components/AppText";
import { textStyles } from "../../../../common/CommonStyles";
import { AppString } from "../../../../common/AppString";

interface EmployeeTasksProps {
    navigation?: any;
}

const EmployeeTasks: React.FC<EmployeeTasksProps> = ({ navigation }) => {

    const [selectedStatus, setSelectedStatus] = useState<TaskStatus_Type | 'All' | any>('All');
    const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
    const [showTaskDetail, setShowTaskDetail] = useState(false);

    const allTasks = useSelector((state: RootState) => state.appData.tasks);
    const currentUser = useSelector((state: RootState) => state.appData.saveUser);

    useEffect(() => {
        setSelectedStatus(AppString.All);
    }, []);

    const sortedTasks = useMemo(() => {
        let employeeTasks = allTasks.filter(
            (task) => task.employeeSelectId === currentUser?.id || task.employeeSelect === currentUser?.id
        );

        if (selectedStatus !== 'All') {
            employeeTasks = employeeTasks.filter(
                (task) => task.status === selectedStatus
            );
        }

        const statusOrder = {
            'In Progress': 0,
            'Pending': 1,
            'Completed': 2,
        };

        return [...employeeTasks].sort((a, b) => {
            const statusA = a.status as TaskStatus_Type;
            const statusB = b.status as TaskStatus_Type;
            const orderA = statusOrder[statusA] ?? 999;
            const orderB = statusOrder[statusB] ?? 999;
            return orderA - orderB;
        });
    }, [allTasks, currentUser?.id, selectedStatus]);

    const handleTaskPress = (task: TaskData) => {
        setSelectedTask(task);
        setShowTaskDetail(true);
    };

    const renderStatusFilter = () => {
        const statuses: (TaskStatus_Type | 'All')[] = ['In Progress', 'Pending', 'Completed', 'All'];

        return (
            <View style={styles.filterContainer}>
                {statuses.map((status) => {
                    const isSelected = selectedStatus === status;
                    const statusColors: Record<TaskStatus_Type | 'All', string> = {
                        'In Progress': '#F9A825',
                        'Pending': '#1565C0',
                        'Completed': '#2E7D32',
                        'All': COLORS.secondaryPrimary,
                    };

                    return (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.filterButton,
                                isSelected && [
                                    styles.filterButtonActive,
                                    { borderColor: statusColors[status] }
                                ],
                            ]}
                            onPress={() => setSelectedStatus(status)}
                        >
                            <AppText
                                txt={status}
                                style={[
                                    [textStyles.caption, { color: COLORS.textLight }],
                                    isSelected && { color: statusColors[status] },
                                ]}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <AppText
                txt={AppString.NoTasksAssignedYet}
                style={[textStyles.subtitle, { color: COLORS.text, marginBottom: vs(8), textAlign: 'center' }]}
            />
            <AppText
                txt={AppString.AssignedToYouAppearHere}
                style={[textStyles.bodySmall, { color: COLORS.textLight, textAlign: 'center', lineHeight: 20 }]}
            />
        </View>
    );

    const renderSectionHeader = (status: TaskStatus_Type, count: number) => {
        if (count === 0) return null;

        const statusColors = {
            'In Progress': '#F9A825',
            'Pending': '#1565C0',
            'Completed': '#2E7D32',
        };

        return (
            <View style={styles.sectionHeader}>
                <View style={[styles.statusIndicator, { backgroundColor: statusColors[status] }]} />
                <Text style={styles.sectionTitle}>{status}</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{count}</Text>
                </View>
            </View>
        );
    };

    const groupedTasks: any = {
        'In Progress': sortedTasks.filter(t => t.status === 'In Progress'),
        'Pending': sortedTasks.filter(t => t.status === 'Pending'),
        'Completed': sortedTasks.filter(t => t.status === 'Completed'),
    };

    const flatListData: (TaskData & { isSection?: boolean; sectionType?: TaskStatus_Type })[] = [];

    (['In Progress', 'Pending', 'Completed'] as const).forEach((status) => {
        if (groupedTasks[status].length > 0) {
            flatListData.push({
                ...({} as any),
                isSection: true,
                sectionType: status,
                tasksId: `section-${status}`,
                taskTitle: '',
                employeeSelectId: '',
                startDateTime: '',
                endDateTime: ''
            });
            flatListData.push(...groupedTasks[status]);
        }
    });

    const renderListItem = ({ item }: { item: any }) => {
        if (item.isSection) {
            const status = item.sectionType as TaskStatus_Type;
            return renderSectionHeader(status, groupedTasks[status].length);
        }
        return <TaskItem task={item} onPress={() => handleTaskPress(item)} />;
    };

    return (
        <ScreenContainer backgroundColor={COLORS.bg}>
            <AppHeader
                title={AppString.MyTasksEmp}
                leftIcon={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                }
            />

            {renderStatusFilter()}

            {sortedTasks.length === 0 ? (
                renderEmptyState()
            ) : (
                <FlatList
                    data={flatListData}
                    renderItem={renderListItem}
                    keyExtractor={(item, index) =>
                        item.isSection ? `section-${item.sectionType}` : `${item.tasksId}-${index}`
                    }
                    scrollEnabled={true}
                    contentContainerStyle={styles.listContent}
                />
            )}

            <EmployeeTaskDetailModal
                visible={showTaskDetail}
                task={selectedTask}
                onClose={() => setShowTaskDetail(false)}
            />
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: hs(16),
        paddingVertical: vs(12),
        gap: hs(8),
        backgroundColor: COLORS.card,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        flexWrap: 'wrap',
    },
    filterButton: {
        paddingVertical: vs(8),
        paddingHorizontal: hs(12),
        borderRadius: RADIUS.md,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        backgroundColor: COLORS.bg,
    },
    filterButtonActive: {
        backgroundColor: COLORS.card,
        borderWidth: 2,
    },
    listContent: {
        paddingHorizontal: hs(16),
        paddingBottom: vs(20),
    },
    summaryCard: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: vs(20),
        marginBottom: vs(12),
        paddingLeft: hs(4),
        gap: hs(10),
    },
    statusIndicator: {
        width: hs(4),
        height: vs(20),
        borderRadius: RADIUS.sm,
    },
    sectionTitle: {
        fontSize: fs(14),
        fontWeight: '700',
        color: COLORS.text,
        flex: 1,
    },
    countBadge: {
        backgroundColor: COLORS.greyColor,
        paddingVertical: vs(8),
        paddingHorizontal: hs(10),
        borderRadius: 100,
    },
    countText: {
        fontSize: fs(12),
        fontWeight: '600',
        color: COLORS.card,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: hs(20),
    },
    emptyIcon: {
        fontSize: fs(60),
        marginBottom: vs(16),
    },
});

export default EmployeeTasks;