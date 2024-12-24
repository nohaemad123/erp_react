"use client";

import { Button, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import React from "react";
import chat from "@/assets/icons/chat.svg";
import { useAppStore } from "@/store";
import {
  HiOutlineClipboardList,
  HiOutlineCurrencyDollar,
  HiOutlineDatabase,
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineViewGrid,
} from "react-icons/hi";
import { HiOutlineCog } from "react-icons/hi";
import { HiChevronLeft } from "react-icons/hi2";
import { HiChevronUp } from "react-icons/hi2";
import { HiChevronDown } from "react-icons/hi2";
import { BsCircle } from "react-icons/bs";
import Link from "next/link";
import { HiOutlineCube } from "react-icons/hi2";
import { useParams, useRouter } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import { usePathname } from "next/navigation";
import { UserMenuSidebarAtom } from "@/components/atom/UserMenuSidebarAtom";
import { AvatarAtom } from "@/components/atom/AvatarAtom";

interface NavigationChild {
  title: string;
  url: string;
  icon: React.ReactNode;
}

interface NavigationItem {
  title: string;
  url?: string;
  icon: React.ReactNode;
  children?: NavigationChild[];
}
export default function SidebarContentOrganism() {
  const { tenant_id } = useParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const { t } = useTranslation();
  const { myUser } = useAppStore();
  const [openTab, setOpenTab] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenTab = (tab: number) => {
    setOpenTab((prev) => (prev === tab ? 0 : tab));
  };

  const handleSignOut = () => {
    localStorage.removeItem("myUser");
    useAppStore.setState({ myUser: null, userToken: undefined });
    push("/login");
  };

  /**
   * Checks if a child URL is part of the current pathname
   * @param childUrl - The URL segment to check against the current pathname
   * @returns {boolean} True if the childUrl is included in the current pathname, false otherwise
   */
  const isChildActive = (childUrl: string): boolean => {
    return pathname.includes(childUrl);
  };

  /**
   * Determines if a navigation item or any of its children is currently active based on the URL.
   *
   * @param item - The navigation item to check
   * @returns A boolean indicating whether the item or any of its children is active
   *
   * @example
   * // Returns true if either the parent URL matches pathname or any child URL matches
   * const active = isParentActive({
   *   url: '/parent',
   *   children: [{ url: '/parent/child' }]
   * });
   */
  const isParentActive = (item: NavigationItem) => {
    if (item.children) {
      return item.children?.some((child) => isChildActive(child.url));
    }
    return pathname === item.url;
  };

  const navigationItems: Array<{
    title: string;
    url?: string;
    icon: React.ReactNode;
    children?: Array<{
      title: string;
      url: string;
      icon: React.ReactNode;
    }>;
  }> = [
    {
      title: "Dashboard",
      url: `/${tenant_id}`,
      icon: <HiOutlineViewGrid />,
    },
    {
      title: "Basic Info",
      icon: <HiOutlineDatabase />,
      children: [
        {
          title: "Branches info",
          url: `/${tenant_id}/branches`,
          icon: <BsCircle />,
        },
        {
          title: "Banks info",
          url: `/${tenant_id}/banks`,
          icon: <BsCircle />,
        },
        {
          title: "Bank cards info",
          url: `/${tenant_id}/bank-cards`,
          icon: <BsCircle />,
        },
        {
          title: "Customers info",
          url: `/${tenant_id}/customers`,
          icon: <BsCircle />,
        },
        {
          title: "Expenses info",
          url: `/${tenant_id}/expenses`,
          icon: <BsCircle />,
        },
        {
          title: "Representatives info",
          url: `/${tenant_id}/representatives`,
          icon: <BsCircle />,
        },
        {
          title: "Stores info",
          url: `/${tenant_id}/stores`,
          icon: <BsCircle />,
        },
        {
          title: "Safes info",
          url: `/${tenant_id}/safes`,
          icon: <BsCircle />,
        },
        {
          title: "Taxes info",
          url: `/${tenant_id}/taxes`,
          icon: <BsCircle />,
        },
        {
          title: "Supplier info",
          url: `/${tenant_id}/suppliers`,
          icon: <BsCircle />,
        },
        {
          title: "Products",
          url: `/${tenant_id}/products`,
          icon: <BsCircle />,
        },
        {
          title: "product Groups",
          url: `/${tenant_id}/product-groups`,
          icon: <BsCircle />,
        },
        {
          title: "Units info",
          url: `/${tenant_id}/units`,
          icon: <BsCircle />,
        },
      ],
    },
    {
      title: "Stock",
      icon: <HiOutlineClipboardList />,
      children: [
        {
          title: "Incoming stock",
          url: `/${tenant_id}/incoming-stock`,
          icon: <BsCircle />,
        },
        {
          title: "Outgoing stock",
          url: `/${tenant_id}/outgoing-stock`,
          icon: <BsCircle />,
        },
        {
          title: "Store transfer",
          url: `/${tenant_id}/store-transfer`,
          icon: <BsCircle />,
        },
      ],
    },
    {
      title: "Purchases",
      icon: <HiOutlineDocumentText />,
      children: [
        {
          title: "Purchase invoice",
          url: `/${tenant_id}/purchase-invoice`,
          icon: <BsCircle />,
        },
        {
          title: "Purchase return",
          url: `/${tenant_id}/purchase-return-invoice`,
          icon: <BsCircle />,
        },
      ],
    },
    {
      title: "Sales",
      icon: <HiOutlineCube />,
      children: [
        {
          title: "Sales invoice",
          url: `/${tenant_id}/sales-invoice`,
          icon: <BsCircle />,
        },
        {
          title: "Sales return",
          url: `/${tenant_id}/sales-return-invoice`,
          icon: <BsCircle />,
        },
        {
          title: "Cashier",
          url: `/${tenant_id}/cashier`,
          icon: <BsCircle />,
        },
        {
          title: "Cashier return",
          url: `/${tenant_id}/cash-return`,
          icon: <BsCircle />,
        },
        {
          title: "Reserve goods",
          url: `/${tenant_id}/reserve-goods`,
          icon: <BsCircle />,
        },
      ],
    },

    {
      title: "Users",
      icon: <HiOutlineUsers />,
      children: [
        {
          title: "Users",
          url: `/${tenant_id}/users`,
          icon: <BsCircle />,
        },
      ],
    },
    {
      title: "Financial transactions",
      icon: <HiOutlineCurrencyDollar />,
      children: [
        {
          title: "Financial transactions",
          url: `/${tenant_id}/financial-transactions`,
          icon: <BsCircle />,
        },
      ],
    },
    {
      title: "Settings",
      icon: <HiOutlineCog />,
      url: `/${tenant_id}/settings`,
    },
  ];

  return (
    <div className="flex flex-col  justify-between p-3 max-w-[280px] w-full h-screen">
      <UserMenuSidebarAtom anchorEl={anchorEl} openMenu={openMenu} handleClose={handleClose} handleSignOut={handleSignOut} />
      <div>
        {/* user info */}
        <Button
          id="basic-button"
          aria-controls={openMenu ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? "true" : undefined}
          onClick={handleClick}
          sx={{
            color: "#404040",
            border: "1px solid #e6e7ec",
            borderRadius: "16px",
            padding: "8px 16px",
            height: "72px",
            display: "flex",
            justifyContent: "space-between",
            margin: "16px 0",
            width: "100%",
          }}
        >
          <AvatarAtom username={myUser?.username} role={myUser?.role} />
          <IoIosArrowDown style={{ color: "#404040" }} width={24} height={24} />
        </Button>

        {/* links */}
        <div>
          {navigationItems.map((item, idx) => {
            return (
              <List key={idx} component="div" disablePadding>
                <ListItemButton
                  onClick={() => (item.children ? handleOpenTab(idx + 1) : push(item.url || `/${tenant_id}`))}
                  sx={{
                    color: isParentActive(item) ? "var(--primary)" : "#04040",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      fontSize: "20px",
                      color: isParentActive(item) ? "var(--primary)" : "#04040#",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={t(item.title)} sx={{ fontSize: 14, fontWeight: "500" }} />
                  {item.children && (openTab === idx + 1 ? <HiChevronUp /> : <HiChevronDown />)}
                </ListItemButton>

                {item.children && (
                  <Collapse in={openTab === idx + 1} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map(
                        (child, childIdx) =>
                          child.title && (
                            <ListItemButton
                              key={childIdx}
                              LinkComponent={Link}
                              href={child.url || ""}
                              sx={{
                                pl: 4,
                                color: isChildActive(child.url) ? "var(--primary)" : "#404040",
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  fontSize: "14px",
                                  color: isChildActive(child.url) ? "var(--primary)" : "#404040",
                                }}
                              >
                                {child.icon}
                              </ListItemIcon>
                              <ListItemText primary={t(child.title)} sx={{ fontSize: "14px", fontWeight: "500" }} />
                            </ListItemButton>
                          ),
                      )}
                    </List>
                  </Collapse>
                )}
              </List>
            );
          })}
        </div>
      </div>

      {/* chat */}
      <div>
        <Button
          id="basic-button"
          sx={{
            color: "#404040",
            border: "1px solid #e6e7ec",
            borderRadius: "16px",
            padding: "8px 16px",
            height: "72px",
            display: "flex",
            justifyContent: "space-between",
            margin: "16px 0",
            width: "100%",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[#1B558E] rounded-full">
              <Image src={chat} alt="logo" width={28} height={28} />
            </div>
            <div>
              <h4 className="text-[15px] font-semibold text-[#404040]">{t("Help Center")}</h4>
              <h4 className="text-[12px] font-normal text-[#404040]">{t("You can follow")}</h4>
            </div>
          </div>
          <HiChevronLeft style={{ color: "#404040" }} width={24} height={24} />
        </Button>
      </div>
    </div>
  );
}
