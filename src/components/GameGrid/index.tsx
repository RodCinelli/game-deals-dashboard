import React, { useEffect, useState } from 'react';
import { GameCard } from '../GameCard';
import { Button } from '../ui/button';
import { Deal } from '../../types';
import { ArrowUp } from 'lucide-react';

interface GameGridProps {
  data: Deal[];
  favorites: Set<string>;
  onToggleFavorite: (e: React.MouseEvent, gameId: string) => void;
  onSelectGame: (game: Deal) => void;
}

export function GameGrid({
  data,
  favorites,
  onToggleFavorite,
  onSelectGame
}: GameGridProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Detectar quando o usuário rolar a página
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (data.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-lg border p-6 text-center">
        <p className="text-lg">Nenhuma oferta encontrada com os filtros selecionados.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((game) => (
          <GameCard
            key={game.dealID}
            game={game}
            onClick={() => onSelectGame(game)}
            isFavorite={favorites.has(game.gameID)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {showScrollTop && (
        <Button
          className="fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full shadow-md"
          size="icon"
          onClick={scrollToTop}
          title="Voltar ao topo"
        >
          <ArrowUp />
        </Button>
      )}
    </div>
  );
} 