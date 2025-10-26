import { FieldValue } from "@react-native-firebase/firestore";
import { TimeAtModel } from ".";

export interface ReportSavedModel {
  id: string;
  authorId: string
  childId: string;
  content: string;
  intervention: string;
  total: string

  planId: string;
  targetId: string;
  teacherIds: string[]
  
  createAt: TimeAtModel | FieldValue;
  updateAt: TimeAtModel | FieldValue;
}
