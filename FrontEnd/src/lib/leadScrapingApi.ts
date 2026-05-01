import { getToken } from './auth';
import type { RunLeadScrapeRequest, RunLeadScrapeResponse } from '../types/leadScraping';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}

export async function runLeadScraping(
  input: RunLeadScrapeRequest
): Promise<RunLeadScrapeResponse> {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/api/lead-scraping/run`, {
    method: 'POST',
      credentials: 'include', // 👈 REQUIRED
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const data = await response.json();
      message = data.message ?? message;
    } catch {
      // ignore
    }

    throw new Error(message);
  }

  return response.json();
}