import { View, StyleSheet, Image, TouchableOpacity, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { COLORS } from '../../../utils/theme';
import { hs, vs } from '../../../utils/stylesUtils';
import { AppIcons } from '../../../common/AppIcons';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import AppButton from '../../../components/AppButton';
import { NavigationKeys } from '../../../common/NavigationKeys';
import { AppString } from '../../../common/AppString';
import AppTextInput from '../../../components/AppTextInput';
import { useDispatch } from 'react-redux';
import { setIsLogin, setIsSaveUser } from '../../../store/reducers/appDataSlice';
import { loginUser } from '../../../services/authService';
import AppKeyboardScrollView from '../../../components/AppKeyboardScrollView';
import { useFormik } from 'formik';
import { signinValidationSchema } from '../../../utils/validators';
import AppText from '../../../components/AppText';
import { textStyles } from '../../../common/CommonStyles';
import { PlaceholderText } from '../../../common/PlaceholderTexts';
import { _showToast } from '../../../services/UIS/toastConfig';

interface LoginProps {
    navigation: any;
}

const LoginScreen: React.FC<LoginProps> = ({ navigation }) => {

    const dispatch = useDispatch();

    const [state, setState] = useState({
        showPassword: false,
    });

    const loginHandler = (values: any) => {
        const { email, password } = values;
        const user: any = loginUser(email, password);
        if (!user) {
            _showToast(AppString.IncorrectEmailPsw, AppString.error);
            return;
        }
        dispatch(setIsLogin(true));
        dispatch(setIsSaveUser(user));
        _showToast(AppString.LoginSuccessfully, AppString.success);
        switch (user.role) {
            case "admin":
                navigation.navigate(NavigationKeys.AdminNavigation);
                break;
            case "employee":
                navigation.navigate(NavigationKeys.EmployeeNavigation);
                break;
            default:
                _showToast("Invalid user role", AppString.error);
                break;
        }
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: signinValidationSchema,
        onSubmit: values => {
            Keyboard.dismiss()
            loginHandler(values);
        }
    })

    return (
        <View style={styles.container}>
            <AppKeyboardScrollView backgroundColor={COLORS.card} contentContainerStyle={{ paddingBottom: vs(50) }}>
                <View style={styles.logoContainer}>
                    <Image
                        source={AppIcons.splashLogo}
                        style={styles.logo}
                    />
                    <AppText txt={AppString.WelcomeBack} style={textStyles.heading} />
                    <AppText style={[textStyles.subtitle, { marginTop: vs(5), fontWeight: undefined }]} txt={AppString.LoginToContinue} />
                </View>

                <AppTextInput
                    placeholder={PlaceholderText.email}
                    placeholderTextColor={COLORS.moreLightGreyColor}
                    leftIcon={<Mail size={20} color={COLORS.secondaryPrimary} />}
                    value={formik.values.email}
                    onChangeText={formik.handleChange('email')}
                    onBlur={formik.handleBlur('email')}
                    errorMessage={formik.touched.email && formik.errors.email}
                    keyboardType='email-address'
                    autoCapitalize="none"
                />
                <AppTextInput
                    placeholder={PlaceholderText.password}
                    placeholderTextColor={COLORS.moreLightGreyColor}
                    leftIcon={<Lock size={20} color={COLORS.secondaryPrimary} />}
                    containerStyle={{ marginTop: vs(20) }}
                    rightIcon={state.showPassword ? (
                        <TouchableOpacity onPress={() => setState(prev => ({ ...prev, showPassword: !state.showPassword }))}>
                            <Eye size={20} color={COLORS.secondaryPrimary} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setState(prev => ({ ...prev, showPassword: !state.showPassword }))}>
                            <EyeOff size={20} color={COLORS.secondaryPrimary} />
                        </TouchableOpacity>
                    )}
                    value={formik.values.password}
                    onChangeText={formik.handleChange('password')}
                    onBlur={formik.handleBlur('password')}
                    errorMessage={formik.touched.password && formik.errors.password}
                    secureTextEntry={!state.showPassword}
                />

                <AppButton
                    label={AppString.Login}
                    onPress={formik.handleSubmit}
                    style={{ backgroundColor: COLORS.secondaryPrimary, marginTop: vs(30) }}
                />
            </AppKeyboardScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.card,
        paddingHorizontal: hs(20),
        paddingTop: vs(60)
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: vs(40)
    },
    logo: {
        width: hs(90),
        height: vs(90),
        borderRadius: 20,
        marginBottom: vs(16)
    },
})

export default LoginScreen;