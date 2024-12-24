import ButtonBase from "@mui/material/ButtonBase";
import { IoIosAddCircleOutline } from "react-icons/io";

interface AddNewOptionAtomProps {
  text: string;
  onClick: () => void;
}

export default function AddNewOptionAtom({ onClick, text = "" }: Readonly<AddNewOptionAtomProps>) {
  return (
    <ButtonBase
      onClick={onClick}
      className="!text-[var(--primary)] w-full !py-2 text-[16px] items-center gap-2 flex text-center mx-auto justify-center"
    >
      <IoIosAddCircleOutline /> {text}
    </ButtonBase>
  );
}
