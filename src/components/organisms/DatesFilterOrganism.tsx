import LabelAtom from "@/components/atom/LabelAtom";
import { ResetButtonAtom } from "@/components/atom/ResetButtonAtom";
import { SearchButtonAtom } from "@/components/atom/SearchButtonAtom";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function DatesFilterOrganism({
  watch,
  isHttpClientLoading,
  handleReset,
  control,
  fromControlName,
  toControlName,
}: {
  watch: (name: string) => any;
  isHttpClientLoading: boolean;
  handleReset: () => void;
  control: any;
  fromControlName: string;
  toControlName: string;
}) {
  const { t } = useTranslation();

  const fromDate = watch(fromControlName);
  const toDate = watch(toControlName);

  return (
    <>
      <div className="flex justify-between w-full search_header">
        <p className="m-0 text-xl font-semibold">{t("Search and filter")}</p>
        <div className="flex gap-4">
          <SearchButtonAtom />
          <ResetButtonAtom
            disabled={isHttpClientLoading}
            type="button"
            className="px-5 ml-3 search_button border-[#E6E6E6] normal-case text-primary py-1 text-[14px] font-semibold border-2 rounded-lg"
            onClick={() => handleReset()}
          />
        </div>
      </div>

      <div className="flex justify-between w-full mt-2 gap-10">
        {/* From Date */}
        <div className="mb-6 sm:w-full md:w-full lg:w-1/2">
          <LabelAtom
            labelMessage={t("From date")}
            className="mb-2 block w-full text-lg leading-normal whitespace-nowrap text-ellipsis"
          />
          <Controller
            control={control}
            name="readDto.from"
            render={({ field: { value, onChange } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disabled={isHttpClientLoading}
                  value={value ? dayjs(value) : null} // Ensure value is valid
                  maxDate={toDate ? dayjs(toDate) : undefined} // Ensure maxDate
                  onChange={(newValue) => onChange(newValue ? newValue.toDate() : null)}
                  className="w-full"
                />
              </LocalizationProvider>
            )}
          />
        </div>

        {/* To Date */}
        <div className="mb-6 sm:w-full md:w-full lg:w-1/2">
          <LabelAtom
            labelMessage={t("To date")}
            className="mb-2 block w-full text-lg leading-normal whitespace-nowrap text-ellipsis"
          />
          <Controller
            control={control}
            name="readDto.to"
            render={({ field: { value, onChange } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disabled={isHttpClientLoading}
                  value={value ? dayjs(value) : null} // Ensure value is valid
                  minDate={fromDate ? dayjs(fromDate) : undefined} // Ensure minDate
                  onChange={(newValue) => onChange(newValue ? newValue.toDate() : null)}
                  className="w-full"
                />
              </LocalizationProvider>
            )}
          />
        </div>
      </div>
    </>
  );
}
