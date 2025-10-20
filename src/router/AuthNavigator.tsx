import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
    AuthHomeScreen,
    Login,
    Register
} from '../screens';

const AuthNavigator = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AuthHomeScreen" component={AuthHomeScreen} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
