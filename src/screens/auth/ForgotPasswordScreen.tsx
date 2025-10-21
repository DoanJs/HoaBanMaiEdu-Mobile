import { collection, getDocs, query, where } from '@react-native-firebase/firestore'
import { ArrowLeft } from 'iconsax-react-native'
import React, { useEffect, useState } from 'react'
import { Alert, ImageBackground, TouchableOpacity, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { auth, db } from '../../../firebase.config'
import { BtnShadowLinearComponent, InputComponent, KeyboardAwareScrollViewComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components'
import { colors } from '../../constants/colors'
import { fontFamillies } from '../../constants/fontFamilies'
import { sizes } from '../../constants/sizes'
import { validateEmail } from '../../constants/validateEmailPhone'
import { sendPasswordResetEmail } from '@react-native-firebase/auth'

const ForgotPasswordScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets()
  const [email, setEmail] = useState('');
  const [disable, setDisable] = useState(true);

  useEffect(() => {
    if (email && validateEmail(email)) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [email]);

  const handleResetPassword = async () => {
    // const snapshot = await getDocs(query(collection(db, 'users'), where('email', '==', email)))
    // console.log(snapshot)
    try {
      sendPasswordResetEmail(auth, email).then(result => {
        Alert.alert('Check your email', 'We sent you a password reset link.');
        setEmail('')
        console.log(result)
      })
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <ImageBackground
        source={{
          uri: 'https://cdn.pixabay.com/photo/2019/10/30/16/19/fox-4589927_1280.jpg',
        }}
        imageStyle={{ resizeMode: 'cover' }}
        style={{ flex: 1, alignItems: 'center' }}
      >
        <SectionComponent styles={{ backgroundColor: 'transparent', top: '6%' }}>
          <RowComponent styles={{ width: '100%' }}>
            <ArrowLeft
              size={28}
              color={colors.background}
              onPress={() => navigation.goBack()}
            />
            <TextComponent
              textAlign="center"
              text="Welcome"
              color={colors.background}
              size={sizes.title}
              flex={1}
              font={fontFamillies.poppinsBold}
            />
          </RowComponent>
        </SectionComponent>

        <View
          style={{
            backgroundColor: colors.background1,
            position: 'absolute',
            right: 0,
            left: 0,
            bottom: 0,
            borderRadius: 10,
          }}
        >
          <KeyboardAwareScrollViewComponent styles={{ paddingBottom: insets.bottom + 80 }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '35%',
                marginVertical: 20
              }}
            >
              <TextComponent
                text="Forgot Password"
                font={fontFamillies.poppinsSemiBold}
                size={sizes.title}
              />
              <TextComponent
                styles={{
                  textAlign: 'center',
                  width: '80%',
                }}
                text="Lấy lại mật khẩu với email đã đăng ký với tài khoản !"
                font={fontFamillies.poppinsMedium}
                size={sizes.bigText}
                color={colors.text}
              />
            </View>
            <InputComponent
              placeholder="Email Address"
              placeholderTextColor={colors.gray}
              styles={{
                backgroundColor: colors.background,
                paddingVertical: 12,
                paddingHorizontal: 26,
                borderRadius: 5,
                width: '100%',
              }}
              prefix={<Fontisto name="email" size={20} color={colors.gray} />}
              color={colors.background}
              value={email}
              allowClear
              textStyles={{
                color: colors.text,
              }}
              onChange={val => setEmail(val)}
            />

            <SpaceComponent height={10} />

            <RowComponent justify="center">
              <TextComponent
                text="Do not have email ? "
                font={fontFamillies.poppinsMedium}
                color={colors.text}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate('VerifyNumberScreen')}
              >
                <TextComponent

                  text="verify phone"
                  font={fontFamillies.poppinsMedium}
                  color={colors.blue}
                />
              </TouchableOpacity>
            </RowComponent>

            <SpaceComponent height={10} />

            <BtnShadowLinearComponent
              disable={disable}
              title="Send link"
              onPress={handleResetPassword}
            />
            {/* </SectionComponent> */}
          </KeyboardAwareScrollViewComponent>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default ForgotPasswordScreen