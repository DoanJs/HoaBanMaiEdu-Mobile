import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { InputComponent, RowComponent, TextComponent } from '../../components';
import { colors } from '../../constants/colors';
import { convertTargetField } from '../../constants/convertTargetAndField';
import { fontFamillies } from '../../constants/fontFamilies';
import { useFieldStore, useTargetStore } from '../../zustand/store';

interface Props {
  index: number;
  addReport: any;
  addReports: any[];
}

const AddReportItemComponent = (props: Props) => {
  const { index, addReport, addReports } = props;
  const [text, setText] = useState('');
  const [textSource, setTextSource] = useState('');
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();

  useEffect(() => {
    if (addReport && addReport.total) {
      setText(addReport.total);
      setTextSource(addReport.total);
    } else {
      setText('');
      setTextSource('');
    }
  }, [addReport]);
  useEffect(() => {
    if (text) {
      const index = addReports.findIndex((_: any) => _.id === addReport.id);
      addReports[index].total = text;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

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
      <TextComponent
        text={`- ${
          addReport.intervention !== '' ? addReport.intervention : 'Trống'
        }`}
        styles={{
          fontStyle: addReport.intervention !== '' ? 'normal' : 'italic',
        }}
        color={addReport.intervention !== '' ? colors.text : colors.orange}
      />
      <TextComponent
        textAlign="justify"
        text={`- ${addReport.content !== '' ? addReport.content : 'Trống'}`}
        styles={{ fontStyle: addReport.content !== '' ? 'normal' : 'italic' }}
        color={addReport.content !== '' ? colors.text : colors.orange}
      />

      <InputComponent
        textStyles={{
          textAlignVertical: 'top',
          minHeight: 120,
        }}
        placeholder="Tổng kết..."
        value={text}
        onChange={val => setText(val)}
        multible
        numberOfLine={4}
      />
    </View>
  );
};

export default AddReportItemComponent;
