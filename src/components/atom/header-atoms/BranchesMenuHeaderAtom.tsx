import { IBranch } from "@/@types/interfaces/IBranch";
import { Button } from "@mui/material";
import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";
import gridIcons from "@/assets/images/view-grid.svg";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/store";
import { MenuHeaderAtom } from "@/components/atom/header-atoms/MenuHeaderAtom";

interface BranchesMenuHeaderAtomProps {
  isOpen: boolean;
  anchorEl: HTMLElement | null;
  branches: IBranch[];
  selectBranch: (branch: IBranch) => void;
  openHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
  closeHandler: () => void;
}

/**
 * A component that renders a branch selection menu in the header.
 * It displays the current branch name and provides a dropdown menu to switch between branches.
 *
 * @param {Object} props - The component props
 * @param {boolean} props.isOpen - Controls the visibility of the branch menu dropdown
 * @param {HTMLElement | null} props.anchorEl - The DOM element that the menu should be anchored to
 * @param {Array<Branch>} props.branches - Array of available branches to select from
 * @param {(branch: Branch) => void} props.selectBranch - Callback function triggered when a branch is selected
 * @param {() => void} props.closeHandler - Function to handle closing the branch menu
 * @param {(event: React.MouseEvent<HTMLButtonElement>) => void} props.openHandler - Function to handle opening the branch menu
 *
 * @returns {JSX.Element} A button that displays current branch info and opens a dropdown menu on click
 */
export function BranchesMenuHeaderAtom({
  isOpen,
  anchorEl,
  branches,
  selectBranch,
  closeHandler,
  openHandler,
}: Readonly<BranchesMenuHeaderAtomProps>) {
  const { t } = useTranslation();
  const { branch } = useAppStore();

  return (
    <div className="relative hidden sm:block">
      <Button
        sx={{ padding: "0px" }}
        aria-controls={isOpen ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : undefined}
        onClick={openHandler}
      >
        <div className="flex items-center gap-2">
          <div className="bg-[#E9F0F7] flex items-center justify-center rounded-lg w-10 h-10">
            <Image src={gridIcons} alt="grid" width={24} height={24} />
          </div>
          <div className="flex flex-col items-start">
            <div className="text-[12px] font-normal text-[#404040]">{branch?.name}</div>
            <div className="text-[12px] font-normal text-[#9E9E9E]">{t("More than 20 branch")}</div>
          </div>
          <IoIosArrowDown width={24} height={24} />
        </div>
      </Button>

      {isOpen && (
        <MenuHeaderAtom
          isOpen={isOpen}
          anchorEl={anchorEl}
          branches={branches}
          selectBranch={selectBranch}
          closeHandler={closeHandler}
        />
      )}
    </div>
  );
}
