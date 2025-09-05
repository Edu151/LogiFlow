"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, FileDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn, exportToCsv } from "@/lib/utils";
import type { Trip, Driver } from "@/types";
import { Badge } from "@/components/ui/badge";

type TripsDataTableProps = {
  trips: Trip[];
  drivers: Driver[];
  showFilters?: boolean;
};

export function TripsDataTable({ trips, drivers, showFilters = true }: TripsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  
  const driverMap = React.useMemo(() => new Map(drivers.map(d => [d.id, d.name])), [drivers]);
  
  const data = React.useMemo(() => trips.map(trip => ({
    ...trip,
    driverName: driverMap.get(trip.driverId) || "N/A",
  })), [trips, driverMap]);

  const columns: ColumnDef<typeof data[0]>[] = [
    { accessorKey: "oc", header: "OC" },
    { accessorKey: "driverName", header: "Motorista" },
    { accessorKey: "product", header: "Produto" },
    { 
      accessorKey: "startDate", 
      header: "Data Início",
      cell: ({ row }) => format(new Date(row.original.startDate), "dd/MM/yyyy"),
    },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const variant: "default" | "secondary" | "destructive" | "outline" = 
            status === 'Concluída' ? 'default' 
          : status === 'Em Andamento' ? 'outline'
          : status === 'Cancelada' ? 'destructive'
          : 'secondary';
        return <Badge variant={variant}>{status}</Badge>
      },
    },
    { 
      accessorKey: "estimatedKm", 
      header: "KM Estimado",
      cell: ({ row }) => `${row.original.estimatedKm} km`
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  });

  const handleExport = () => {
    const dataToExport = table.getFilteredRowModel().rows.map(row => ({
      OC: row.original.oc,
      Motorista: row.original.driverName,
      Produto: row.original.product,
      "Data Início": format(new Date(row.original.startDate), "dd/MM/yyyy"),
      Status: row.original.status,
      "KM Estimado": row.original.estimatedKm,
      "KM Real": row.original.realKm ?? '',
      Cidades: row.original.cities.join(' -> '),
    }));
    exportToCsv(`logiflow_viagens_${new Date().toISOString().split('T')[0]}.csv`, dataToExport);
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Input
            placeholder="Filtrar por OC..."
            value={(table.getColumn("oc")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("oc")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <Select
            onValueChange={(value) => table.getColumn("driverName")?.setFilterValue(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full md:w-[280px]">
              <SelectValue placeholder="Filtrar por motorista..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Motoristas</SelectItem>
              {drivers.map(driver => (
                <SelectItem key={driver.id} value={driver.name}>{driver.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateFilter table={table} />
          <Button onClick={handleExport} variant="outline" className="ml-auto">
            <FileDown className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">Nenhum resultado.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >Anterior</Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >Próximo</Button>
      </div>
    </div>
  );
}


function DateFilter({ table }: { table: ReturnType<typeof useReactTable<any>> }) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  React.useEffect(() => {
    if (date?.from && date?.to) {
        table.getColumn("startDate")?.setFilterValue([date.from, date.to]);
    } else {
        table.getColumn("startDate")?.setFilterValue(undefined);
    }
  }, [date, table]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full md:w-[300px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Selecione um período</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
