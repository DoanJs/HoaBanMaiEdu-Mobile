import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { SpaceComponent, TextComponent } from '../../components';
import { fontFamillies } from '../../constants/fontFamilies';
import { sizes } from '../../constants/sizes';
import { ChildrenModel } from '../../models';
import { useChildStore } from '../../zustand/store';

interface Props {
  child: ChildrenModel;
}
const ChildItemComponent = (props: Props) => {
  const navigation: any = useNavigation();
  const { child } = props;
  const { setChild } = useChildStore();
  return (
    <TouchableOpacity
      onPress={() => {
        setChild(child);
        navigation.navigate('Main');
      }}
      style={{
        alignItems: 'center',
        width: '45%',
        marginVertical: 16,
      }}
    >
      <Image
        style={{
          height: 150,
          width: 150,
          borderRadius: 10,
          resizeMode: 'cover',
        }}
        source={{
          uri:
            child.avatar ??
            'https://cdn.pixabay.com/photo/2019/10/30/16/19/fox-4589927_1280.jpg',
        }}
      />
      <SpaceComponent height={10} />
      <TextComponent
        size={sizes.smallText}
        text={child.fullName}
        font={fontFamillies.poppinsBold}
      />
    </TouchableOpacity>
  );
};

export default ChildItemComponent;
