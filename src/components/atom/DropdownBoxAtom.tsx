"use client";

import { ITranslatedName } from "@/@types/interfaces/ITranslatedName";
import ModalViewAddAndEditAtom from "@/components/atom/ModalViewAddAndEditAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import { classNameGen } from "@/lib/cn";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { useState, MouseEvent, useId, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi2";

interface IDropdownBoxAtomProps<OptionType> {
  options: OptionType[];
  value?: OptionType | string | number | OptionType[] | string[] | number[] | null;
  multiple?: boolean;
  keepOpen?: boolean;
  placeholder?: string;
  modalChildren?: ReactNode;
  modalTriggerLabel?: ReactNode;
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  filter?: (keyof OptionType)[];
  valueSelector: (item: OptionType) => string | number | null | undefined;
  onModalClose?: () => void;
  keySelector?: (item: OptionType) => string | number;
  triggerLabelDisplay?: (item: OptionType) => string | number;
  optionRender?: (item: OptionType) => ReactNode;
  onSelect?: (item: OptionType, e?: MouseEvent) => void;
}
/**
 * DropdownBoxAtom is a component that renders a dropdown menu with selectable options.
 * It supports customizable options, multi-selection, search filtering, and the ability
 * to trigger a modal for additional actions. The component also allows for custom rendering
 * of options and selected values.
 *
 * @template OptionType
 * @param {OptionType[]} options - Array of options to display in the dropdown.
 * @param {OptionType | string | number | OptionType[] | string[] | number[] | null} [value] - Selected value(s).
 * @param {boolean} [keepOpen] - Determines whether the dropdown should remain open after selection.
 * @param {string} [placeholder] - Placeholder text when no value is selected.
 * @param {ReactNode} [modalChildren] - Content to render inside the modal.
 * @param {boolean} [fullWidth] - If true, the dropdown will take up the full width of its container.
 * @param {string} [size] - Size of the dropdown.
 * @param {(keyof OptionType)[]} [filter] - Array of keys to filter options by.
 * @param {ReactNode} [modalTriggerLabel] - Label for the button that triggers the modal.
 * @param {(item: OptionType) => string | number | null | undefined} valueSelector - Function to select the value from an option.
 * @param {() => void} [onModalClose] - Callback when the modal is closed.
 * @param {(item: OptionType) => string | number} [keySelector] - Function to select a unique key from an option.
 * @param {(item: OptionType) => string | number} [triggerLabelDisplay] - Function to display the label of the selected item.
 * @param {(item: OptionType) => ReactNode} [optionRender] - Function to custom render an option.
 * @param {(item: OptionType, e?: MouseEvent) => void} [onSelect] - Callback when an option is selected.
 *
 * @returns {JSX.Element}
 */
export default function DropdownBoxAtom<OptionType>({
  options,
  value,
  keepOpen,
  placeholder,
  modalChildren,
  fullWidth,
  size = "large",
  filter,
  modalTriggerLabel,
  valueSelector,
  onModalClose,
  keySelector,
  triggerLabelDisplay,
  optionRender,
  onSelect,
}: Readonly<IDropdownBoxAtomProps<OptionType>>) {
  const { t, i18n } = useTranslation();
  const menuId = useId();
  const buttonId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const valueOptionObj = options.reduce(
    (acc, opt) => {
      const val = valueSelector(opt);
      if (typeof val === "string" || typeof val === "number") acc[val] = opt;
      return acc;
    },
    {} as { [key: string | number]: OptionType },
  );

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleSelect(e: MouseEvent<HTMLLIElement>, item: OptionType) {
    e.stopPropagation();
    onSelect?.(item, e);
    if (!keepOpen) handleClose();
  }

  const valueText = value
    ? Array.isArray(value)
      ? value.length > 1
        ? value.length + " " + t("Selected")
        : value
            .map((x) => triggerLabelDisplay?.(typeof x !== "string" && typeof x !== "number" ? x : valueOptionObj[x]) || x)
            .join(", ")
      : triggerLabelDisplay?.(typeof value !== "string" && typeof value !== "number" ? value : valueOptionObj[value]) || value
    : undefined;
  const buttonText =
    (valueText && (typeof valueText === "string" || typeof valueText === "number" ? valueText : JSON.stringify(valueText))) ||
    placeholder;

  const searchText = searchInput.trim().toLocaleLowerCase();
  const filteredOptions = filter
    ? options.filter((o) =>
        filter.some((f) =>
          o[f] && f === "names"
            ? (o[f] as ITranslatedName[]).some((x) => x.value?.toLocaleLowerCase().includes(searchText))
            : typeof o[f] === "string"
              ? o[f].toLocaleLowerCase().includes(searchText)
              : o[f] == searchText,
        ),
      )
    : options;

  return (
    <div className={classNameGen(fullWidth && "w-full")}>
      <Button
        id={buttonId}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="outlined"
        fullWidth={fullWidth && size !== "small"}
        sx={{
          minWidth: size === "small" ? 120 : 220,
          height: 40,
          border: "1px solid #808080",
          borderRadius: "var(--mui-shape-borderRadius)",
          color: "var(--mui-palette-text-primary)",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          cursor: "pointer",
          backgroundColor: "white",
          padding: 0,
          overflow: "hidden",
        }}
      >
        <Typography
          component="span"
          className={classNameGen("flex-grow flex-wrap flex break-all text-base", !valueText && "opacity-[0.42]")}
          sx={{
            padding: "8.5px 14px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: size == "small" ? "50px" : "100px",
          }}
        >
          {buttonText}
        </Typography>
        <div
          className={`bg-[#EDEDED80] ${i18n.language === "en" ? "right-0" : "left-0"} w-6 h-full flex justify-center items-center min-w-8`}
        >
          <HiChevronDown className="w-[15px] h-[15px] text-[#9B9B98] " />
        </div>
      </Button>
      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": buttonId,
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "6px",
              boxShadow: "none",
              border: "1px solid #c2c2c2",
              maxHeight: "400px",
              minWidth: size == "small" ? "200px" : "300px",
              marginTop: "4px",
            },
          },
        }}
      >
        {filter && (
          <div className="sticky top-0 bg-white z-50 p-2" onKeyDown={(e) => e.stopPropagation()}>
            <TextFieldAtom
              placeholder={t("Search")}
              fullWidth
              size="small"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        )}
        {modalChildren && (
          <div className="px-2">
            <Button
              size="small"
              fullWidth
              onClick={() => {
                setIsOpen(true);
              }}
              sx={{ fontSize: "12px", fontWeight: "400", padding: "8px 16px", borderBottom: "1px solid #C2C2C24D", borderRadius: "0" }}
            >
              <HiOutlinePlusCircle className="mx-2" />
              {modalTriggerLabel ?? t("Add")}
            </Button>
          </div>
        )}
        {filteredOptions.map((item, index) => (
          <MenuItem
            key={keySelector?.(item) || valueSelector(item) || index}
            onClick={(e) => handleSelect(e, item)}
            selected={
              !!value &&
              (Array.isArray(value)
                ? value.some((x) =>
                    typeof x !== "string" && typeof x !== "number"
                      ? valueSelector(x) === valueSelector(item)
                      : valueSelector(valueOptionObj[x]) === valueSelector(item),
                  )
                : typeof value !== "string" && typeof value !== "number"
                  ? valueSelector(value) === valueSelector(item)
                  : valueSelector(valueOptionObj[value]) === valueSelector(item))
            }
            sx={{ borderBottom: "1px solid #C2C2C24D", padding: "8px 16px", fontSize: "14px", fontWeight: 400 }}
          >
            {optionRender?.(item) ?? JSON.stringify(item)}
          </MenuItem>
        ))}
      </Menu>
      {modalChildren && (
        <ModalViewAddAndEditAtom isOpen={isOpen} setIsOpen={setIsOpen} onClose={onModalClose}>
          {modalChildren}
        </ModalViewAddAndEditAtom>
      )}
    </div>
  );
}
