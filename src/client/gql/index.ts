import {
  AddJob,
  CancelJob,
  JobAdded,
  JobRemoved,
  Jobs,
  JobUpdated,
  MetadataAndOptions,
  RemoveJob,
  YTMetadata,
} from "./job";
import {
  ChangePassword,
  CreateUser,
  CurrentUser,
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
  Login,
  Logout,
  RemoveJob,
};

export const Subscription = {
  JobAdded,
  JobRemoved,
  JobUpdated,
};
