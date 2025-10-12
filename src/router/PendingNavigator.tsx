import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PendingScreen } from '../screens';

const PendingNavigator = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PendingScreen" component={PendingScreen} />
        </Stack.Navigator>
    );
};

export default PendingNavigator;
