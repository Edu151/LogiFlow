import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { mockTrips, mockDrivers } from "@/lib/mock-data";
import { TripsDataTable } from "./data-table";

export default function TripsPage() {
  return (
    <>
      <PageHeader
        title="Gerenciamento de Viagens"
        description="Visualize, filtre e gerencie todas as suas viagens."
      >
        <Button asChild>
          <Link href="/trips/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Viagem
          </Link>
        </Button>
      </PageHeader>
      <TripsDataTable trips={mockTrips} drivers={mockDrivers} />
    </>
  );
}
