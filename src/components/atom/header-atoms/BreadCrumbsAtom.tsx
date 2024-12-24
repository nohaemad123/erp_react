import { Breadcrumbs } from "@mui/material";
import i18next from "i18next";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface BreadCrumbsAtomProps {
  tenantId: string | string[];
  pathnameArray: string[];
}
/**
 * Renders a breadcrumb navigation component that shows the current page location hierarchy.
 * The component adapts to the current language direction (LTR/RTL) and provides navigation links.
 *
 * @param {Object} props - The component props
 * @param {string} props.tenantId - The tenant identifier used in navigation URLs
 * @param {string[]} props.pathnameArray - Array of path segments representing the current location
 * @returns {JSX.Element} A breadcrumb navigation component with translated path segments
 *
 * @example
 * ```tsx
 * <BreadcrumbsAtom tenantId="tenant1" pathnameArray={["settings", "users"]} />
 * ```
 */
export function BreadcrumbsAtom({ tenantId, pathnameArray }: Readonly<BreadCrumbsAtomProps>) {
  const { t } = useTranslation();
  return (
    <div className="relative hidden sm:block">
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={
          i18next.language === "en" ? <IoIosArrowForward className="text-[#9E9E9E]" /> : <IoIosArrowBack className="text-[#9E9E9E]" />
        }
      >
        <Link
          key="dashboard"
          className="flex justify-center items-center no-underline text-[12px] font-normal text-[#9E9E9E]"
          href={`/${tenantId}`}
        >
          {t("Dashboard")}
        </Link>
        {pathnameArray.map((x, index) => (
          <Link
            key={x + index}
            className="flex justify-center items-center no-underline text-[12px] font-normal text-[#9E9E9E]"
            href={`/${tenantId}/${pathnameArray.slice(0, index + 1).join("/")}`}
          >
            {t(x)}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
}
