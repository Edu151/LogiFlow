"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import type { Trip } from "@/types";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  realKm: z.coerce.number().min(0, "KM Real deve ser positivo."),
  kmPaid: z.coerce.number().min(0, "Valor por KM deve ser positivo."),
  referenceValue: z.coerce.number().min(0, "Valor de referência deve ser positivo."),
});

type CostsFormProps = {
  trip: Trip;
  onCostUpdate: (tripId: string, data: { realKm: number; kmPaid: number; referenceValue: number; }) => void;
};

export function CostsForm({ trip, onCostUpdate }: CostsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      realKm: trip.realKm ?? trip.estimatedKm,
      kmPaid: trip.cost?.kmPaid ?? 0,
      referenceValue: trip.cost?.referenceValue ?? 0,
    },
  });

  useEffect(() => {
    form.reset({
      realKm: trip.realKm ?? trip.estimatedKm,
      kmPaid: trip.cost?.kmPaid ?? 0,
      referenceValue: trip.cost?.referenceValue ?? 0,
    });
  }, [trip, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onCostUpdate(trip.id, values);
    toast({
      title: "Custo Atualizado!",
      description: `Os custos para a viagem ${trip.oc} foram salvos.`,
    });
  };

  const realKm = form.watch("realKm");
  const kmPaid = form.watch("kmPaid");
  const referenceValue = form.watch("referenceValue");

  const totalCostValue = realKm * kmPaid;
  const profitValue = referenceValue - totalCostValue;

  const totalCost = totalCostValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const profit = profitValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custos da Viagem: {trip.oc}</CardTitle>
        <CardDescription>
          Adicione os valores para calcular a rentabilidade da viagem.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="realKm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KM Real</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="KM rodado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kmPaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor por KM (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Ex: 1.50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="referenceValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor de Referência (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Ex: 3000.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2 pt-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Custo Total da Viagem:</span>
                    <span className="font-bold text-lg">{totalCost}</span>
                </div>
                 <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Lucro/Prejuízo:</span>
                    <span className={cn(
                        "font-bold text-lg",
                        profitValue > 0 && "text-green-600",
                        profitValue < 0 && "text-red-600"
                    )}>{profit}</span>
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Salvar Custos</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
