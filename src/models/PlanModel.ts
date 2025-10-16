import { FieldValue } from "@react-native-firebase/firestore";
import { TimeAtModel } from "./TimeAtModel";

export interface PlanModel {
  id: string;
  type: string
  title: string
  childId: string
  teacherIds: string[]
  authorId: string
  status: string
  comment: string

  createAt: TimeAtModel | FieldValue;
  updateAt: TimeAtModel | FieldValue;
}
