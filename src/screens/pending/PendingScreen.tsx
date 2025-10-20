import { where } from '@react-native-firebase/firestore';
import { MessageNotif, Profile2User } from 'iconsax-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
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
import { PlanModel, ReportModel } from '../../models';
import {
  useChildStore,
  usePlanStore,
  useReportStore,
  useUserStore,
} from '../../zustand/store';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const PendingScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets()
  const [selected, setSelected] = useState('Kế hoạch');
  const { child } = useChildStore();
  const { user } = useUserStore();
  const { plans, setPlans } = usePlanStore();
  const [planNews, setPlanNews] = useState<PlanModel[]>([]);
  const { reports, setReports } = useReportStore();
  const [reportNews, setReportNews] = useState<ReportModel[]>([]);
  const [refreshing, setRefreshing] = useState(false); // loading khi kéo xuống

  useEffect(() => {
    if (plans.length > 0) {
      setPlanNews(plans.filter(plan => plan.status === 'pending'));
    }
  }, [plans]);
  useEffect(() => {
    if (reports.length > 0) {
      setReportNews(reports.filter(report => report.status === 'pending'));
    }
  }, [reports]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      getDocsData({
        nameCollect: 'plans',
        condition: [where('teacherIds', 'array-contains', user?.id)],
        setData: setPlans,
      });
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
          <RowComponent
            justify="space-between"
            styles={{
              borderBottomColor: colors.textBold,
              borderBottomWidth: 1,
              paddingBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setSelected('Kế hoạch')}
              style={{
                backgroundColor:
                  selected === 'Kế hoạch' ? 'coral' : colors.background,
                padding: 10,
                borderRadius: 10,
              }}
            >
              <TextComponent
                text="Kế hoạch"
                font={fontFamillies.poppinsBold}
                color={selected === 'Kế hoạch' ? colors.background : colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelected('Báo cáo')}
              style={{
                backgroundColor:
                  selected === 'Báo cáo' ? 'coral' : colors.background,
                padding: 10,
                borderRadius: 10,
              }}
            >
              <TextComponent
                text="Báo cáo"
                font={fontFamillies.poppinsBold}
                color={selected === 'Báo cáo' ? colors.background : colors.text}
              />
            </TouchableOpacity>
          </RowComponent>

          <SpaceComponent height={10} />

          <SearchComponent
            arrSource={
              selected === 'Kế hoạch'
                ? plans.filter(plan => plan.status === 'pending')
                : reports.filter(report => report.status === 'pending')
            }
            onChange={
              selected === 'Kế hoạch'
                ? val => setPlanNews(val)
                : val => setReportNews(val)
            }
            placeholder={`Nhập ${selected === 'Kế hoạch' ? 'kế hoạch' : 'báo cáo'
              }`}
            type={selected === 'Kế hoạch' ? 'searchPlan' : 'searchReport'}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <RowComponent
              justify="space-around"
              styles={{ flexWrap: 'wrap', paddingTop: 10 }}
            >
              {selected === 'Kế hoạch'
                ? planNews.map((_, index) => (
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
                      position: 'relative',
                    }}
                  >
                    <TextComponent
                      text={_.title}
                      font={fontFamillies.poppinsBold}
                    />
                    {_.comment && (
                      <View
                        style={{
                          position: 'absolute',
                          top: -10,
                          right: 0,
                        }}
                      >
                        <MessageNotif
                          color={colors.red}
                          size={sizes.title}
                          variant="Bold"
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                ))
                : reportNews.map((_, index) => (
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
                      position: 'relative',
                    }}
                  >
                    <TextComponent
                      text={_.title}
                      font={fontFamillies.poppinsBold}
                    />
                    {_.comment && (
                      <View
                        style={{
                          position: 'absolute',
                          top: -10,
                          right: 0,
                        }}
                      >
                        <MessageNotif
                          color={colors.red}
                          size={sizes.title}
                          variant="Bold"
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
            </RowComponent>
          </ScrollView>
        </SectionComponent>
      </Container>
    </SafeAreaView>
  );
};

export default PendingScreen;
