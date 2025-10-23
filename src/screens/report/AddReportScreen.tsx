import { serverTimestamp, where } from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
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
import { convertTargetField } from '../../constants/convertTargetAndField';
import { addDocData } from '../../constants/firebase/addDocData';
import { deleteDocData } from '../../constants/firebase/deleteDocData';
import { getDocsData } from '../../constants/firebase/getDocsData';
import { groupArrayWithField } from '../../constants/groupArrayWithField';
import { PlanModel, PlanTaskModel, ReportSavedModel } from '../../models';
import {
  useChildStore,
  useFieldStore,
  useReportSavedStore,
  useReportStore,
  useTargetStore,
  useUserStore,
} from '../../zustand/store';
import AddReportItemComponent from './AddReportItemComponent';

const AddReportScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { child } = useChildStore();
  const { user } = useUserStore();
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();
  const [isVisibleAddReport, setIsVisibleAddReport] = useState(false);
  const [planSelected, setPlanSelected] = useState<PlanModel>();
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);
  const [addReports, setAddReports] = useState<any[]>([]);
  const { addReport } = useReportStore();
  const [isLoading, setIsLoading] = useState(false);
  const { reportSaveds } = useReportSavedStore();
  const [isReportSaved, setIsReportSaved] = useState(false);

  useEffect(() => {
    if (planSelected) {
      const items = reportSaveds.filter(
        (reportSaved: ReportSavedModel) =>
          reportSaved.planId === planSelected.id,
      );

      if (items.length > 0) {
        setIsReportSaved(true);
        setPlanTasks(items);
      } else {
        setIsReportSaved(false);
        getDocsData({
          nameCollect: 'planTasks',
          condition: [
            where('teacherIds', 'array-contains', user?.id),
            where('planId', '==', planSelected.id),
          ],
          setData: setPlanTasks,
        });
      }
    }
  }, [planSelected]);
  useEffect(() => {
    if (planTasks) {
      if (isReportSaved) {
        setAddReports(
          planTasks.map((planTask: any) => {
            const { id, ..._ } = planTask;
            return {
              ..._,
              reportSavedId: id,
              id: _.planTaskId,
            };
          }),
        );
      } else {
        setAddReports(planTasks);
      }
    }
  }, [planTasks]);

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

          if (isReportSaved) {
            const promiseReportSavedtems = addReports.map(reportSaved =>
              deleteDocData({
                nameCollect: 'reportSaveds',
                id: reportSaved.reportSavedId,
                metaDoc: 'reportSaveds',
              }),
            );
            await Promise.all(promiseReportSavedtems);
          }

          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          console.log(error);
        });
      navigation.navigate('Main', { screen: 'Pending' });
    }
  };
  const hanldeGroupPlanWithField = (addReports: any[]) => {
    return groupArrayWithField(
      addReports.map(_ => {
        return {
          ..._,
          fieldId: convertTargetField(_.targetId, targets, fields).fieldId,
        };
      }),
      'fieldId',
    );
  };
  const handleSaveReportSaved = async () => {
    if (isReportSaved) {
      // xoa het them lai
      const promiseReportSavedtems = addReports.map(reportSaved =>
        deleteDocData({
          nameCollect: 'reportSaveds',
          id: reportSaved.reportSavedId,
          metaDoc: 'reportSaveds',
        }),
      );
      await Promise.all(promiseReportSavedtems);
    }

    // them moi tat ca
    const promiseItems = addReports.map(_ => {
      const { id, ...data } = _;
      addDocData({
        nameCollect: 'reportSaveds',
        value: {
          ...data,
          planTaskId: id,
          total: _.total ?? '',
        },
        metaDoc: 'reportSaveds',
      });
    });

    Promise.all(promiseItems)
      .then(() => {
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  };

  if (!child) return <ActivityIndicator />;
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['bottom']}
    >
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
            <KeyboardAwareFlatList
              keyboardShouldPersistTaps="handled"
              enableOnAndroid={true}
              extraScrollHeight={100}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
              data={hanldeGroupPlanWithField(addReports)}
              renderItem={({ item, index }) => (
                <AddReportItemComponent
                  key={item.id}
                  index={index}
                  addReport={item}
                  addReports={addReports}
                />
              )}
              ListFooterComponent={
                <RowComponent
                  justify="space-around"
                  styles={{ paddingVertical: 16 }}
                >
                  <ButtonComponent
                    color={colors.orange}
                    text="Lưu nháp"
                    onPress={handleSaveReportSaved}
                    styles={{ flex: 1 }}
                  />
                  <SpaceComponent width={20} />
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
    </SafeAreaView>
  );
};

export default AddReportScreen;
