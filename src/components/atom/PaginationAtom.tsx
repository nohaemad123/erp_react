import { MenuItem, Pagination, Select, SelectChangeEvent } from "@mui/material";
import { useTranslation } from "react-i18next";

interface IPagination {
  page: number;
  pageSize: number;
  totalCount: number | undefined;
  totalPages: number | undefined;
  changeSelectHandler: (event: SelectChangeEvent<number>) => void;
  changePaginationHandler: (event: React.ChangeEvent<unknown>, value: number) => void;
}

/**
 * PaginationAtom is a component that renders a pagination control with a select component for choosing the number of items per page.
 * It also renders a label indicating the current page number and the total number of pages.
 *
 * @param page - The current page number.
 * @param pageSize - The number of items per page.
 * @param totalCount - The total number of items.
 * @param totalPages - The total number of pages.
 * @param changeSelectHandler - A function to call when the select component value changes.
 * @param changePaginationHandler - A function to call when the pagination control page changes.
 * @returns A JSX element representing the pagination control.
 */
export function PaginationAtom({
  page,
  pageSize,
  totalCount,
  totalPages,
  changeSelectHandler,
  changePaginationHandler,
}: Readonly<IPagination>) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 mt-4 justify-between">
      <div className="flex items-center gap-2 text-[10px] font-normal text-[#0A0A0A]">
        {t("Showing")}
        <Select
          size="small"
          value={pageSize}
          onChange={changeSelectHandler}
          sx={{
            backgroundColor: "white",
            borderRadius: "6px",
            padding: "6px 10px",
            gap: "6px",
            width: "52px",
            height: "32px",
            fontSize: "10px",
            fontWeight: "400",
            "& .MuiSelect-select": {
              padding: "0px",
            },
          }}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
        </Select>
        {t("out of")} {totalCount}
      </div>
      <Pagination
        page={page}
        onChange={changePaginationHandler}
        count={totalPages}
        shape="rounded"
        size="medium"
        sx={{
          "& .MuiPaginationItem-root": {
            fontSize: "14px",
            fontWeight: "600",
            color: "#9E9E9E",
            borderRadius: "5px",

            "&.Mui-selected": {
              backgroundColor: "#226AB2",
              color: "white",
            },
          },
        }}
      />
    </div>
  );
}
