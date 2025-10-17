import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChildrenScreen } from '../screens';
import MainHomeNavigator from './MainHomeNavigator';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChildrenScreen" component={ChildrenScreen} />
      <Stack.Screen name="MainHome" component={MainHomeNavigator} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
