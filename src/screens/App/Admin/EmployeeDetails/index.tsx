import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ScreenContainer from '../../../../components/ScreenContainer';
import { COLORS } from '../../../../utils/theme';
import AppHeader from '../../../../components/AppHeader';
import { ArrowLeft, LocateIcon, Mail, Pencil, Phone, Trash2, User } from 'lucide-react-native';
import { hs, vs } from '../../../../utils/stylesUtils';
import { NavigationKeys } from '../../../../common/NavigationKeys';
import { setIsDeleteEmployee } from '../../../../store/reducers/appDataSlice';
import { AppString } from '../../../../common/AppString';
import AppAvatar from '../../../../components/AppAvatar';
import AppText from '../../../../components/AppText';
import { textStyles } from '../../../../common/CommonStyles';
import ConfirmationModal from '../../../../subviews/ConfirmationModal';
import { _showToast } from '../../../../services/UIS/toastConfig';

interface EmployeeDetailsProps {
    navigation: any;
    route: {
        params: {
            employeeId: string;
        }
    }
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ navigation, route }) => {

    const dispatch = useDispatch();
    const employee = useSelector((state: any) => state.appData.createEmployee.find((emp: any) => emp.id == route?.params?.employeeId));

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <ScreenContainer backgroundColor={COLORS.bg}>
            <AppHeader
                title={AppString.EmployeeDetails}
                leftIcon={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                }
            />

            {!employee ?
                <View style={styles.container}>
                    <AppText
                        txt={AppString.NoResultsFound}
                        style={[textStyles.title, { textAlign: 'center', color: COLORS.greyColor }]}
                    />
                </View>
                :
                <ScrollView contentContainerStyle={styles.mainContainer}>
                    <View style={styles.profileBox}>
                        <AppAvatar uri={employee?.file?.uri} size={110} />
                        <AppText
                            txt={employee?.name}
                            style={[textStyles.title, {
                                marginTop: vs(20),
                                color: '#1B1D28',
                            }]}
                        />
                    </View>

                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Mail size={20} color={COLORS.primary} />
                            <AppText
                                txt={employee?.email}
                                style={[textStyles.primary15, {
                                    color: '#1b1d28',
                                }]}
                            />
                        </View>

                        <View style={[styles.row, { marginTop: vs(15) }]}>
                            <Phone size={20} color={COLORS.primary} />
                            <AppText
                                txt={`+91 ${employee?.phoneNumber}`}
                                style={[textStyles.primary15, {
                                    color: '#1b1d28',
                                }]}
                            />
                        </View>

                        <View style={[styles.row, { marginTop: vs(15) }]}>
                            <User size={20} color={COLORS.primary} />
                            <AppText
                                txt={employee?.designation}
                                style={[textStyles.primary15, {
                                    color: '#1b1d28',
                                }]}
                            />
                        </View>

                        <View style={[styles.row, { marginTop: vs(15) }]}>
                            <LocateIcon size={20} color={COLORS.primary} />
                            <AppText
                                txt={employee?.fieldLocation}
                                style={[textStyles.primary15, {
                                    color: '#1b1d28',
                                }]}
                            />
                        </View>
                    </View>

                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: '#EEF2FF' }]}
                            onPress={() => navigation.navigate(NavigationKeys.CreateEditEmployee,
                                { fromEdit: true, employeeId: route?.params?.employeeId })
                            }
                        >
                            <Pencil size={20} color={COLORS.primary} />
                            <AppText
                                txt={AppString.Edit}
                                style={[textStyles.primary15, {
                                    color: COLORS.primary,
                                }]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: '#FEE2E2' }]}
                            onPress={() => setModalVisible(true)}
                        >
                            <Trash2 size={20} color={COLORS.danger} />
                            <AppText
                                txt={AppString.Delete}
                                style={[textStyles.primary15, {
                                    color: COLORS.danger,
                                }]}
                            />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            }

            <ConfirmationModal
                visible={modalVisible}
                title={AppString.DeleteEmployee}
                message={AppString.ConfirmationDelete}
                cancel={AppString.Cancel}
                confirm={AppString.Delete}
                onCancel={() => setModalVisible(false)}
                onConfirm={() => {
                    _showToast(AppString.DeleteEmployeeProfile, AppString.error);
                    dispatch(setIsDeleteEmployee(route?.params?.employeeId)),
                        navigation.goBack()
                }}
            />
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 20,
        paddingBottom: vs(40)
    },
    profileBox: {
        alignItems: 'center',
        marginTop: vs(20)
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profilePictureStyle: {
        height: vs(110),
        width: hs(110), borderRadius: 100,
        resizeMode: 'cover'
    },
    noProfilePhotoViewStyle: {
        borderWidth: 1,
        height: vs(100),
        width: hs(100),
        borderRadius: 100,
        borderColor: '#dfe6f2',
        backgroundColor: '#dfe6f2'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 4,
        elevation: 4,
        marginTop: vs(20)
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(30)
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '48%',
        paddingVertical: vs(15),
        borderRadius: 15
    }
})

export default EmployeeDetails;