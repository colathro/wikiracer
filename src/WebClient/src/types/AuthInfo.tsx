import { AuthType } from "../enums/AuthType";

export type AuthInfo = {
  display_name: string;
  access_token: string;
  auth_provider: AuthType;
};
