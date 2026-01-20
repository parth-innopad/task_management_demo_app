import { View, StyleSheet, TouchableOpacity, FlatList, Image, Keyboard, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ScreenContainer from '../../../../components/ScreenContainer'
import { COLORS } from '../../../../utils/theme'
import AppHeader from '../../../../components/AppHeader'
import { ArrowLeft, Camera, ChevronDown, Eye, EyeOff, Images, Pencil, Trash } from 'lucide-react-native'
import { fs, hs, vs } from '../../../../utils/stylesUtils'
import AppTextInput from '../../../../components/AppTextInput'
import AppButton from '../../../../components/AppButton'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddEmployees, setIsUpdateEmployee } from '../../../../store/reducers/appDataSlice'
import { AppString } from '../../../../common/AppString'
import AppKeyboardScrollView from '../../../../components/AppKeyboardScrollView'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SelectView from '../../../../subviews/SelectView'
import { RootState } from '../../../../store'
import { useFormik } from 'formik'
import { createEditEmployeeValidationSchema } from '../../../../utils/validators'
import { Constants } from '../../../../common/Constants'
import { PlaceholderText } from '../../../../common/PlaceholderTexts'
import AppText from '../../../../components/AppText'
import { textStyles } from '../../../../common/CommonStyles'
import AppAvatar from '../../../../components/AppAvatar'
import debounce from 'lodash.debounce';
import { fetchAddressSuggestions } from '../../../../services/APIS/apisServices'
import { _showToast } from '../../../../services/UIS/toastConfig'
import ErrorModal from '../../../../subviews/ErrorModal'

interface CreateEditEmployeeProps {
    navigation: any;
    route: {
        params: {
            fromEdit: boolean;
            employeeId: any;
        }
    }
}

const CreateEditEmployee: React.FC<CreateEditEmployeeProps> = ({ navigation, route }) => {

    const dispatch = useDispatch();

    const employees = useSelector((state: RootState) => state.appData.createEmployee);
    const editEmployee = employees.find((emp: any) => emp.id == route?.params?.employeeId);

    const [state, setState] = useState({
        showPassword: '',
        file: null,
        isOpenPickerSheet: false,
        showsLists: false,
        selectDesignation: '',
        designationId: '',
        addressSuggestions: [],
        visibleErrModal: false
    });

    useEffect(() => {
        if (route?.params?.fromEdit && editEmployee) {
            setState((prev: any) => ({
                ...prev,
                file: editEmployee.file,
                selectDesignation: editEmployee?.designation,
            }));
        }
    }, [route?.params?.fromEdit, editEmployee]);

    const handleCreateEditEmployee = (values: any) => {
        const newEmployee: any = {
            id: route?.params?.fromEdit
                ? route?.params?.employeeId
                : Date.now().toString(),
            file: state.file,
            ...values,
        };
        if (route?.params?.fromEdit) {
            _showToast(AppString.EditEmployeeProfile, AppString.success);
            dispatch(setIsUpdateEmployee(newEmployee));
        } else {
            _showToast(AppString.CreateEmployeeProfile, AppString.success);
            dispatch(setIsAddEmployees(newEmployee));
        }
        navigation.goBack();
    };

    const debouncedFetch = useRef(
        debounce(async (text: string) => {
            const results = await fetchAddressSuggestions(text);
            setState((prev) => ({ ...prev, addressSuggestions: results }));
        }, 200)
    ).current;

    useEffect(() => {
        return () => {
            debouncedFetch.cancel();
        };
    }, []);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: editEmployee?.name || '',
            email: editEmployee?.email || '',
            password: editEmployee?.password || '',
            phoneNumber: editEmployee?.phoneNumber || '',
            designation: editEmployee?.designation || '',
            fieldLocation: editEmployee?.fieldLocation || '',
        },
        validationSchema: createEditEmployeeValidationSchema,
        onSubmit: values => {
            Keyboard.dismiss()
            handleCreateEditEmployee(values);
        },
    })

    const openPicker = async (selectItem: any) => {
        let options: any = {
            title: 'Select Image',
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 0.5,
        };

        if (selectItem == 1) {
            setTimeout(() => {
                launchCamera(options, response => {
                    if (response.didCancel) {
                        console.log('User cancelled image picker');
                    } else {
                        const firstAsset = response?.assets?.[0];
                        if (firstAsset) {
                            setState((prev: any) => ({ ...prev, file: firstAsset }));
                            setState((prev: any) => ({ ...prev, isOpenPickerSheet: false }));
                        }
                    }
                });
            }, 500);
        } else if (selectItem == 2) {
            launchImageLibrary(options, response => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else {
                    const firstAsset = response.assets?.[0];
                    if (firstAsset) {
                        setState((prev: any) => ({ ...prev, file: firstAsset }));
                        setState((prev: any) => ({ ...prev, isOpenPickerSheet: false }));
                    }
                }
            });
        } else {
            console.log('Not found...!')
        }
    };

    return (
        <ScreenContainer backgroundColor={COLORS.bg}>
            <AppHeader
                title={route?.params?.fromEdit ? AppString.EditEmployee : AppString.CreateEmployee}
                leftIcon={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={25} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                }
            />
            <AppKeyboardScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity
                    style={styles.avatarBox}
                    onPress={() => setState((prev) => ({ ...prev, isOpenPickerSheet: true }))}
                >
                    {state?.file?.uri ? (
                        <AppAvatar uri={state?.file?.uri} size={110} />
                    ) : (
                        <View style={styles.placeholder}>
                            <Images size={28} color={COLORS.greyColor} />
                        </View>
                    )}
                    <View style={styles.cameraOverlay}>
                        {state?.file?.uri ? <Pencil size={16} color="#fff" /> : <Camera size={16} color="#fff" />}
                    </View>
                </TouchableOpacity>

                <View style={[styles.field, { marginTop: vs(20) }]}>
                    <AppText
                        style={textStyles.primary15}
                        txt={AppString.FullName}
                    />
                    <AppTextInput
                        placeholder={PlaceholderText.fullName}
                        placeholderTextColor={COLORS.moreLightGreyColor}
                        containerStyle={{ marginTop: vs(20) }}
                        value={formik.values.name}
                        onChangeText={formik.handleChange('name')}
                        onBlur={formik.handleBlur('name')}
                        errorMessage={formik.touched.name && formik.errors.name}
                        hasError={!!(formik.touched.name && formik.errors.name)}
                    />
                </View>

                <View style={[styles.field, { marginTop: vs(10) }]}>
                    <AppText
                        style={textStyles.primary15}
                        txt={AppString.Email}
                    />
                    <AppTextInput
                        placeholder={PlaceholderText.email}
                        placeholderTextColor={COLORS.moreLightGreyColor}
                        containerStyle={{ marginTop: vs(20) }}
                        value={formik.values.email}
                        onChangeText={formik.handleChange('email')}
                        onBlur={formik.handleBlur('email')}
                        errorMessage={formik.touched.email && formik.errors.email}
                        keyboardType='email-address'
                        autoCapitalize="none"
                        hasError={!!(formik.touched.email && formik.errors.email)}
                    />
                </View>

                <View style={[styles.field, { marginTop: vs(10) }]}>
                    <AppText
                        style={textStyles.primary15}
                        txt={AppString.Password}
                    />
                    <AppTextInput
                        placeholder={PlaceholderText.password}
                        placeholderTextColor={COLORS.moreLightGreyColor}
                        containerStyle={{ marginTop: vs(20) }}
                        rightIcon={state.showPassword ? (
                            <TouchableOpacity
                                onPress={() => setState((prev: any) => ({
                                    ...prev,
                                    showPassword: !state.showPassword
                                }))}
                            >
                                <Eye size={20} color={COLORS.secondaryPrimary} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => setState((prev: any) => ({
                                    ...prev,
                                    showPassword: !state.showPassword
                                }))}
                            >
                                <EyeOff size={20} color={COLORS.secondaryPrimary} />
                            </TouchableOpacity>
                        )}
                        value={formik.values.password}
                        onChangeText={formik.handleChange('password')}
                        onBlur={formik.handleBlur('password')}
                        errorMessage={formik.touched.password && formik.errors.password}
                        secureTextEntry={!state.showPassword}
                        hasError={!!(formik.touched.password && formik.errors.password)}
                    />
                </View>

                <View style={[styles.field, { marginTop: vs(10) }]}>
                    <AppText
                        style={textStyles.primary15}
                        txt={AppString.PhoneNumber}
                    />
                    <AppTextInput
                        placeholder={PlaceholderText.phoneNumber}
                        placeholderTextColor={COLORS.moreLightGreyColor}
                        containerStyle={{ marginTop: vs(20) }}
                        keyboardType='number-pad'
                        maxLength={10}
                        value={formik.values.phoneNumber}
                        onChangeText={formik.handleChange('phoneNumber')}
                        onBlur={formik.handleBlur('phoneNumber')}
                        errorMessage={formik.touched.phoneNumber && formik.errors.phoneNumber}
                        hasError={!!(formik.touched.phoneNumber && formik.errors.phoneNumber)}
                    />
                </View>

                <View style={[styles.field, { marginTop: vs(10) }]}>
                    <AppText
                        style={textStyles.primary15}
                        txt={AppString.DesignationTitle}
                    />
                    <TouchableOpacity
                        style={[styles.selectBox, {
                            borderWidth: formik.touched.designation && formik.errors.designation ? 1 : 0,
                            borderColor: formik.touched.designation && formik.errors.designation ? COLORS.danger : undefined,
                            marginTop: vs(20)
                        }]}
                        onPress={() => { setState((prev) => ({ ...prev, showsLists: !state.showsLists })), Keyboard.dismiss() }}
                    >
                        <AppText
                            style={[textStyles.bodySmall, {
                                marginHorizontal: hs(10),
                                color: state.selectDesignation ? COLORS.blackColor : COLORS.moreLightGreyColor,
                                fontWeight: undefined
                            }]}
                            txt={state.selectDesignation ? state.selectDesignation : `${PlaceholderText.Designation}`}
                        />
                        <ChevronDown size={25} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                    {formik.touched.designation && formik.errors.designation && (
                        <AppText
                            txt={formik.errors.designation}
                            style={[textStyles.error, { marginTop: vs(4), marginLeft: hs(5) }]}
                        />
                    )}
                    {state.showsLists && (
                        <View style={styles.dropdownContainer}>
                            <FlatList
                                data={Constants.employeeDesignation}
                                keyExtractor={(_, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled
                                contentContainerStyle={styles.listContent}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.listItem}
                                        onPress={() => {
                                            setState((prev: any) => ({
                                                ...prev,
                                                showsLists: false,
                                                selectDesignation: item.designationName,
                                                designationId: item.id
                                            }));
                                            formik.setFieldValue('designation', item.designationName);
                                        }}
                                    >
                                        <AppText
                                            txt={item.designationName}
                                            style={textStyles.bodySmall}
                                        />
                                    </TouchableOpacity>
                                )}
                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                            />
                        </View>
                    )}
                </View>

                <View style={[styles.field, { marginTop: vs(10) }]}>
                    <AppText style={textStyles.primary15} txt={AppString.FieldLocation} />
                    <AppTextInput
                        placeholder={PlaceholderText.EnterFieldLocation}
                        placeholderTextColor={COLORS.moreLightGreyColor}
                        containerStyle={{ marginTop: vs(20) }}
                        value={formik.values.fieldLocation}
                        onChangeText={(text: any) => {
                            formik.setFieldValue('fieldLocation', text);
                            debouncedFetch(text);
                        }}
                        onBlur={formik.handleBlur('fieldLocation')}
                        errorMessage={formik.touched.fieldLocation && formik.errors.fieldLocation}
                        hasError={!!(formik.touched.fieldLocation && formik.errors.fieldLocation)}
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
                                            formik.setFieldValue('fieldLocation', item.fullAddress);
                                            setState((prev) => ({ ...prev, addressSuggestions: [] }))
                                            Keyboard.dismiss()
                                        }}
                                    >
                                        <AppText txt={item.fullAddress} style={textStyles.bodySmall} />
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}
                </View>

                <AppButton
                    label={route?.params?.fromEdit ? AppString.UpdateEmployee : AppString.CreateEmployee}
                    onPress={formik.handleSubmit}
                    style={{ backgroundColor: COLORS.secondaryPrimary, marginTop: vs(30) }}
                />
            </AppKeyboardScrollView>
            <SelectView
                isOpenSheet={state.isOpenPickerSheet}
                close={() => setState((prev) => ({ ...prev, isOpenPickerSheet: false }))}
                openPicker={openPicker}
            />
            <ErrorModal
                visible={state.visibleErrModal}
                title={'Profile Photo Upload'}
                message={'Please save or remove profile photo'}
                cancel={'OK'}
                onCancel={() => {
                    setState((prev) => ({ ...prev, visibleErrModal: false }))
                }}
            />
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: hs(20),
        paddingBottom: vs(50)
    },
    avatarBox: {
        height: vs(110),
        width: hs(110),
        borderRadius: 100,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: vs(20),
    },
    field: {
        marginBottom: vs(15)
    },
    selectBox: {
        height: vs(50),
        borderRadius: 12,
        backgroundColor: '#F1F4F8',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraOverlay: {
        position: 'absolute',
        bottom: 6,
        right: 0,
        height: 30,
        width: 30,
        borderRadius: 100,
        backgroundColor: COLORS.secondaryPrimary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
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
})

export default CreateEditEmployee;