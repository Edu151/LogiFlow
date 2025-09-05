"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Trip } from "@/types";
import { useMemo } from "react";

type TripsChartProps = {
  trips: Trip[];
};

export function TripsChart({ trips }: TripsChartProps) {
  const data = useMemo(() => {
    const monthlyData: { [key: string]: number } = {};
    trips.forEach(trip => {
      const month = new Date(trip.startDate).toLocaleString('default', { month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return monthOrder.map(month => ({
        name: month,
        total: monthlyData[month] || 0,
    })).filter(d => d.total > 0);

  }, [trips]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Geral das Viagens</CardTitle>
        <CardDescription>Total de viagens realizadas por mês.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                }}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
