import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { InputComponent } from '.';
import { TargetModel } from '../models';

interface Props {
  placeholder: string;
  type?: string;
  width?: number | string;
  arrSource: TargetModel[];
  // | ChildrenModel[]
  // |
  // | PlanModel[]
  // | ReportModel[]
  // | SuggestModel[]
  // | UserModel[];
  onChange: (val: any) => void;
}

export default function SearchComponent(props: Props) {
  const { placeholder, type, arrSource, onChange, width } = props;
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
      //   case "searchPlan":
      //     items = (arrSource as PlanModel[]).filter((plan) =>
      //       plan.title.toLowerCase().includes(value.toLowerCase())
      //     );
      //     break;
      //   case "searchReport":
      //     items = (arrSource as ReportModel[]).filter((report) =>
      //       report.title.toLowerCase().includes(value.toLowerCase())
      //     );
      //     break;
      //   case "searchSuggest":
      //     items = (arrSource as SuggestModel[]).filter((suggest) =>
      //       suggest.name.toLowerCase().includes(value.toLowerCase())
      //     );
      //     break;
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
    <View style={{ width: '50%' }}>
      <InputComponent
        value={value}
        onChange={val => setValue(val)}
        placeholder={placeholder}
      />
    </View>
  );
}
