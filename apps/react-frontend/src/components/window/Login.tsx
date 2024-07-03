import { useNavigate } from "react-router-dom";
import Button from "../Button";
import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import type { AxiosResponse } from "axios";
import { STATUS_CODES } from "@repo/interfaceAndEnums/STATUS_CODES";

interface ILogin {
	email: string;
	password: string;
}

type TAxiosReturn =
	| {
			loading: boolean;
			response: AxiosResponse;
	  }
	| undefined;

const Login = () => {
	const [userInput, setUserInput] = useState<ILogin>({
		email: "",
		password: "",
	});

	const [axiosReturn, setAxiosReturn] = useState<TAxiosReturn | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(userInput);
		const target = e.target as HTMLInputElement;
		if (target.id === "email") {
			setUserInput((preval) => {
				return {
					...preval,
					email: target.value,
				};
			});
		} else if (target.id === "password") {
			setUserInput((preval) => {
				return {
					...preval,
					password: target.value,
				};
			});
		}
	};

	const navigate = useNavigate();

	const handleClick = () => {
		const bad = async () => {
			const obj = (await useAxios(
				"http://localhost:3000/auth/login",
				{
					email: userInput.email,
					password: userInput.password,
				},
				"POST",
			)) as TAxiosReturn;
			setAxiosReturn(obj);
		};
		bad();
		if (axiosReturn?.response.status === STATUS_CODES.OK) navigate("/game");
		else {
			alert("invalid username or password");
		}
		console.log("the axios return is ", axiosReturn);
	};

	return (
		<div className="h-screen flex justify-center items-center flex-col p-2">
			<div className="p-3 bg-black justify-center rounded-3xl ">
				<span className="flex text-bold text-xl text-white p-2 ">Email</span>
				<input
					id="email"
					className="p-2 m-2"
					onChange={handleChange}
					type="text"
				/>
				<span className="flex text-bold text-xl text-white p-2">Password</span>
				<input
					onChange={handleChange}
					id="password"
					className="p-2 m-2"
					type="text"
				/>
			</div>
			<Button handleClick={handleClick}>Click To Login</Button>
		</div>
	);
};

export default Login;
