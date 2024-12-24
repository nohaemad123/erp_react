"use client";

import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { UsersDto } from "@/@types/dto/UserDto";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { usersAddValidationSchema, usersEditValidationSchema } from "@/@types/validators/usersValidators";
import fetchClient from "@/lib/fetchClient";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { useEffect, useState } from "react";
import { getAllBranches, getAllNationalities, getAllRoleUser, getAllStores, getUserById } from "@/services/loadData";
import { INationality } from "@/@types/interfaces/INationality";
import { IRoleUser } from "@/@types/interfaces/IRoleUser";
import { IBranch } from "@/@types/interfaces/IBranch";
import { IStore } from "@/@types/interfaces/IStore";
import { Autocomplete, Checkbox } from "@mui/material";
import { useAppStore } from "@/store";
import { useRouter } from "next/navigation";
import { IUser } from "@/@types/interfaces/IUser";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import ModalSavedAtom from "@/components/atom/ModalSavedAtom";
import { SaveButtonAtom } from "@/components/atom/SaveButtonAtom";
import { CreateButtonAtom } from "@/components/atom/CreateButtonAtom";
import { DeleteButtonAtom } from "@/components/atom/DeleteButtonAtom";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";
import { MobileFieldAtom } from "@/components/atom/MobileFieldAtom";
import DropdownBoxAtom from "@/components/atom/DropdownBoxAtom";

interface IUserFormTemplateProps {
  tenantId: string;
  userId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

const Lang = [
  { name: "العربيه", code: "ar" },
  { name: "English", code: "en" },
];

export default function UserFormTemplate({ tenantId, userId, isEdit, isView }: Readonly<IUserFormTemplateProps>) {
  const { t, i18n } = useTranslation();
  const [isModalSavedOpen, setIsModalSavedOpen] = useState<boolean>(false);

  const { push } = useRouter();
  const { isHttpClientLoading } = useAppStore();
  const [nationality, setNationality] = useState<INationality[]>([]);
  const [userRole, setUserRole] = useState<IRoleUser[]>([]);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [Store, setStore] = useState<IStore[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UsersDto>({
    defaultValues: new UsersDto({ phoneNumberCountryId: "SA" }),
    resolver: valibotResolver(isEdit ? usersEditValidationSchema : usersAddValidationSchema),
  });

  // Function to fetch nationality data
  function fetchNationality() {
    getAllNationalities(i18n.language, tenantId)
      .then((res) => {
        setNationality(res?.listData ?? []);
      })
      .catch(console.log);
  }

  // Function to fetch user role data
  function fetchUserRole() {
    getAllRoleUser(i18n.language, tenantId)
      .then((res) => {
        setUserRole(res?.listData ?? []);
      })
      .catch(console.log);
  }

  // Function to fetch Branches data
  function fetchBranches() {
    getAllBranches(i18n.language, tenantId, {})
      .then((res) => {
        setBranches(res?.listData ?? []);
      })
      .catch(console.log);
  }

  // Function to fetch Stores data
  function fetchStores() {
    getAllStores(i18n.language, tenantId)
      .then((res) => {
        console.log(res);
        setStore(res?.listData ?? []);
      })
      .catch(console.log);
  }

  useEffect(() => {
    if (userId && typeof userId === "string") {
      getUserById(i18n.language, tenantId, userId)
        .then((res) => {
          reset(res);
        })
        .catch(console.log);
    }
    fetchNationality();
    fetchUserRole();
    fetchBranches();
    fetchStores();
  }, [userId]);

  async function handleCreate(usersData: UsersDto) {
    try {
      const response = await fetchClient<ResultHandler<IUser>>(EndPointsEnums.User, {
        method: "POST",
        body: usersData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/users");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function handleUpdate(usersData: UsersDto) {
    try {
      const response = await fetchClient<ResultHandler<IUser>>(EndPointsEnums.User, {
        method: "PUT",
        body: usersData,
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: userId,
        },
      });

      // console.log(response);

      if (response.status) {
        push("/" + tenantId + "/users");
        return;
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  // Function to handle form submission
  async function handleSubmitForm(usersData: UsersDto) {
    console.log(usersData);

    if (isView) return;

    setIsModalSavedOpen(true);
    if (isEdit) {
      handleUpdate(usersData);
    } else {
      handleCreate(usersData);
    }
  }

  // Function to clear the form
  function handleClearForm() {
    reset(new UsersDto());
  }

  async function handleDelete() {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.User, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: userId,
        },
      });

      if (response.status) {
        // toaster for success
        push("/" + tenantId + "/users");
        return;
      }

      // toaster for error
    } catch (error) {
      console.error("Error deleting:", error);
      // toaster for error
    }
  }

  return (
    <div>
      <div className="w-full ">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <ModalSavedAtom isOpen={isModalSavedOpen} setIsOpen={setIsModalSavedOpen} isEdit={isEdit} />

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <MainCardTitleAtom title="User Information" />
            {!isView && (
              <div className="flex gap-3">
                {!isEdit && <CreateButtonAtom onClick={handleClearForm} />}
                <SaveButtonAtom />

                {isEdit && <DeleteButtonAtom onClick={handleDelete} />}
              </div>
            )}
          </div>

          {/* controls */}
          <div className="p-10 bg-white border-solid border-[#E6E7EC] border rounded-md rounded-tr-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* name */}
              <div>
                <LabelAtom required labelMessage="User Name" />
                <TextFieldAtom
                  disabled={isView || isHttpClientLoading}
                  type="text"
                  placeholder={t("Enter User Name")}
                  className="w-full"
                  {...register("name")}
                />
                {errors.name?.message && <ErrorInputAtom errorMessage={errors.name?.message} />}
              </div>

              {/* password */}
              <div>
                <LabelAtom required labelMessage="Password" />
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { value, onChange } }) => (
                    <TextFieldAtom
                      type="password"
                      value={value}
                      onChange={onChange}
                      disabled={isView || isHttpClientLoading}
                      className="w-full text-base"
                      placeholder={t("Enter your password")}
                    />
                  )}
                />
                {!isEdit && errors.password?.message && <ErrorInputAtom errorMessage={errors.password?.message} />}
              </div>

              {/* confirm password */}
              <div>
                <LabelAtom required labelMessage="Confirm Password" />
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { value, onChange } }) => (
                    <TextFieldAtom
                      type="password"
                      value={value}
                      onChange={onChange}
                      disabled={isView || isHttpClientLoading}
                      className="w-full text-base"
                      placeholder={t("Confirm Password")}
                    />
                  )}
                />
                {!isEdit && errors.confirmPassword?.message && <ErrorInputAtom errorMessage={errors.confirmPassword?.message} />}
              </div>

              {/* phone Number */}
              <div>
                <LabelAtom required labelMessage="Phone Number" />
                <MobileFieldAtom control={control} name="phone" />
                {errors.phoneNumber?.message && <ErrorInputAtom errorMessage={errors.phoneNumber?.message} />}
                {errors.phoneNumberCountryId?.message && <ErrorInputAtom errorMessage={errors.phoneNumberCountryId?.message} />}
              </div>

              {/* address */}
              <div>
                <LabelAtom labelMessage="Address" />
                <TextFieldAtom
                  disabled={isView || isHttpClientLoading}
                  type="text"
                  placeholder={t("Enter Address")}
                  className="w-full text-base"
                  {...register("address")}
                />
                {errors.address?.message && <ErrorInputAtom errorMessage={errors.address?.message} />}
              </div>

              {/* nationality */}
              <div>
                <LabelAtom required labelMessage="Nationality" />

                <Controller
                  control={control}
                  name="nationalityId"
                  render={({ field: { value, onChange } }) => (
                    <DropdownBoxAtom
                      options={nationality}
                      value={value}
                      keySelector={(item) => item.id ?? Date.now()}
                      valueSelector={(item) => item.id}
                      fullWidth
                      optionRender={(item) => item.name}
                      triggerLabelDisplay={(item) => item.name ?? ""}
                      filter={["name"]}
                      onSelect={(item) => {
                        onChange(item.id);
                      }}
                    />
                  )}
                />
                {errors.nationalityId?.message && <ErrorInputAtom errorMessage={errors.nationalityId?.message} />}
              </div>
            </div>
            <h3 className="my-6 w-full text-[#226AB2]">{t("Account Information")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* email */}
              <div>
                <LabelAtom required labelMessage="Email" />
                <TextFieldAtom
                  disabled={isView || isHttpClientLoading}
                  type="email"
                  className="w-full text-base"
                  {...register("email")}
                />
                {errors.email?.message && <ErrorInputAtom errorMessage={errors.email?.message} />}
              </div>

              {/* roles */}
              <div>
                <LabelAtom required labelMessage="Enter the Job Role" />
                <Controller
                  control={control}
                  name="roles"
                  render={({ field: { value, onChange } }) => (
                    <DropdownBoxAtom
                      options={userRole}
                      value={value}
                      keySelector={(item) => item.id ?? Date.now()}
                      valueSelector={(item) => item.id}
                      fullWidth
                      optionRender={(item) => item.name}
                      triggerLabelDisplay={(item) => item.name ?? ""}
                      filter={["name"]}
                      onSelect={(item) => {
                        onChange([item.id]);
                      }}
                    />
                  )}
                />
                {errors.roles?.message && <ErrorInputAtom errorMessage={errors.roles?.message} />}
              </div>

              {/* default Language */}
              <div>
                <LabelAtom required labelMessage="Language" />
                <Controller
                  control={control}
                  name="defaultLanguage"
                  render={({ field: { value, onChange } }) => (
                    <DropdownBoxAtom
                      options={Lang}
                      value={value}
                      keySelector={(item) => item.code ?? Date.now()}
                      valueSelector={(item) => item.code}
                      fullWidth
                      optionRender={(item) => item.name}
                      triggerLabelDisplay={(item) => item.name ?? ""}
                      filter={["name"]}
                      onSelect={(item) => {
                        onChange(item.code);
                      }}
                    />
                  )}
                />

                {errors.defaultLanguage?.message && <ErrorInputAtom errorMessage={errors.defaultLanguage?.message} />}
              </div>

              {/* branches User */}
              <div>
                <LabelAtom required labelMessage="Permitted branches" />
                <Controller
                  control={control}
                  name="branchUser"
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      multiple
                      value={value}
                      options={branches.map((x) => {
                        return x.id;
                      })}
                      disabled={isView || isHttpClientLoading}
                      filterSelectedOptions
                      getOptionLabel={(option) => {
                        const branch = branches.find((item) => item.id === option);
                        return branch ? branch.name : "";
                      }}
                      onChange={(_, value) => {
                        onChange(value);
                      }}
                      renderInput={(params) => <TextFieldAtom {...params} placeholder={t("Choose stores")} />}
                    />
                  )}
                />
                {errors.storeUser?.message && <ErrorInputAtom errorMessage={errors.storeUser?.message} />}
              </div>

              {/* store User */}
              <div>
                <LabelAtom required labelMessage="Permitted stores" />
                <Controller
                  control={control}
                  name="storeUser"
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      multiple
                      value={value}
                      options={Store.map((x) => {
                        return x.id;
                      })}
                      disabled={isView || isHttpClientLoading}
                      getOptionLabel={(option) => {
                        const store = Store.find((item) => item.id === option);
                        return store ? store.name : "";
                      }}
                      filterSelectedOptions
                      onChange={(_, val) => {
                        onChange(val);
                      }}
                      renderInput={(params) => <TextFieldAtom {...params} placeholder={t("Choose Stores")} />}
                    />
                  )}
                />
                {errors.storeUser?.message && <ErrorInputAtom errorMessage={errors.storeUser?.message} />}
              </div>

              {/* sendDataToMail */}
              <div className="bg-[#E5EEF9] flex items-center px-2 mt-auto h-[45px]">
                <Controller
                  control={control}
                  name="sendDataToMail"
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      checked={value}
                      onChange={(e) => {
                        onChange(e.target.checked);
                      }}
                      disabled={isView || isHttpClientLoading}
                      className="flex bg-transparent border-0 rounded-lg mx-3 w-4"
                    />
                  )}
                />

                <LabelAtom labelMessage="Send Data To Mail" sx={{ mx: 1, my: 0, fontSize: "12px" }} />
                {errors.sendDataToMail?.message && <ErrorInputAtom errorMessage={errors.sendDataToMail?.message} />}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
