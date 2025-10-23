import { QueryConstraint, where } from '@react-native-firebase/firestore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { useFirestoreWithMetaCondition } from '../constants/firebase/useFirestoreWithMetaCondition';
import { CartModel, PlanModel, ReportModel } from '../models';
import {
  AddReportScreen,
  PlanDetailScreen,
  ReportDetailScreen,
} from '../screens';
import {
  useCartStore,
  useChildStore,
  usePlanStore,
  useReportStore,
  useUserStore,
} from '../zustand/store';
import TabNavigator from './TabNavigator';

const MainHomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  const { child } = useChildStore();
  const { user } = useUserStore();
  const { setCarts } = useCartStore();
  const { setPlans } = usePlanStore();
  const { setReports } = useReportStore();

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
  const { data: data_plans, loading: loading_plans } =
    useFirestoreWithMetaCondition({
      key: 'plansCache',
      metaDoc: 'plans',
      id: user?.id,
      nameCollect: 'plans',
      condition: [
        where('teacherIds', 'array-contains', user?.id),
      ] as QueryConstraint[],
    });
  const { data: data_reports, loading: loading_reports } =
    useFirestoreWithMetaCondition({
      key: 'reportsCache',
      metaDoc: 'reports',
      id: user?.id,
      nameCollect: 'reports',
      condition: [
        where('teacherIds', 'array-contains', user?.id),
      ] as QueryConstraint[],
    });

  useEffect(() => {
    if (!loading_plans) {
      const items = data_plans as PlanModel[];
      setPlans(items.filter(plan => plan.childId === child?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_plans, loading_plans]);
  useEffect(() => {
    if (!loading_reports) {
      const items = data_reports as ReportModel[];
      setReports(items.filter(report => report.childId === child?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_reports, loading_reports]);
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
