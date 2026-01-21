import * as Yup from 'yup';
import { AppError } from '../common/AppError';

export const signinValidationSchema = Yup.object().shape({
    email: Yup.string()
        .trim()
        .email(AppError.PleaseEnterValidEmail)
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/i,
            'Enter a valid email address'
        )
        .required(AppError.EmailRequired),
    password: Yup.string()
        .min(6, AppError.PasswordMustSixChar)
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z]).+$/,
            AppError.PasswordMustContainUpperLower
        )
        .required(AppError.PasswordRequired),
});

export const createEditEmployeeValidationSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required('Full name is required'),
    email: Yup.string()
        .trim()
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/i,
            'Enter a valid email address'
        )
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z]).+$/,
            AppError.PasswordMustContainUpperLower
        )
        .required('Password is required'),
    phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, 'Enter valid phone number')
        .required('Phone number is required'),
    designation: Yup.string()
        .required('Designation is required'),
    fieldLocation: Yup.string()
        .required('Field location is required'),
});

export const createEditTasksValidationSchema = Yup.object().shape({
    taskTitle: Yup.string().required('Task title is required'),
    taskDescription: Yup.string()
        .required('Task description is required'),
    employeeSelect: Yup.string().required('Please select employee'),
    employeeSelectId: Yup.string(),
    startDateTime: Yup.date()
        .required('Start date & time is required'),
    endDateTime: Yup.date()
        .min(
            Yup.ref('startDateTime'),
            'End date & time must be after start'
        )
        .required('End date & time is required'),
});
