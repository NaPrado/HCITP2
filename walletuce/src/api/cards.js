import { Api } from './api.js';

export function formatCardNumber(value) {
  if (!value) return '';
  const cleaned = value.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
}

export function cleanCardNumber(value) {
  return value.replace(/\s/g, '');
}

export function formatDisplayNumber(number) {
  return `**** **** **** ${number.slice(-4)}`;
}

export function formatCardType(type) {
  return type === 'CREDIT' ? 'Crédito' : 'Débito';
}

export const CARD_TYPES = [
  { value: 'CREDIT', text: 'Crédito' },
  { value: 'DEBIT', text: 'Débito' }
];

export class CardsService {
  static getUrl(slug) {
    return `${Api.baseUrl}/card${slug ? `/${slug}` : ''}`;
  }

  static async getAll() {
    try {
      console.log('Fetching cards...');
      const response = await Api.get(this.getUrl(), true);
      console.log('API Response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw error;
    }
  }

  static async add(card) {
    try {
      console.log('Adding card:', card);
      const response = await Api.post(this.getUrl(), true, card);
      console.log('Add card response:', response);
      return response;
    } catch (error) {
      console.error('Error adding card:', error);
      throw error;
    }
  }

  static async remove(cardId) {
    try {
      await Api.delete(this.getUrl(cardId), true);
    } catch (error) {
      console.error('Error removing card:', error);
      throw error;
    }
  }
} 