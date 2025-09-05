"use client"
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { mockDrivers } from "@/lib/mock-data";
import { DriversDataTable } from "./data-table";
import { AddDriverDialog } from "./add-driver-dialog";
import type { Driver } from "@/types";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);

  const handleAddDriver = (newDriverData: Omit<Driver, 'id'>) => {
    const newDriver: Driver = {
      id: (drivers.length + 1).toString(),
      ...newDriverData,
    };
    setDrivers(prev => [...prev, newDriver]);
  };

  return (
    <>
      <PageHeader
        title="Gerenciamento de Motoristas"
        description="Adicione, visualize e gerencie os motoristas da sua frota."
      >
        <AddDriverDialog onAddDriver={handleAddDriver} />
      </PageHeader>
      <DriversDataTable drivers={drivers} />
    </>
  );
}
