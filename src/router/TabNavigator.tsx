import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { useCartStore, usePlanStore, useReportStore } from '../zustand/store';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const insets = useSafeAreaInsets()
  const { carts } = useCartStore()
  const { plans } = usePlanStore()
  const { reports } = useReportStore()

  const [pendings, setPendings] = useState<any[]>([]);

  useEffect(() => {
    if (plans.length > 0 || reports.length > 0) {
      const plansPending = plans.filter((_) => _.status === 'pending')
      const reportsPending = reports.filter((_) => _.status === 'pending')
      setPendings(plansPending.concat(reportsPending))
    }
  }, [plans, reports])

  const tabBarIcon = ({ focused, size, color, route }: any) => {
    color = focused ? colors.textBold : colors.text;
    size = sizes.title;
    let icon = <TargetSvg width={size} height={size} color={color} />;
    let title;

    switch (route.name) {
      case 'Pending':
        icon = <View
          style={{
            position: 'relative'
          }}>
          {
            pendings.length > 0 &&
            <TextComponent
              text={`${pendings.length}`}
              size={size.smallText}
              font={fontFamillies.poppinsBold}
              color={colors.red}
              styles={{
                position: 'absolute',
                height: 26,
                width: 26,
                top: -10,
                right: -24,
                borderRadius: 100,
              }}
            />
          }
          <PendingSvg width={size} height={size} color={color} />
        </View>;
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
        icon = <View
          style={{
            position: 'relative'
          }}>
          {
            carts.length > 0 &&
            <TextComponent
              text={`${carts.length}`}
              size={size.smallText}
              font={fontFamillies.poppinsBold}
              color={colors.red}
              styles={{
                position: 'absolute',
                height: 26,
                width: 26,
                top: -10,
                right: -24,
                borderRadius: 100,
              }}
            />
          }
          <CartSvg width={size} height={size} color={color} />
        </View>;
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
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom,
          position: 'absolute'
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
    width: 200,
  },
});
