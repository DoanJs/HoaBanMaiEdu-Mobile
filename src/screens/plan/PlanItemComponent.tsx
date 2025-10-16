import React from 'react'
import { View } from 'react-native'
import { RowComponent, TextComponent } from '../../components'
import { convertTargetField } from '../../constants/convertTargetAndField'
import { fontFamillies } from '../../constants/fontFamilies'
import { PlanTaskModel } from '../../models'
import { useFieldStore, useTargetStore } from '../../zustand/store'

interface Props {
  index: number
  planTask: PlanTaskModel
}
const PlanItemComponent = (props: Props) => {
  const { index, planTask } = props
  const { targets } = useTargetStore()
  const { fields } = useFieldStore()

  return (
    <View style={{
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'coral',
      marginBottom: 10,
    }}>
      <RowComponent justify='space-between'>
        <TextComponent text={`${index + 1}. ${convertTargetField(planTask.targetId, targets, fields).nameField}`} font={fontFamillies.poppinsBold} />
        <TextComponent text='Level 2' font={fontFamillies.poppinsBold} />
      </RowComponent>
      <TextComponent text={convertTargetField(planTask.targetId, targets, fields).nameTarget} />
      <TextComponent text={`- ${planTask.intervention !== '' ? planTask.intervention : 'Trống'}`} styles={{ fontStyle: planTask.intervention !== '' ? 'normal' : 'italic' }} />
      <TextComponent text={`- ${planTask.content !== '' ? planTask.content : 'Trống'}`} styles={{ fontStyle: planTask.intervention !== '' ? 'normal' : 'italic' }} />
    </View>
  )
}

export default PlanItemComponent