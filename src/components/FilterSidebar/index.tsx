import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Store, DealFilter } from '../../types';
import { getStores } from '../../lib/api';

interface FilterSidebarProps {
  onFilterChange: (filters: DealFilter) => void;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [minSavings, setMinSavings] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError(null);
        const storesData = await getStores();
        
        if (Array.isArray(storesData)) {
          setStores(storesData.filter(store => store.isActive === 1));
        } else {
          console.error('Resposta da API de lojas não é um array:', storesData);
          setStores([]);
          setError('Erro ao carregar lista de lojas');
        }
      } catch (error) {
        console.error("Erro ao buscar lojas:", error);
        setStores([]);
        setError('Erro ao carregar lista de lojas');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleApplyFilters = () => {
    const filters: DealFilter = {};

    if (selectedStore && selectedStore !== 'all') filters.storeID = selectedStore;
    if (priceRange[0] > 0) filters.lowerPrice = priceRange[0].toString();
    if (priceRange[1] < 50) filters.upperPrice = priceRange[1].toString();
    if (sortBy) filters.sortBy = sortBy;
    if (title) filters.title = title;
    if (minSavings > 0) filters.minSavings = minSavings.toString();

    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setSelectedStore('all');
    setPriceRange([0, 50]);
    setMinSavings(0);
    setSortBy('');
    setTitle('');
    onFilterChange({});
  };

  const sortOptions = [
    { value: 'Deal Rating', label: 'Melhor Avaliação' },
    { value: 'Title', label: 'Título' },
    { value: 'Savings', label: 'Maior Desconto' },
    { value: 'Price', label: 'Menor Preço' },
    { value: 'Reviews', label: 'Mais Avaliações' },
    { value: 'Release', label: 'Data de Lançamento' },
    { value: 'Store', label: 'Loja' },
  ];

  return (
    <div className="w-full space-y-6 rounded-lg border p-4">
      <h2 className="text-lg font-medium">Filtros</h2>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar por título</Label>
          <Input 
            id="search"
            type="text"
            placeholder="Nome do jogo..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="store">Loja</Label>
          {loading ? (
            <div className="h-10 animate-pulse rounded bg-muted"></div>
          ) : (
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger id="store">
                <SelectValue placeholder="Selecione uma loja" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as lojas</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.storeID} value={store.storeID}>
                    {store.storeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="priceRange">Faixa de preço (R$)</Label>
          <div className="pt-2">
            <Slider 
              defaultValue={[0, 50]} 
              max={50} 
              step={1} 
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
            />
            <div className="mt-2 flex justify-between text-sm">
              <span>R$ {priceRange[0]}</span>
              <span>R$ {priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="discountRange">Desconto mínimo: {minSavings}%</Label>
          <div className="pt-2">
            <Slider 
              defaultValue={[0]} 
              max={100} 
              step={5} 
              value={[minSavings]}
              onValueChange={(value) => setMinSavings(value[0])}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortBy">Ordenar por</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sortBy">
              <SelectValue placeholder="Selecione uma ordenação" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button onClick={handleApplyFilters}>
            Aplicar Filtros
          </Button>
          <Button variant="outline" onClick={handleClearFilters}>
            Limpar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
} 