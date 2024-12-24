"use client";

import { Drawer, useMediaQuery } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import React from "react";
import SidebarContentOrganism from "@/components/organisms/SidebarContentOrganism";

interface ISidebarOrganismProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SidebarOrganism({ open, setOpen }: Readonly<ISidebarOrganismProps>) {
  const isMediaSm = useMediaQuery("(min-width:1024px)");

  return isMediaSm ? (
    <div
      className="flex-shrink-0 transition-[width] overflow-x-hidden bg-white"
      style={{
        width: open ? 280 : 0,
      }}
    >
      <SidebarContentOrganism />
    </div>
  ) : (
    <Drawer
      variant={"temporary"}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <SidebarContentOrganism />
    </Drawer>
  );
}
