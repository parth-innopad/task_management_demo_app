import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootStack } from './src/navigation/RootStack';
import { Provider } from 'react-redux';
import store, { persistor } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';
import toastConfig from './src/services/UIS/toastConfig';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor={"transparent"} translucent />
            <RootStack />
            <Toast visibilityTime={2000} config={toastConfig} position="bottom" topOffset={60} />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

export default App;