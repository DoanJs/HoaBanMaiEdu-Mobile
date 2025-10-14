import { Profile2User } from 'iconsax-react-native';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Container, RowComponent, SearchComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { colors } from '../../constants/colors';
import { fontFamillies } from '../../constants/fontFamilies';
import { sizes } from '../../constants/sizes';

const PlanScreen = ({ navigation }: any) => {
  return (
    <Container
      bg={colors.primaryLight}
      title="NGUYỄN HOÀNG ĐĂNG (Bin)"
      right={
        <Profile2User
          size={sizes.title}
          color={colors.textBold}
          variant="Bold"
        />
      }
    >
      <SectionComponent
        styles={{
          backgroundColor: colors.background,
          flex: 1,
          paddingVertical: 10,
        }}
      >
        <SearchComponent
          arrSource={[]}
          onChange={() => { }}
          placeholder="Nhập kế hoạch"
          type="searchTarget"
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <SpaceComponent height={6} />
          <RowComponent justify="space-around" styles={{ flexWrap: 'wrap' }}>
            {
              Array.from({ length: 100 }).map((_, index) =>
                <TouchableOpacity
                  onPress={() => navigation.navigate('PlanDetailScreen')}
                  key={index}
                  style={{
                    padding: 10,
                    width: '45%',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: 'coral',
                    borderRadius: 100,
                    marginBottom: 10,
                    marginLeft: 10
                  }}>
                  <TextComponent text='KH 10/2025' font={fontFamillies.poppinsBold} />
                </TouchableOpacity>
              )
            }
          </RowComponent>
        </ScrollView>
      </SectionComponent>
    </Container>
  );
}

export default PlanScreen;
