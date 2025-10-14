import { Logout } from 'iconsax-react-native'
import React, { useState } from 'react'
import { Image, ScrollView, TouchableOpacity } from 'react-native'
import { auth, signOut } from '../../../firebase.config'
import { Container, RowComponent, SearchComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { colors } from '../../constants/colors'
import { fontFamillies } from '../../constants/fontFamilies'
import { sizes } from '../../constants/sizes'


const ChildrenScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    await signOut(auth);

    setIsLoading(false);
  };

  return (
    <Container
      bg={colors.primaryLight}
      title="Cô Trần Thị My Ny _ Giám đốc"
      right={
        <Logout
          onPress={handleLogout}
          size={sizes.title}
          color={colors.orange}
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
        <SearchComponent
          arrSource={[]}
          onChange={() => { }}
          placeholder="Nhập tên trẻ"
          type="searchChild"
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <RowComponent justify='space-around' styles={{ flexWrap: 'wrap' }}>
            {
              Array.from({ length: 20 }).map((_, index) =>
                <TouchableOpacity key={index}
                  onPress={() => navigation.navigate('Main')}
                  style={{
                    alignItems: 'center',
                    width: '45%',
                    marginVertical: 16,
                  }}>
                  <Image
                    style={{
                      height: 150, width: 150,
                      borderRadius: 10, resizeMode: 'cover'
                    }}
                    source={{ uri: 'https://cdn.pixabay.com/photo/2019/10/30/16/19/fox-4589927_1280.jpg' }} />
                  <SpaceComponent height={10} />
                  <TextComponent size={sizes.smallText} text='Nguyễn Hoàng Đăng (Bin)' font={fontFamillies.poppinsBold} />
                </TouchableOpacity>
              )
            }
          </RowComponent>
        </ScrollView>
      </SectionComponent>
    </Container>
  )
}

export default ChildrenScreen