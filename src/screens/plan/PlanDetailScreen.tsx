import { where } from '@react-native-firebase/firestore';
import {
  DocumentDownload,
  Edit2,
  Profile2User,
  Trash,
} from 'iconsax-react-native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import {
  Container,
  RowComponent,
  SectionComponent,
  SpinnerComponent,
  TextComponent
} from '../../components';
import { DeleteModal } from '../../components/modals';
import { colors } from '../../constants/colors';
import { convertTargetField } from '../../constants/convertTargetAndField';
import { convertTimeStampFirestore } from '../../constants/convertTimeStampFirestore';
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
  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);

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
console.log(convertPlanTasksToCarts)
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
          {convertTimeStampFirestore(plan?.createAt) !==
            convertTimeStampFirestore(plan?.updateAt) ? (
            <TextComponent
              styles={{ fontStyle: "italic" }}
              text={`Cập nhật: ${moment(
                convertTimeStampFirestore(plan?.updateAt)
              ).format("HH:mm:ss DD/MM/YYYY")}`}
              size={sizes.smallText}
            />
          ) :
            <TextComponent
              styles={{ fontStyle: "italic" }}
              text={`Gửi lên: ${moment(
                convertTimeStampFirestore(plan?.createAt)
              ).format("HH:mm:ss_DD/MM/YYYY")}`}
              size={sizes.smallText}
            />}
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
                  size={sizes.extraTitle}
                  color={colors.blue}
                  onPress={() => { }}
                />
              )}
              {plan.status === 'pending' && (
                <>
                  <Edit2
                    variant="Bold"
                    size={sizes.extraTitle}
                    color={colors.green}
                    onPress={handleEditPlan}
                  />
                  <Trash variant="Bold" size={sizes.extraTitle}
                    color={colors.red}
                    onPress={() => setIsVisibleDeleteModal(true)}
                  />
                </>
              )}
            </RowComponent>
          }
        />
      </SectionComponent>

      <DeleteModal data={{
        id: plan.id,
        type: 'planPending',
        itemTasks: planTasks
      }}
        visible={isVisibleDeleteModal}
        onClose={() => setIsVisibleDeleteModal(false)}
      />
      <SpinnerComponent loading={isLoading} />
    </Container>
  );
};

export default PlanDetailScreen;
