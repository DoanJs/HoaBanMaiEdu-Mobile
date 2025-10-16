import { QueryConstraint, where } from '@react-native-firebase/firestore';
import { Profile2User } from 'iconsax-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { Container, RowComponent, SectionComponent } from '../../components';
import { colors } from '../../constants/colors';
import { useFirestoreWithMetaCondition } from '../../constants/firebase/useFirestoreWithMetaCondition.ts';
import { sizes } from '../../constants/sizes';
import { CartModel, PlanModel, ReportModel } from '../../models/index.ts';
import {
  useCartStore,
  useChildStore,
  useFieldStore,
  usePlanStore,
  useReportStore,
  useUserStore,
} from '../../zustand/store';
import FieldItemComponent from './FieldItemComponent.tsx';

const TargetScreen = ({ navigation }: any) => {
  const { child } = useChildStore();
  const { fields } = useFieldStore();
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
    if (!loading_carts) {
      const items = data_carts as CartModel[];
      setCarts(items.filter(cart => cart.childId === child?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_carts, loading_carts]);
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
      setReports(items.filter(plan => plan.childId === child?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_reports, loading_reports]);

  if (!child) return <ActivityIndicator />;
  return (
    <Container
      bg={colors.primaryLight}
      title={child.fullName}
      uri={child.avatar}
      right={
        <Profile2User
          size={sizes.title}
          color={colors.textBold}
          variant="Bold"
          onPress={() => navigation.navigate('ChildrenScreen')}
        />
      }
    >
      <SectionComponent
        styles={{ backgroundColor: colors.background, flex: 1, paddingTop: 10 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <RowComponent justify="space-around" styles={{ flexWrap: 'wrap' }}>
            {fields.map((_, index) => (
              <FieldItemComponent key={index} field={_} />
            ))}
          </RowComponent>
        </ScrollView>
      </SectionComponent>
    </Container>
  );
};

export default TargetScreen;
