import z from "zod";

export const loginBodyZod = z.object({
	email: z.string().email(),
	password: z.string().min(4),
});

export const signupBodyZod = z.object({
	email: z.string().email(),
	username: z.string().min(4),
	name: z.string().optional(),
	password: z.string().min(4),
});

export const dbUserZod = z.object({
	id: z.string(),
	name: z.string().or(z.null()),
	username: z.string(),
	email: z.string(),
	password: z.string(),
	createdAt: z.date(),
	lastLogin: z.date(),
});

export type loginBodyZodType = z.infer<typeof loginBodyZod>;
export type signUpBodyZodType = z.infer<typeof signupBodyZod>;
export type dbUserZodType = z.infer<typeof dbUserZod>;
