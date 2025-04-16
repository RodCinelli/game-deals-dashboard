import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Deal } from '../../types';
import { getGameDetails } from '../../lib/api';

interface GameModalProps {
  game: Deal;
  isOpen: boolean;
  onClose: () => void;
}

export function GameModal({ game, isOpen, onClose }: GameModalProps) {
  const [gameDetails, setGameDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await getGameDetails(game.gameID);
        setGameDetails(details);
      } catch (error) {
        console.error("Erro ao buscar detalhes do jogo:", error);
        setError("Não foi possível carregar os detalhes do jogo. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && game) {
      fetchGameDetails();
    }
  }, [isOpen, game]);

  if (!isOpen) return null;

  const formatCurrency = (value: string) => {
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(parseFloat(value));
    } catch (e) {
      console.error("Erro ao formatar moeda:", e);
      return value;
    }
  };

  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp * 1000).toLocaleDateString('pt-BR');
    } catch (e) {
      console.error("Erro ao formatar data:", e);
      return "Data desconhecida";
    }
  };

  const calculateDiscount = (original: string, sale: string) => {
    try {
      const originalPrice = parseFloat(original);
      const salePrice = parseFloat(sale);
      return ((originalPrice - salePrice) / originalPrice * 100).toFixed(0);
    } catch (e) {
      console.error("Erro ao calcular desconto:", e);
      return "0";
    }
  };

  const getStoreImage = (storeID: string) => {
    try {
      return `https://www.cheapshark.com/img/stores/icons/${parseInt(storeID) - 1}.png`;
    } catch (e) {
      console.error("Erro ao obter imagem da loja:", e);
      return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-lg bg-background p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Fechar</span>
        </button>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <p className="text-destructive">{error}</p>
            <Button onClick={onClose} variant="outline" className="mt-4">
              Fechar
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-shrink-0">
                <img 
                  src={game.thumb} 
                  alt={game.title} 
                  className="h-auto w-full rounded-md md:w-48" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/200x100?text=Imagem+Indisponível';
                  }}
                />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold">{game.title}</h2>
                
                <div className="mt-2 flex items-center gap-2">
                  <img 
                    src={getStoreImage(game.storeID)} 
                    alt="Store" 
                    className="h-6 w-6" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Preço Original</p>
                    <p className="text-lg font-medium line-through">
                      {formatCurrency(game.normalPrice)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Preço Atual</p>
                    <p className="text-lg font-bold text-green-500">
                      {formatCurrency(game.salePrice)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Economia</p>
                    <p className="text-lg font-medium text-green-500">
                      {calculateDiscount(game.normalPrice, game.salePrice)}%
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Avaliação</p>
                    <p className="text-lg font-medium">
                      {game.dealRating ? parseFloat(game.dealRating).toFixed(1) + "/10" : "N/A"}
                    </p>
                  </div>
                </div>

                {gameDetails?.cheapestPriceEver && (
                  <div className="mt-4 rounded-md bg-muted p-3">
                    <h3 className="font-medium">Menor Preço Histórico</h3>
                    <div className="mt-1 flex justify-between">
                      <span>{formatCurrency(gameDetails.cheapestPriceEver.price)}</span>
                      <span>em {formatDate(gameDetails.cheapestPriceEver.date)}</span>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Button 
                    onClick={() => window.open(`https://www.cheapshark.com/redirect?dealID=${game.dealID}`, '_blank')}
                    variant="default"
                  >
                    Comprar Agora
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 