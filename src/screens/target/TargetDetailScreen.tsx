import { where } from '@react-native-firebase/firestore';
import {
  ArrowRotateLeft,
  Profile2User,
  TickCircle,
} from 'iconsax-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import {
  Container,
  RowComponent,
  SearchComponent,
  SectionComponent,
  SpaceComponent,
  SpinnerComponent,
  TargetItemComponent,
  TextComponent,
} from '../../components';
import { colors } from '../../constants/colors';
import { deleteDocData } from '../../constants/firebase/deleteDocData';
import { getDocsData } from '../../constants/firebase/getDocsData';
import { fontFamillies } from '../../constants/fontFamilies';
import { showUIIconTarget } from '../../constants/showUIIconTarget';
import { sizes } from '../../constants/sizes';
import { PlanTaskModel, TargetModel } from '../../models';
import {
  useCartStore,
  useChildStore,
  useTargetStore,
  useUserStore,
} from '../../zustand/store';

const TargetDetailScreen = ({ navigation, route }: any) => {
  const { field } = route.params;
  const { user } = useUserStore();
  const { child } = useChildStore();
  const { targets, setTargets } = useTargetStore();
  const { carts, setCarts } = useCartStore();
  const [targetsField, setTargetsField] = useState<TargetModel[]>([]);
  const [targetsNew, setTargetsNew] = useState<TargetModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [planTasks, setPlanTasks] = useState<PlanTaskModel[]>([]);
  const [refreshing, setRefreshing] = useState(false); // loading khi kéo xuống

  useEffect(() => {
    if (child) {
      getDocsData({
        nameCollect: 'planTasks',
        condition: [
          where('teacherIds', 'array-contains', user?.id),
          where('childId', '==', child.id),
        ],
        setData: setPlanTasks,
      });
    }
  }, [child]);
  useEffect(() => {
    if (targets) {
      setTargetsField(
        targets.filter((target: TargetModel) => target.fieldId === field.id),
      );
      setTargetsNew(
        targets.filter((target: TargetModel) => target.fieldId === field.id),
      );
    }
  }, [targets]);

  const handleRemoveSelect = async () => {
    setIsLoading(true);
    const items = carts.filter(cart => cart.fieldId !== field.id);
    const itemsRemove = carts.filter(cart => cart.fieldId === field.id);

    setCarts(items);
    const promiseItems = itemsRemove.map(_ =>
      deleteDocData({
        nameCollect: 'carts',
        id: _.id,
        metaDoc: 'carts',
      }),
    );

    await Promise.all(promiseItems);
    setIsLoading(false);
  };
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      getDocsData({
        nameCollect: 'targets',
        setData: setTargets,
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

  if (!child) return <ActivityIndicator />;
  return (
    <Container
      bg={colors.primaryLight}
      back
      title={child.fullName}
      uri={child.avatar}
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
        styles={{ backgroundColor: colors.background, flex: 1 }}
      >
        <SpaceComponent height={10} />
        <RowComponent justify="space-between">
          <RowComponent>
            {showUIIconTarget(field.name, sizes.bigTitle, sizes.bigTitle)}
            <SpaceComponent width={8} />
            <TextComponent
              text={field.name.toUpperCase()}
              size={sizes.text}
              font={fontFamillies.poppinsBold}
            />
            <TextComponent
              text={` (${targetsNew.length})`}
              size={sizes.smallText}
            />
          </RowComponent>
          <RowComponent>
            <TickCircle
              variant="Bold"
              size={sizes.title}
              color={
                carts.filter(cart => cart.fieldId === field.id).length > 0
                  ? colors.green
                  : colors.gray
              }
            />
            <TextComponent
              text={` (${
                carts.filter(cart => cart.fieldId === field.id).length
              })`}
              size={sizes.smallText}
            />
          </RowComponent>
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
              arrSource={targetsField}
              onChange={val => setTargetsNew(val)}
              placeholder="Nhập mục tiêu"
              type="searchTarget"
            />
          </View>

          <SpaceComponent width={20} />

          <ArrowRotateLeft
            size={sizes.title}
            color={colors.red}
            onPress={handleRemoveSelect}
          />
        </RowComponent>

        <SpaceComponent height={8} />

        <FlatList
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={targetsNew.sort((a, b) => a.level - b.level)}
          renderItem={({ item }) => (
            <TargetItemComponent
              key={item.id}
              target={item}
              setIsLoading={setIsLoading}
              planTasks={planTasks}
            />
          )}
        />
      </SectionComponent>
      <SpinnerComponent loading={isLoading} />
    </Container>
  );
};

export default TargetDetailScreen;
