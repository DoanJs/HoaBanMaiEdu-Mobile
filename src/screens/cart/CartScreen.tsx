import { collection, getDocs, query, serverTimestamp, where } from '@react-native-firebase/firestore';
import { Profile2User } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../../../firebase.config';
import {
  ButtonComponent,
  CartItemComponent,
  Container,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  SpinnerComponent,
  TextComponent
} from '../../components';
import { TitlePlanModal } from '../../components/modals';
import { colors } from '../../constants/colors';
import { addDocData } from '../../constants/firebase/addDocData';
import { deleteDocData } from '../../constants/firebase/deleteDocData';
import { updateDocData } from '../../constants/firebase/updateDocData';
import { fontFamillies } from '../../constants/fontFamilies';
import { sizes } from '../../constants/sizes';
import { useCartEditStore, useCartStore, useChildStore, usePlanStore, useUserStore } from '../../zustand/store';
import { getDocData } from '../../constants/firebase/getDocData';
import { PlanModel } from '../../models';

const CartScreen = ({ navigation }: any) => {
  const { user } = useUserStore()
  const { carts, setCarts } = useCartStore();
  const { child } = useChildStore();
  const { addPlan, editPlan, plans } = usePlanStore()
  const { cartEdit, setCartEdit } = useCartEditStore();
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleTitlePlan, setIsVisibleTitlePlan] = useState(false);
  const [plan, setPlan] = useState<PlanModel>();

  
  useEffect(() => {
    if (cartEdit) {
      getDocData({ id: cartEdit, nameCollect: "plans", setData: setPlan });
    }
  }, [cartEdit]);
  useEffect(() => {
    if (plan) {
      setTitle(plan.title);
    }
  }, [plan]);

  const handleAddEditPlan = async () => {
    if (user && child) {
      setIsLoading(true);
      if (!cartEdit) {
        await addDocData({
          nameCollect: "plans",
          value: {
            type: "KH",
            title,
            childId: child.id,
            teacherIds: child.teacherIds,
            authorId: user.id,
            status: "pending",
            comment: "",

            createAt: serverTimestamp(),
            updateAt: serverTimestamp(),
          },
          metaDoc: "plans",
        })
          .then(async (result) => {
            addPlan({
              id: result.id,
              type: "KH",
              title,
              childId: child.id,
              teacherIds: child.teacherIds,
              authorId: user.id,
              status: "pending",
              comment: "",

              createAt: serverTimestamp(),
              updateAt: serverTimestamp(),
            });
            const promiseItems = carts.map((cart) =>
              addDocData({
                nameCollect: "planTasks",
                value: {
                  content: cart.content ?? "",
                  intervention: cart.intervention ?? "",
                  teacherIds: child.teacherIds,
                  authorId: user.id,
                  planId: result.id,
                  targetId: cart.targetId,
                  childId: child.id,

                  createAt: serverTimestamp(),
                  updateAt: serverTimestamp(),
                },
                metaDoc: "plans",
              })
            );

            await Promise.all(promiseItems);
            setIsLoading(false);
            setCarts([]);
            setTitle("");

            // xóa hết cart cũ khi đã thêm thành công
            const promiseCartItems = carts.map((cart) =>
              deleteDocData({
                nameCollect: "carts",
                id: cart.id,
                metaDoc: "carts",
              })
            );
            await Promise.all(promiseCartItems);
          })
          .catch((error) => {
            setIsLoading(false);
            console.log(error);
          });
      } else {
        updateDocData({
          nameCollect: "plans",
          id: cartEdit,
          valueUpdate: {
            title,
          },
          metaDoc: "plans",
        })
          .then(() => {
            const index = plans.findIndex((_) => _.id === cartEdit);
            if (index !== -1) {
              editPlan(cartEdit, { ...plans[index], title });
            }
          })
          .catch((error) => {
            console.log(error);
          });

        // xoa het cai cu
        const snapShot = await getDocs(
          query(
            collection(db, "planTasks"),
            where("teacherIds", "array-contains", user.id),
            where("planId", "==", cartEdit)
          )
        );
        if (!snapShot.empty) {
          const promisePlanTasksOld = snapShot.docs.map((_: any) =>
            deleteDocData({
              nameCollect: "planTasks",
              id: _.id,
              metaDoc: "plans",
            })
          );
          await Promise.all(promisePlanTasksOld);
        }

        // tao lai cai moi
        const promisePlanTasksNew = carts.map((cart) =>
          addDocData({
            nameCollect: "planTasks",
            value: {
              childId: child.id,
              planId: cartEdit,
              targetId: cart.targetId,
              teacherIds: child.teacherIds,
              authorId: user.id,
              content: cart.content ?? "",
              intervention: cart.intervention ?? "",

              createAt: serverTimestamp(),
              updateAt: serverTimestamp(),
            },
            metaDoc: "plans",
          })
        );

        await Promise.all(promisePlanTasksNew);
        setIsLoading(false);
        setCartEdit(null);
        setCarts([]);
        setTitle("");
      }
      navigation.navigate('Pending')
    }
  };
  const handleSaveCart = () => {
    setIsLoading(true)
    const promiseItems = carts.map((cart) => updateDocData({
      nameCollect: 'carts',
      id: cart.id,
      valueUpdate: cart,
      metaDoc: 'carts'
    }))

    Promise.all(promiseItems).then(() => {
      setIsLoading(false)
    }).catch(error => {
      setIsLoading(false)
      console.log(error)
    })
  }

  if (!child) return <ActivityIndicator />;
  return (
    <Container
      bg={colors.primaryLight}
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
        styles={{
          backgroundColor: colors.background,
          flex: 1,
          paddingVertical: 10,
        }}
      >
        {
          carts.length > 0 ?
            <>
              <InputComponent
                styles={{
                  backgroundColor: colors.background,
                  borderRadius: 5,
                }}
                allowClear
                placeholder="Tên kế hoạch: "
                placeholderTextColor={colors.text}
                color={colors.gray}
                value={title}
                onChange={val => setTitle(val)}
              />

              <SpaceComponent height={10} />

              <FlatList
                showsVerticalScrollIndicator={false}
                data={carts}
                renderItem={({ item, index }) =>
                  <CartItemComponent
                    key={item.id}
                    index={index}
                    cart={item}
                  />}
                ListFooterComponent={
                  carts.length > 0 && title !== '' ?
                    <RowComponent justify="space-around">
                      <ButtonComponent
                        color="coral"
                        text="Lưu nháp"
                        onPress={handleSaveCart}
                        styles={{ flex: 1 }}
                      />
                      <SpaceComponent width={16} />
                      <ButtonComponent
                        color={colors.green}
                        text="Gửi duyệt"
                        onPress={handleAddEditPlan}
                        styles={{ flex: 1 }}
                      />
                    </RowComponent>
                    :
                    <RowComponent justify="space-around">
                      <ButtonComponent
                        color="coral"
                        text="Lưu nháp"
                        onPress={() => setIsVisibleTitlePlan(true)}
                        styles={{ flex: 1 }}
                      />
                      <SpaceComponent width={16} />
                      <ButtonComponent
                        color={colors.green}
                        text="Gửi duyệt"
                        onPress={() => setIsVisibleTitlePlan(true)}
                        styles={{ flex: 1 }}
                      />
                    </RowComponent>
                }
              />
            </>
            :
            <RowComponent justify='center'>
              <TextComponent text='Giỏ mục tiêu trống !' font={fontFamillies.poppinsBold} />
              <SpaceComponent width={10} />
              <TouchableOpacity
                onPress={() => navigation.navigate('Target')}
                style={{
                  backgroundColor: colors.green,
                  padding: 10,
                  borderRadius: 10
                }}>
                <TextComponent text='Tạo kế hoạch mới' />
              </TouchableOpacity>
            </RowComponent>
        }
      </SectionComponent>

      <SpinnerComponent loading={isLoading} />
      <TitlePlanModal
        visible={isVisibleTitlePlan}
        title={title}
        setTitle={setTitle}
        onChange={(val) => setTitle(val)}
        onClose={() => setIsVisibleTitlePlan(false)}
      />
    </Container>
  );
};

export default CartScreen;
