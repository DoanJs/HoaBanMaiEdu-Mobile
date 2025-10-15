import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { RowComponent, SpaceComponent, TextComponent } from '.';
import { colors } from '../constants/colors';
import { convertTargetField } from '../constants/convertTargetAndField';
import { fontFamillies } from '../constants/fontFamilies';
import { sizes } from '../constants/sizes';
import {
  useFieldStore,
  useInterventionStore,
  useSuggestStore,
  useTargetStore,
} from '../zustand/store';

interface Props {
  index: number;
  cart: any;
}

const CartItemComponent = (props: Props) => {
  const { index, cart } = props;
  const { targets } = useTargetStore();
  const { fields } = useFieldStore();
  const { interventions } = useInterventionStore();
  const { suggests } = useSuggestStore();
  const [title, setTitle] = useState('');

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [openSuggest, setOpenSuggest] = useState(false);
  const [valueSuggest, setValueSuggest] = useState(null);
  const [interventionNews, setInterventionNews] = useState<any[]>([]);
  const [suggestNews, setSuggestNews] = useState<any[]>([]);

  useEffect(() => {
    if (interventions.length > 0) {
      setInterventionNews(
        interventions.map(_ => {
          return {
            label: _.name,
            value: _.id,
          };
        }),
      );
    }
  }, [interventions]);
  useEffect(() => {
    if (suggests.length > 0) {
      setSuggestNews(
        handleSuggestsWithField(cart.fieldId).map(_ => {
          return {
            label: _.name,
            value: _.id,
          };
        }),
      );
    }
  }, [suggests]);

  console.log(suggestNews)

  const handleSuggestsWithField = (fieldId: string) => {
    const items = suggests.filter(suggest => suggest.fieldId === fieldId);
    return items;
  };

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.textBold,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
      }}
    >
      <RowComponent justify="space-between">
        <TextComponent
          text={`${index + 1}. ${
            convertTargetField(cart.targetId, targets, fields).nameField
          }`}
          size={sizes.subText}
          font={fontFamillies.poppinsBold}
        />
        <TextComponent
          text="Level 2"
          size={sizes.subText}
          font={fontFamillies.poppinsBold}
        />
      </RowComponent>
      <TextComponent
        styles={{ textAlign: 'justify' }}
        text={cart.name}
        size={sizes.subText}
      />

      <DropDownPicker
        open={open}
        value={value}
        items={interventionNews}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setInterventionNews}
        placeholder="Mức độ hỗ trợ"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />
      <SpaceComponent height={10} />
      <DropDownPicker
        open={open}
        value={value}
        items={interventionNews}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setInterventionNews}
        placeholder="Mức độ hỗ trợ"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <SpaceComponent height={10} />

      {/*       
      <InputComponent
        textStyles={{
          textAlignVertical: 'top',
          minHeight: 120,
        }}
        placeholder="Nội dung"
        value={title}
        onChange={val => setTitle(val)}
        multible
        numberOfLine={4}
      /> */}
    </View>
  );
};

export default CartItemComponent;
const styles = StyleSheet.create({
  dropdown: { backgroundColor: colors.green2 },
  dropdownContainer: { backgroundColor: colors.background },
});
