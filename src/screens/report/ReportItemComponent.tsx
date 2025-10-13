import React, { useState } from 'react'
import { View } from 'react-native'
import { InputComponent, RowComponent, TextComponent } from '../../components'
import { fontFamillies } from '../../constants/fontFamilies'

const ReportItemComponent = () => {
  const [text, setText] = useState('');
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
      <TextComponent textAlign='justify' text='Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, accusamus quam. Iusto incidunt doloremque veniam quos magni natus minus laborum quibusdam provident quisquam hic non vitae, sequi nobis quam vel.' />
      <TextComponent text='- Hỗ trực trực tiếp bằng hình ảnh' />
      <TextComponent textAlign='justify' text='- Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, accusamus quam. Iusto incidunt doloremque veniam quos magni natus minus laborum quibusdam provident quisquam hic non vitae, sequi nobis quam vel.' />

      <InputComponent
        textStyles={{
          textAlignVertical: 'top',
          minHeight: 120
        }}
        placeholder="Tổng kết..."
        value={text}
        onChange={(val) => setText(val)}
        multible
        numberOfLine={4}
      />
    </View>
  )
}

export default ReportItemComponent