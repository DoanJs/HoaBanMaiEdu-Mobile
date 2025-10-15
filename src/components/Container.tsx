import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'iconsax-react-native';
import React, { ReactNode } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { RowComponent, SpaceComponent, TextComponent } from '.';
import { colors } from '../constants/colors';
import { fontFamillies } from '../constants/fontFamilies';
import { sizes } from '../constants/sizes';
import { globalStyles } from '../styles/globalStyles';

type Props = {
  children: ReactNode;
  title?: string;
  back?: boolean;
  left?: ReactNode;
  right?: ReactNode;
  center?: ReactNode;
  isScroll?: boolean;
  bg?: string;
  uri?: string;
};

const Container = (props: Props) => {
  const navigation: any = useNavigation();
  const { children, title, back, left, right, center, isScroll, bg, uri } =
    props;
  const localStyle = StyleSheet.create({
    header: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    title: { paddingHorizontal: 16, flex: 1, alignItems: 'center' },
  });

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { backgroundColor: bg ?? colors.background },
      ]}
    >
      {(back || left || right || title) && (
        <RowComponent styles={[localStyle.header]}>
          {back && (
            <ArrowLeft
              size={26}
              color={colors.text}
              onPress={() => navigation.goBack()}
            />
          )}
          {title && (
            <RowComponent styles={[localStyle.title]}>
              <Image
                style={{
                  height: 32,
                  width: 32,
                  borderRadius: 100,
                  resizeMode: 'cover',
                }}
                source={{
                  uri:
                    uri ??
                    'https://cdn.pixabay.com/photo/2019/10/30/16/19/fox-4589927_1280.jpg',
                }}
              />
              <SpaceComponent width={10} />
              <TextComponent
                text={title}
                size={sizes.bigText}
                font={fontFamillies.poppinsBold}
              />
            </RowComponent>
          )}
          {center && center}
          {right && right}
        </RowComponent>
      )}
      {!isScroll ? (
        <View style={[globalStyles.container]}>{children}</View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[globalStyles.container]}
        >
          {children}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Container;
