import { Typography } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface IAddNewButtonAtomProps {
  href: string;
  sx?: React.CSSProperties;
}
/**
 * A reusable component for adding a new atom
 * @param {string} href - The route to go to when the button is clicked
 * @param {React.CSSProperties} sx - Additional styles to add
 * @returns {JSX.Element} The component itself
 */
export default function AddNewButtonAtom({ href, sx }: Readonly<IAddNewButtonAtomProps>) {
  const { t } = useTranslation();
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Typography
        variant="body1"
        sx={{
          color: "white",
          backgroundColor: "var(--primary)",
          fontSize: "14px",
          fontWeight: "600",
          padding: "6px 16px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          ...sx,
        }}
      >
        {t("Add new")}
      </Typography>
    </Link>
  );
}
