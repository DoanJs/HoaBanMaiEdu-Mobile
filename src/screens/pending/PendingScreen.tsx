import { Profile2User } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import { Container, RowComponent, SearchComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { colors } from '../../constants/colors'
import { fontFamillies } from '../../constants/fontFamilies'
import { sizes } from '../../constants/sizes'
import { useChildStore, usePlanStore } from '../../zustand/store'
import { PlanModel } from '../../models'

const PendingScreen = ({ navigation }: any) => {
  const [selected, setSelected] = useState('Kế hoạch');
  const { child } = useChildStore()
  const { plans } = usePlanStore()
  const [planNews, setPlanNews] = useState<PlanModel[]>([]);


  useEffect(() => {
    if (plans.length > 0) {
      setPlanNews(plans)
    }
  }, [plans])

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
                : Array.from({ length: 100 }).map((_, index) =>
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
        {/* <ButtonComponent
          text='KH 10/2025'
          onPress={() => { }}
          color={colors.background}
          styles={{ borderWidth: 1, borderColor: 'coral', width:'50%' }} />
        <ButtonComponent
          text='KH 10/2025'
          onPress={() => { }}
          color={colors.background}
          styles={{ borderWidth: 1, borderColor: 'coral', width:'50%' }} /> */}
        {/* <FlatList
          showsVerticalScrollIndicator={false}
          data={Array.from({ length: 10 })}
          renderItem={({ item, index }) => <CartItemComponent key={index} />}
          ListFooterComponent={
            <RowComponent justify="space-around">
              <ButtonComponent
                color='coral'
                text="Lưu nháp"
                onPress={() => {}}
                styles={{ flex: 1 }}
              />
              <SpaceComponent width={16} />
              <ButtonComponent
                color={colors.green}
                text="Gửi duyệt"
                onPress={() => {}}
                styles={{ flex: 1 }}
              />
            </RowComponent>
          }
        /> */}
      </SectionComponent>
    </Container>
  )
}

export default PendingScreen