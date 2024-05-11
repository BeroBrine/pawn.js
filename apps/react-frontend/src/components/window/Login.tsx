import { useNavigate } from "react-router-dom";
import Button from "../Button";
import { useState } from "react";

const Login = () => {
	const [inputs, setInputs] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(inputs);
		const target = e.target as HTMLInputElement;
		if (target.id === "email") {
			setInputs((preval) => {
				return {
					...preval,
					email: target.value,
				};
			});
		} else if (target.id === "password") {
			setInputs((preval) => {
				return {
					...preval,
					password: target.value,
				};
			});
		}
	};
	const navigate = useNavigate();
	const handleClick = () => {
		navigate("/game");
	};
	return (
		<div className="h-screen flex justify-center items-center flex-col p-2">
			<div className="p-3 justify-center rounded-3xl bg-white">
				<span className="flex text-bold text-xl p-2 ">Email</span>
				<input
					id="email"
					className="p-2 m-2"
					onChange={handleChange}
					type="text"
				/>
				<span className="flex text-bold text-xl p-2">Password</span>
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
