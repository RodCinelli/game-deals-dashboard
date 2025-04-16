import { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { GameGrid } from './components/GameGrid';
import { columns } from './components/DataTable/columns';
import { FilterSidebar } from './components/FilterSidebar';
import { Deal, DealFilter } from './types';
import { getDeals } from './lib/api';
import { MoonIcon, SunIcon, LayoutGrid, LayoutList, Star } from 'lucide-react';
import { Button } from './components/ui/button';
import { GameModal } from './components/GameModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

// Chave para armazenar favoritos no localStorage
const FAVORITES_KEY = 'game-deals-favorites';
// Chave para armazenar preferência de visualização
const VIEW_MODE_KEY = 'game-deals-view-mode';

function App() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DealFilter>({});
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Deal | null>(null);

  // Verificar preferência de tema e carregar favoritos após montagem
  useEffect(() => {
    setMounted(true);
    
    // Carregar tema
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(savedDarkMode || prefersDarkMode);
    
    // Carregar modo de visualização
    const savedViewMode = localStorage.getItem(VIEW_MODE_KEY) as 'table' | 'grid' | null;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
    
    // Carregar favoritos
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (!mounted) return;
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode, mounted]);

  // Salvar modo de visualização
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode, mounted]);

  // Carregar dados
  useEffect(() => {
    if (!mounted) return;

    const fetchDeals = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDeals(filters);
        
        if (Array.isArray(data)) {
          setDeals(data);
        } else {
          console.error('Resposta da API não é um array:', data);
          setDeals([]);
          setError('Formato de dados inesperado. Verifique o console para mais detalhes.');
        }
      } catch (err) {
        setDeals([]);
        setError('Erro ao carregar ofertas. Tente novamente mais tarde.');
        console.error('Erro na chamada da API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [filters, mounted]);

  // Filtrar por favoritos se necessário
  const filteredDeals = showOnlyFavorites 
    ? deals.filter(deal => favorites.has(deal.gameID)) 
    : deals;

  const handleFilterChange = (newFilters: DealFilter) => {
    setFilters(newFilters);
  };

  const handleToggleFavorite = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    
    // Atualizar estado
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      
      if (newFavorites.has(gameId)) {
        newFavorites.delete(gameId);
      } else {
        newFavorites.add(gameId);
      }
      
      // Salvar no localStorage
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...newFavorites]));
      
      return newFavorites;
    });
  };

  const handleToggleViewMode = () => {
    setViewMode(prev => prev === 'table' ? 'grid' : 'table');
  };

  const handleToggleShowOnlyFavorites = () => {
    setShowOnlyFavorites(prev => !prev);
  };

  // Evitar problemas de hidratação renderizando apenas após montagem
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="text-3xl font-bold">Game Deals Dashboard</h1>
            <p className="text-muted-foreground">
              Encontre as melhores ofertas de jogos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleViewMode}
              aria-label={viewMode === 'table' ? 'Mudar para visualização em grid' : 'Mudar para visualização em tabela'}
              className="relative"
              title={viewMode === 'table' ? 'Visualização em Grid' : 'Visualização em Tabela'}
            >
              {viewMode === 'table' ? (
                <LayoutGrid className="h-5 w-5" />
              ) : (
                <LayoutList className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              variant={showOnlyFavorites ? 'default' : 'outline'}
              size="icon"
              onClick={handleToggleShowOnlyFavorites}
              aria-label={showOnlyFavorites ? 'Mostrar todos os jogos' : 'Mostrar apenas favoritos'}
              title={showOnlyFavorites ? 'Mostrar todos' : 'Mostrar favoritos'}
              className="relative"
            >
              <Star className={`h-5 w-5 ${showOnlyFavorites ? 'fill-primary-foreground' : ''}`} />
              {favorites.size > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {favorites.size}
                </span>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
              title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <aside className="md:col-span-1">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </aside>

          <main className="md:col-span-3">
            {loading ? (
              <div className="flex h-96 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="flex h-96 flex-col items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
                <p className="text-lg font-medium text-destructive">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => setFilters({})}
                >
                  Tentar Novamente
                </Button>
              </div>
            ) : filteredDeals.length === 0 ? (
              <div className="flex h-96 flex-col items-center justify-center rounded-lg border p-6 text-center">
                <p className="text-lg">
                  {showOnlyFavorites 
                    ? "Você ainda não adicionou nenhum jogo aos favoritos." 
                    : "Nenhuma oferta encontrada com os filtros selecionados."}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => {
                    if (showOnlyFavorites) {
                      setShowOnlyFavorites(false);
                    } else {
                      setFilters({});
                    }
                  }}
                >
                  {showOnlyFavorites 
                    ? "Mostrar Todos os Jogos" 
                    : "Limpar Filtros"}
                </Button>
              </div>
            ) : (
              <>
                {viewMode === 'table' ? (
                  <DataTable 
                    columns={columns} 
                    data={filteredDeals} 
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ) : (
                  <GameGrid 
                    data={filteredDeals}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectGame={setSelectedGame}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {selectedGame && (
        <GameModal 
          game={selectedGame} 
          isOpen={!!selectedGame} 
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
}

export default App;
