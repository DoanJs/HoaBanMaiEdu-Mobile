import { useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { InputComponent } from '.';
import {
  ChildrenModel,
  PlanModel,
  ReportModel,
  SuggestModel,
  TargetModel,
} from '../models';

interface Props {
  placeholder: string;
  type?: string;
  width?: number | string;
  arrSource:
    | TargetModel[]
    | ChildrenModel[]
    | PlanModel[]
    | SuggestModel[]
    | ReportModel[];
  // | UserModel[];
  styles?: StyleProp<ViewStyle>;
  onChange: (val: any) => void;
}

export default function SearchComponent(props: Props) {
  const { placeholder, type, arrSource, styles, onChange, width } = props;
  const [value, setValue] = useState('');

  useEffect(() => {
    let items: any = [];
    switch (type) {
      case 'searchTarget':
        items = (arrSource as TargetModel[]).filter(
          target =>
            target.name.toLowerCase().includes(value.toLowerCase()) ||
            target.level === Number(value),
        );
        break;
      case 'searchChild':
        items = (arrSource as ChildrenModel[]).filter(target =>
          target.fullName.toLowerCase().includes(value.toLowerCase()),
        );
        break;
      case 'searchPlan':
        items = (arrSource as PlanModel[]).filter(plan =>
          plan.title.toLowerCase().includes(value.toLowerCase()),
        );
        break;
      case 'searchSuggest':
        items = (arrSource as SuggestModel[]).filter(suggest =>
          suggest.name.toLowerCase().includes(value.toLowerCase()),
        );
        break;
      case 'searchReport':
        items = (arrSource as ReportModel[]).filter(report =>
          report.title.toLowerCase().includes(value.toLowerCase()),
        );
        break;
      //   case "searchTeacher":
      //     items = (arrSource as UserModel[]).filter((teacher) =>
      //       teacher.fullName.toLowerCase().includes(value.toLowerCase())
      //     );
      //     break;
      //   case "searchMeta":
      //     items = (arrSource as any[]).filter((meta) =>
      //       meta.id.toLowerCase().includes(value.toLowerCase())
      //     );
      //     break;

      default:
        break;
    }

    onChange(items);
  }, [value]);

  return (
    <View style={styles}>
      <InputComponent
        value={value}
        onChange={val => setValue(val)}
        placeholder={placeholder}
        allowClear
      />
    </View>
  );
}
