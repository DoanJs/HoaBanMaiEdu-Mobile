import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MediaScreen} from '../screens';

const MediaNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MediaScreen" component={MediaScreen} />
    </Stack.Navigator>
  );
};

export default MediaNavigator;
