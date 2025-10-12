import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { TextComponent } from '.';
import { colors } from '../constants/colors';
import { fontFamillies } from '../constants/fontFamilies';

const TargetItemComponent = () => {
  const [selected, setSelected] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => setSelected(!selected)}
      style={{
        borderWidth: 1,
        borderColor: colors.textBold,
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
        backgroundColor: selected ? colors.green : colors.background,
      }}
    >
      <TextComponent
        styles={{ textAlign: 'justify' }}
        text="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium aliquam soluta sit optio. Vel unde ea ab quod quo, assumenda labore deleniti, magni ipsam temporibus placeat libero soluta accusantium quibusdam."
      />
      <TextComponent text="Level: 2" font={fontFamillies.poppinsBold} />
    </TouchableOpacity>
  );
};

export default TargetItemComponent;
