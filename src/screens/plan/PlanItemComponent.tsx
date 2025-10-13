import React from 'react'
import { View } from 'react-native'
import { RowComponent, TextComponent } from '../../components'
import { fontFamillies } from '../../constants/fontFamilies'

const PlanItemComponent = () => {
  return (
    <View style={{
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'coral',
      marginBottom: 10,
    }}>
      <RowComponent justify='space-between'>
        <TextComponent text='1. Ngôn ngữ diễn đạt' font={fontFamillies.poppinsBold} />
        <TextComponent text='Level 2' font={fontFamillies.poppinsBold} />
      </RowComponent>
      <TextComponent text='Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, accusamus quam. Iusto incidunt doloremque veniam quos magni natus minus laborum quibusdam provident quisquam hic non vitae, sequi nobis quam vel.' />
      <TextComponent text='- Hỗ trực trực tiếp bằng hình ảnh' />
      <TextComponent text='- Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, accusamus quam. Iusto incidunt doloremque veniam quos magni natus minus laborum quibusdam provident quisquam hic non vitae, sequi nobis quam vel.' />
    </View>
  )
}

export default PlanItemComponent