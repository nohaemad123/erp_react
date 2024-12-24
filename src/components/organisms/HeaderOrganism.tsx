"use client";

import LanguageChangerAtom from "@/components/atom/LanguageChangerAtom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams, usePathname } from "next/navigation";
import { getAllBranches } from "@/services/loadData";
import { IBranch } from "@/@types/interfaces/IBranch";
import { ISearch } from "@/@types/interfaces/ISearch";
import { useAppStore } from "@/store";
import { IconButton } from "@mui/material";
import Image from "next/image";
import logo from "@/assets/images/logo-colored.svg";
import barIcon from "@/assets/images/bar-icon.svg";
import arLogo from "@/assets/images/ar-logo.svg";
import { BranchesMenuHeaderAtom } from "@/components/atom/header-atoms/BranchesMenuHeaderAtom";
import { HeaderButtonsAtom } from "@/components/atom/header-atoms/HeaderButtonsAtom";
import { BreadcrumbsAtom } from "@/components/atom/header-atoms/BreadCrumbsAtom";

interface IHeaderOrganismProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function HeaderOrganism({ setOpen }: Readonly<IHeaderOrganismProps>) {
  const { tenant_id } = useParams();
  const pathname = usePathname();
  const pathnameArr = pathname.split("/").filter((x) => x && x !== tenant_id);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { i18n } = useTranslation();
  const [branches, setBranches] = useState<IBranch[]>([]);
  const search: ISearch = {
    page: 1,
    pageSize: 10000,
    search: "",
    readDto: {},
  };

  useEffect(() => {
    fetchBranches();
  }, [tenant_id]);

  function fetchBranches() {
    if (tenant_id && typeof tenant_id === "string")
      getAllBranches(i18n.language, tenant_id, search)
        .then((res) => {
          setBranches(res?.listData ?? []);
          useAppStore.setState({ branch: res?.listData?.[0] });
        })
        .catch(console.log);
  }

  const selectBranch = (branchValue: IBranch) => {
    useAppStore.setState({ branch: branchValue });
  };

  return (
    <header className="sticky top-0 h-16 px-6 bg-white shadow-lg flex justify-between items-center z-50">
      <div className="flex gap-3 items-center">
        <div className="flex w-auto sm:w-[233px] items-center justify-between me-0 sm:me-12">
          {i18n.language === "en" ? <Image src={logo} alt="logo" width={120} /> : <Image src={arLogo} alt="logo" width={120} />}
          <IconButton
            onClick={() => {
              setOpen((prev) => !prev);
            }}
          >
            <Image src={barIcon} width={24} height={24} alt="barIcon" />
          </IconButton>
        </div>
        <BreadcrumbsAtom tenantId={tenant_id} pathnameArray={pathnameArr} />
      </div>
      <div className="flex gap-5 items-center">
        <LanguageChangerAtom />
        <HeaderButtonsAtom />
        <BranchesMenuHeaderAtom
          isOpen={open}
          anchorEl={anchorEl}
          branches={branches}
          selectBranch={selectBranch}
          openHandler={handleClick}
          closeHandler={handleClose}
        />
      </div>
    </header>
  );
}
