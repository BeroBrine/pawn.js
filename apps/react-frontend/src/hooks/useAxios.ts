import type { loginBodyZodType, signUpBodyZodType } from "@repo/zodValidation/loginBodyZod";
import axios from "axios";

type axiosMethod = "POST" | "GET" | "PUT"
type axiosBody = loginBodyZodType | signUpBodyZodType

const useAxios = (url: string, method: axiosMethod, headers?: ) => {
  if (method === "GET") {
    await axios.get()
  }
}
