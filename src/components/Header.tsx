import React from 'react'
import { Image } from 'react-native'
import { RowComponent, SectionComponent, SpaceComponent, TextComponent } from '.'
import { fontFamillies } from '../constants/fontFamilies'
import { sizes } from '../constants/sizes'
import { globalStyles } from '../styles/globalStyles'

const Header = () => {
  return (
    <SectionComponent styles={[globalStyles.header, { paddingVertical: 10 }]}>
      <RowComponent>
        <Image
          style={{ height: 32, width: 32, borderRadius: 100, resizeMode: 'cover' }}
          source={{ uri: 'https://cdn.pixabay.com/photo/2019/10/30/16/19/fox-4589927_1280.jpg' }} />
        <SpaceComponent width={10} />
        <TextComponent text='NGUYỄN HOÀNG ĐĂNG (Bin)' size={sizes.bigText} font={fontFamillies.poppinsBold} />
      </RowComponent>
    </SectionComponent>
  )
}

export default Header