import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TargetDetailScreen, TargetScreen } from '../screens';

const TargetNavigator = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TargetScreen" component={TargetScreen} />
            <Stack.Screen name="TargetDetailScreen" component={TargetDetailScreen} />
        </Stack.Navigator>
    );
};

export default TargetNavigator;
