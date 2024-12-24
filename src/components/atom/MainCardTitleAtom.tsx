import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface MainCardTitleAtomProps {
  totalCount?: number;
  title: string;
}

/**
 * A main card title component that renders a title and its count.
 
 * @param {{ totalCount: number; title: string; }} props The component props.
 * @param {number} props.totalCount The count of the title.
 * @param {string} props.title The title to be translated.
 */

export function MainCardTitleAtom({ totalCount, title }: Readonly<MainCardTitleAtomProps>) {
  const { t } = useTranslation();
  return (
    <div className="px-8 pt-3 border-solid border-[#E6E7EC] bg-white border-t border-l border-r border-b-0 rounded-ss-md rounded-se-md">
      <Typography
        component="p"
        fontWeight={500}
        fontSize={12}
        color="var(--primary)"
        borderBottom={1.5}
        borderColor={"var(--primary)"}
        paddingBottom={1}
      >
        {t(title)}
        {totalCount && (
          <Typography
            component="span"
            fontSize={8}
            color="#fff"
            sx={{
              borderRadius: "4px",
              backgroundColor: "var(--primary)",
              padding: "2px 4px",
              margin: "0 4px",
            }}
          >
            {totalCount}
          </Typography>
        )}
      </Typography>
    </div>
  );
}
