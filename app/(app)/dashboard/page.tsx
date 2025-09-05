import { PageHeader } from "@/components/page-header";
import { mockTrips, mockDrivers } from "@/lib/mock-data";
import { StatsCards } from "./stats-cards";
import { TripsChart } from "./trips-chart";
import { TripsDataTable } from "../trips/data-table";

export default function DashboardPage() {
  const stats = {
    totalTrips: mockTrips.length,
    tripsInProgress: mockTrips.filter(t => t.status === 'Em Andamento').length,
    totalKmDriven: mockTrips.reduce((acc, t) => acc + (t.realKm || 0), 0),
    totalSacksTransported: mockTrips.reduce((acc, t) => acc + t.sacks, 0),
  };

  const recentTrips = [...mockTrips].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).slice(0, 5);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Bem-vindo ao seu painel de controle logístico."
      />
      <div className="space-y-8">
        <StatsCards stats={stats} />
        <TripsChart trips={mockTrips} />
        <div>
          <h2 className="text-2xl font-bold font-headline mb-4">Viagens Recentes</h2>
          <TripsDataTable trips={recentTrips} drivers={mockDrivers} showFilters={false} />
        </div>
      </div>
    </>
  );
}
