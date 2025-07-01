import type { z } from "zod";
import type { NewUserSchema } from "./utils";

export interface AddJob {
	companyName: string;
	positionName: string;
	status:
		| "bookmarked"
		| "applied"
		| "rejected"
		| "ghosted"
		| "interviewing"
		| "offered"
		| "accepted";
	description: string;
	applicationUrl: string;
	location: string;
}
export interface EditJob {
	companyName?: string;
	positionName?: string;
	status?:
		| "bookmarked"
		| "applied"
		| "rejected"
		| "ghosted"
		| "interviewing"
		| "offered"
		| "accepted";
	description?: string;
	applicationUrl?: string;
	location?: string;
}
export interface TLoginRequest {
	email: string;
	password: string;
}
export interface TLoginResponse {
	id: number;
	email: string;
	name: string;
	token: string;
}
export type TRegisterRequest = z.infer<typeof NewUserSchema>;
export interface TRegisterResponse {
	id: number;
	name: string;
	email: string;
}
export interface TDirectoryRequest {
	name: string;
	userId: number;
}
export interface TDirectoryResponse {
	id: number;
	name: string;
}
export interface GetDirectoryResponse {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
}
export interface EditDirectoryRequest {
	userId: number;
	name: string;
	id: string;
}
export interface AddJobRequest {
	userId: number;
	company_name: string;
	position_name: string;
	status: string;
	description: string;
	application_url: string;
	location: string;
}
