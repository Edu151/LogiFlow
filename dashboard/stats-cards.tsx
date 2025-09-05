import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/types";
import { Truck, Navigation, Sigma, BarChart } from "lucide-react";

type StatsCardsProps = {
  stats: DashboardStats;
};

const iconMapping = {
  totalTrips: Truck,
  tripsInProgress: Navigation,
  totalKmDriven: Sigma,
  totalSacksTransported: BarChart,
};

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total de Viagens"
        value={stats.totalTrips}
        icon={iconMapping.totalTrips}
      />
      <StatCard
        title="Viagens em Andamento"
        value={stats.tripsInProgress}
        icon={iconMapping.tripsInProgress}
      />
      <StatCard
        title="Total KM Rodados"
        value={`${stats.totalKmDriven.toLocaleString('pt-BR')} km`}
        icon={iconMapping.totalKmDriven}
      />
      <StatCard
        title="Total de Sacos"
        value={stats.totalSacksTransported.toLocaleString('pt-BR')}
        icon={iconMapping.totalSacksTransported}
      />
    </div>
  );
}

type StatCardProps = {
    title: string;
    value: string | number;
    icon: React.ElementType;
}

function StatCard({ title, value, icon: Icon }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            </CardContent>
      </Card>
    )
}
