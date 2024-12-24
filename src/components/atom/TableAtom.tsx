import { SortColumnType } from "@/@types/types/sortColumnType";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { useAppStore } from "@/store";
import Link from "next/link";
import { DetailedHTMLProps, HTMLAttributes, MouseEvent, ReactNode, TableHTMLAttributes, TdHTMLAttributes } from "react";
import { FiPrinter, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { HiOutlineSwitchVertical, HiOutlineArrowSmDown, HiOutlineArrowSmUp } from "react-icons/hi";
import { ButtonBase } from "@mui/material";
import { classNameGen } from "@/lib/cn";
import styles from "./TableAtom.module.css";

interface ITableAtomProps
  extends DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>,
    VariantProps<typeof tableAtomVariants> {
  children?: ReactNode;
  fullWidth?: boolean;
}
const tableAtomVariants = cva(`min-w-[650px] border-spacing-0 w-full ${styles["table"]}`, {
  variants: {
    variant: {
      default: classNameGen(styles["default"]),
      dynamic: classNameGen(styles["dynamic"]),
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
export default function TableAtom({ children, fullWidth, variant, className, ...props }: Readonly<ITableAtomProps>) {
  return (
    <div className={classNameGen("p-2 bg-white w-full border-solid border-[#E6E7EC] border overflow-y-auto", fullWidth && "w-full")}>
      <table className={cn(tableAtomVariants({ variant, className }))} {...props}>
        {children}
      </table>
    </div>
  );
}

interface ITableHeadAtomProps extends DetailedHTMLProps<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement> {
  children?: ReactNode;
}
TableAtom.THead = function THead({ children, ...props }: Readonly<ITableHeadAtomProps>) {
  return <thead {...props}>{children}</thead>;
};

interface ITableBodyAtomProps extends DetailedHTMLProps<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement> {
  children?: ReactNode;
}
TableAtom.TBody = function TBody({ children, ...props }: Readonly<ITableBodyAtomProps>) {
  return <tbody {...props}>{children}</tbody>;
};

interface ITableRowAtomProps extends DetailedHTMLProps<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement> {
  children?: ReactNode;
}
TableAtom.TRow = function TRow({ children, ...props }: Readonly<ITableRowAtomProps>) {
  return <tr {...props}>{children}</tr>;
};

type TableTCellAtomComponent = "td" | "th";
interface ITableCellAtomProps extends DetailedHTMLProps<TdHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement> {
  children?: ReactNode;
  sortable?: boolean;
  field?: string;
  sortBy?: string;
  sortDirection?: SortColumnType;
  fullWidth?: boolean;
  disabled?: boolean;
  component?: TableTCellAtomComponent;
  onSort?: (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>, sortBy: string, sortDirection: SortColumnType) => void;
}
const sortIconClassName = "w-4 h-4";
const nextSortOrderMap = new Map<SortColumnType, SortColumnType>();
nextSortOrderMap.set(undefined, "asc");
nextSortOrderMap.set("asc", "desc");
nextSortOrderMap.set("desc", undefined);

TableAtom.TCell = function TCell({
  children,
  sortable,
  field,
  sortBy,
  sortDirection,
  fullWidth,
  onSort,
  disabled,
  className,
  component = "td",
  align = "right",
  ...props
}: Readonly<ITableCellAtomProps>) {
  const { isHttpClientLoading } = useAppStore();
  const content =
    sortable && field ? (
      <button
        style={{ fontFamily: "inherit", fontWeight: "inherit", fontSize: "inherit" }}
        className="flex gap-2 items-center cursor-pointer border-none bg-transparent"
        onClick={(e) => onSort?.(e, field, nextSortOrderMap.get(sortDirection))}
        disabled={isHttpClientLoading || disabled}
      >
        <span>{children}</span>
        {sortBy !== field || sortDirection === undefined ? (
          <HiOutlineSwitchVertical className={sortIconClassName} />
        ) : sortDirection === "desc" ? (
          <HiOutlineArrowSmDown className={sortIconClassName} />
        ) : (
          <HiOutlineArrowSmUp className={sortIconClassName} />
        )}
      </button>
    ) : (
      children
    );
  return component === "th" ? (
    <th className={classNameGen(fullWidth && "w-full", className)} align={align} {...props}>
      {content}
    </th>
  ) : (
    <td className={classNameGen(fullWidth && "w-full", className)} align={align} {...props}>
      {content}
    </td>
  );
};

interface ITableCellEndAtomProps extends DetailedHTMLProps<TdHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement> {
  editLink?: string;
  viewLink?: string;
  onDelete: (item: unknown) => void;
  onPrint?: (item: unknown) => void;
}
TableAtom.TCellEnd = function TCellEnd({ editLink, viewLink, onDelete, onPrint, ...props }: Readonly<ITableCellEndAtomProps>) {
  const { isHttpClientLoading } = useAppStore();
  return (
    <td {...props}>
      <div className="flex h-full items-center justify-end gap-1">
        {onPrint && (
          <ButtonBase
            disabled={isHttpClientLoading}
            onClick={onPrint}
            type="button"
            sx={{
              border: "1px solid #99A1B766",
              borderRadius: "6px",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "black",
              "&:hover": {
                backgroundColor: "var(--primary)",
                color: "white",
              },
            }}
          >
            <FiPrinter className="w-3 h-3" />
          </ButtonBase>
        )}

        <Link
          title="bank view"
          href={`${viewLink}`}
          style={{
            border: "1px solid #99A1B766",
            borderRadius: "6px",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="text-black hover:bg-[var(--primary)] hover:text-white"
        >
          <FiEye className="w-3 h-3" />
        </Link>

        <Link
          href={`${editLink}`}
          style={{
            border: "1px solid #99A1B766",
            borderRadius: "6px",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="text-black hover:bg-[var(--primary)] hover:text-white"
        >
          <FiEdit className="w-3 h-3" />
        </Link>

        <ButtonBase
          disabled={isHttpClientLoading}
          onClick={onDelete}
          type="button"
          sx={{
            border: "1px solid #99A1B766",
            borderRadius: "6px",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
            "&:hover": {
              backgroundColor: "var(--danger)",
              color: "white",
            },
          }}
        >
          <FiTrash2 className="w-3 h-3" />
        </ButtonBase>
      </div>
    </td>
  );
};
