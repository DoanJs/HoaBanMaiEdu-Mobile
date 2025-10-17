import { collection, deleteDoc, doc, getDocs, query, where } from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { SpaceComponent } from "..";
import { db } from "../../../firebase.config";
import { colors } from "../../constants/colors";
import { deleteDocData } from "../../constants/firebase/deleteDocData";
import { CartModel, PlanTaskModel, ReportTaskModel } from "../../models";
import { usePlanStore, useReportStore, useUserStore } from "../../zustand/store";

interface DataModel {
  id: string;
  type: string;
  itemTasks: ReportTaskModel[] | PlanTaskModel[] | CartModel[];
  setForm?: any;
  setEdit?: any;
}
interface Props {
  data: DataModel;
  visible: boolean
  onClose: () => void
}

export default function DeleteModal(props: Props) {
  const { data, visible, onClose } = props;
  const navigation: any = useNavigation()
  const { user } = useUserStore();
  const { removePlan } = usePlanStore();
  const { removeReport } = useReportStore();
  const [isLoading, setIsLoading] = useState(false);


  const deleteReportPending = async (reportId: string) => {
    removeReport(reportId);
    setIsLoading(true);

    const reportTasks = await getDocs(
      query(
        collection(db, "reportTasks"),
        where("teacherIds", "array-contains", user?.id),
        where("reportId", "==", reportId)
      )
    );

    if (!reportTasks.empty) {
      const promiseReportTasks = reportTasks.docs.map((_: any) =>
        deleteDocData({
          nameCollect: "reportTasks",
          id: _.id,
          metaDoc: "reports",
        })
      );
      await Promise.all(promiseReportTasks);
    }

    await deleteDocData({
      nameCollect: "reports",
      id: reportId,
      metaDoc: "reports",
    });

    setIsLoading(false);
    navigation.navigate('Main', { screen: 'Pending' })
  };
  const deletePlanPending = async (planId: string) => {
    removePlan(planId);
    setIsLoading(true);

    const promisePlanTasks = data.itemTasks.map((_) =>
      deleteDocData({
        nameCollect: "planTasks",
        id: _.id,
        metaDoc: "plans",
      })
    );
    await Promise.all(promisePlanTasks);

    await deleteDocData({
      nameCollect: "plans",
      id: planId,
      metaDoc: "plans",
    });

    setIsLoading(false);
    navigation.navigate('Main', { screen: 'Pending' })
  };
  const deleteChildren = async (childId: string) => {
    setIsLoading(true);
    deleteDocData({
      nameCollect: "children",
      id: childId,
      metaDoc: "children",
    })
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };
  const deleteTarget = async (targetId: string) => {
    setIsLoading(true);
    deleteDocData({
      nameCollect: "targets",
      id: targetId,
      metaDoc: "targets",
    })
      .then(() => {
        setIsLoading(false);
        data.setForm({
          nameSuggest: "",
          nameTarget: "",
          level: 0,
          fieldId: "",
        });
        data.setEdit(undefined);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };
  const deleteSuggest = async (suggestId: string) => {
    setIsLoading(true);
    deleteDocData({
      nameCollect: "suggests",
      id: suggestId,
      metaDoc: "suggests",
    })
      .then(() => {
        setIsLoading(false);
        data.setForm({ fieldId: "", nameSuggest: "" });
        data.setEdit(undefined);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };
  const deleteUser = async (userId: string) => {
    setIsLoading(true);
    deleteDocData({
      nameCollect: "users",
      id: userId,
      metaDoc: "users",
    })
      .then(() => {
        setIsLoading(false);
        data.setForm({
          fullName: "",
          avatar: "",
          role: "",
          email: "",
          position: "",
        });
        data.setEdit(undefined);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };
  const deletePlanApproved = async (planId: string) => {
    setIsLoading(true);
    deleteDocData({
      nameCollect: "plans",
      id: planId,
      metaDoc: "plans",
    })
      .then(() => {
        setIsLoading(false);
        data.setForm({
          title: "",
          status: "pending",
        });
        data.setEdit(undefined);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };
  const deleteMeta = async (metaId: string) => {
    setIsLoading(true);
    deleteDoc(doc(db, "Meta", metaId))
      .then(() => {
        setIsLoading(false);
        data.setForm({
          name: "",
          lastUpdated: Date.now(),
        });
        data.setEdit(undefined);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };
  const deleteCart = async (carts: CartModel[]) => {
    setIsLoading(true);
    const promiseItems = carts.map((cart) => deleteDocData({
      nameCollect: 'carts',
      id: cart.id,
      metaDoc: 'carts'
    }))

    Promise.all(promiseItems)
      .then(() => {
        setIsLoading(false);
        data.setForm([])
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };


  const handleDelete = async () => {
    switch (data.type) {
      case "planPending":
        deletePlanPending(data.id);
        break;

      case "reportPending":
        deleteReportPending(data.id);
        break;

      case "children":
        deleteChildren(data.id);
        break;

      case "targets":
        deleteTarget(data.id);
        break;

      case "suggests":
        deleteSuggest(data.id);
        break;

      case "users":
        deleteUser(data.id);
        break;

      case "Meta":
        deleteMeta(data.id);
        break;

      case "carts":
        deleteCart(data.itemTasks as CartModel[]);
        break;

      case "planApproveds":
        deletePlanApproved(data.id);
        break;

      default:
        break;
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true)
    await handleDelete()
    setIsLoading(false)
    onClose()
  };
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}
    >
      <View style={styles.modalBox}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Xóa dữ liệu</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>Đóng</Text>
          </TouchableOpacity>
        </View>
        <Text>Cô chắc chắn muốn xóa dữ liệu này ?</Text>
        <SpaceComponent height={20} />
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancel]}>
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleConfirm} style={[styles.button, styles.confirm]}>
            {
              isLoading
                ? <ActivityIndicator />
                : <Text style={styles.buttonText}>Xóa</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 0, // bỏ khoảng trống mặc định
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    maxHeight: '85%', // tránh tràn màn hình
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    color: '#007AFF',
    fontSize: 16,
  },
  // item: {
  //   marginBottom: 16,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#eee',
  //   paddingBottom: 8,
  // },
  // itemTitle: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   marginBottom: 4,
  // },
  // itemContent: {
  //   fontSize: 15,
  //   lineHeight: 22,
  //   color: '#333',
  // },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  cancel: {
    backgroundColor: "#ccc",
  },
  confirm: {
    backgroundColor: colors.red,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});