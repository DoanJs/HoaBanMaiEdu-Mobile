import { TimeAtModel } from ".";

export interface ChildrenModel {
  id: string;
  fullName: string;
  avatar: string;
  birth: TimeAtModel
  gender: string
  teacherIds: [string]
  managerIds: [string]

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
