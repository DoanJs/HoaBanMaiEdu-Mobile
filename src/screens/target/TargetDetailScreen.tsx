import { ArrowRotateLeft, Profile2User } from 'iconsax-react-native';
import React from 'react';
import { FlatList, View } from 'react-native';
import {
  Container,
  RowComponent,
  SearchComponent,
  SectionComponent,
  SpaceComponent,
  TargetItemComponent,
  TextComponent,
} from '../../components';
import { colors } from '../../constants/colors';
import { fontFamillies } from '../../constants/fontFamilies';
import { showUIIconTarget } from '../../constants/showUIIconTarget';
import { sizes } from '../../constants/sizes';

const TargetDetailScreen = ({ navigation, route }: any) => {
  const { title } = route.params;
  return (
    <Container
      bg={colors.primaryLight}
      back
      title="NGUYỄN HOÀNG ĐĂNG (Bin)"
      right={<Profile2User size={sizes.title} color={colors.textBold} variant='Bold' />}
    >
      <SectionComponent
        styles={{ backgroundColor: colors.background, flex: 1 }}
      >
        <SpaceComponent height={10} />
        <RowComponent>
          {showUIIconTarget(title, sizes.bigTitle, sizes.bigTitle)}
          <SpaceComponent width={8} />
          <TextComponent
            text={title.toUpperCase()}
            size={sizes.text}
            font={fontFamillies.poppinsBold}
          />
        </RowComponent>

        <RowComponent
          justify="space-between"
          styles={{
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.textBold,
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <SearchComponent
              arrSource={[]}
              onChange={() => {}}
              placeholder="Nhập mục tiêu"
              type="searchTarget"
            />
          </View>

          <SpaceComponent width={20} />

          <ArrowRotateLeft
            size={sizes.title}
            color={colors.red}
            onPress={() => {}}
          />
        </RowComponent>

        <SpaceComponent height={8} />

        <FlatList
          showsVerticalScrollIndicator={false}
          data={Array.from({ length: 20 })}
          renderItem={({ item, index }) => <TargetItemComponent key={index} />}
        />
      </SectionComponent>
    </Container>
  );
};

export default TargetDetailScreen;
