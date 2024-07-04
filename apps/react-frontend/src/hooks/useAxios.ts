import type {
	loginBodyZodType,
	signUpBodyZodType,
} from "@repo/zodValidation/loginBodyZod";
import axios, { type AxiosResponse, type RawAxiosRequestHeaders } from "axios";
import { useState } from "react";

type axiosMethod = "POST" | "GET" | "PUT";
export type axiosBody = loginBodyZodType | signUpBodyZodType;

const useAxios = async ({
	url,
	method,
	data,
	axiosHeaders,
}: {
	url: string;
	method: axiosMethod;
	data?: axiosBody;
	axiosHeaders?: {
		headers: RawAxiosRequestHeaders;
	};
}): Promise<{ loading: boolean; response: AxiosResponse } | undefined> => {
	let loading = true;
	switch (method) {
		case "GET": {
			try {
				const response = await axios.get(`${url}`);
				loading = false;
				const returnObj = { loading, response };
				return returnObj;
			} catch (e) {
				console.log(e);
				throw new Error("Fetch Request Failed");
			}
		}

		case "POST": {
			try {
				console.log("posting");
				const response = await axios.post(`${url}`, data, axiosHeaders);
				loading = false;
				console.log(response);
				const returnObj = { loading, response };
				console.log("returning");
				return returnObj;
			} catch (e) {
				console.log("the error is ", e);
				throw new Error("Post Request Failed");
			}
		}
		default: {
			console.log("no method specified");
			break;
		}
	}
};

export default useAxios;
