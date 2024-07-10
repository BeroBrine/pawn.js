import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";

function LandingPage() {
	const navigate = useNavigate();
	const [gameId, setGameId] = useState<string>("");
	let dbId = "";
	const token = localStorage.getItem("token");

	const create = async () => {
		const axiosData = await useAxios({
			url: "http://localhost:3000/game/generateGame",
			method: "POST",
			axiosHeaders: {
				headers: {
					withAuthorization: true,
					Authorization: `token ${token}`,
				},
			},
		});
		console.log(axiosData?.response.data.randomId);
		dbId = axiosData?.response.data.randomId;
		console.log("dbId is ", dbId);
		navigate(`customGame/${dbId}`);
	};

	// 	(async () => {
	// 		try {
	// 			const axiosData = await useAxios({
	// 				url: "http://localhost:3000/game/generateGame",
	// 				method: "POST",
	// 				axiosHeaders: {
	// 					headers: {
	// 						withAuthorization: true,
	// 						Authorization: `token ${token}`,
	// 					},
	// 				},
	// 			});
	// 		} catch (e) {
	// 			console.log(e);
	// 		}
	// 	})();
	// }, [token]);

	const handleClick = () => {
		navigate("/game");
	};
	return (
		<div className="bg-black flex flex-col justify-center items-center h-screen w-screen">
			<div className="bg-white rounded-xl p-4">
				<button type="button" onClick={handleClick}>
					Play A Game
				</button>
			</div>
			<div className="flex flex-col justif-center items-center">
				<input
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						const target = e.target as HTMLInputElement;
						setGameId(target.value);
					}}
					type="text"
					className="p-4 m-3 h-5 rounded-xl bg-white "
				/>
				<button
					onClick={() => {
						navigate(`/customGame/${gameId}`);
					}}
					type="button"
					className="text-black p-2 rounded-xl bg-white "
				>
					Join Custom Game
				</button>

				<button
					onClick={create}
					type="button"
					className="text-black m-3 p-2 rounded-xl bg-white "
				>
					Create Custom Game
				</button>
			</div>
		</div>
	);
}

export default LandingPage;
