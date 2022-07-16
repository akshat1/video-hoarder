import { Job } from "../model/Job";
import { Role } from "../model/Role";
import { User } from "../model/User";

export const canSee = (user: User, job: Job): boolean => {
  if (user.role === Role.Admin) 
    // Admin can see any job.
    return true;
  

  // Others can only see their own jobs.
  return job.createdBy === user.userName;
}

export const canDelete = (user: User, job: Job): boolean => {
  if (user.role === Role.Admin) 
    // Admin can delete any job.
    return true;
  

  // Others can only delete their own jobs.
  return job.createdBy === user.userName;
};

export const canChangeSettings = (user: User): boolean =>
  user.role === Role.Admin;
