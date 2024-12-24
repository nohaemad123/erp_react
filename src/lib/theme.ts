"use client";

import { CssVarsThemeOptions, ThemeOptions, createTheme } from "@mui/material/styles";

const options: Omit<ThemeOptions, "components"> &
  Pick<CssVarsThemeOptions, "defaultColorScheme" | "colorSchemes" | "components"> & {
    cssVariables?:
      | boolean
      | Pick<
          CssVarsThemeOptions,
          "colorSchemeSelector" | "rootSelector" | "disableCssColorScheme" | "cssVarPrefix" | "shouldSkipGeneratingVar"
        >;
  } = {
  cssVariables: true,
  components: {
    MuiCollapse: {
      styleOverrides: {
        root: {
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 500,
          border: "1px solid #C2C2C2",
          height: "45px",
          padding: "10px 16px",
          borderRadius: "6px",
          lineHeight: "26.24px",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
  typography: {
    fontFamily: ["__Cairo_655793"].join(","),
  },
  palette: {
    primary: {
      main: "#226AB2",
    },
  },
};

export const ltrTheme = createTheme({ ...options });

export const rtlTheme = createTheme({ ...options, direction: "rtl" });
