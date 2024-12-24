import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { IUserLogin } from "@/@types/interfaces/IUser";
import { IBranch } from "@/@types/interfaces/IBranch";

interface IStore {
  isSidebarOpen: boolean;
  isHttpClientLoading: boolean;
  userToken?: string | null;
  myUser?: IUserLogin | null;
  branch?: IBranch;
  accessToken?: string;
}

export const useAppStore = createWithEqualityFn<IStore>(
  (_set) => ({
    isSidebarOpen: false,
    isHttpClientLoading: false,
    accessToken: "",
  }),
  shallow,
);
