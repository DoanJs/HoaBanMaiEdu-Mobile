import { Profile2User } from 'iconsax-react-native';
import React from 'react';
import {
  Container,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import { colors } from '../../constants/colors';
import { fontFamillies } from '../../constants/fontFamilies';
import { showUIIconTarget } from '../../constants/showUIIconTarget';
import { sizes } from '../../constants/sizes';
import { ScrollView } from 'react-native';

const fields = [
  'Hành vi',
  'Cá nhân xã hội',
  'Chỉnh âm',
  'Ngôn ngữ hiểu',
  'Ngôn ngữ diễn đạt',
  'Vận động tinh',
  'Nhận thức',
  'Tập trung chú ý',
];
const TargetScreen = ({ navigation }: any) => {
  return (
    <Container
      bg={colors.primaryLight}
      title="NGUYỄN HOÀNG ĐĂNG (Bin)"
      right={
        <Profile2User
          size={sizes.title}
          color={colors.textBold}
          variant="Bold"
          onPress={() => navigation.navigate('ChildrenScreen')}
        />
      }
    >
      <SectionComponent
        styles={{ backgroundColor: colors.background, flex: 1, paddingTop: 10 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <RowComponent justify="space-around" styles={{ flexWrap: 'wrap' }}>
            {fields.map((_, index) => (
              <RowComponent
                onPress={() =>
                  navigation.navigate('TargetDetailScreen', { title: _ })
                }
                justify="center"
                key={index}
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
                {showUIIconTarget(_)}
                <SpaceComponent height={10} />
                <TextComponent
                  text={_}
                  color={colors.textBold}
                  font={fontFamillies.poppinsBold}
                />
              </RowComponent>
            ))}
          </RowComponent>
        </ScrollView>
      </SectionComponent>
    </Container>
  );
};

export default TargetScreen;
