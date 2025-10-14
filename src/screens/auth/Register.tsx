// import {
//     addDoc,
//     collection,
//     serverTimestamp,
//   } from '@react-native-firebase/firestore';
  import { ArrowLeft, Lock } from 'iconsax-react-native';
  import React, { useEffect, useState } from 'react';
  import { ImageBackground, TouchableOpacity, View } from 'react-native';
  import Feather from 'react-native-vector-icons/Feather';
  import Fontisto from 'react-native-vector-icons/Fontisto';
//   import {
//     auth,
//     createUserWithEmailAndPassword,
//     db,
//   } from '../../../firebase.config';
//   import createAccountPng from '../../assets/images/createAccount.png';
  import {
    BtnShadowLinearComponent,
    InputComponent,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
  } from '../../components';
  import { colors } from '../../constants/colors';
  import { fontFamillies } from '../../constants/fontFamilies';
  import { sizes } from '../../constants/sizes';
//   import { setDocData } from '../../constants/setDocData';
//   import { addDocData } from '../../constants/addDocData';
  
  const Register = ({ navigation }: any) => {
    const [email, setEmail] = useState('accountRegister@gmail.com');
    const [phone, setPhone] = useState('0995845221');
    const [password, setPassword] = useState('accountRegister');
    const [errorText, setErrorText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      if (email || password || phone) {
        setErrorText('');
      }
    }, [email, password]);
  
    const handleRegister = async () => {
      if (!email || !password) {
        setErrorText('Please enter your email, phone or password!');
      } else {
        setErrorText('');
        setIsLoading(true);
  
        // await createUserWithEmailAndPassword(auth, email, password)
        //   .then(userCredential => {
        //     // Signed in
        //     setIsLoading(false);
        //     const user = userCredential.user;
        //     setDocData({
        //       nameCollect: 'users',
        //       id: user.uid,
        //       valueUpdate: {
        //         email,
        //         name: email.split('@')[0],
        //         url: '',
        //         phone,
        //         createAt: serverTimestamp(),
        //         updateAt: serverTimestamp(),
        //       },
        //     });
        //     addDocData({
        //       nameCollect: 'settings',
        //       value: {
        //         allowNotifications: true,
        //         emailNotifications: false,
        //         orderNotifications: false,
        //         generalNotifications: true,
        //         userId: user.uid,
        //         createAt: serverTimestamp(),
        //         updateAt: serverTimestamp(),
        //       },
        //     });
        //   })
        //   .catch((error: any) => {
        //     console.log(error);
        //     setIsLoading(false);
        //     setErrorText(error.message);
        //   });
      }
    };
    return (
      <ImageBackground
        source={{uri: 'https://cdn.pixabay.com/photo/2019/10/30/16/19/fox-4589927_1280.jpg',
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
              text="Welcome"
              color={colors.background}
              size={sizes.title}
              flex={1}
              font={fontFamillies.poppinsBold}
              styles={{
                textAlign: 'center',
              }}
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
            paddingVertical: 20,
            borderRadius: 10,
          }}
        >
          <SectionComponent>
            <TextComponent
              text="Create account"
              font={fontFamillies.poppinsSemiBold}
              size={sizes.title}
            />
            <TextComponent
              text="Sign in to your account"
              color={colors.text}
              size={sizes.bigText}
              font={fontFamillies.poppinsRegular}
            />
  
            <SpaceComponent height={16} />
  
            <InputComponent
              styles={{
                backgroundColor: colors.background,
                paddingVertical: 12,
                paddingHorizontal: 26,
                borderRadius: 5,
              }}
              allowClear
              prefix={<Fontisto name="email" color={colors.text} size={26} />}
              placeholder="Email Address"
              placeholderTextColor={colors.text}
              color={colors.background}
              value={email}
              onChange={val => setEmail(val)}
            />
            <InputComponent
              styles={{
                backgroundColor: colors.background,
                paddingVertical: 12,
                paddingHorizontal: 26,
                borderRadius: 5,
              }}
              allowClear
              prefix={<Feather name="phone" color={colors.text} size={26} />}
              placeholder="Phone number"
              placeholderTextColor={colors.text}
              color={colors.background}
              value={phone}
              onChange={val => setPhone(val)}
            />
            <InputComponent
              styles={{
                backgroundColor: colors.background,
                paddingVertical: 12,
                paddingHorizontal: 26,
                borderRadius: 5,
              }}
              prefix={<Lock color={colors.text} size={26} />}
              color={colors.background}
              value={password}
              isPassword
              textStyles={{
                color: colors.text,
              }}
              onChange={val => setPassword(val)}
            />
  
            {errorText !== '' && (
              <TextComponent
                text={errorText}
                font={fontFamillies.poppinsSemiBold}
                size={sizes.smallText}
                color={colors.red}
              />
            )}
  
            <SpaceComponent height={16} />
  
            <BtnShadowLinearComponent
              title="Signup"
              onPress={handleRegister}
              isLoading={isLoading}
            />
  
            <RowComponent justify="center">
              <TextComponent
                text="Already have an account ?"
                size={sizes.bigText}
                font={fontFamillies.poppinsLight}
                color={colors.text}
              />
              <SpaceComponent width={10} />
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <TextComponent
                  text="Login"
                  color={colors.text}
                  size={sizes.bigText}
                  font={fontFamillies.poppinsMedium}
                />
              </TouchableOpacity>
            </RowComponent>
          </SectionComponent>
        </View>
      </ImageBackground>
    );
  };
  
  export default Register;
  