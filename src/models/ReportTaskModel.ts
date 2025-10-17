import { TimeAtModel } from ".";

export interface ReportTaskModel {
  id: string;
  content: string;
  isEdit: boolean
  planId: string
  planTaskId: string;
  reportId: string
  childId: string
  teacherIds: string[]
  authorId: string

  createAt: TimeAtModel;
  updateAt: TimeAtModel;
}
