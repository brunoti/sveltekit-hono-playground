import { TaskCreateInput } from '$lib/api';
import { makeClient } from '$lib/make-client';
import type { Actions } from '@sveltejs/kit';

export const actions = {
	async default({ fetch, request }) {
		const client = makeClient(fetch);
		const form = await request.formData();
		const data = TaskCreateInput.parse(Object.fromEntries(form));
		const response = await client.tasks.$post({
			json: data
		});

		if (!response.ok) {
			return {
				message: 'An error occurred'
			};
		}

		return await response.json();
	}
} satisfies Actions;
