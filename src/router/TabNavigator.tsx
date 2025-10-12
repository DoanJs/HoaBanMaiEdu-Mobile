import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  CartNavigator,
  PendingNavigator,
  PlanNavigator,
  ReportNavigator,
  TargetNavigator
} from '.';
import {
  CartSvg,
  PendingSvg,
  PlanSvg,
  ReportSvg,
  TargetSvg
} from '../assets/icons';
import { TextComponent } from '../components';
import { colors } from '../constants/colors';
import { fontFamillies } from '../constants/fontFamilies';
import { sizes } from '../constants/sizes';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  const tabBarIcon = ({ focused, size, color, route }: any) => {
    color = focused ? colors.textBold : colors.text;
    size = sizes.smallTitle;
    let icon = <TargetSvg width={size} height={size} color={color} />;
    let title;

    switch (route.name) {
      case 'Pending':
        icon = <PendingSvg width={size} height={size} color={color} />;
        title = (
          <TextComponent
            text="Chờ duyệt"
            size={sizes.smallText}
            color={color}
            font={fontFamillies.poppinsBold}
          />
        );
        break;
      case 'Cart':
        icon = <CartSvg width={size} height={size} color={color} />;
        title = (
          <TextComponent
            text="Giỏ mục tiêu"
            size={sizes.smallText}
            color={color}
            font={fontFamillies.poppinsBold}
          />
        );
        break;
      case 'Plan':
        icon = <PlanSvg width={size} height={size} color={color} />;
        title = (
          <TextComponent
            text="Kế hoạch"
            size={sizes.smallText}
            color={color}
            font={fontFamillies.poppinsBold}
          />
        );
        break;
      case 'Report':
        icon = <ReportSvg width={size} height={size} color={color} />;
        title = (
          <TextComponent
            text="Báo cáo"
            size={sizes.smallText}
            color={color}
            font={fontFamillies.poppinsBold}
          />
        );
        break;
      case 'Target':
        icon = <TargetSvg width={size} height={size} color={color} />;
        title = (
          <TextComponent
            text="Mục tiêu"
            size={sizes.smallText}
            color={color}
            font={fontFamillies.poppinsBold}
          />
        );
        break;

      default:
        break;
    }
    return (
      <View style={localStyle.tabIcon}>
        {icon}
        {title}
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.primaryLight,
          paddingTop: 8,
          justifyContent: 'space-around',
          alignItems: 'center',
        },
        tabBarIcon: ({ focused, size, color }: any) =>
          tabBarIcon({ focused, size, color, route }),
      })}
    >
      <Tab.Screen name="Target" component={TargetNavigator} />
      <Tab.Screen name="Cart" component={CartNavigator} />
      <Tab.Screen name="Pending" component={PendingNavigator} />
      <Tab.Screen name="Plan" component={PlanNavigator} />
      <Tab.Screen name="Report" component={ReportNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
const localStyle = StyleSheet.create({
  tabIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 80,
  },
});
