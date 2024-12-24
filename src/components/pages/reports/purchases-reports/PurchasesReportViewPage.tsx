"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import { FiArrowLeft } from "react-icons/fi";

export default function PurchasesReportViewPage() {
  const { t } = useTranslation();
  const { tenant_id } = useParams();

  const reports = [
    { title: t("purchases movements report") },
    { title: t("purchases total report") },
    { title: t("purchases return report") },
    { title: t("purchases total return report") },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 p-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report, index) => (
          <Link
            key={index}
            href={`/${tenant_id}/reports/purchases-reports/purchase-report-form/${index + 1}`}
            className="no-underline text-black"
          >
            <div className="flex flex-col m-2 px-8 py-6 pb-3 transition shadow rounded-2xl cursor-pointer bg-white hover:bg-[var(--primary)] group">
              <div className="text-base font-bold mb-3 transition font-ca group-hover:text-white">{report.title}</div>
              <div className="self-end mt-1 -mx-3">
                <FiArrowLeft className="w-6 h-6 text-[var(--primary)] group-hover:text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
