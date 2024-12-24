"use client";

import Link from "next/link";
import notfoundImage from "@/assets/images/notfound.png";
import Image from "next/image";
import { Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function NotFound() {
  const { t } = useTranslation();
  useEffect(() => {
    const timedOut = setTimeout(() => {
      window.history.back();
    }, 3000);
    return () => clearTimeout(timedOut);
  }, []);
  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="flex flex-col items-center space-y-4">
        <Image src={notfoundImage} alt="notfound image" width={458} height={324} />
        <Typography variant="h6" component={"h2"} fontSize={24} fontWeight={600}>
          {t("Not Found Page")}
        </Typography>
        <Typography component={"p"} fontSize={18} fontWeight={400}>
          {t("Are you looking for something we don't serve?")}
        </Typography>
        <Button variant="contained" sx={{ backgroundColor: "var(--primary)", minWidth: 204, height: 40 }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            {t("Back to home page")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
