import { makeClient } from '$lib/make-client';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const client = makeClient(fetch);
	const tasks = await client.tasks.$get();

	if (!tasks.ok) {
		return { tasks: [] };
	}

	return {
		tasks: await tasks.json()
	};
}) satisfies PageLoad;
