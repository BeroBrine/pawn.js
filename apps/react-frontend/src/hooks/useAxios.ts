import type {
	loginBodyZodType,
	signUpBodyZodType,
} from "@repo/zodValidation/loginBodyZod";
import axios, { type AxiosResponse, type RawAxiosRequestHeaders } from "axios";
import { useState } from "react";

type axiosMethod = "POST" | "GET" | "PUT";
type axiosBody = loginBodyZodType | signUpBodyZodType;

type useAxiosReturnType = { loading: boolean; response: AxiosResponse } | null;

const useAxios = async (
	url: string,
	data: axiosBody,
	method: axiosMethod,
	axiosHeaders?: {
		headers: RawAxiosRequestHeaders;
	},
): Promise<useAxiosReturnType> => {
	const [loading, setLoading] = useState<boolean>(true);
	switch (method) {
		case "GET": {
			const response = await axios.get(`${url}`);
			setLoading(true);
			return { loading, response };
		}

		case "POST": {
			if (!axiosHeaders) throw new Error("error in post request");
			const response = await axios.post(`${url}`, data, axiosHeaders);
			setLoading(true);
			return { loading, response };
		}
		default: {
			return null;
		}
	}
};

export default useAxios;
