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
import { ReportModel } from '../../models';
import {
  useChildStore,
  useReportStore,
  useUserStore,
} from '../../zustand/store';

const ReportScreen = ({ navigation }: any) => {
  const { child } = useChildStore();
  const { user } = useUserStore();
  const { reports, setReports } = useReportStore();
  const [reportsApproved, setReportsApproved] = useState<ReportModel[]>([]);
  const [refreshing, setRefreshing] = useState(false); // loading khi kéo xuống

  useEffect(() => {
    if (reports.length > 0) {
      setReportsApproved(
        reports.filter(report => report.status === 'approved'),
      );
    }
  }, [reports]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      getDocsData({
        nameCollect: 'reports',
        condition: [where('teacherIds', 'array-contains', user?.id)],
        setData: setReports,
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

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
            arrSource={reports.filter(report => report.status === 'approved')}
            onChange={val => setReportsApproved(val)}
            placeholder="Nhập báo cáo"
            type="searchReport"
          />
          <SpaceComponent width={20} />
          <AddCircle
            onPress={() => navigation.navigate('AddReportScreen')}
            size={sizes.title}
            color={colors.primary}
            variant="Bold"
          />
        </RowComponent>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <SpaceComponent height={6} />
          <RowComponent justify="space-around" styles={{ flexWrap: 'wrap' }}>
            {reportsApproved.map((_, index) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ReportDetailScreen', { report: _ })
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

export default ReportScreen;
