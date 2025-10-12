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
import { ArrowRotateLeft } from 'iconsax-react-native';

const TargetDetailScreen = ({ navigation, route }: any) => {
  const { title } = route.params;
  return (
    <Container bg={colors.primaryLight} back title="Js">
      <SectionComponent
        styles={{ backgroundColor: colors.background, flex: 1 }}
      >
        <RowComponent
          justify="space-between"
          styles={{
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.textBold,
            alignItems: 'center',
          }}
        >
          <RowComponent>
            {showUIIconTarget(title, sizes.bigTitle, sizes.bigTitle)}
            <SpaceComponent width={8} />
            <TextComponent
              text={title.toUpperCase()}
              size={sizes.text}
              font={fontFamillies.poppinsBold}
            />
          </RowComponent>

          <SearchComponent
            arrSource={[]}
            onChange={() => {}}
            placeholder="Nhập mục tiêu"
            type="searchTarget"
            width={'50%'}
          />

          <ArrowRotateLeft size={sizes.title} color={colors.red} onPress={() => {}}/>
        </RowComponent>

        <SpaceComponent height={8} />

        <FlatList
          showsVerticalScrollIndicator={false}
          data={Array.from({ length: 20 })}
          renderItem={({ item, index }) => <TargetItemComponent key={index}/>}
        />
      </SectionComponent>
    </Container>
  );
};

export default TargetDetailScreen;
