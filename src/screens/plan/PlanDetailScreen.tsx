import { where } from '@react-native-firebase/firestore';
import {
  DocumentDownload,
  Edit2,
  Profile2User,
  Trash,
} from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import {
  ButtonComponent,
  Container,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from '../../components';
import { colors } from '../../constants/colors';
import { convertTargetField } from '../../constants/convertTargetAndField';
import { getDocsData } from '../../constants/firebase/getDocsData';
import { fontFamillies } from '../../constants/fontFamilies';
import { sizes } from '../../constants/sizes';
import { PlanTaskModel } from '../../models';
import {
  useCartEditStore,
  useCartStore,
  useChildStore,
  useFieldStore,
  useTargetStore,
  useUserStore,
} from '../../zustand/store';
import PlanItemComponent from './PlanItemComponent';

const PlanDetailScreen = ({ navigation, route }: any) => {
  const { plan } = route.params;
  const { user } = useUserStore();
  const { child } = useChildStore();
  const { fields } = useFieldStore();
  const { targets } = useTargetStore();
  const { setCarts } = useCartStore();
  const { setCartEdit } = useCartEditStore();
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Lấy trực tiếp từ firebase
  useEffect(() => {
    if (plan) {
      // if (comment) {
      //   setIsComment(true);
      //   setText(comment.split("@Js@")[1]);
      // }
      getDocsData({
        nameCollect: 'planTasks',
        condition: [
          where('teacherIds', 'array-contains', user?.id),
          where('planId', '==', plan.id),
        ],
        setData: setPlanTasks,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  const handleEditPlan = () => {
    setIsLoading(true);
    const convertPlanTasksToCarts = planTasks.map(_ => {
      const { targetId, planId, ...newPlanTask } = _;
      return {
        ...newPlanTask,
        targetId: _.targetId,
        fieldId: convertTargetField(_.targetId, targets, fields).fieldId,
        name: convertTargetField(_.targetId, targets, fields).nameTarget,
      };
    });
    setCarts(convertPlanTasksToCarts);
    setCartEdit(plan.id);

    setIsLoading(false);
    navigation.navigate('Main', { screen: 'Cart' });
  };

  if (!child) return <ActivityIndicator />;
  return (
    <Container
      back
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
        <RowComponent justify="space-between">
          <TextComponent text={plan.title} font={fontFamillies.poppinsBold} />
          <TextComponent
            text={plan.status === 'pending' ? 'Chờ duyệt' : 'Đã duyệt'}
            size={sizes.smallText}
            styles={{ fontStyle: 'italic' }}
          />
        </RowComponent>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={planTasks}
          renderItem={({ item, index }) => (
            <PlanItemComponent key={item.id} planTask={item} index={index} />
          )}
          ListFooterComponent={
            <RowComponent
              justify="space-around"
              styles={{ paddingVertical: 16 }}
            >
              {plan.status === 'approved' && (
                <DocumentDownload
                  variant="Bold"
                  size={sizes.title}
                  color={colors.blue}
                  onPress={() => {}}
                />
              )}
              {plan.status === 'pending' && (
                <>
                  <Edit2
                    variant="Bold"
                    size={sizes.title}
                    color={colors.green}
                    onPress={handleEditPlan}
                  />
                  <Trash variant="Bold" size={sizes.title} color={colors.red} />
                </>
              )}
            </RowComponent>
          }
        />
      </SectionComponent>
      <SpinnerComponent loading={isLoading} />
    </Container>
  );
};

export default PlanDetailScreen;
