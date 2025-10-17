import { serverTimestamp, where } from '@react-native-firebase/firestore'
import { DocumentDownload, Profile2User, Trash } from 'iconsax-react-native'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import { Container, RowComponent, SectionComponent, SpinnerComponent, TextComponent } from '../../components'
import { DeleteModal } from '../../components/modals'
import { colors } from '../../constants/colors'
import { convertTimeStampFirestore } from '../../constants/convertTimeStampFirestore'
import { getDocsData } from '../../constants/firebase/getDocsData'
import { updateDocData } from '../../constants/firebase/updateDocData'
import { fontFamillies } from '../../constants/fontFamilies'
import { sizes } from '../../constants/sizes'
import { ReportTaskModel } from '../../models'
import { useChildStore, useUserStore } from '../../zustand/store'
import ReportItemComponent from './ReportItemComponent'

const ReportDetailScreen = ({ navigation, route }: any) => {
  const { report } = route.params
  const { child } = useChildStore()
  const { user } = useUserStore()
  const [disable, setDisable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [reportTasks, setReportTasks] = useState<ReportTaskModel[]>([]);
  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);

  // Lấy trực tiếp từ firebase
  useEffect(() => {
    if (report) {
      // if (comment) {
      //   setIsComment(true);
      //   setText(comment.split("@Js@")[1]);
      // }
      getDocsData({
        nameCollect: "reportTasks",
        condition: [
          where("teacherIds", "array-contains", user?.id),
          where("reportId", "==", report.id),
        ],
        setData: setReportTasks,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report]);


  const handleSaveReportTask = async () => {
    // luu phia firestore
    if (!disable) {
      try {
        setIsLoading(true);
        const promiseItems = reportTasks.map((_) =>
          updateDocData({
            nameCollect: "reportTasks",
            id: _.id,
            valueUpdate: {
              content: _.content,
              updateAt: serverTimestamp(),
            },
            metaDoc: "reports",
          })
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

  if (!child) return <ActivityIndicator />
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
        <RowComponent justify='space-between'>
          <TextComponent text={report.title} font={fontFamillies.poppinsBold} />
          {convertTimeStampFirestore(report?.createAt) !==
            convertTimeStampFirestore(report?.updateAt) ? (
            <TextComponent
              styles={{ fontStyle: "italic" }}
              text={`Cập nhật: ${moment(
                convertTimeStampFirestore(report?.updateAt)
              ).format("HH:mm:ss DD/MM/YYYY")}`}
              size={sizes.smallText}
            />
          ) :
            <TextComponent
              styles={{ fontStyle: "italic" }}
              text={`Gửi lên: ${moment(
                convertTimeStampFirestore(report?.createAt)
              ).format("HH:mm:ss_DD/MM/YYYY")}`}
              size={sizes.smallText}
            />}
          <TextComponent
            text={report.status === 'pending' ? 'Chờ duyệt' : 'Đã duyệt'}
            size={sizes.smallText}
            styles={{ fontStyle: 'italic' }}
          />
        </RowComponent>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={reportTasks}
          renderItem={({ item, index }) =>
            <ReportItemComponent
              key={index}
              index={index}
              reportTask={item}
              reportTasks={reportTasks}
              onSetReportTasks={setReportTasks}
              setDisable={setDisable}
              onChange={() => { }}
            />}
          ListFooterComponent={
            <RowComponent justify="space-around" styles={{ paddingVertical: 10 }}>
              {report.status === 'approved' && (
                <DocumentDownload
                  variant="Bold"
                  size={sizes.extraTitle}
                  color={colors.blue}
                  onPress={() => { }}
                />
              )}
              {report.status === 'pending' && (
                <>
                  <Entypo
                    name="save"
                    size={sizes.extraTitle}
                    color={disable ? colors.gray2 : colors.blue}
                    onPress={disable ? () => { } : handleSaveReportTask}
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
        id: report.id,
        type: 'reportPending',
        itemTasks: reportTasks
      }}
        visible={isVisibleDeleteModal}
        onClose={() => setIsVisibleDeleteModal(false)}
      />
      <SpinnerComponent loading={isLoading} />
    </Container>
  )
}

export default ReportDetailScreen