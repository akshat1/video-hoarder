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
  CurrentUser,
  Login,
  Logout,
} from "./user";

export const Query = {
  CurrentUser,
  Jobs,
  MetadataAndOptions,
  YTMetadata,
};

export const Mutation = {
  AddJob,
  CancelJob,
  ChangePassword,
  Login,
  Logout,
  RemoveJob,
};

export const Subscription = {
  JobAdded,
  JobRemoved,
  JobUpdated,
};
