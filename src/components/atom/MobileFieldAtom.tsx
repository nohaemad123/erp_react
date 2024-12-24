import { useAppStore } from "@/store";
import { MuiTelInput } from "mui-tel-input";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Control } from "react-hook-form";

interface MobileFieldAtomProps {
  name: string;
  control: Control<any>;
}

/**
 * A mobile phone field component using MuiTelInput with Saudi Arabia (+966) country code.
 *
 * @param {Control} props.control - React Hook Form control object
 *
 * @remarks
 * - Uses React Hook Form's Controller component for form integration
 * - Restricts country selection to Saudi Arabia only
 * - Supports i18n for language localization
 * - Disables input when HTTP client is loading
 * - Includes full width styling
 * ```
 */
export function MobileFieldAtom({ name, control }: Readonly<MobileFieldAtomProps>) {
  const { isHttpClientLoading } = useAppStore();
  const { i18n } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, name } }) => (
        <MuiTelInput
          value={value}
          lang={i18n.language}
          langOfCountryName={i18n.language}
          defaultCountry={"SA"}
          onlyCountries={["SA"]}
          disableDropdown={true}
          disabled={isHttpClientLoading}
          onChange={(mobile) => {
            onChange(mobile);
          }}
          className="w-full"
          inputProps={{
            name: name,
            autoFocus: false,
          }}
        />
      )}
    />
  );
}
