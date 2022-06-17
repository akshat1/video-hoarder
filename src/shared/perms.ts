import { Job } from "../model/Job";
import { Role } from "../model/Role";
import { User } from "../model/User";

export const canDelete = (user: User, job: Job): boolean => {
  if (user.role === Role.Admin) {
    // Admin can delete any job.
    return true;
  }

  // Others can only delete their own jobs.
  return job.createdBy === user.id;
};

export const canChangeSettings = (user: User): boolean =>
  user.role === Role.Admin;
