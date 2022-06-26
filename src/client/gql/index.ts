import {
  AddJob,
  CancelJob,
  JobAdded,
  JobRemoved,
  Jobs,
  JobUpdated,
  MetadataAndOptions,
  RemoveAllDoneJobs,
  RemoveJob,
  YTMetadata,
} from "./job";
import {
  ChangePassword,
  CreateUser,
  CurrentUser,
  DeleteUser,
  Login,
  Logout,
  Users,
} from "./user";
import { YTDLInformation } from "./ytdl";

export const Query = {
  CurrentUser,
  Jobs,
  MetadataAndOptions,
  YTMetadata,
  YTDLInformation,
  Users,
};

export const Mutation = {
  AddJob,
  CancelJob,
  ChangePassword,
  CreateUser,
  DeleteUser,
  Login,
  Logout,
  RemoveAllDoneJobs,
  RemoveJob,
};

export const Subscription = {
  JobAdded,
  JobRemoved,
  JobUpdated,
};
