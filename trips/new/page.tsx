import { PageHeader } from "@/components/page-header";
import { CreateTripForm } from "./create-trip-form";
import { mockDrivers } from "@/lib/mock-data";

export default function NewTripPage() {
  return (
    <>
      <PageHeader
        title="Criar Nova Viagem"
        description="Preencha os detalhes abaixo para planejar uma nova viagem."
      />
      <CreateTripForm drivers={mockDrivers} />
    </>
  );
}
