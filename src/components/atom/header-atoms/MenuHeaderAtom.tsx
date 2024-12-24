import { IBranch } from "@/@types/interfaces/IBranch";
import { Menu, MenuItem } from "@mui/material";

interface MenuHeaderAtomProps {
  branches: IBranch[];
  isOpen: boolean;
  anchorEl: HTMLElement | null;
  selectBranch: (branch: IBranch) => void;
  closeHandler: () => void;
}
/**
 * A component that renders a dropdown menu for selecting branches
 *
 * @component
 * @param {Object} props - The component props
 * @param {Array<Branch>} props.branches - Array of branch objects to display in menu
 * @param {boolean} props.isOpen - Controls whether the menu is displayed
 * @param {HTMLElement | null} props.anchorEl - The DOM element used as anchor for menu positioning
 * @param {(branch: Branch) => void} props.selectBranch - Callback function when a branch is selected
 * @param {() => void} props.closeHandler - Callback function to handle menu close
 *
 * @returns {JSX.Element} A Menu component containing MenuItems for each branch
 *
 * @example
 * <MenuHeaderAtom
 *   branches={branchList}
 *   isOpen={menuOpen}
 *   anchorEl={buttonRef.current}
 *   selectBranch={handleBranchSelect}
 *   closeHandler={handleClose}
 * />
 */
export function MenuHeaderAtom({ branches, isOpen, anchorEl, selectBranch, closeHandler }: Readonly<MenuHeaderAtomProps>) {
  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={isOpen}
      onClose={closeHandler}
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
  );
}
