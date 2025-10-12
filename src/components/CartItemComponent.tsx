import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { InputComponent, RowComponent, SpaceComponent, TextComponent } from '.';
import { colors } from '../constants/colors';
import { fontFamillies } from '../constants/fontFamilies';
import { sizes } from '../constants/sizes';

const CartItemComponent = () => {
    const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Chọn mức độ hỗ trợ', value: 'Chọn mức độ hỗ trợ' },
    { label: 'Táo', value: 'apple' },
    { label: 'Chuối', value: 'banana' },
    { label: 'Cam', value: 'orange' },
  ]);
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.textBold,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10
      }}
    >
      <RowComponent justify="space-between">
        <TextComponent
          text="1. Ngôn ngữ diễn đạt"
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
        text="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet facere laborum velit rem nostrum cupiditate quas quod aliquid! Inventore commodi quae numquam qui at reiciendis. Velit eaque odio impedit dicta!"
        size={sizes.subText}
      />

      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Mức độ hỗ trợ"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />
      <SpaceComponent height={10} />
      <InputComponent
        placeholder="Nội dung"
        value={text}
        onChange={(val) => setText(val)}
        multible
        numberOfLine={4}
      />
    </View>
  );
};

export default CartItemComponent;
const styles = StyleSheet.create({
  dropdown: { backgroundColor: colors.primaryBold },
  dropdownContainer: { backgroundColor: colors.background },
});
