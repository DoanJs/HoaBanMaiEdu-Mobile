import {
  doc,
  getDoc,
  serverTimestamp,
  where,
} from '@react-native-firebase/firestore';
import {
  ArchiveTick,
  DocumentDownload,
  MessageAdd,
  MessageNotif,
  Profile2User,
  Trash,
} from 'iconsax-react-native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Linking } from 'react-native';
import Share from 'react-native-share';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { db } from '../../../firebase.config';
import {
  Container,
  RowComponent,
  SectionComponent,
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
import { PlanTaskModel, ReportTaskModel } from '../../models';
import {
  useChildStore,
  useFieldStore,
  useReportStore,
  useTargetStore,
  useUserStore,
} from '../../zustand/store';
import ReportItemComponent from './ReportItemComponent';

const ReportDetailScreen = ({ navigation, route }: any) => {
  const { report } = route.params;
  const { child } = useChildStore();
  const { user } = useUserStore();
  const [disable, setDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();
  const { reports, editReport } = useReportStore();
  const [isComment, setIsComment] = useState(false);
  const [text, setText] = useState('');
  const [reportTasks, setReportTasks] = useState<ReportTaskModel[]>([]);
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);
  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);
  const [isVisibleCommentModal, setIsVisibleCommentModal] = useState(false);

  // Lấy trực tiếp từ firebase
  useEffect(() => {
    if (report) {
      if (report.comment) {
        setIsComment(true);
        setText(report.comment.split('@Js@')[1]);
      }
      getDocsData({
        nameCollect: 'reportTasks',
        condition: [
          where('teacherIds', 'array-contains', user?.id),
          where('reportId', '==', report.id),
        ],
        setData: setReportTasks,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report]);
  useEffect(() => {
    if (reportTasks.length > 0) {
      getPlanTasks(reportTasks);
    }
  }, [reportTasks]);
  useEffect(() => {
    if (text !== report.comment?.split('@Js@')[1]) {
      setDisable(false);
    } else {
      setDisable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const handleSaveReportTask = async () => {
    // luu phia firestore
    if (!disable) {
      try {
        setIsLoading(true);
        const promiseItems = reportTasks.map(_ =>
          updateDocData({
            nameCollect: 'reportTasks',
            id: _.id,
            valueUpdate: {
              content: _.content,
              updateAt: serverTimestamp(),
            },
            metaDoc: 'reports',
          }),
        );
        await Promise.all(promiseItems);
        setIsLoading(false);
        setDisable(true);
      } catch (error) {
        setIsLoading(false);
        setDisable(true);
      }
    }
  };
  const getPlanTask = (planTaskId: string, planTasks: PlanTaskModel[]) => {
    const index = planTasks.findIndex(planTask => planTask.id === planTaskId);
    if (index !== -1) {
      return planTasks[index];
    }
  };
  const getPlanTasks = async (reportTasks: ReportTaskModel[]) => {
    const promiseItems = reportTasks.map(async reportTask => {
      const docSnap = await getDoc(doc(db, 'planTasks', reportTask.planTaskId));
      return {
        ...docSnap.data(),
        id: docSnap.id,
      };
    });
    const result = await Promise.all(promiseItems);

    setPlanTasks(result as PlanTaskModel[]);
  };
  const handleGroupReportWithField = (reportTasks: ReportTaskModel[]) => {
    return groupArrayWithField(
      reportTasks.map(reportTask => {
        return {
          ...reportTask,
          fieldId: convertTargetField(
            getPlanTask(reportTask.planTaskId, planTasks)?.targetId as string,
            targets,
            fields,
          ).fieldId,
        };
      }),
      'fieldId',
    );
  };
  const handleSaveComment = async () => {
    setIsLoading(true);
    const indexReport = reports.findIndex(_ => _.id === report.id);
    editReport(report.id, {
      ...reports[indexReport],
      comment: text ? `${user?.fullName}@Js@${text}` : '',
    });
    await updateDocData({
      nameCollect: 'reports',
      id: report.id,
      metaDoc: 'reports',
      valueUpdate: {
        comment: text !== '' ? `${user?.fullName}@Js@${text}` : '',
      },
    });
    setIsLoading(false);
    setDisable(true);
  };
  const handleApproved = async () => {
    const indexReport = reports.findIndex(_ => _.id === report.id);
    editReport(report.id, { ...reports[indexReport], status: 'approved' });

    setIsLoading(true);

    const promiseItems = handleGroupReportWithField(reportTasks).map(
      async reportTask => {
        const docSnap = await getDoc(
          doc(db, 'planTasks', reportTask.planTaskId),
        );
        if (docSnap.exists()) {
          return {
            intervention: docSnap.data()?.intervention,
            content: docSnap.data()?.content,
            field: convertTargetField(docSnap.data()?.targetId, targets, fields)
              .nameField,
            target: convertTargetField(
              docSnap.data()?.targetId,
              targets,
              fields,
            ).nameTarget,
            total: reportTask.content,
          };
        } else {
          console.log(`getDoc data error`);
        }
      },
    );
    const result = await Promise.all(promiseItems);

    exportWord({
      rows: result,
      title: report.title.substring(2).trim(),
      child: child?.fullName,
      teacher: user?.fullName,
      templateName: 'report',
      fileName: `${report.title.replace('/', '_')}_${child?.fullName}`,
    })
      .then((url: string) => {
        updateDocData({
          nameCollect: 'reports',
          id: report.id,
          valueUpdate: { status: 'approved', url },
          metaDoc: 'reports',
        })
          .then(() => {
            setIsLoading(false);
            navigation.navigate('Main', { screen: 'Report' });
          })
          .catch(error => {
            setIsLoading(false);
            console.log(error);
          });
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  };
  const openFile = async () => {
    try {
      await Linking.openURL(report.url);
    } catch (error) {
      Alert.alert('Lỗi file không mở được hoặc chưa tồn tại !');
    }
  };
  const shareFileLink = async () => {
    try {
      await Share.open({
        title: 'Chia sẻ file Báo cáo',
        message: 'Xem file Báo cáo này nhé:',
        url: report.url, // 🔹 chỉ là link, không phải file local
      });
    } catch (err) {
      console.log('❌ Lỗi chia sẻ:', err);
    }
  };

  if (!child) return <ActivityIndicator />;
  return (
    <Container
      back
      bg={colors.primaryLight}
      title={child.fullName}
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
          <TextComponent text={report.title} font={fontFamillies.poppinsBold} />
          {isComment && report.status === 'pending' && (
            <MessageNotif
              size={sizes.title}
              color={colors.red}
              variant="Bold"
              onPress={() => setIsVisibleCommentModal(true)}
            />
          )}
          {!isComment &&
            report.status === 'pending' &&
            ['Phó Giám đốc', 'Giám đốc'].includes(user?.position as string) && (
              <MessageAdd
                size={sizes.title}
                color={colors.green}
                variant="Bold"
                onPress={() => setIsVisibleCommentModal(true)}
              />
            )}
          {convertTimeStampFirestore(report?.createAt) !==
          convertTimeStampFirestore(report?.updateAt) ? (
            <TextComponent
              styles={{ fontStyle: 'italic' }}
              text={`Cập nhật: ${moment(
                convertTimeStampFirestore(report?.updateAt),
              ).format('HH:mm:ss DD/MM/YYYY')}`}
              size={sizes.smallText}
            />
          ) : (
            <TextComponent
              styles={{ fontStyle: 'italic' }}
              text={`Gửi lên: ${moment(
                convertTimeStampFirestore(report?.createAt),
              ).format('HH:mm:ss_DD/MM/YYYY')}`}
              size={sizes.smallText}
            />
          )}
          <TextComponent
            text={report.status === 'pending' ? 'Chờ duyệt' : 'Đã duyệt'}
            size={sizes.smallText}
            styles={{ fontStyle: 'italic' }}
          />
        </RowComponent>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={handleGroupReportWithField(reportTasks)}
          renderItem={({ item, index }) => (
            <ReportItemComponent
              key={index}
              index={index}
              report={report}
              reportTask={item}
              reportTasks={reportTasks}
              onSetReportTasks={setReportTasks}
              setDisable={setDisable}
              onChange={() => {}}
            />
          )}
          ListFooterComponent={
            <RowComponent
              justify="space-around"
              styles={{ paddingVertical: 10 }}
            >
              {report.status === 'approved' && report.url !== '' && (
                <>
                  <DocumentDownload
                    variant="Bold"
                    size={sizes.extraTitle}
                    color={colors.blue}
                    onPress={openFile}
                  />
                  <FontAwesome5
                    name="share-alt"
                    size={sizes.bigTitle}
                    color={colors.blue}
                    onPress={shareFileLink}
                  />
                </>
              )}
              {report.status === 'pending' && (
                <>
                  {user?.role === 'admin' && (
                    <ArchiveTick
                      variant="Bold"
                      size={sizes.extraTitle}
                      color={colors.green}
                      onPress={handleApproved}
                    />
                  )}
                  <Entypo
                    name="save"
                    size={sizes.extraTitle}
                    color={disable ? colors.gray2 : colors.blue}
                    onPress={disable ? () => {} : handleSaveReportTask}
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
          id: report.id,
          type: 'reportPending',
          itemTasks: reportTasks,
        }}
        visible={isVisibleDeleteModal}
        onClose={() => setIsVisibleDeleteModal(false)}
      />
      <CommentModal
        visible={isVisibleCommentModal}
        disable={disable}
        onClose={() => setIsVisibleCommentModal(false)}
        value={text}
        comment={report.comment}
        onChange={val => setText(val)}
        handleSaveComment={handleSaveComment}
      />
      <SpinnerComponent loading={isLoading} />
    </Container>
  );
};

export default ReportDetailScreen;
