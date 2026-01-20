import { View, TouchableOpacity, StyleSheet, FlatList, Text } from 'react-native'
import React, { useState } from 'react'
import ScreenContainer from '../../../../components/ScreenContainer'
import { COLORS } from '../../../../utils/theme'
import AppHeader from '../../../../components/AppHeader'
import { AppString } from '../../../../common/AppString'
import { ArrowLeft, ChartNoAxesCombined, Filter, MapPin, Pencil, Plus, Search, Trash2, X } from 'lucide-react-native'
import AppTextInput from '../../../../components/AppTextInput'
import { fs, hs, vs } from '../../../../utils/stylesUtils'
import { Constants } from '../../../../common/Constants'
import AppCard from '../../../../components/AppCard'
import { NavigationKeys } from '../../../../common/NavigationKeys'
import AppKeyboardScrollView from '../../../../components/AppKeyboardScrollView'
import { useDispatch, useSelector } from 'react-redux'
import { setIsDeleteTasks } from '../../../../store/reducers/appDataSlice'
import TasksFilterSheet from '../../../../subviews/TasksFilterSheet'
import AppText from '../../../../components/AppText'
import { textStyles } from '../../../../common/CommonStyles'
import ConfirmationModal from '../../../../subviews/ConfirmationModal'
import { _showToast } from '../../../../services/UIS/toastConfig'

interface TasksProps {
    navigation: any
}

const Tasks: React.FC<TasksProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const [state, setState] = useState({
        search: '',
        filterVisible: false,
        modalVisible: false
    });

    const [appliedFilters, setAppliedFilters] = useState({
        status: AppString.all,
        priority: AppString.all,
        employeeId: AppString.all,
        startDateTime: null,
        endDateTime: null,
    });

    const [deleteTaskId, setDeleteTaskId] = useState<any>(null);

    const tasksLists = useSelector((state: any) => state.appData.tasks);
    const employees = useSelector((state: any) => state.appData.createEmployee);

    const isFilterApplied =
        appliedFilters.status !== AppString.all ||
        appliedFilters.priority !== AppString.all ||
        appliedFilters.employeeId !== AppString.all ||
        appliedFilters.startDateTime !== null ||
        appliedFilters.endDateTime !== null;


    const filteredTasks = tasksLists.filter((task: any) => {
        // SEARCH
        if (
            state.search &&
            !task.taskTitle?.toLowerCase().includes(state.search.toLowerCase())
        ) return false;

        // STATUS
        if (
            appliedFilters.status !== AppString.all &&
            task.status !== appliedFilters.status
        ) return false;

        // PRIORITY
        if (
            appliedFilters.priority !== AppString.all &&
            task.priority !== appliedFilters.priority
        ) return false;

        // EMPLOYEE
        if (
            appliedFilters.employeeId !== AppString.all &&
            String(task.employeeSelectId) !== String(appliedFilters.employeeId)
        ) {
            return false;
        }

        // START DATE
        if (appliedFilters.startDateTime) {
            const taskStart = new Date(task.startDateTime).setHours(0, 0, 0, 0);
            const filterStart = new Date(appliedFilters.startDateTime).setHours(0, 0, 0, 0);
            if (taskStart < filterStart) return false;
        }

        // END DATE
        if (appliedFilters.endDateTime) {
            const taskEnd = new Date(task.endDateTime).setHours(23, 59, 59, 999);
            const filterEnd = new Date(appliedFilters.endDateTime).setHours(23, 59, 59, 999);
            if (taskEnd > filterEnd) return false;
        }
        return true;
    });

    const onApplyFilters = (filters: any) => {
        setAppliedFilters({
            status: filters.status,
            priority: filters.priority,
            employeeId: filters.employeeId,
            startDateTime: filters.startDate || null,
            endDateTime: filters.endDate || null,
        });

        setState(prev => ({ ...prev, filterVisible: false }));
    };


    const handleDeletePress = (id: any) => {
        setDeleteTaskId(id);
        setState(prev => ({ ...prev, modalVisible: true }));
    };

    const _renderItem = ({ item, index }: any) => {
        const statusStyles = Constants.getStatusStyle(item.status);
        return (
            <AppCard
                key={index}
                style={styles.card}
                onPress={() => navigation.navigate(NavigationKeys.TasksDetails, { tasks: item })}
            >
                <View style={styles.headerRow}>
                    <Text style={[styles.title, { maxWidth: '70%' }]} numberOfLines={1} ellipsizeMode='tail'>
                        {item?.taskTitle}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyles.bg }]}>
                        <AppText
                            txt={item?.status || AppString.Pending}
                            style={[textStyles.caption, { color: statusStyles.text }]}
                        />
                    </View>
                </View>

                <View>
                    <Text style={[styles.employee, { maxWidth: '75%' }]} numberOfLines={1} ellipsizeMode='tail'>{item?.employeeSelect}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, position: 'absolute', right: 10, top: 15 }}>
                        <TouchableOpacity onPress={() => navigation.navigate(NavigationKeys.CreateEditTasks, { fromEditTask: true, taskId: item.tasksId })}>
                            <Pencil
                                size={20}
                                color={COLORS.secondaryPrimary}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeletePress(item.tasksId)}>
                            <Trash2
                                size={20}
                                color={COLORS.danger}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.infoRow}>
                    <MapPin size={16} color={COLORS.secondaryPrimary} />
                    <AppText
                        txt={item?.location || AppString.NotProvided}
                        numberOfLines={2}
                        style={[textStyles.bodySmall, { marginLeft: hs(5), color: '#374151', }]}
                    />
                </View>
            </AppCard>
        )
    }

    return (
        <ScreenContainer backgroundColor={COLORS.bg}>
            <AppHeader
                title={AppString.TaskLists}
                leftIcon={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={25} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                }
                rightIconOnly={
                    <TouchableOpacity onPress={() => navigation.navigate(NavigationKeys.EmployeeTasksHistory)}>
                        <ChartNoAxesCombined size={25} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                }
            />

            <View style={styles.viewRow}>
                <AppTextInput
                    placeholder={AppString.SearchTasks}
                    placeholderTextColor={COLORS.greyColor}
                    rightIcon={state.search ?
                        <X size={20} color={COLORS.danger} onPress={() => setState((prev) => ({ ...prev, search: '' }))} />
                        : <Search size={20} color={COLORS.secondaryPrimary} />}
                    containerStyle={styles.searchInputContainerStyle}
                    value={state.search}
                    onChangeText={(text: any) => setState((prev) => ({
                        ...prev,
                        search: text
                    }))}
                />
                <TouchableOpacity
                    style={[
                        styles.filterBtnStyle,
                        isFilterApplied && {
                            backgroundColor: COLORS.secondaryPrimary,
                            borderColor: COLORS.secondaryPrimary,
                        },
                    ]}
                    onPress={() => setState(prev => ({ ...prev, filterVisible: true }))}
                >
                    <Filter
                        size={20}
                        color={isFilterApplied ? COLORS.card : COLORS.secondaryPrimary}
                    />
                </TouchableOpacity>

            </View>

            <AppKeyboardScrollView>
                {isFilterApplied && (
                    <View style={{ marginHorizontal: hs(20), marginTop: vs(10) }}>
                        <AppText
                            txt={`Filtered ${appliedFilters.status.toLowerCase()} (${filteredTasks.length} results)`}
                            style={[
                                textStyles.bodySmall,
                                { color: COLORS.secondaryPrimary, fontWeight: '600' },
                            ]}
                        />
                    </View>
                )}

                <FlatList
                    data={filteredTasks}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={_renderItem}
                    contentContainerStyle={{
                        padding: hs(20),
                        paddingBottom: vs(100),
                        flexGrow: filteredTasks.length === 0 ? 1 : 0
                    }}
                    ListEmptyComponent={
                        <AppText
                            txt={state.search ? AppString.NoResultsFound : AppString.addYourFirstTask}
                            style={[textStyles.emptyText, {
                                textAlign: 'center',
                                marginTop: vs(50)
                            }]}
                        />
                    }
                />
            </AppKeyboardScrollView>

            <TouchableOpacity
                style={styles.addBtn}
                onPress={() => navigation.navigate(NavigationKeys.CreateEditTasks)}
            >
                <Plus size={25} color={"#fff"} />
            </TouchableOpacity>

            <TasksFilterSheet
                visible={state.filterVisible}
                employees={employees}
                onApply={onApplyFilters}
                onClose={() =>
                    setState(prev => ({ ...prev, filterVisible: false }))
                }
            />

            <ConfirmationModal
                visible={state.modalVisible}
                title={AppString.DeleteTask}
                message={AppString.ConfirmationDeleteTask}
                cancel={AppString.Cancel}
                confirm={AppString.Delete}
                onCancel={() => {
                    setState(prev => ({ ...prev, modalVisible: false }));
                    setDeleteTaskId(null);
                }}
                onConfirm={() => {
                    if (deleteTaskId) {
                        _showToast(AppString.TaskDeletedSuccessfully, AppString.error);
                        dispatch(setIsDeleteTasks(deleteTaskId));
                    }
                    setState(prev => ({ ...prev, modalVisible: false }));
                    setDeleteTaskId(null);
                }}
            />
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    searchInputContainerStyle: {
        width: '80%'
    },
    viewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: hs(20),
        marginTop: vs(20),
    },
    filterBtnStyle: {
        borderWidth: 1,
        height: vs(50),
        width: hs(50),
        borderRadius: 10,
        backgroundColor: '#F1F4F8',
        borderColor: '#F1F4F8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        marginBottom: vs(15)
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: fs(16),
        fontWeight: '700',
        color: '#1B1D28'
    },
    statusBadge: {
        paddingHorizontal: hs(10),
        paddingVertical: vs(5),
        borderRadius: 20
    },
    employee: {
        marginTop: vs(10),
        fontSize: fs(14),
        color: '#6B7280'
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: vs(10)
    },
    addBtn: {
        height: vs(60),
        width: hs(60),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: '#6C47FF',
        position: 'absolute',
        bottom: vs(50),
        right: hs(20)
    },
})

export default Tasks;