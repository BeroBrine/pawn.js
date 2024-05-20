import type {
	loginBodyZodType,
	signUpBodyZodType,
} from "@repo/zodValidation/loginBodyZod";
import axios, { type AxiosResponse, type RawAxiosRequestHeaders } from "axios";
import { useState } from "react";

type axiosMethod = "POST" | "GET" | "PUT";
type axiosBody = loginBodyZodType | signUpBodyZodType;

const useAxios = async (
	url: string,
	data: axiosBody,
	method: axiosMethod,
	axiosHeaders?: {
		headers: RawAxiosRequestHeaders;
	},
): Promise<{ loading: boolean; response: AxiosResponse } | undefined> => {
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
			console.log("axiosHeaders are ", axiosHeaders);
			try {
				console.log("axiosHeaders are ", axiosHeaders);
				if (!axiosHeaders) throw new Error("error in post request");
				const response = await axios.post(`${url}`, data, axiosHeaders);
				loading = false;
				const returnObj = { loading, response };
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
