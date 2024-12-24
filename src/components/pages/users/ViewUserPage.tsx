"use client";

import { IUser } from "@/@types/interfaces/IUser";
import { getAllBranches, getAllRoleUser, getAllUsers } from "@/services/loadData";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IRoleUser } from "@/@types/interfaces/IRoleUser";
import { SearchDto } from "@/@types/dto/SearchDto";
import { useAppStore } from "@/store";
import { IPagination } from "@/@types/interfaces/IPagination";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import fetchClient from "@/lib/fetchClient";
import { EndPointsEnums } from "@/@types/enums/endPoints";
import { Controller, useForm } from "react-hook-form";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import ModalDeleteAtom from "@/components/atom/ModalDeleteAtom";
import { SearchButtonAtom } from "@/components/atom/SearchButtonAtom";
import { ResetButtonAtom } from "@/components/atom/ResetButtonAtom";
import { PaginationAtom } from "@/components/atom/PaginationAtom";
import TableAtom from "@/components/atom/TableAtom";
import { MainCardTitleAtom } from "@/components/atom/MainCardTitleAtom";
import DropdownBoxAtom from "@/components/atom/DropdownBoxAtom";
import AddNewButtonAtom from "@/components/atom/AddNewButtonAtom";

const initSearchValues = new SearchDto({
  readDto: { searchRoles: "", searchBranchs: "" },
  selectColumns: ["id", "name", "email", "phoneNumber", "isActive", "roles", "lastLogIn"],
});

interface IViewUserPageProps {
  tenantId: string;
}

export default function ViewUserPage({ tenantId }: Readonly<IViewUserPageProps>) {
  const { t, i18n } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const [deletedPopup, setDeletedPopup] = useState<IUser | null>(null);
  const handleClose = () => setDeletedPopup(null);
  const [rows, setRows] = useState<IUser[]>([]);
  const [pagination, setPagination] = useState<IPagination>();
  const { reset, register, handleSubmit, control, getValues, setValue, watch } = useForm<SearchDto>({
    defaultValues: { ...initSearchValues },
  });

  const [roleUsers, setRoleUsers] = useState<IRoleUser[]>([]);
  const [branchs, setBranchs] = useState<IRoleUser[]>([]);

  function handleSubmitForm(values: SearchDto) {
    console.log(values);
    fetchUsers(values);
  }

  function fetchRoleUsers() {
    getAllRoleUser(i18n.language, tenantId, {})
      .then((res) => {
        setRoleUsers(res?.listData ?? []);
      })
      .catch(console.log);
  }

  function fetchBranches() {
    getAllBranches(i18n.language, tenantId, {})
      .then((res) => {
        setBranchs(res?.listData ?? []);
      })
      .catch(console.log);
  }

  // Fetch users on component mount
  function fetchUsers(params: SearchDto) {
    getAllUsers(i18n.language, tenantId, params)
      .then((res) => {
        setRows(res?.listData ?? []);
        setPagination(res?.paginationData);
        if (res) {
          setValue("page", res.paginationData.currentPage);
          setValue("pageSize", res.paginationData.pageSize);
        }
      })
      .catch(console.log);
  }

  async function handleDelete(id: any) {
    try {
      const response = await fetchClient<ResultHandler<null>>(EndPointsEnums.User, {
        method: "DELETE",
        headers: {
          Tenant: tenantId,
          "Accept-Language": i18n.language,
        },
        params: {
          id: id,
        },
      });

      if (response.status) {
        handleClose();
        fetchUsers(getValues());
      } else {
        console.error("Error deleting");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  }

  useEffect(() => {
    fetchRoleUsers();
    fetchBranches();
    fetchUsers(getValues());
  }, [tenantId, watch("page"), watch("pageSize")]);

  return (
    <div className="w-full">
      <div className="w-full p-8">
        <form className="w-full p-8  bg-white rounded-md " onSubmit={handleSubmit(handleSubmitForm)}>
          {/* Buttons */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-xl font-normal">{t("filter_search")}</p>
            <div className="flex gap-4">
              <SearchButtonAtom />
              <ResetButtonAtom
                disabled={isHttpClientLoading}
                type="button"
                onClick={() => {
                  reset({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
                  fetchUsers({ ...initSearchValues, page: getValues("page"), pageSize: getValues("pageSize") });
                }}
              />
            </div>
          </div>

          {/* Controlls */}
          <div className="grid grid-cols md:grid-cols-3 gap-6 mt-2">
            <div>
              <LabelAtom labelMessage="Search by" />
              <TextFieldAtom placeholder={t("Search For")} {...register("search")} className="w-full text-base" />
            </div>

            <div>
              <LabelAtom labelMessage="Enter the Job Role" />
              <Controller
                control={control}
                name="readDto.searchRoles"
                render={({ field: { value, onChange } }) => (
                  <DropdownBoxAtom
                    options={roleUsers}
                    value={value}
                    keySelector={(item) => item?.name ?? Date.now()}
                    valueSelector={(item) => item?.name}
                    fullWidth
                    optionRender={(item) => item?.name}
                    triggerLabelDisplay={(item) => item?.name}
                    filter={["name"]}
                    onSelect={(item) => {
                      onChange(item.name);
                    }}
                  />
                )}
              />
            </div>

            <div className="mb-6 sm:w-full md:w-full lg:w-1/3">
              <LabelAtom labelMessage="Choose branches" />
              <Controller
                control={control}
                name="readDto.searchBranchs"
                render={({ field: { value, onChange } }) => (
                  <DropdownBoxAtom
                    options={branchs}
                    value={value}
                    keySelector={(item) => item?.name ?? Date.now()}
                    valueSelector={(item) => item?.name}
                    fullWidth
                    optionRender={(item) => item?.name}
                    triggerLabelDisplay={(item) => item?.name}
                    filter={["name"]}
                    onSelect={(item) => {
                      onChange(item.name);
                    }}
                  />
                )}
              />
            </div>
          </div>
        </form>

        <div className="flex items-center justify-between mt-8">
          <MainCardTitleAtom title="Users" totalCount={pagination?.totalCount} />

          <div className="flex">
            <AddNewButtonAtom href={"/" + tenantId + "/users/add"} />
          </div>
        </div>

        <div className="p-2 bg-white w-full">
          <TableAtom aria-label="User Page">
            <TableAtom.THead>
              <TableAtom.TRow>
                <TableAtom.TCell component="th">#</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("user Name")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("email")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("phoneNumber")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("roles")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{t("lastLogIn")}</TableAtom.TCell>
                <TableAtom.TCell component="th">{""}</TableAtom.TCell>
              </TableAtom.TRow>
            </TableAtom.THead>
            <TableAtom.TBody>
              {rows.map((item, index) => (
                <TableAtom.TRow key={item?.id}>
                  <TableAtom.TCell>{index + 1}</TableAtom.TCell>
                  <TableAtom.TCell>{item.name}</TableAtom.TCell>
                  <TableAtom.TCell>{item.email}</TableAtom.TCell>
                  <TableAtom.TCell>{item.phoneNumber}</TableAtom.TCell>
                  <TableAtom.TCell>{item.roles}</TableAtom.TCell>
                  <TableAtom.TCell>{item.isActive}</TableAtom.TCell>
                  <TableAtom.TCell>{item.lastLogIn}</TableAtom.TCell>
                  <TableAtom.TCellEnd
                    viewLink={"/" + tenantId + "/users/" + item?.id}
                    editLink={"/" + tenantId + "/users/" + item?.id + "/edit"}
                    onDelete={() => setDeletedPopup(item)}
                  />
                </TableAtom.TRow>
              ))}
            </TableAtom.TBody>
          </TableAtom>
        </div>
        <PaginationAtom
          page={watch("page")}
          changeSelectHandler={(val) => {
            setValue("page", 1);
            setValue("pageSize", +val.target.value);
          }}
          changePaginationHandler={(_, page) => {
            setValue("page", page);
          }}
          pageSize={watch("pageSize")}
          totalPages={pagination?.totalPages}
          totalCount={pagination?.totalCount}
        />
      </div>
      <ModalDeleteAtom
        isOpen={!!deletedPopup}
        deleteHandler={() => handleDelete(deletedPopup?.id)}
        closeHandler={handleClose}
        titleMessage="Delete user?"
        descriptionMessage="When you delete the user, you will lose all the user information and it will be transferred to the deleted list"
      />
    </div>
  );
}
