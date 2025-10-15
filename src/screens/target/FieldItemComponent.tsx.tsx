import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { RowComponent, SpaceComponent, TextComponent } from '../../components';
import { colors } from '../../constants/colors';
import { fontFamillies } from '../../constants/fontFamilies';
import { showUIIconTarget } from '../../constants/showUIIconTarget';
import { FieldModel } from '../../models';

interface Props {
  field: FieldModel;
}
const FieldItemComponent = (props: Props) => {
  const navigation: any = useNavigation();
  const { field } = props;

  return (
    <RowComponent
      onPress={() => navigation.navigate('TargetDetailScreen', { field })}
      justify="center"
      styles={{
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: 'coral',
        padding: 10,
        borderRadius: 10,
        width: '45%',
        height: 160,
        marginBottom: 16,
        backgroundColor: colors.primaryLightOpacity,
      }}
    >
      {showUIIconTarget(field.name)}
      <SpaceComponent height={10} />
      <TextComponent
        text={field.name}
        color={colors.textBold}
        font={fontFamillies.poppinsBold}
      />
    </RowComponent>
  );
};

export default FieldItemComponent;
