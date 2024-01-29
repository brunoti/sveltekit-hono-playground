import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

export const Task = z.object({
	id: z.string().uuid(),
	name: z.string().min(1),
	done: z.boolean()
});

export type Task = z.infer<typeof Task>;

export const TaskCreateInput = Task.pick({ name: true });

export type TaskCreateInput = z.infer<typeof TaskCreateInput>;

export const TaskParam = Task.pick({ id: true });
export type TaskParam = z.infer<typeof TaskParam>;

/**
 * This will be our in-memory data store
 */
let tasks: Task[] = [];

export const router = new Hono()
	.get('/tasks', (c) => c.json<Task[]>(tasks))
	.post('/tasks', zValidator('json', TaskCreateInput), (c) => {
		const body = c.req.valid('json');
		const task = {
			id: crypto.randomUUID(),
			name: body.name,
			done: false
		};
		tasks = [...tasks, task];
		return c.json(task);
	})
	.post('/tasks/:id/finish', zValidator('param', TaskParam), (c) => {
		const { id } = c.req.valid('param');
		const task = tasks.find((task) => task.id === id);
		if (task) {
			task.done = true;
			return c.json(task);
		}

		throw c.json({ message: 'Task not found' }, 404);
	})
	.post('/tasks/:id/undo', zValidator('param', TaskParam), (c) => {
		const { id } = c.req.valid('param');
		const task = tasks.find((task) => task.id === id);
		if (task) {
			task.done = false;
			return c.json(task);
		}

		throw c.json({ message: 'Task not found' }, 404);
	})
	.post('/tasks/:id/delete', zValidator('param', TaskParam), (c) => {
		const { id } = c.req.valid('param');
		tasks = tasks.filter((task) => task.id !== id);
		return c.json({ message: 'Task deleted' });
	});

export const api = new Hono().route('/api', router);

export type Router = typeof router;
