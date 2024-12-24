"use client";

import { ICustomer } from "@/@types/interfaces/ICustomer";
import { getTranslatedName } from "@/@types/stables";
import DropdownBoxAtom from "@/components/atom/DropdownBoxAtom";
import CustomerFormTemplate from "@/components/template/customers/CustomerFormTemplate";
import { getAllCustomers } from "@/services/loadData";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function Page({ params: { tenant_id } }: Readonly<IPage>) {
  const { i18n } = useTranslation();
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<ICustomer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  useEffect(() => {
    getAllCustomers(i18n.language, tenant_id).then((res) => {
      setCustomers(res?.listData ?? []);
    });
  }, [tenant_id, i18n.language]);

  return (
    <div className="p-10">
      <DropdownBoxAtom
        options={customers}
        value={selectedCustomer}
        placeholder="Select Customers"
        filter={["name", "names", "mobile"]}
        optionRender={(item) => getTranslatedName(item.names, i18n.language) ?? item.name}
        modalChildren={<CustomerFormTemplate tenantId={tenant_id} />}
        valueSelector={(item) => item.id}
        triggerLabelDisplay={(value) => value?.name ?? ""}
        onSelect={(item) => {
          setSelectedCustomer(item);
        }}
      />
      <DropdownBoxAtom
        options={customers}
        value={selectedCustomers}
        placeholder="Select Customers"
        filter={["name", "names", "mobile"]}
        keepOpen
        optionRender={(item) => getTranslatedName(item.names, i18n.language) ?? item.name}
        modalChildren={<CustomerFormTemplate tenantId={tenant_id} />}
        valueSelector={(item) => item.id}
        triggerLabelDisplay={(value) => value?.name ?? ""}
        onSelect={(item) => {
          setSelectedCustomers((prev) =>
            prev.some((x) => x.id === item.id) ? prev.filter((x) => x.id !== item.id) : [...prev, item],
          );
        }}
      />
      <DropdownBoxAtom
        options={customers}
        value={selectedCustomerId}
        placeholder="Select Customers"
        filter={["name", "names", "mobile"]}
        optionRender={(item) => getTranslatedName(item.names, i18n.language) ?? item.name}
        modalChildren={<CustomerFormTemplate tenantId={tenant_id} />}
        valueSelector={(item) => item.id}
        triggerLabelDisplay={(value) => value?.name ?? ""}
        onSelect={(item) => {
          setSelectedCustomerId(item.id);
        }}
      />
      <DropdownBoxAtom
        options={customers}
        value={selectedCustomerIds}
        placeholder="Select Customers"
        filter={["name", "names", "mobile"]}
        keepOpen
        optionRender={(item) => getTranslatedName(item.names, i18n.language) ?? item.name}
        modalChildren={<CustomerFormTemplate tenantId={tenant_id} />}
        valueSelector={(item) => item.id}
        triggerLabelDisplay={(value) => value?.name ?? ""}
        onSelect={(item) => {
          setSelectedCustomerIds((prev) =>
            prev.includes(item.id ?? "") ? prev.filter((x) => x !== item.id) : [...prev, item.id ?? ""],
          );
        }}
      />
    </div>
  );
}
