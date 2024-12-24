import { IconButton } from "@mui/material";
import { FiBell, FiInbox, FiSearch } from "react-icons/fi";

/**
 * HeaderButtonsAtom component renders a group of icon buttons for header actions
 * @returns {JSX.Element} A div containing three icon buttons for search, notifications, and inbox
 *
 */
export function HeaderButtonsAtom() {
  return (
    <div className="flex gap-3">
      <IconButton sx={{ border: "1px solid #E0E3E9", width: "40px", height: "40px", borderRadius: "10px" }}>
        <FiSearch className=" w-[20px] h-[20px] text-[#C2C2C2]" />
      </IconButton>

      <IconButton sx={{ border: "1px solid #E0E3E9", width: "40px", height: "40px", borderRadius: "10px" }}>
        <FiBell className=" w-[20px] h-[20px] text-[#C2C2C2]" />
      </IconButton>

      <IconButton sx={{ border: "1px solid #E0E3E9", width: "40px", height: "40px", borderRadius: "10px" }}>
        <FiInbox className=" w-[20px] h-[20px] text-[#C2C2C2]" />
      </IconButton>
    </div>
  );
}
