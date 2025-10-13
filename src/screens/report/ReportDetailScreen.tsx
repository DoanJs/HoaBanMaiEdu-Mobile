import { Profile2User } from 'iconsax-react-native'
import React from 'react'
import { FlatList } from 'react-native'
import { ButtonComponent, Container, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { colors } from '../../constants/colors'
import { fontFamillies } from '../../constants/fontFamilies'
import { sizes } from '../../constants/sizes'
import ReportItemComponent from './ReportItemComponent'

const ReportDetailScreen = () => {
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
        <TextComponent text='BC 10/2025' font={fontFamillies.poppinsBold} />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={Array.from({ length: 10 })}
          renderItem={({ item, index }) => <ReportItemComponent key={index} />}
          ListFooterComponent={
            <RowComponent justify="space-around">
              <ButtonComponent
                color={colors.blue}
                text="Lưu"
                onPress={() => { }}
                styles={{ flex: 1 }}
                textStyles={{color: colors.background}}
              />
              <SpaceComponent width={16} />
              {/* <ButtonComponent
                color={colors.green}
                text="Xuất file"
                onPress={() => { }}
                styles={{ flex: 1 }}
              /> */}
            </RowComponent>
          }
        />
      </SectionComponent>
    </Container>
  )
}

export default ReportDetailScreen