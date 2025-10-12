import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ReportScreen} from '../screens';

const ReportNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ReportScreen" component={ReportScreen} />
    </Stack.Navigator>
  );
};

export default ReportNavigator;
