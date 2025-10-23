import { where } from '@react-native-firebase/firestore';
import {
  ArchiveTick,
  DocumentDownload,
  Edit2,
  MessageAdd,
  MessageNotif,
  Profile2User,
  Trash,
} from 'iconsax-react-native';
import Share from 'react-native-share';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Linking } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  Container,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from '../../components';
import { CommentModal, DeleteModal } from '../../components/modals';
import { colors } from '../../constants/colors';
import { convertTargetField } from '../../constants/convertTargetAndField';
import { convertTimeStampFirestore } from '../../constants/convertTimeStampFirestore';
import { getDocsData } from '../../constants/firebase/getDocsData';
import { updateDocData } from '../../constants/firebase/updateDocData';
import { fontFamillies } from '../../constants/fontFamilies';
import { groupArrayWithField } from '../../constants/groupArrayWithField';
import { sizes } from '../../constants/sizes';
import { exportWord } from '../../exportFile/exportWord';
import { PlanTaskModel } from '../../models';
import {
  useCartEditStore,
  useCartStore,
  useChildStore,
  useFieldStore,
  usePlanStore,
  useTargetStore,
  useUserStore,
} from '../../zustand/store';
import PlanItemComponent from './PlanItemComponent';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

const PlanDetailScreen = ({ navigation, route }: any) => {
  const { plan } = route.params;
  const insets = useSafeAreaInsets()
  const { user } = useUserStore();
  const { child } = useChildStore();
  const { fields } = useFieldStore();
  const { targets } = useTargetStore();
  const { setCarts } = useCartStore();
  const { setCartEdit } = useCartEditStore();
  const { plans, editPlan } = usePlanStore();
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [text, setText] = useState('');
  const [disable, setDisable] = useState(true);
  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);
  const [isVisibleCommentModal, setIsVisibleCommentModal] = useState(false);

  // Lấy trực tiếp từ firebase
  useEffect(() => {
    if (plan) {
      if (plan.comment) {
        setIsComment(true);
        setText(plan.comment.split('@Js@')[1]);
      }
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
  useEffect(() => {
    if (text !== plan.comment?.split('@Js@')[1]) {
      setDisable(false);
    } else {
      setDisable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const handleEditPlan = () => {
    setIsLoading(true);
    const convertPlanTasksToCarts = planTasks.map(_ => {
      const { targetId, planId, ...newPlanTask } = _;
      return {
        ...newPlanTask,
        targetId: _.targetId,
        fieldId: convertTargetField(_.targetId, targets, fields).fieldId,
        name: convertTargetField(_.targetId, targets, fields).nameTarget,
        level: convertTargetField(_.targetId, targets, fields).levelTarget,
      };
    });

    setCarts(convertPlanTasksToCarts);
    setCartEdit(plan.id);

    setIsLoading(false);
    navigation.navigate('Main', { screen: 'Cart' });
  };
  const hanldeGroupPlanWithField = (planTasks: PlanTaskModel[]) => {
    return groupArrayWithField(
      planTasks.map(_ => {
        return {
          ..._,
          fieldId: convertTargetField(_.targetId, targets, fields).fieldId,
        };
      }),
      'fieldId',
    );
  };
  const handleSaveComment = async () => {
    setIsLoading(true);
    const indexPlan = plans.findIndex(_ => _.id === plan.id);
    editPlan(plan.id, {
      ...plans[indexPlan],
      comment: text ? `${user?.fullName}@Js@${text}` : '',
    });
    await updateDocData({
      nameCollect: 'plans',
      id: plan.id,
      metaDoc: 'plans',
      valueUpdate: { comment: text ? `${user?.fullName}@Js@${text}` : '' },
    });
    setIsLoading(false);
    setDisable(true);
  };
  const handleApproved = () => {
    const indexPlan = plans.findIndex(_ => _.id === plan.id);
    editPlan(plan.id, { ...plans[indexPlan], status: 'approved' });

    setIsLoading(true);
    // tạo url để tải về, lưu vào Firestore của mỗi plan
    const items = hanldeGroupPlanWithField(planTasks).map(planTask => {
      return {
        field: convertTargetField(planTask.targetId, targets, fields).nameField,
        target: convertTargetField(planTask.targetId, targets, fields)
          .nameTarget,
        intervention: planTask.intervention,
        content: planTask.content,
      };
    });
    exportWord({
      rows: items,
      title: plan.title.substring(2).trim(),
      child: child?.fullName,
      teacher: user?.fullName,
      templateName: 'plan',
      fileName: `${plan.title.replace('/', '_')}_${child?.fullName}`,
    })
      .then(url => {
        updateDocData({
          nameCollect: 'plans',
          id: plan.id,
          valueUpdate: { status: 'approved', url },
          metaDoc: 'plans',
        })
          .then(() => {
            setIsLoading(false);
            navigation.navigate('Main', { screen: 'Plan' });
          })
          .catch(error => {
            setIsLoading(false);
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  };
  const openFile = async () => {
    try {
      await Linking.openURL(plan.url);
    } catch (error) {
      Alert.alert('Lỗi file không mở được hoặc chưa tồn tại !');
    }
  };
  const shareFileLink = async () => {
    try {
      await Share.open({
        title: 'Chia sẻ file kế hoạch',
        message: 'Xem file kế hoạch này nhé:',
        url: plan.url, // 🔹 chỉ là link, không phải file local
      });
    } catch (err) {
      console.log('❌ Lỗi chia sẻ:', err);
    }
  };

  if (!child) return <ActivityIndicator />;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['bottom']}>
      <Container
        back
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
          <RowComponent justify="space-between">
            <TextComponent text={plan.title} font={fontFamillies.poppinsBold} />
            {isComment && plan.status === 'pending' && (
              <MessageNotif
                size={sizes.title}
                color={colors.red}
                variant="Bold"
                onPress={() => setIsVisibleCommentModal(true)}
              />
            )}
            {!isComment &&
              plan.status === 'pending' &&
              ['Phó Giám đốc', 'Giám đốc'].includes(user?.position as string) && (
                <MessageAdd
                  size={sizes.title}
                  color={colors.green}
                  variant="Bold"
                  onPress={() => setIsVisibleCommentModal(true)}
                />
              )}
            <TextComponent
              text={plan.status === 'pending' ? 'Chờ duyệt' : 'Đã duyệt'}
              size={sizes.extraComment}
              styles={{ fontStyle: 'italic' }}
            />
          </RowComponent>
          <RowComponent justify="space-between">
            <TextComponent
              styles={{ fontStyle: 'italic' }}
              text={`Gửi lên: ${moment(
                convertTimeStampFirestore(plan?.createAt),
              ).format('HH:mm:ss_DD/MM/YYYY')}`}
              size={sizes.extraComment}
            />
            {convertTimeStampFirestore(plan?.createAt) !==
              convertTimeStampFirestore(plan?.updateAt) && (
                <TextComponent
                  styles={{ fontStyle: 'italic' }}
                  text={`Cập nhật: ${moment(
                    convertTimeStampFirestore(plan?.updateAt),
                  ).format('HH:mm:ss DD/MM/YYYY')}`}
                  size={sizes.extraComment}
                />
              )}
          </RowComponent>

          <SpaceComponent height={8} />

          <KeyboardAwareFlatList
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
            data={hanldeGroupPlanWithField(planTasks)}
            renderItem={({ item, index }) => (
              <PlanItemComponent key={item.id} planTask={item} index={index} />
            )}
            ListFooterComponent={
              <RowComponent
                justify="space-around"
                styles={{ paddingVertical: 16 }}
              >
                {plan.status === 'approved' && plan.url !== '' && (
                  <>
                    <DocumentDownload
                      variant="Bold"
                      size={sizes.extraTitle}
                      color={colors.blue}
                      onPress={openFile}
                    />
                    <FontAwesome5
                      name="share-alt"
                      size={sizes.extraTitle}
                      color={colors.blue}
                      onPress={shareFileLink}
                    />
                  </>
                )}
                {plan.status === 'pending' && (
                  <>
                    {user?.role === 'admin' && (
                      <ArchiveTick
                        variant="Bold"
                        size={sizes.extraTitle}
                        color={colors.green}
                        onPress={handleApproved}
                      />
                    )}
                    <Edit2
                      variant="Bold"
                      size={sizes.extraTitle}
                      color={colors.blue2}
                      onPress={handleEditPlan}
                    />
                    <Trash
                      variant="Bold"
                      size={sizes.extraTitle}
                      color={colors.red}
                      onPress={() => setIsVisibleDeleteModal(true)}
                    />
                  </>
                )}
              </RowComponent>
            }
          />
        </SectionComponent>

        <DeleteModal
          data={{
            id: plan.id,
            type: 'planPending',
            itemTasks: planTasks,
          }}
          visible={isVisibleDeleteModal}
          onClose={() => setIsVisibleDeleteModal(false)}
        />
        <CommentModal
          visible={isVisibleCommentModal}
          disable={disable}
          onClose={() => setIsVisibleCommentModal(false)}
          value={text}
          comment={plan.comment}
          onChange={val => setText(val)}
          handleSaveComment={handleSaveComment}
        />
        <SpinnerComponent loading={isLoading} />
      </Container>
    </SafeAreaView>
  );
};

export default PlanDetailScreen;
