import { useNavigate } from "react-router-dom";
import Button from "../Button";

const Landing = () => {
	const navigate = useNavigate();
	const handleClick = () => {
		navigate("/game");
	};
	return (
		<div className="h-screen flex justify-center items-center flex-col">
			<span
				className="font-bold text-white text-4xl p-7
      "
			>
				Play Chess Online
			</span>

			<Button handleClick={handleClick}>Click To Enter</Button>
		</div>
	);
};

export default Landing;
