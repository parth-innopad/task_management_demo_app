import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import ScreenContainer from '../../../components/ScreenContainer';
import AppHeader from '../../../components/AppHeader';
import { COLORS } from '../../../utils/theme';
import { ArrowLeft } from 'lucide-react-native';
import { fs, vs } from '../../../utils/stylesUtils';
import AppTextInput from '../../../components/AppTextInput';
import { AppString } from '../../../common/AppString';
import AppButton from '../../../components/AppButton';
import { NavigationKeys } from '../../../common/NavigationKeys';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLogin, setIsShowCheckIn, stopEmployeeSession } from '../../../store/reducers/appDataSlice';
import AppAvatar from '../../../components/AppAvatar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../../../store';
import AppText from '../../../components/AppText';
import { textStyles } from '../../../common/CommonStyles';
import ConfirmationModal from '../../../subviews/ConfirmationModal';
import { Constants } from '../../../common/Constants';
import { _showToast } from '../../../services/UIS/toastConfig';

interface ProfileProps {
    navigation?: any;
    route: {
        params: {
            saveUser: any;
        }
    };
}

const Profile: React.FC<ProfileProps> = ({ navigation, route }) => {
    const {
        saveUser
    } = route.params;

    const dispatch = useDispatch();

    const currentUser = useSelector((state: RootState) => state.appData.saveUser);

    const [modalVisible, setModalVisible] = useState(false);

    const _LogoutHandler = async () => {
        const timestamp = new Date().toISOString();
        _showToast(AppString.LogoutSuccessfully, AppString.success);
        dispatch(
            stopEmployeeSession({
                employeeId: currentUser.id,
                timestamp,
            })
        );
        await AsyncStorage.removeItem('clockInTime_v2');
        dispatch(setIsLogin(false));
        dispatch(setIsShowCheckIn(false));
        navigation.reset({
            index: 0,
            routes: [
                {
                    name: NavigationKeys.AuthNavigation,
                    state: {
                        routes: [{ name: NavigationKeys.Login }],
                    },
                },
            ],
        });
    }

    return (
        <ScreenContainer backgroundColor={COLORS.bg}>
            <AppHeader
                title={AppString.Profile}
                leftIcon={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color={COLORS.secondaryPrimary} />
                    </TouchableOpacity>
                }
            />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View style={{ alignItems: 'center', marginBottom: vs(10) }}>
                    <AppAvatar
                        uri={saveUser?.file?.uri}
                        size={120}
                    />
                </View>

                <AppText txt={AppString.FullName} style={[textStyles.primary15, { marginTop: vs(20) }]} />
                <AppTextInput
                    placeholder={AppString.EnterEmployeeName}
                    placeholderTextColor={COLORS.greyColor}
                    containerStyle={{ marginTop: vs(20) }}
                    value={saveUser?.name}
                    editable={false}
                />

                <AppText txt={AppString.Email} style={[textStyles.primary15, { marginTop: vs(20) }]} />
                <AppTextInput
                    placeholder={AppString.EnterEmployeeName}
                    placeholderTextColor={COLORS.greyColor}
                    containerStyle={{ marginTop: vs(20) }}
                    value={saveUser?.email}
                    editable={false}
                />

                <AppText txt={AppString.PhoneNumber} style={[textStyles.primary15, { marginTop: vs(20) }]} />
                <AppTextInput
                    placeholder={AppString.EnterEmployeeName}
                    placeholderTextColor={COLORS.greyColor}
                    containerStyle={{ marginTop: vs(20) }}
                    value={`+91 ${saveUser?.phoneNumber}`}
                    editable={false}
                />

                <AppButton
                    label={AppString.Logout}
                    onPress={() => setModalVisible(true)}
                    style={{ backgroundColor: COLORS.danger, marginTop: vs(50) }}
                />
            </ScrollView>

            <ConfirmationModal
                visible={modalVisible}
                title={AppString.Logout}
                message={AppString.AreYourSureWantLogout}
                cancel={AppString.Cancel}
                confirm={AppString.Logout}
                onCancel={() => setModalVisible(false)}
                onConfirm={() => _LogoutHandler()}
            />
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: vs(20)
    }
})

export default Profile;