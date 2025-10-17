import { QueryConstraint, where } from '@react-native-firebase/firestore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { useFirestoreWithMetaCondition } from '../constants/firebase/useFirestoreWithMetaCondition';
import { CartModel } from '../models';
import { AddReportScreen, PlanDetailScreen, ReportDetailScreen } from '../screens';
import { useCartStore, useChildStore, useUserStore } from '../zustand/store';
import TabNavigator from './TabNavigator';

const MainHomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  const { child } = useChildStore();
  const { user } = useUserStore();
  const { setCarts } = useCartStore();

  const { data: data_carts, loading: loading_carts } =
    useFirestoreWithMetaCondition({
      key: 'cartsCache',
      metaDoc: 'carts',
      id: user?.id,
      nameCollect: 'carts',
      condition: [
        where('teacherIds', 'array-contains', user?.id),
      ] as QueryConstraint[],
    });

    
  useEffect(() => {
    if (!loading_carts) {
      const items = data_carts as CartModel[];
      setCarts(items.filter(cart => cart.childId === child?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_carts, loading_carts]);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="PlanDetailScreen" component={PlanDetailScreen} />
      <Stack.Screen name="ReportDetailScreen" component={ReportDetailScreen} />
      <Stack.Screen name="AddReportScreen" component={AddReportScreen} />
    </Stack.Navigator>
  );
};

export default MainHomeNavigator;
