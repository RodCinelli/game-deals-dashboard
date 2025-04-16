import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Deal } from '../../types';

interface GameCardProps {
  game: Deal;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, gameId: string) => void;
}

export function GameCard({ game, onClick, isFavorite, onToggleFavorite }: GameCardProps) {
  const formatCurrency = (value: string) => {
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(parseFloat(value));
    } catch (e) {
      return value;
    }
  };

  const calculateDiscount = (original: string, sale: string) => {
    try {
      const originalPrice = parseFloat(original);
      const salePrice = parseFloat(sale);
      return ((originalPrice - salePrice) / originalPrice * 100).toFixed(0);
    } catch (e) {
      return "0";
    }
  };

  const getStoreImage = (storeID: string) => {
    try {
      return `https://www.cheapshark.com/img/stores/icons/${parseInt(storeID) - 1}.png`;
    } catch (e) {
      return "";
    }
  };

  const discount = calculateDiscount(game.normalPrice, game.salePrice);
  
  return (
    <div 
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md"
    >
      <div className="relative">
        {/* Banner de desconto */}
        {parseFloat(discount) > 0 && (
          <div className="absolute left-0 top-0 z-10 rounded-br-lg bg-red-600 px-2 py-1 text-xs font-bold text-white">
            -{discount}%
          </div>
        )}
        
        {/* Botão de favorito */}
        <button
          onClick={(e) => onToggleFavorite(e, game.gameID)}
          className="absolute right-2 top-2 z-10 rounded-full bg-background/80 p-1.5 text-yellow-500 backdrop-blur-sm transition-all hover:bg-background/90 hover:text-yellow-400"
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Star className={isFavorite ? "fill-yellow-500" : ""} size={18} />
        </button>
        
        {/* Imagem do jogo */}
        <div
          className="relative aspect-video cursor-pointer overflow-hidden"
          onClick={onClick}
        >
          <img
            src={game.thumb}
            alt={game.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x300?text=Imagem+Indisponível';
            }}
          />
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        {/* Nome do jogo */}
        <h3 
          className="mb-2 cursor-pointer text-base font-bold line-clamp-2"
          onClick={onClick}
        >
          {game.title}
        </h3>
        
        {/* Loja */}
        <div className="mt-1 flex items-center gap-2">
          <img
            src={getStoreImage(game.storeID)}
            alt="Store"
            className="h-4 w-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="text-xs text-muted-foreground">
            {game.steamRatingText ? game.steamRatingText : "Sem avaliações"}
          </span>
        </div>
        
        {/* Preços */}
        <div className="mt-auto pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground line-through">
              {formatCurrency(game.normalPrice)}
            </span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(game.salePrice)}
            </span>
          </div>
          
          {/* Botão de compra e avaliação */}
          <div className="mt-3 flex items-center justify-between">
            <div 
              className="rounded-md bg-muted px-2 py-1 text-xs font-medium"
              title="Avaliação da oferta"
            >
              {game.dealRating ? `${parseFloat(game.dealRating).toFixed(1)}/10` : "N/A"}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(`https://www.cheapshark.com/redirect?dealID=${game.dealID}`, '_blank')}
              className="h-8 rounded-full px-3"
            >
              <ShoppingCart size={14} className="mr-1" />
              Comprar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 