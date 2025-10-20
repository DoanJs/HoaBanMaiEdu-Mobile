import { QueryConstraint, where } from '@react-native-firebase/firestore';
import { Logout } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { auth, signOut } from '../../../firebase.config';
import {
  Container,
  RowComponent,
  SearchComponent,
  SectionComponent,
  SpinnerComponent,
} from '../../components';
import { colors } from '../../constants/colors';
import { getDocData } from '../../constants/firebase/getDocData';
import {
  query_fields,
  query_interventions,
  query_suggests,
  query_targets,
} from '../../constants/firebase/query';
import { useFirestoreWithMeta } from '../../constants/firebase/useFirestoreWithMeta';
import { useFirestoreWithMetaCondition } from '../../constants/firebase/useFirestoreWithMetaCondition';
import { sizes } from '../../constants/sizes';
import {
  ChildrenModel,
  FieldModel,
  InterventionModel,
  SuggestModel,
  TargetModel,
} from '../../models';
import {
  useChildrenStore,
  useFieldStore,
  useInterventionStore,
  useSuggestStore,
  useTargetStore,
  useUserStore,
} from '../../zustand/store';
import ChildItemComponent from './ChildItemComponent';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// const children = [
//   {
//     id: '0B5Vno6QRymCF01j8fU6',
//     birth: '',
//     createAt: {
//       type: 'firestore/timestamp/1.0',
//       seconds: 1758376836,
//       nanoseconds: 805000000,
//     },
//     shortName: '',
//     updateAt: {
//       type: 'firestore/timestamp/1.0',
//       seconds: 1758376836,
//       nanoseconds: 805000000,
//     },
//     avatar:
//       'https://res.cloudinary.com/dr8wxl8it/image/upload/v1758269420/nguyenbanguyen_kin_of62lj.jpg',
//     teacherIds: [
//       '52LPPcC0ejgAWSEoWhWBCT8KHsm2',
//       'JcbMj3Z33KNyNsS1bCB0iGNYNOD3',
//     ],
//     gender: '',
//     fullName: 'Nguyễn Bá Nguyên (Kin)',
//   },
//   {
//     id: '10C6wTWtD4WAXAuziJUy',
//     updateAt: {
//       type: 'firestore/timestamp/1.0',
//       seconds: 1758376837,
//       nanoseconds: 46000000,
//     },
//     gender: '',
//     shortName: '',
//     fullName: 'Nguyễn Tâm Như (Mì)',
//     avatar:
//       'https://res.cloudinary.com/dr8wxl8it/image/upload/v1758214589/nguyentamnhu_mi_ywcfng.jpg',
//     teacherIds: [
//       '52LPPcC0ejgAWSEoWhWBCT8KHsm2',
//       'DevLOWAoKoeLwhGooHi5Wc5lLqs1',
//       'LHlXX5G8NAgPeCr5Y6fpwVcijja2',
//     ],
//     birth: '',
//     createAt: {
//       type: 'firestore/timestamp/1.0',
//       seconds: 1758376837,
//       nanoseconds: 46000000,
//     },
//   },
//   {
//     id: '2t1pa0kkBEy4TNAyktvX',
//     createAt: {
//       type: 'firestore/timestamp/1.0',
//       seconds: 1758376836,
//       nanoseconds: 377000000,
//     },
//     gender: '',
//     avatar:
//       'https://res.cloudinary.com/dr8wxl8it/image/upload/v1758214556/nguyenhoangvu_gau_i5kvjo.jpg',
//     updateAt: {
//       type: 'firestore/timestamp/1.0',
//       seconds: 1758376836,
//       nanoseconds: 377000000,
//     },
//     birth: '',
//     shortName: '',
//     teacherIds: [
//       '52LPPcC0ejgAWSEoWhWBCT8KHsm2',
//       'FCb4DuQpuWUcqpYbWlA4fNi8Rlt2',
//       '5fshD6m9GVa6TdpSZ5W9T57hXyq1',
//     ],
//     fullName: 'Nguyễn Hoàng Vũ (Gấu)',
//   },
//   {
//     id: '4ETda1DhSueq2eAJQPAH',
//     fullName: 'Nguyễn Tú Linh',
//     gender: '',
//     updateAt: {
//       type: 'firestore/timestamp/1.0',
//       seconds: 1758376837,
//       nanoseconds: 18000000,
//     },
//     avatar:
//       'https://res.cloudinary.com/dr8wxl8it/image/upload/v1758214533/nguyentulinh_qxdiuh.jpg',
//     shortName: '',
//     createAt: {
//       type: 'firestore/timestamp/1.0',
//       seconds: 1758376837,
//       nanoseconds: 18000000,
//     },
//     birth: '',
//     teacherIds: [
//       '52LPPcC0ejgAWSEoWhWBCT8KHsm2',
//       'DevLOWAoKoeLwhGooHi5Wc5lLqs1',
//       'LHlXX5G8NAgPeCr5Y6fpwVcijja2',
//     ],
//   },
// ];

const ChildrenScreen = () => {
  const userServer = auth.currentUser;
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUserStore();
  const { children, setChildren } = useChildrenStore();
  const { setFields } = useFieldStore();
  const { setTargets } = useTargetStore();
  const { setSuggests } = useSuggestStore();
  const { setInterventions } = useInterventionStore();

  const { data: data_children, loading: loading_children } =
    useFirestoreWithMetaCondition({
      key: `${user?.id}_childrenCache`,
      id: user?.id,
      metaDoc: 'children',
      nameCollect: 'children',
      condition: [
        where('teacherIds', 'array-contains', user?.id),
      ] as QueryConstraint[],
    });
  const { data: data_targets, loading: loading_targets } = useFirestoreWithMeta(
    {
      key: 'targetsCache',
      query: query_targets,
      metaDoc: 'targets',
    },
  );
  const { data: data_fields, loading } = useFirestoreWithMeta({
    key: 'fieldsCache',
    query: query_fields,
    metaDoc: 'fields',
  });
  const { data: data_suggests, loading: loading_suggests } =
    useFirestoreWithMeta({
      key: 'suggestsCache',
      query: query_suggests,
      metaDoc: 'suggests',
    });
  const { data: data_interventions, loading: loading_interventions } =
    useFirestoreWithMeta({
      key: 'interventions',
      query: query_interventions,
      metaDoc: 'interventions',
    });

  useEffect(() => {
    if (userServer) {
      getDocData({
        id: userServer.uid,
        nameCollect: 'users',
        setData: setUser,
      });
    }
  }, [userServer]);
  useEffect(() => {
    if (!loading_children) {
      setChildren(data_children as ChildrenModel[]);
    }
  }, [data_children, loading_children, setChildren]);
  useEffect(() => {
    if (!loading) {
      setFields(data_fields as FieldModel[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_fields, loading]);
  useEffect(() => {
    if (!loading_targets) {
      setTargets(data_targets as TargetModel[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_targets, loading_targets]);
  useEffect(() => {
    if (!loading_suggests) {
      setSuggests(data_suggests as SuggestModel[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_suggests, loading_suggests]);
  useEffect(() => {
    if (!loading_interventions) {
      setInterventions(data_interventions as InterventionModel[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_interventions, loading_interventions]);


  const handleLogout = async () => {
    setIsLoading(true);

    await signOut(auth);
    await GoogleSignin.signOut();
    await GoogleSignin.revokeAccess()
    setIsLoading(false);
  };


  // const uploadData = async () => {
  //   // const data = firestoreData.Meta;
  //   const promiseItem = children.map(_ => {
  //     const { id, ...valueUpdate } = _;
  //     setDocData({
  //       nameCollect: 'children',
  //       id,
  //       valueUpdate: {
  //         ...valueUpdate,
  //         createAt: serverTimestamp(),
  //         updateAt: serverTimestamp(),
  //       },
  //     });
  //   });

  //   Promise.all(promiseItem)
  //     .then(() => console.log('completed !'))
  //     .catch(error => console.log(error));
  // };

  if(!user) return <ActivityIndicator />
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Container
        bg={colors.primaryLight}
        uri={user?.avatar}
        title={`Cô ${user?.fullName}`}
        right={
          <Logout
            onPress={handleLogout}
            size={sizes.smallHeader}
            color={colors.orange}
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
          {/* <RowComponent onPress={uploadData}>
          <TextComponent text="Upload Data" />
        </RowComponent> */}
          <SearchComponent
            arrSource={data_children as ChildrenModel[]}
            onChange={val => setChildren(val)}
            placeholder="Nhập tên trẻ"
            type="searchChild"
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <RowComponent justify="space-around" styles={{ flexWrap: 'wrap' }}>
              {children.length > 0 &&
                children.map((_, index) => (
                  <ChildItemComponent key={index} child={_} />
                ))}
            </RowComponent>
          </ScrollView>
        </SectionComponent>
        
        <SpinnerComponent loading={isLoading}/>
      </Container>
    </SafeAreaView>
  );
};

export default ChildrenScreen;
