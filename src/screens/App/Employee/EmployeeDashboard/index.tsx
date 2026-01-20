import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, BackHandler } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ScreenContainer from '../../../../components/ScreenContainer'
import { COLORS } from '../../../../utils/theme'
import AppHeader from '../../../../components/AppHeader'
import { fs, vs } from '../../../../utils/stylesUtils'
import { CalendarDays, ChartNoAxesCombined, ClipboardList, UserRound } from 'lucide-react-native'
import CheckInTaskSheet from '../../../../subviews/CheckInTaskSheet'
import CheckOutAlert from '../../../../subviews/CheckOutAlert'
import { AppString } from '../../../../common/AppString'
import { Constants } from '../../../../common/Constants'
import { useDispatch, useSelector } from 'react-redux'
import { NavigationKeys } from '../../../../common/NavigationKeys'
import ClockCard from '../../../../components/ClockCard'
import { RootState } from '../../../../store'
import { TaskStatus_Type } from '../../../../types/taskTypes'
import { setIsUpdateTasks } from '../../../../store/reducers/appDataSlice'
import ActiveInActive from '../../../../components/ActiveInActive'
import AppText from '../../../../components/AppText'
import { textStyles } from '../../../../common/CommonStyles'
import AppCard from '../../../../components/AppCard'
import { _showToast } from '../../../../services/UIS/toastConfig'
import { useFocusEffect } from '@react-navigation/native'
import ConfirmationModal from '../../../../subviews/ConfirmationModal'

interface EmployeeDashboardProps {
    navigation?: any;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const clockRef = useRef<any>(null);

    const [isClockedIn, setIsClockedIn] = useState(false);
    const [showCheckInModal, setShowCheckInModal] = useState(false);
    const [showCheckOutModal, setShowCheckOutModal] = useState(false);
    const [currentTask, setCurrentTask] = useState<any>(null);
    const [deferredClockHandler, setDeferredClockHandler] = useState<(() => void) | any>(null);
    const [clockOutCompletion, setClockOutCompletion] = useState<((data: { status: TaskStatus_Type; taskTitle: string }) => void) | null>(null);
    const [exitVisible, setExitVisible] = useState(false);

    const saveUser = useSelector((state: any) => state.appData.saveUser);
    const allTasks = useSelector((state: RootState) => state.appData.tasks);
    const currentUser = useSelector((state: RootState) => state.appData.saveUser);
    const todayKey = Constants.newDateISOStringSplit;

    const loginData = useSelector((state: RootState) => {
        const empData = state.appData.employeeLoginStatus[currentUser?.id];
        if (!empData) return null;
        return empData.find(d => d.date === todayKey) || null;
    });

    const filteredTasks = allTasks.filter(t =>
        (t.employeeSelectId === currentUser?.id ||
            t.employeeSelect === currentUser?.id) &&
        (t.status === AppString.Pending || t.status === AppString.InProgress)
    );

    useEffect(() => {
        if (!currentUser?.id || !allTasks?.length) return;
        const activeTask = allTasks.find(
            t =>
                (t.employeeSelectId === currentUser.id ||
                    t.employeeSelect === currentUser.id) &&
                t.status === AppString.InProgress
        );
        if (activeTask) {
            setCurrentTask(activeTask);
        } else {
            setCurrentTask(null);
        }
    }, [allTasks, currentUser]);

    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                setExitVisible(true);
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction
            );

            return () => backHandler.remove();
        }, [])
    );

    return (
        <ScreenContainer backgroundColor={COLORS.bg}>
            <AppHeader
                title={AppString.Dashboard}
                rightIcon={
                    <TouchableOpacity onPress={() => navigation.navigate(NavigationKeys.Profile, { saveUser: saveUser })}>
                        <UserRound size={24} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                }
            />
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <AppText
                    txt={`${AppString.Hello} ${saveUser?.name}, ${Constants.getTimeBasedGreeting()}`}
                    style={[textStyles.subtitle, { color: '#1B1D28', textAlign: 'center', marginBottom: vs(20) }]}
                />

                <ActiveInActive
                    isClockedIn={isClockedIn}
                    onBreakInBefore={async () => {
                        if (isClockedIn && clockRef.current) {
                            await clockRef.current.forceTaskCheckout();
                            setCurrentTask(null);
                            setIsClockedIn(false);
                        }
                    }}
                />

                <ClockCard
                    ref={clockRef}
                    isClockedIn={isClockedIn}
                    setIsClockedIn={setIsClockedIn}
                    onCheckIn={(defaultHandler: any) => {
                        setShowCheckInModal(true);
                        setDeferredClockHandler(() => defaultHandler);
                    }}
                    onCheckOut={(clockData: any, completionCallback: () => void) => {
                        const activeTask = allTasks.find(
                            t =>
                                (t.employeeSelectId === currentUser?.id ||
                                    t.employeeSelect === currentUser?.id) &&
                                t.status === AppString.InProgress
                        );
                        setCurrentTask(activeTask ?? null);
                        setDeferredClockHandler(() => clockData);
                        setClockOutCompletion(() => completionCallback);
                        setShowCheckOutModal(true);
                    }}
                    currentTask={currentTask}
                />

                {isClockedIn && (
                    <AppCard style={{ marginTop: vs(20) }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <ClipboardList size={25} color={COLORS.secondaryPrimary} />
                            <AppText
                                txt={`${AppString.Workingon} ${currentTask?.taskTitle}`}
                                style={[
                                    textStyles.bodySmall,
                                    { color: COLORS.secondaryPrimary },
                                ]}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: vs(10) }}>
                            <ChartNoAxesCombined size={25} color={COLORS.secondaryPrimary} />
                            <AppText
                                txt={`${AppString.StatusEmpDash} ${currentTask?.status}`}
                                style={[
                                    textStyles.bodySmall,
                                    { color: COLORS.secondaryPrimary },
                                ]}
                            />
                        </View>
                    </AppCard>
                )}

                <View style={styles.grid}>
                    <TouchableOpacity
                        style={styles.actionBox}
                        onPress={() => navigation.navigate(NavigationKeys.EmployeeAttendance)}
                    >
                        <CalendarDays size={32} color={COLORS.secondaryPrimary} />
                        <AppText
                            txt={AppString.Attendance}
                            style={[textStyles.primary15, { marginTop: vs(10), color: '#1B1D28' }]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionBox}
                        onPress={() => navigation.navigate(NavigationKeys.EmployeeTasks)}
                    >
                        <ClipboardList size={32} color={COLORS.secondaryPrimary} />
                        <AppText
                            txt={AppString.MyTasks}
                            style={[textStyles.primary15, { marginTop: vs(10), color: '#1B1D28' }]}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.actionBox, { width: '100%', alignSelf: 'center' }]}
                    onPress={() => navigation.navigate(NavigationKeys.EmployeeTasksSummary)}
                >
                    <ChartNoAxesCombined size={32} color={COLORS.secondaryPrimary} />
                    <AppText
                        txt={AppString.TasksSummary}
                        style={[textStyles.primary15, { marginTop: vs(10), color: '#1B1D28' }]}
                    />
                </TouchableOpacity>

                <CheckInTaskSheet
                    visible={showCheckInModal}
                    onClose={() => setShowCheckInModal(false)}
                    tasks={filteredTasks}
                    onStart={(t: any) => {
                        if (!loginData?.isActive) {
                            _showToast(AppString.StartActiveTimeFirst, AppString.error);
                            setShowCheckInModal(false);
                            return;
                        }
                        const updatedTask = {
                            ...t,
                            status: AppString.InProgress,
                        };
                        setCurrentTask(updatedTask);
                        dispatch(setIsUpdateTasks(updatedTask));
                        setShowCheckInModal(false);
                        if (deferredClockHandler) deferredClockHandler();
                        setIsClockedIn(true);
                    }}
                />

                <CheckOutAlert
                    visible={showCheckOutModal}
                    onClose={() => setShowCheckOutModal(false)}
                    onChoose={(status: TaskStatus_Type) => {
                        if (!currentTask) return;
                        const updatedTask = {
                            ...currentTask,
                            status,
                        };
                        dispatch(setIsUpdateTasks(updatedTask));
                        setShowCheckOutModal(false);
                        setCurrentTask(null);
                        // if (clockOutCompletion && deferredClockHandler) {
                        //     deferredClockHandler.status = status;
                        //     deferredClockHandler.taskTitle = updatedTask.taskTitle;
                        //     clockOutCompletion();
                        // }
                        // clockOutCompletion?.({
                        //     status,
                        //     taskTitle: updatedTask.taskTitle,
                        // });
                        clockRef.current?.completeClockOut({
                            status,
                            taskTitle: updatedTask.taskTitle,
                        });

                        setIsClockedIn(false);
                    }}
                />

                <ConfirmationModal
                    visible={exitVisible}
                    title="Exit App"
                    message="Are you sure you want to exit?"
                    cancel={AppString.Cancel}
                    confirm="Exit"
                    onCancel={() => setExitVisible(false)}
                    onConfirm={() => {
                        setExitVisible(false);
                        BackHandler.exitApp();
                    }}
                />
            </ScrollView>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: vs(100)
    },
    greetingText: {
        fontSize: fs(18),
        fontWeight: '700',
        color: '#1B1D28',
        textAlign: 'center',
        marginBottom: vs(20)
    },
    status: {
        fontSize: fs(16),
        color: '#6B7280',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: vs(20)
    },
    actionBox: {
        width: '48%',
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: vs(14),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 4,
        elevation: 4
    },
    actionText: {
        marginTop: vs(10),
        fontSize: fs(15),
        fontWeight: '600',
        color: '#1B1D28'
    },
    taskTitle: {
        fontSize: fs(16),
        fontWeight: '700',
        marginTop: vs(8)
    },
    taskMeta: {
        fontSize: fs(13),
        color: '#6B7280',
        marginTop: vs(8)
    },
    noTask: {
        marginTop: vs(8),
        fontSize: fs(14),
        color: '#9CA3AF'
    }
});

export default EmployeeDashboard;
