import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { name as appName } from "../../app.json";
import { persistReducer, persistStore } from 'redux-persist';
import appDataSlice from "../store/reducers/appDataSlice";

const storage = AsyncStorage;

const persistAppConfig = {
    key: `persistAppConfig${appName}`,
    storage: storage,
    blackList: [],
    whiteList: [
        'isLogin',
        'saveUser',
        'createEmployee',
        'deleteEmployee',
        'fieldVisit',
        'deleteFieldVisit',
        'attendanceRulesState',
        'tasks',
        'deleteTasks',
        'employeeLoginStatus',
        'showCheckInOption'
    ],
}

const app_slice = persistReducer(persistAppConfig, appDataSlice);

const store = configureStore({
    reducer: {
        appData: app_slice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

export default store;