import { Profile2User } from 'iconsax-react-native'
import React from 'react'
import { FlatList } from 'react-native'
import { ButtonComponent, Container, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { colors } from '../../constants/colors'
import { fontFamillies } from '../../constants/fontFamilies'
import { sizes } from '../../constants/sizes'
import PlanItemComponent from './PlanItemComponent'

const PlanDetailScreen = () => {
  return (
    <Container
      back
      bg={colors.primaryLight}
      title="NGUYỄN HOÀNG ĐĂNG (Bin)"
      right={
        <Profile2User
          size={sizes.title}
          color={colors.textBold}
          variant="Bold"
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
        <TextComponent text='KH 10/2025' font={fontFamillies.poppinsBold} />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={Array.from({ length: 10 })}
          renderItem={({ item, index }) => <PlanItemComponent key={index} />}
          ListFooterComponent={
            <RowComponent justify="space-around">
              <ButtonComponent
                color='coral'
                text="Sửa"
                onPress={() => { }}
                styles={{ flex: 1 }}
              />
              <SpaceComponent width={16} />
              <ButtonComponent
                color={colors.green}
                text="Xuất file"
                onPress={() => { }}
                styles={{ flex: 1 }}
              />
            </RowComponent>
          }
        />
      </SectionComponent>
    </Container>
  )
}

export default PlanDetailScreen