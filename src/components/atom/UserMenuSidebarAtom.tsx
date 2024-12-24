import { Menu, MenuItem, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { HiOutlineLogout, HiOutlineUserCircle } from "react-icons/hi";

interface UserMenuSidebarAtomProps {
  anchorEl: HTMLElement | null;
  openMenu: boolean;
  handleClose: () => void;
  handleSignOut: () => void;
}

/**
 * @function UserMenuSidebarAtom
 * @description This function renders a material-ui menu component with two menu items (Profile and Sign out).
 * The menu is rendered at the position of the anchorEl element.
 * The menu will close when the user clicks outside of it.
 * @param {HTMLElement | null} anchorEl - the element to use as the anchor of the menu.
 * @param {boolean} openMenu - whether the menu is open or not.
 * @param {() => void} handleClose - the function to call when the user clicks outside of the menu.
 * @param {() => void} handleSignOut - the function to call when the user clicks the Sign out menu item.
 * @returns {JSX.Element} - a JSX element representing the rendered menu.
 */
export function UserMenuSidebarAtom({ anchorEl, openMenu, handleClose, handleSignOut }: UserMenuSidebarAtomProps) {
  const { t } = useTranslation();
  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={openMenu}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
    >
      <MenuItem className="p-4 py-3 text-[14px] text-[#1e293b]">
        <Typography component="span">
          <HiOutlineUserCircle size={20} /> {t("Profile")}
        </Typography>
      </MenuItem>

      <MenuItem className="p-4 py-3 text-[14px] text-[#1e293b]" onClick={handleSignOut}>
        <Typography component="span">
          <HiOutlineLogout size={20} /> {t("Sign out")}
        </Typography>
      </MenuItem>
    </Menu>
  );
}
