export type IRole = {
  id: number;
  name: string;
  __entity: "RoleEntity";
};

export type IStatus = {
  id: number;
  name: string;
  __entity: "StatusEntity";
};

export type IUser = {
  id: number;
  email: string;
  provider: string;
  socialId: string | null;
  firstName: string;
  lastName: string;
  role: IRole;
  status: IStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
