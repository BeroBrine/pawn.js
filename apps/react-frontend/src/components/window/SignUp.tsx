import type { signUpBodyZodType } from "@repo/zodValidation/loginBodyZod";
import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import type { AxiosResponse } from "axios";

type inputIds = "email" | "password" | "name" | "username";

function SignUp() {
	const [userInputs, setUserInputs] = useState<signUpBodyZodType>({
		username: "",
		password: "",
		email: "",
	});

	const handleClick = async () => {
		if (!userInputs) return;
		const { response } = (await useAxios({
			url: "http://localhost:3000/auth/signup",
			method: "POST",
			data: userInputs,
		})) as { response: AxiosResponse };
		console.log(response);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		const id = target.id as inputIds;

		switch (id) {
			case "username": {
				setUserInputs((prev) => {
					return {
						...prev,
						username: target.value,
					};
				});
				break;
			}

			case "password": {
				setUserInputs((prev) => {
					return {
						...prev,
						password: target.value,
					};
				});
				break;
			}

			case "name": {
				setUserInputs((prev) => {
					return {
						...prev,
						name: target.value,
					};
				});
				break;
			}

			case "email": {
				setUserInputs((prev) => {
					return {
						...prev,
						email: target.value,
					};
				});
				break;
			}
		}
	};

	return (
		<div className="h-screen  flex justify-center items-center">
			<div className="rounded-3xl bg-white p-5 flex flex-col">
				<div className="flex flex-col p-2">
					<span className="text-xl font-bold pb-2">Username</span>
					<input
						onChange={handleChange}
						id="username"
						type="text"
						className="p-2 rounded-xl w-full border border-black"
						placeholder="username here"
					/>
				</div>

				<div className="flex flex-col p-2">
					<span className="text-xl font-bold pb-2 justify-start">Email</span>
					<input
						onChange={handleChange}
						id="email"
						type="text"
						className="p-2 rounded-xl w-full border border-black "
						placeholder="xxx@gmail.com"
					/>
				</div>

				<div className="flex flex-col p-2">
					<span className="text-xl font-bold pb-2 justify-start">
						Name(Optional)
					</span>
					<input
						onChange={handleChange}
						id="name"
						type="text"
						className="p-2 rounded-xl w-full border border-black"
						placeholder="name here"
					/>
				</div>

				<div className="flex flex-col p-2">
					<span className="text-xl font-bold pb-2 justify-start">Password</span>
					<input
						onChange={handleChange}
						id="password"
						type="text"
						className="p-2 rounded-xl w-full border border-black"
						placeholder="*****"
					/>
				</div>
				<button
					onClick={handleClick}
					className="bg-black p-3 rounded-2xl text-white font-bold"
					type="submit"
				>
					Sign Up
				</button>
			</div>
		</div>
	);
}

export default SignUp;
