import { AddCircle, Profile2User } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import {
  Container,
  RowComponent,
  SearchComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import { colors } from '../../constants/colors';
import { fontFamillies } from '../../constants/fontFamilies';
import { sizes } from '../../constants/sizes';
import { PlanModel } from '../../models';
import { useChildStore, usePlanStore } from '../../zustand/store';

const PlanScreen = ({ navigation }: any) => {
  const { child } = useChildStore();
  const { plans } = usePlanStore();
  const [plansApproved, setPlansApproved] = useState<PlanModel[]>([]);

  useEffect(() => {
    if (plans.length > 0) {
      setPlansApproved(plans.filter(plan => plan.status === 'approved'));
    }
  }, [plans]);

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
        <ScrollView showsVerticalScrollIndicator={false}>
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
  );
};

export default PlanScreen;
