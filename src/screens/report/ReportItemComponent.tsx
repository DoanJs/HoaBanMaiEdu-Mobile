import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { InputComponent, RowComponent, TextComponent } from '../../components';
import { convertTargetField } from '../../constants/convertTargetAndField';
import { fontFamillies } from '../../constants/fontFamilies';
import { PlanTaskModel, ReportTaskModel } from '../../models';
import { useFieldStore, useTargetStore } from '../../zustand/store';
import { getDocData } from '../../constants/firebase/getDocData';
import { colors } from '../../constants/colors';

interface Props {
  index: number;
  reportTask: ReportTaskModel;
  reportTasks: ReportTaskModel[];
  onSetReportTasks: any;
  setDisable: any;
  onChange: (data: { val: string; planTaskId: string }) => void;
}

const ReportItemComponent = (props: Props) => {
  const { index, reportTask, reportTasks, onSetReportTasks, setDisable, onChange } = props;
  const [content, setContent] = useState('');
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();
  const [planTask, setPlanTask] = useState<PlanTaskModel>();
  const [contentSource, setContentSource] = useState("");

  useEffect(() => {
    if (reportTask) {
      getDocData({
        id: reportTask.planTaskId,
        nameCollect: "planTasks",
        setData: setPlanTask,
      });
      setContent(reportTask.content);
      setContentSource(reportTask.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportTask]);
  useEffect(() => {
    const index = reportTasks.findIndex((_) => _.id === reportTask.id);
    if (content && content !== contentSource) {
      reportTasks[index].content = content;
      reportTasks[index].isEdit = true;
      onSetReportTasks(reportTasks);
    } else {
      reportTasks[index].isEdit = false;
    }

    const isEdit = reportTasks.some((reportTask) => reportTask.isEdit);
    setDisable(!isEdit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  if (!planTask) return <ActivityIndicator />
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
          text={`${index + 1}. ${convertTargetField(planTask.targetId, targets, fields).nameField
            }`}
          font={fontFamillies.poppinsBold}
        />
        <TextComponent
          text={`Level ${convertTargetField(planTask.targetId, targets, fields).levelTarget
            }`}
          font={fontFamillies.poppinsBold}
        />
      </RowComponent>
      <TextComponent
        textAlign="justify"
        text={
          convertTargetField(planTask.targetId, targets, fields).nameTarget
        }
      />
      <TextComponent text={`- ${planTask.intervention !== '' ? planTask.intervention : 'Trống'}`}
        styles={{ fontStyle: planTask.intervention !== '' ? 'normal' : 'italic' }}
        color={planTask.intervention !== '' ? colors.text : colors.orange}
      />
      <TextComponent textAlign="justify" text={`- ${planTask.content !== '' ? planTask.content : 'Trống'}`} 
       styles={{ fontStyle: planTask.content !== '' ? 'normal' : 'italic' }}
       color={planTask.content !== '' ? colors.text : colors.orange}
     />

      <InputComponent
        textStyles={{
          textAlignVertical: 'top',
          minHeight: 120,
        }}
        placeholder="Tổng kết..."
        value={content}
        onChange={val => {
          setContent(val);
          onChange({
            val,
            planTaskId: planTask.id,
          });
        }}
        multible
        numberOfLine={4}
      />
    </View>
  );
};

export default ReportItemComponent;
