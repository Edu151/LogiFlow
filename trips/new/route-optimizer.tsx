"use client";

import { useState } from 'react';
import { optimizeRouteWithAI, type OptimizeRouteWithAIOutput } from '@/ai/flows/optimize-route-with-ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlusCircle, Trash2, Route, Loader2, Info, MapPinned } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

interface RouteOptimizerProps {
  onRouteOptimized: (data: { cities: string[], distance: number }) => void;
  form: UseFormReturn<any>;
}

export function RouteOptimizer({ onRouteOptimized, form }: RouteOptimizerProps) {
  const [cities, setCities] = useState<string[]>(['', '']);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<OptimizeRouteWithAIOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCityChange = (index: number, value: string) => {
    const newCities = [...cities];
    newCities[index] = value;
    setCities(newCities);
    form.setValue("cities", newCities.filter(c => c.trim() !== ''));
  };

  const addCity = () => {
    setCities([...cities, '']);
  };

  const removeCity = (index: number) => {
    if (cities.length <= 2) return;
    const newCities = cities.filter((_, i) => i !== index);
    setCities(newCities);
    form.setValue("cities", newCities.filter(c => c.trim() !== ''));
  };

  const handleOptimize = async () => {
    setError(null);
    setResult(null);
    const validCities = cities.filter(c => c.trim() !== '');
    if (validCities.length < 2) {
      setError('Por favor, insira pelo menos duas cidades.');
      form.setError("cities", { type: "manual", message: "Pelo menos duas cidades são necessárias." });
      return;
    }

    setRunning(true);
    try {
      const output = await optimizeRouteWithAI({ cities: validCities, optimizeFor: 'distance' });
      setResult(output);
      onRouteOptimized({
        cities: output.optimizedRoute,
        distance: output.totalDistanceKm || 0,
      });
    } catch (e) {
      setError('Ocorreu um erro ao otimizar a rota. Tente novamente.');
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Otimizador de Rota com IA</CardTitle>
        <CardDescription>Insira as cidades de parada para encontrar a rota mais eficiente.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {cities.map((city, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder={`Cidade ${index + 1}`}
                value={city}
                onChange={(e) => handleCityChange(index, e.target.value)}
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeCity(index)} disabled={cities.length <= 2}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addCity}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Cidade
          </Button>
        </div>
        
        {form.formState.errors.cities && (
            <p className="text-sm font-medium text-destructive">{form.formState.errors.cities.message?.toString()}</p>
        )}

        <div className="flex justify-end">
          <Button type="button" onClick={handleOptimize} disabled={running}>
            {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Route className="mr-2 h-4 w-4" />}
            Otimizar Rota
          </Button>
        </div>

        {error && <Alert variant="destructive"><Info className="h-4 w-4" /><AlertTitle>Erro</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

        {result && (
          <Alert>
            <MapPinned className="h-4 w-4" />
            <AlertTitle>Rota Otimizada</AlertTitle>
            <AlertDescription>
              <div className="space-y-2 mt-2">
                <p><strong className="font-medium">Rota Sugerida:</strong> {result.optimizedRoute.join(' → ')}</p>
                <p><strong className="font-medium">Distância Total:</strong> {result.totalDistanceKm} km</p>
                <p><strong className="font-medium">Tempo Estimado:</strong> {result.totalTimeHours} horas</p>
                <p className="text-xs text-muted-foreground pt-2">{result.explanation}</p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
