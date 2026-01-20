import { View, TouchableOpacity, StyleSheet, Image, FlatList, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ScreenContainer from '../../../../components/ScreenContainer';
import { COLORS } from '../../../../utils/theme';
import AppHeader from '../../../../components/AppHeader';
import { ArrowLeft, Calendar, ChevronDown, ClipboardList, MapPin, User } from 'lucide-react-native';
import AppKeyboardScrollView from '../../../../components/AppKeyboardScrollView';
import { fs, hs, vs } from '../../../../utils/stylesUtils';
import { AppImages } from '../../../../common/AppImages';
import AppTextInput from '../../../../components/AppTextInput';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePickerModal from 'react-native-date-picker';
import AppButton from '../../../../components/AppButton';
import { setIsAddTasks, setIsUpdateTasks } from '../../../../store/reducers/appDataSlice';
import { AppString } from '../../../../common/AppString';
import { useFormik } from 'formik';
import { PlaceholderText } from '../../../../common/PlaceholderTexts';
import { createEditTasksValidationSchema } from '../../../../utils/validators';
import AppText from '../../../../components/AppText';
import { textStyles } from '../../../../common/CommonStyles';
import debounce from 'lodash.debounce';
import { fetchAddressSuggestions } from '../../../../services/APIS/apisServices';
import { _showToast } from '../../../../services/UIS/toastConfig';

interface CreateEditTasksProps {
    navigation: any;
    route: {
        params: {
            fromEditTask: boolean;
            taskId: any;
        }
    }
}

const CreateEditTasks: React.FC<CreateEditTasksProps> = ({ navigation, route }) => {

    const dispatch = useDispatch();

    const tasksLists = useSelector((state: any) => state.appData.tasks);
    const editTasksLists = tasksLists?.find(
        (item: any) => item.tasksId === route?.params?.taskId
    );
    const employeesLists = useSelector((state: any) => state.appData.createEmployee);

    const [state, setState] = useState({
        showsLists: false,
        selectEmployeeId: '',
        openStartPicker: false,
        openEndPicker: false,
        showStatusLists: false,
        status: 'Pending',
        statusId: '1',
        addressSuggestions: []
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            taskTitle: editTasksLists?.taskTitle?.trim() || '',
            taskDescription: editTasksLists?.taskDescription?.trim() || '',
            employeeSelect: editTasksLists?.employeeSelect || '',
            location: editTasksLists?.location?.trim() || '',
            startDateTime: editTasksLists?.startDateTime
                ? new Date(editTasksLists.startDateTime)
                : null,
            endDateTime: editTasksLists?.endDateTime
                ? new Date(editTasksLists.endDateTime)
                : null,
        },
        validationSchema: createEditTasksValidationSchema,
        onSubmit: values => {
            const payload: any = {
                tasksId: route?.params?.taskId ?? Date.now().toString(),
                ...values,
                employeeSelectId: editTasksLists?.employeeSelectId || state.selectEmployeeId,
                status: editTasksLists?.status || state.status,
                statusId: state.statusId,
            };
            Keyboard.dismiss()
            if (route?.params?.fromEditTask) {
                _showToast(AppString.TaskUpdatedSuccessfully, AppString.success);
                dispatch(setIsUpdateTasks(payload));
            } else {
                _showToast(AppString.TaskAddedSuccessfully, AppString.success);
                dispatch(setIsAddTasks(payload));
            }
            navigation.goBack();
        }
    });

    const debouncedFetch = useRef(
        debounce(async (text: string) => {
            const results = await fetchAddressSuggestions(text);
            setState((prev) => ({ ...prev, addressSuggestions: results }));
        }, 400)
    ).current;

    useEffect(() => {
        return () => {
            debouncedFetch.cancel();
        };
    }, []);

    return (
        <ScreenContainer backgroundColor={COLORS.bg}>
            <AppHeader
                title={route?.params?.fromEditTask ? AppString.UpdateTask : AppString.CreateTask}
                leftIcon={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={25} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                }
            />

            <AppKeyboardScrollView contentContainerStyle={styles.container}>
                <View style={{ alignSelf: 'center', marginTop: vs(20) }}>
                    <Image
                        source={AppImages.teamImg}
                        style={{ width: hs(120), height: vs(120), resizeMode: 'contain', tintColor: COLORS.secondaryPrimary }}
                    />
                </View>

                <View style={[styles.field, { marginTop: vs(20) }]}>
                    <AppText
                        style={textStyles.primary15}
                        txt={AppString.TaskTitle}
                    />
                    <AppTextInput
                        placeholder={PlaceholderText.taskTitle}
                        placeholderTextColor={COLORS.moreLightGreyColor}
                        leftIcon={<ClipboardList size={20} color={COLORS.secondaryPrimary} />}
                        containerStyle={{ marginTop: vs(20) }}
                        value={formik.values.taskTitle}
                        onChangeText={formik.handleChange('taskTitle')}
                        onBlur={formik.handleBlur('taskTitle')}
                        errorMessage={formik.touched.taskTitle && formik.errors.taskTitle}
                        hasError={!!(formik.touched.taskTitle && formik.errors.taskTitle)}
                    />
                </View>

                <View style={[styles.field, { marginTop: vs(20) }]}>
                    <AppText
                        style={textStyles.primary15}
                        txt={AppString.TaskDescription}
                    />
                    <AppTextInput
                        placeholder={PlaceholderText.taskDescription}
                        placeholderTextColor={COLORS.moreLightGreyColor}
                        leftIcon={<ClipboardList size={20} color={COLORS.secondaryPrimary} />}
                        multiline
                        numberOfLines={5}
                        scrollEnabled
                        containerStyle={{ marginTop: vs(20) }}
                        inputStyle={{ minHeight: vs(100), textAlignVertical: 'top' }}
                        value={formik.values.taskDescription}
                        onChangeText={formik.handleChange('taskDescription')}
                        onBlur={formik.handleBlur('taskDescription')}
                        errorMessage={
                            formik.touched.taskDescription && formik.errors.taskDescription
                        }
                        hasError={!!(formik.touched.taskDescription && formik.errors.taskDescription)}
                    />
                </View>

                <View style={[styles.field, { marginTop: vs(20) }]}>
                    <AppText
                        style={textStyles.primary15}
                        txt={AppString.AssignedEmployees}
                    />
                    <TouchableOpacity
                        style={[styles.selectBox, {
                            justifyContent: 'space-between',
                            marginTop: vs(20),
                            borderWidth: formik.touched.employeeSelect && formik.errors.employeeSelect ? 1 : 0,
                            borderColor: formik.touched.employeeSelect && formik.errors.employeeSelect ? COLORS.danger : undefined,
                        }]}
                        onPress={() => { setState((prev) => ({ ...prev, showsLists: !state.showsLists })), Keyboard.dismiss() }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <User size={20} color={COLORS.secondaryPrimary} />
                            <AppText
                                style={[textStyles.bodySmall, { color: formik.values.employeeSelect ? COLORS.blackColor : COLORS.moreLightGreyColor, fontWeight: undefined }]}
                                txt={formik.values.employeeSelect || PlaceholderText.selectEmployee}
                            />
                        </View>
                        <ChevronDown size={25} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                    {formik.touched.employeeSelect && formik.errors.employeeSelect && (
                        <AppText
                            txt={formik.errors.employeeSelect}
                            style={[textStyles.error, { marginTop: vs(4), marginLeft: hs(5) }]}
                        />
                    )}
                    {state.showsLists && (
                        <View style={styles.dropdownContainer}>
                            {employeesLists.length > 0 ?
                                <FlatList
                                    data={employeesLists}
                                    keyExtractor={(_, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    nestedScrollEnabled
                                    contentContainerStyle={styles.listContent}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.listItem}
                                            onPress={() => {
                                                setState(prev => ({
                                                    ...prev,
                                                    showsLists: false,
                                                    selectEmployee: item.name,
                                                    selectEmployeeId: item.id
                                                }));
                                                Keyboard.dismiss();
                                                formik.setFieldValue('employeeSelect', item.name);
                                            }}
                                        >
                                            <AppText
                                                txt={item.name}
                                                style={[textStyles.bodySmall]}
                                            />
                                        </TouchableOpacity>
                                    )}
                                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                                />
                                :
                                <View style={{ padding: 10, alignItems: 'center' }}>
                                    <AppText txt={AppString.NoResultsFound} style={textStyles.bodySmall} />
                                </View>
                            }
                        </View>
                    )}
                </View>

                <View style={styles.field}>
                    <AppText
                        style={textStyles.primary15}
                        txt={AppString.Location}
                    />
                    <AppTextInput
                        placeholder={AppString.EnterLocationOptional}
                        placeholderTextColor={COLORS.moreLightGreyColor}
                        leftIcon={<MapPin size={20} color={COLORS.secondaryPrimary} />}
                        containerStyle={{ marginTop: vs(20) }}
                        value={formik.values.location}
                        onChangeText={(text: any) => {
                            formik.setFieldValue('location', text);
                            debouncedFetch(text);
                        }}
                    />
                    {state.addressSuggestions?.length > 0 && (
                        <View style={styles.suggestionBox}>
                            <FlatList
                                data={state.addressSuggestions}
                                keyExtractor={(_, index) => index.toString()}
                                keyboardShouldPersistTaps="handled"
                                renderItem={({ item }: any) => (
                                    <TouchableOpacity
                                        style={styles.suggestionItem}
                                        onPress={() => {
                                            formik.setFieldValue('location', item.fullAddress);
                                            Keyboard.dismiss();
                                            setState((prev) => ({ ...prev, addressSuggestions: [] }))
                                        }}
                                    >
                                        <AppText txt={item.fullAddress} style={textStyles.bodySmall} />
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}
                </View>

                <AppText
                    style={[textStyles.primary15, { marginTop: vs(20) }]}
                    txt={AppString.SelectStartDateTime}
                />

                <TouchableOpacity
                    style={[styles.timelineBoxFull, {
                        borderWidth: formik.touched.startDateTime && formik.errors.startDateTime ? 1 : 0,
                        borderColor: formik.touched.startDateTime && formik.errors.startDateTime ? COLORS.danger : undefined,
                    }]}
                    onPress={() => setState(prev => ({ ...prev, openStartPicker: true }))}
                >
                    <Calendar size={20} color={COLORS.secondaryPrimary} />
                    <AppText
                        txt={
                            formik.values.startDateTime
                                ? new Date(formik.values.startDateTime).toLocaleString()
                                : AppString.StartDate
                        }
                        style={[
                            textStyles.bodySmall,
                            { color: formik.values.startDateTime ? COLORS.blackColor : COLORS.moreLightGreyColor, fontWeight: '500' }
                        ]}
                    />
                </TouchableOpacity>

                {state.openStartPicker && (
                    <DateTimePickerModal
                        modal
                        open
                        date={formik.values.startDateTime ?? new Date()}
                        mode="datetime"
                        minimumDate={new Date()}
                        onConfirm={(date) => {
                            formik.setFieldValue('startDateTime', date);
                            formik.setFieldTouched('startDateTime', false);
                            formik.validateField('startDateTime');
                            setState(prev => ({ ...prev, openStartPicker: false }));
                            Keyboard.dismiss();
                        }}
                        onCancel={() =>
                            setState(prev => ({ ...prev, openStartPicker: false }))
                        }
                    />
                )}

                {formik.touched.startDateTime && formik.errors.startDateTime && (
                    <AppText
                        txt={formik.errors.startDateTime}
                        style={[textStyles.error, { marginTop: vs(5), marginLeft: hs(5) }]}
                    />
                )}

                <AppText
                    style={[textStyles.primary15, { marginTop: vs(20) }]}
                    txt={AppString.SelectEndDateTime}
                />

                <TouchableOpacity
                    style={[styles.timelineBoxFull, {
                        borderWidth: formik.touched.endDateTime && formik.errors.endDateTime ? 1 : 0,
                        borderColor: formik.touched.endDateTime && formik.errors.endDateTime ? COLORS.danger : undefined,
                    }]}
                    onPress={() => setState(prev => ({ ...prev, openEndPicker: true }))}
                >
                    <Calendar size={20} color={COLORS.secondaryPrimary} />
                    <AppText
                        txt={
                            formik.values.endDateTime
                                ? new Date(formik.values.endDateTime).toLocaleString()
                                : AppString.EndDate
                        }
                        style={[
                            textStyles.bodySmall,
                            { color: formik.values.endDateTime ? COLORS.blackColor : COLORS.moreLightGreyColor, fontWeight: '500' }
                        ]}
                    />
                </TouchableOpacity>

                {state.openEndPicker && (
                    <DateTimePickerModal
                        modal
                        open
                        date={formik.values.endDateTime ?? new Date()}
                        mode="datetime"
                        minimumDate={new Date()}
                        onConfirm={(date) => {
                            formik.setFieldValue('endDateTime', date);
                            formik.setFieldTouched('endDateTime', false);
                            formik.validateField('endDateTime');
                            setState(prev => ({ ...prev, openEndPicker: false }));
                            Keyboard.dismiss();
                        }}
                        onCancel={() =>
                            setState(prev => ({ ...prev, openEndPicker: false }))
                        }
                    />
                )}

                {formik.touched.endDateTime && formik.errors.endDateTime && (
                    <AppText
                        txt={formik.errors.endDateTime}
                        style={[textStyles.error, { marginTop: vs(5), marginLeft: hs(5) }]}
                    />
                )}

                {/* {route?.params?.fromEditTask && (
                    <View style={[styles.field, { marginTop: vs(20) }]}>
                        <AppText
                            style={textStyles.primary15}
                            txt={AppString.SelectTaskStatus}
                        />
                        <TouchableOpacity
                            style={[styles.selectBox, { marginTop: vs(20) }]}
                            onPress={() => setState((prev) => ({ ...prev, showStatusLists: !state.showStatusLists }))}
                        >
                            <User size={20} color={COLORS.secondaryPrimary} />
                            <AppText
                                txt={state.status ? state.status : AppString.SelectTaskStatus}
                                style={[textStyles.bodySmall, { color: state.status && COLORS.blackColor, fontWeight: undefined }]}
                            />
                        </TouchableOpacity>
                        {state.showStatusLists && (
                            <View style={styles.dropdownContainer}>
                                <FlatList
                                    data={Constants.taskStatus}
                                    keyExtractor={(_, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    nestedScrollEnabled
                                    contentContainerStyle={styles.listContent}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.listItem}
                                            onPress={() => {
                                                setState((prev: any) => ({
                                                    ...prev,
                                                    showStatusLists: false,
                                                    status: item.status,
                                                    statusId: item.id
                                                }));
                                            }}
                                        >
                                            <AppText
                                                txt={item.status}
                                                style={[textStyles.bodySmall, { color: COLORS.blackColor }]}
                                            />
                                        </TouchableOpacity>
                                    )}
                                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                                />
                            </View>
                        )}
                    </View>
                )} */}

                <AppButton
                    label={route?.params?.fromEditTask ? AppString.UpdateTask : AppString.CreateTask}
                    style={{ backgroundColor: COLORS.secondaryPrimary, marginTop: vs(30) }}
                    onPress={formik.handleSubmit}
                />
            </AppKeyboardScrollView>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: hs(20),
        paddingBottom: vs(50)
    },
    field: {
        marginTop: vs(20)
    },
    selectBox: {
        height: vs(50),
        borderRadius: 12,
        backgroundColor: '#F1F4F8',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: hs(10),
        gap: 10,
    },
    dropdownContainer: {
        maxHeight: 150,
        marginTop: 8,
        borderWidth: 1,
        borderColor: COLORS.card,
        borderRadius: 10,
        backgroundColor: COLORS.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
        zIndex: 999,
    },
    listContent: {
        paddingVertical: 6,
    },
    listItem: {
        paddingVertical: vs(12),
        paddingHorizontal: hs(16),
    },
    separator: {
        height: 1,
        backgroundColor: COLORS.greyColor,
        opacity: 0.3,
        marginHorizontal: hs(12),
    },
    timelinerow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(20)
    },
    timelineBox: {
        width: '48%',
        height: vs(50),
        backgroundColor: '#F1F4F8',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    timelineText: {
        fontSize: fs(14),
        color: COLORS.greyColor
    },
    errorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(5)
    },
    errorSlot: {
        width: '48%',
        minHeight: vs(16),
    },
    timelineBoxFull: {
        width: '100%',
        height: vs(50),
        backgroundColor: '#F1F4F8',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: vs(15),
        paddingLeft: hs(10)
    },
    suggestionBox: {
        backgroundColor: COLORS.card,
        borderRadius: 10,
        marginTop: 8,
        maxHeight: 180,
        borderWidth: 1,
        borderColor: COLORS.card,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        zIndex: 999,
        elevation: 6,
    },
    suggestionItem: {
        paddingVertical: vs(12),
        paddingHorizontal: hs(14),
    },
});

export default CreateEditTasks;