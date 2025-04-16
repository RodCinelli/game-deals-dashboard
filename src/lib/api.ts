import axios, { AxiosError } from 'axios';
import { Deal, DealFilter, GameDetail, Store } from '../types';

const API_BASE_URL = 'https://www.cheapshark.com/api/1.0';

// Criar a instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
});

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('Erro na API CheapShark:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    } else if (error.request) {
      console.error('Sem resposta do servidor');
    }
    
    return Promise.reject(error);
  }
);

export async function getDeals(filter: DealFilter = {}): Promise<Deal[]> {
  try {
    const response = await api.get('/deals', { params: filter });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar ofertas:', error);
    throw error;
  }
}

export async function getStores(): Promise<Store[]> {
  try {
    const response = await api.get('/stores');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar lojas:', error);
    throw error;
  }
}

export async function getDealById(dealId: string): Promise<Deal> {
  try {
    const response = await api.get(`/deals?id=${dealId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar oferta ${dealId}:`, error);
    throw error;
  }
}

export async function getGameDetails(gameId: string): Promise<GameDetail> {
  try {
    const response = await api.get(`/games?id=${gameId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar detalhes do jogo ${gameId}:`, error);
    throw error;
  }
}

export async function searchGames(title: string): Promise<any[]> {
  try {
    const response = await api.get('/games', { params: { title, limit: 20 } });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar jogos com título "${title}":`, error);
    throw error;
  }
}

export default api; 