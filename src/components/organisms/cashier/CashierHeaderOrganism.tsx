"use client";

import LanguageChangerAtom from "@/components/atom/LanguageChangerAtom";
import { useEffect, useState } from "react";
import { FiHome } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { getAllBranches } from "@/services/loadData";
import { IBranch } from "@/@types/interfaces/IBranch";
import { ISearch } from "@/@types/interfaces/ISearch";
import { FiGrid } from "react-icons/fi";
import { useAppStore } from "@/store";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import Link from "next/link";
import { PiInvoice } from "react-icons/pi";

export default function CashierHeaderOrganism() {
  const { tenant_id } = useParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { t, i18n } = useTranslation();
  const [branches, setBranches] = useState<IBranch[]>([]);
  const { branch } = useAppStore();
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
    console.log(branch);
  };

  return (
    <header className="sticky top-0 h-16 px-6 bg-white shadow-lg flex justify-between items-center z-50">
      <div className="relative hidden sm:block">
        <Button
          className="mr-2 border-none bg-transparent"
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <div className="flex gap-2">
            <div className="bg-blue-100 flex items-center justify-center round rounded-lg w-14">
              <FiGrid size={24} />
            </div>
            <div className="flex w-full justify-between min-w-30 text-[var(--primary)]">
              <div className="flex flex-col justify-center">
                <div className="w-full whitespace-nowrap text-right text-lg text-ellipsis overflow-hidden leading-normal">
                  {branch?.name}
                </div>
                <div className="w-full text-sm mt-0.5 whitespace-nowrap text-ellipsis overflow-hidden text-center leading-normal font-medium text-secondary">
                  {t("More than 20 branch")}
                </div>
              </div>
            </div>
          </div>
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {branches.map((branch) => (
            <MenuItem key={branch.id} onClick={() => selectBranch(branch)}>
              {branch.name}
            </MenuItem>
          ))}
        </Menu>
      </div>
      <div className="flex gap-5 items-center">
        <LanguageChangerAtom />

        <div className="icons flex gap-2">
          <div>
            <IconButton
              className="bg-transparent icon_button border text-[#C2C2C2] border-[#E0E3E9] w-[40px] h-[40px] rounded-[8px]"
              LinkComponent={Link}
              href="/"
            >
              <FiHome className=" w-[20px] h-[20px]" />
            </IconButton>
          </div>
          <div>
            <IconButton className="bg-transparent icon_button text-[#C2C2C2]  border border-[#E0E3E9] w-[40px] h-[40px] rounded-[8px]">
              <PiInvoice className=" w-[20px] h-[20px]" />
            </IconButton>
          </div>
        </div>
      </div>
    </header>
  );
}
