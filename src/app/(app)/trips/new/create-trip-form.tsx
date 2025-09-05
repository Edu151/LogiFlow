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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Driver } from "@/types";
import { RouteOptimizer } from "./route-optimizer";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  oc: z.string().min(1, "Ordem de Carga é obrigatória."),
  driverId: z.string().min(1, "Motorista é obrigatório."),
  product: z.enum(["milho", "sorgo"]),
  sacks: z.coerce.number().min(1, "Quantidade de sacos é obrigatória."),
  startDate: z.date({ required_error: "Data de início é obrigatória." }),
  estimatedKm: z.coerce.number().optional(),
  cities: z.array(z.string()).min(2, "Pelo menos duas cidades são necessárias."),
});

type CreateTripFormProps = {
  drivers: Driver[];
};

export function CreateTripForm({ drivers }: CreateTripFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oc: "",
      driverId: "",
      product: "milho",
      sacks: 0,
      cities: ["", ""],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Trip submitted:", values);
    toast({
      title: "Viagem Criada!",
      description: `A viagem com OC ${values.oc} foi criada com sucesso.`,
    });
    router.push("/trips");
  }

  const handleRouteOptimized = ({ cities, distance }: { cities: string[], distance: number }) => {
    form.setValue("cities", cities, { shouldValidate: true });
    form.setValue("estimatedKm", distance, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Viagem</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="oc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordem de Carga (OC)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: OC-2024-008" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="driverId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motorista</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um motorista" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {drivers.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o produto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="milho">Milho</SelectItem>
                      <SelectItem value="sorgo">Sorgo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sacks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade de Sacos</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Início</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0,0,0,0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <RouteOptimizer onRouteOptimized={handleRouteOptimized} form={form} />
        
        <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
            <Button type="submit">Criar Viagem</Button>
        </div>
      </form>
    </Form>
  );
}
