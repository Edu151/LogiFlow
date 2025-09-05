"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { mockTrips, mockDrivers } from "@/lib/mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Trip } from "@/types";
import { CostsForm } from "./costs-form";

export default function CostsPage() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(trips.find(t => t.status === 'Concluída') || trips[0] || null);
  const [searchOc, setSearchOc] = useState("");
  const [searchDriver, setSearchDriver] = useState("");

  const driverMap = new Map(mockDrivers.map(d => [d.id, d.name]));

  const handleCostUpdate = (tripId: string, data: { realKm: number; kmPaid: number; referenceValue: number; }) => {
    setTrips(prevTrips =>
      prevTrips.map(trip =>
        trip.id === tripId
          ? { ...trip, realKm: data.realKm, cost: { kmPaid: data.kmPaid, referenceValue: data.referenceValue }, status: 'Concluída' }
          : trip
      )
    );
    // Also update selected trip if it's the one being edited
    if (selectedTrip?.id === tripId) {
      setSelectedTrip(prev => prev
        ? { ...prev, realKm: data.realKm, cost: { kmPaid: data.kmPaid, referenceValue: data.referenceValue }, status: 'Concluída' }
        : null
      );
    }
  };

  const filteredTrips = trips.filter(trip => {
    const driverName = driverMap.get(trip.driverId)?.toLowerCase() || "";
    const ocMatch = trip.oc.toLowerCase().includes(searchOc.toLowerCase());
    const driverMatch = driverName.includes(searchDriver.toLowerCase());
    return ocMatch && driverMatch;
  });

  return (
    <>
      <PageHeader
        title="Gerenciamento de Custos"
        description="Selecione uma viagem para adicionar ou editar seus custos."
      />
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Viagens</CardTitle>
            <CardDescription>Selecione uma viagem da lista.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4">
               <Input 
                placeholder="Buscar por OC..."
                value={searchOc}
                onChange={(e) => setSearchOc(e.target.value)}
              />
              <Input 
                placeholder="Buscar por Motorista..."
                value={searchDriver}
                onChange={(e) => setSearchDriver(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[450px] w-full pr-4">
              <div className="space-y-2">
                {filteredTrips.map(trip => (
                  <button
                    key={trip.id}
                    onClick={() => setSelectedTrip(trip)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-colors",
                      selectedTrip?.id === trip.id
                        ? "bg-accent text-accent-foreground border-accent"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <p className="font-semibold">{trip.oc}</p>
                    <p className="text-sm text-muted-foreground">{driverMap.get(trip.driverId)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(trip.startDate).toLocaleDateString()}</p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          {selectedTrip ? (
            <CostsForm trip={selectedTrip} onCostUpdate={handleCostUpdate} />
          ) : (
            <Card className="h-full flex items-center justify-center">
                <CardContent>
                    <p className="text-muted-foreground">Selecione uma viagem para ver os detalhes.</p>
                </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
