import { api } from '$lib/api';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request }) => api.fetch(request);
export const POST: RequestHandler = ({ request }) => api.fetch(request);
