import React, { useState } from 'react';
import { View } from 'react-native';
import { InputComponent, RowComponent, TextComponent } from '../../components';
import { convertTargetField } from '../../constants/convertTargetAndField';
import { fontFamillies } from '../../constants/fontFamilies';
import { useFieldStore, useTargetStore } from '../../zustand/store';

interface Props {
  index: number;
  addReport: any;
  onChange: (data: { val: string; planTaskId: string }) => void;
}

const AddReportItemComponent = (props: Props) => {
  const { index, addReport, onChange } = props;
  const [text, setText] = useState('');
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();

  return (
    <View
      style={{
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'coral',
        marginBottom: 10,
      }}
    >
      <RowComponent justify="space-between">
        <TextComponent
          text={`${index + 1}. ${
            convertTargetField(addReport.targetId, targets, fields).nameField
          }`}
          font={fontFamillies.poppinsBold}
        />
        <TextComponent
          text={`Level ${
            convertTargetField(addReport.targetId, targets, fields).levelTarget
          }`}
          font={fontFamillies.poppinsBold}
        />
      </RowComponent>
      <TextComponent
        textAlign="justify"
        text={
          convertTargetField(addReport.targetId, targets, fields).nameTarget
        }
      />
      <TextComponent text={`- ${addReport.intervention !== '' ? addReport.intervention : 'Trống'}`} styles={{ fontStyle: addReport.intervention !== '' ? 'normal' : 'italic' }} />
      <TextComponent textAlign="justify" text={`- ${addReport.content !== '' ? addReport.content : 'Trống'}`} styles={{ fontStyle: addReport.content !== '' ? 'normal' : 'italic' }} />

      <InputComponent
        textStyles={{
          textAlignVertical: 'top',
          minHeight: 120,
        }}
        placeholder="Tổng kết..."
        value={text}
        onChange={val => {
          setText(val);
          onChange({
            val,
            planTaskId: addReport.id,
          });
        }}
        multible
        numberOfLine={4}
      />
    </View>
  );
};

export default AddReportItemComponent;
