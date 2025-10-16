import { Profile2User } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import { Container, RowComponent, SearchComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { colors } from '../../constants/colors'
import { fontFamillies } from '../../constants/fontFamilies'
import { sizes } from '../../constants/sizes'
import { useChildStore, usePlanStore, useReportStore } from '../../zustand/store'
import { PlanModel, ReportModel } from '../../models'

const PendingScreen = ({ navigation }: any) => {
  const [selected, setSelected] = useState('Kế hoạch');
  const { child } = useChildStore()
  const { plans } = usePlanStore()
  const [planNews, setPlanNews] = useState<PlanModel[]>([]);
  const { reports} = useReportStore()
  const [reportNews, setReportNews] = useState<ReportModel[]>([]);


  useEffect(() => {
    if (plans.length > 0) {
      setPlanNews(plans.filter((plan) => plan.status === "pending"))
    }
  }, [plans])
  useEffect(() => {
    if (reports.length > 0) {
      setReportNews(reports.filter((report) => report.status === "pending"))
    }
  }, [reports])

console.log(reportNews)
  if (!child) return <ActivityIndicator />
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
        <RowComponent justify='space-between' styles={{
          borderBottomColor: colors.textBold,
          borderBottomWidth: 1,
          paddingBottom: 10
        }}>
          <TouchableOpacity
            onPress={() => setSelected('Kế hoạch')}
            style={{
              backgroundColor: selected === 'Kế hoạch' ? 'coral' : colors.background,
              padding: 10,
              borderRadius: 10
            }}>
            <TextComponent text='Kế hoạch'
              font={fontFamillies.poppinsBold}
              color={selected === 'Kế hoạch' ? colors.background : colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelected('Báo cáo')}
            style={{
              backgroundColor: selected === 'Báo cáo' ? 'coral' : colors.background,
              padding: 10,
              borderRadius: 10
            }}>
            <TextComponent text='Báo cáo'
              font={fontFamillies.poppinsBold}
              color={selected === 'Báo cáo' ? colors.background : colors.text}
            />
          </TouchableOpacity>
        </RowComponent>

        <SpaceComponent height={10} />

        <SearchComponent
          arrSource={selected === 'Kế hoạch' ? plans : []}
          onChange={selected === 'Kế hoạch' ? (val) => setPlanNews(val) : () => { }}
          placeholder={`Nhập ${selected === 'Kế hoạch' ? 'kế hoạch' : 'báo cáo'}`}
          type="searchPlan"
        />

        <SpaceComponent height={10} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <RowComponent justify="space-around" styles={{ flexWrap: 'wrap' }}>
            {
              selected === 'Kế hoạch'
                ? planNews.map((_, index) =>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('PlanDetailScreen', {plan: _})}
                    key={index}
                    style={{
                      padding: 10,
                      width: '45%',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'coral',
                      borderRadius: 100,
                      marginBottom: 10,
                      marginLeft: 10
                    }}>
                    <TextComponent text={_.title} font={fontFamillies.poppinsBold} />
                  </TouchableOpacity>
                )
                : reportNews.map((_, index) =>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ReportDetailScreen')}
                    key={index}
                    style={{
                      padding: 10,
                      width: '45%',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'coral',
                      borderRadius: 100,
                      marginBottom: 10,
                      marginLeft: 10
                    }}>
                    <TextComponent text='BC 10/2025' font={fontFamillies.poppinsBold} />
                  </TouchableOpacity>
                )
            }

          </RowComponent>
        </ScrollView>
      </SectionComponent>
    </Container>
  )
}

export default PendingScreen