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
		(async () => {
			console.log("requesting");
			const obj = (await useAxios({
				url: "http://localhost:3000/auth/login",
				method: "POST",
				data: {
					email: userInput.email,
					password: userInput.password,
				},
			})) as TAxiosReturn;

			console.log("the axios return is ", obj);

			if (obj?.response.status === STATUS_CODES.OK && obj.response.data.token) {
				localStorage.setItem("token", obj.response.data.token);
				navigate("/game");
			} else {
				alert("invalid username or password");
			}
		})();
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
			<button
				onClick={handleClick}
				type="button"
				className="rounded-xl text-xl bg-black p-5 text-white font-bold"
			>
				Click To Login
			</button>
		</div>
	);
};

export default Login;
