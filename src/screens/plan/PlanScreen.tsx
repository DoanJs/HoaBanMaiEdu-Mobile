import { where } from '@react-native-firebase/firestore';
import { AddCircle, Profile2User } from 'iconsax-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import {
  Container,
  RowComponent,
  SearchComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import { colors } from '../../constants/colors';
import { getDocsData } from '../../constants/firebase/getDocsData';
import { fontFamillies } from '../../constants/fontFamilies';
import { sizes } from '../../constants/sizes';
import { PlanModel } from '../../models';
import { useChildStore, usePlanStore, useUserStore } from '../../zustand/store';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const PlanScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets()
  const { child } = useChildStore();
  const { user } = useUserStore();
  const { plans, setPlans } = usePlanStore();
  const [plansApproved, setPlansApproved] = useState<PlanModel[]>([]);
  const [refreshing, setRefreshing] = useState(false); // loading khi kéo xuống

  useEffect(() => {
    if (plans.length > 0) {
      setPlansApproved(plans.filter(plan => plan.status === 'approved'));
    }
  }, [plans]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      getDocsData({
        nameCollect: 'plans',
        condition: [where('teacherIds', 'array-contains', user?.id)],
        setData: setPlans,
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

  if (!child) return <ActivityIndicator />;
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Container
        bg={colors.primaryLight}
        title={child.fullName}
        uri={child.avatar}
      >
        <SectionComponent
          styles={{
            backgroundColor: colors.background,
            flex: 1,
            paddingVertical: 10,
          }}
        >
          <RowComponent>
            <SearchComponent
              styles={{ flex: 1 }}
              arrSource={plans.filter(plan => plan.status === 'approved')}
              onChange={val => setPlansApproved(val)}
              placeholder="Nhập kế hoạch"
              type="searchPlan"
            />
            <SpaceComponent width={20} />
            <AddCircle
              onPress={() => navigation.navigate('Target')}
              size={sizes.title}
              color={colors.primary}
              variant="Bold"
            />
          </RowComponent>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <SpaceComponent height={6} />
            <RowComponent justify="space-around" styles={{ flexWrap: 'wrap' }}>
              {plansApproved.map((_, index) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('PlanDetailScreen', { plan: _ })
                  }
                  key={index}
                  style={{
                    padding: 10,
                    width: '45%',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: 'coral',
                    borderRadius: 100,
                    marginBottom: 10,
                    marginLeft: 10,
                  }}
                >
                  <TextComponent
                    text={_.title}
                    font={fontFamillies.poppinsBold}
                  />
                </TouchableOpacity>
              ))}
            </RowComponent>
          </ScrollView>
        </SectionComponent>
      </Container>
    </SafeAreaView>
  );
};

export default PlanScreen;
