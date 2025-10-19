import { serverTimestamp, where } from '@react-native-firebase/firestore';
import { Profile2User } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import {
  ButtonComponent,
  Container,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent,
} from '../../components';
import { AddReportModal } from '../../components/modals';
import { colors } from '../../constants/colors';
import { addDocData } from '../../constants/firebase/addDocData';
import { getDocsData } from '../../constants/firebase/getDocsData';
import { fontFamillies } from '../../constants/fontFamilies';
import { sizes } from '../../constants/sizes';
import { PlanModel, PlanTaskModel } from '../../models';
import {
  useChildStore,
  useReportStore,
  useUserStore,
} from '../../zustand/store';
import AddReportItemComponent from './AddReportItemComponent';

const AddReportScreen = ({ navigation }: any) => {
  const { child } = useChildStore();
  const { user } = useUserStore();
  const [isVisibleAddReport, setIsVisibleAddReport] = useState(false);
  const [planSelected, setPlanSelected] = useState<PlanModel>();
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);
  const [addReports, setAddReports] = useState<any[]>([]);
  const { addReport } = useReportStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (planSelected) {
      //   const index = planApprovals.findIndex(_ => _.id === planId);
      //   setPlan(planApprovals[index]);
      getDocsData({
        nameCollect: 'planTasks',
        condition: [
          where('teacherIds', 'array-contains', user?.id),
          where('planId', '==', planSelected.id),
        ],
        setData: setPlanTasks,
      });
    }
  }, [planSelected]);
  useEffect(() => {
    if (planTasks) {
      setAddReports(planTasks);
    }
  }, [planTasks]);

  const handleChangeValue = (data: { val: string; planTaskId: string }) => {
    const index = addReports.findIndex((_: any) => _.id === data.planTaskId);
    addReports[index].total = data.val;
    setAddReports(addReports);
  };
  const handleAddReport = async () => {
    if (user && child) {
      setIsLoading(true);
      await addDocData({
        nameCollect: 'reports',
        value: {
          type: 'BC',
          title: planSelected?.title.replace('KH', 'BC'),
          childId: child.id,
          teacherIds: child.teacherIds,
          planId: planSelected?.id,
          status: 'pending',
          comment: '',
          url: '',

          createAt: serverTimestamp(),
          updateAt: serverTimestamp(),
        },
        metaDoc: 'reports',
      })
        .then(async result => {
          addReport({
            id: result.id,
            type: 'BC',
            title: planSelected?.title.replace('KH', 'BC') as string,
            childId: child.id,
            teacherIds: child.teacherIds,
            authorId: user.id,
            planId: planSelected?.id as string,
            status: 'pending',
            comment: '',
            url: '',

            createAt: serverTimestamp(),
            updateAt: serverTimestamp(),
          });
          const promiseItems = addReports.map(_ =>
            addDocData({
              nameCollect: 'reportTasks',
              value: {
                reportId: result.id,
                planId: planSelected?.id as string,
                childId: child.id,
                planTaskId: _.id,
                content: _.total ?? '',
                isEdit: false,
                teacherIds: child.teacherIds,

                createAt: serverTimestamp(),
                updateAt: serverTimestamp(),
              },
              metaDoc: 'reports',
            }),
          );

          await Promise.all(promiseItems);
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          console.log(error);
        });
      navigation.navigate('Main', { screen: 'Pending' });
    }
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
        <TouchableOpacity onPress={() => setIsVisibleAddReport(true)}>
          <TextComponent
            text={planSelected ? planSelected.title : 'Chọn kế hoạch tháng'}
            styles={{
              backgroundColor: colors.primary + '80',
              padding: 10,
              borderRadius: 10,
              textAlign: 'center',
            }}
          />
        </TouchableOpacity>
        <SpaceComponent height={10} />

        {planSelected && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={addReports}
            renderItem={({ item, index }) => (
              <AddReportItemComponent
                key={item.id}
                index={index}
                addReport={item}
                onChange={(data: { val: string; planTaskId: string }) =>
                  handleChangeValue(data)
                }
              />
            )}
            ListFooterComponent={
              <RowComponent
                justify="space-around"
                styles={{ paddingVertical: 16 }}
              >
                <ButtonComponent
                  color={colors.green}
                  text="Gửi duyệt"
                  onPress={handleAddReport}
                  styles={{ flex: 1 }}
                />
              </RowComponent>
            }
          />
        )}
      </SectionComponent>

      <AddReportModal
        visible={isVisibleAddReport}
        onClose={() => setIsVisibleAddReport(false)}
        onChange={val => setPlanSelected(val)}
        planSelected={planSelected}
      />
      <SpinnerComponent loading={isLoading} />
    </Container>
  );
};

export default AddReportScreen;
