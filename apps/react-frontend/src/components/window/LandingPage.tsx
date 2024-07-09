import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";

function LandingPage() {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	useEffect(() => {
		(async () => {
			try {
				const axiosData = await useAxios({
					url: "http://localhost:3000/auth/loggedIn",
					method: "POST",
					axiosHeaders: {
						headers: {
							withAuthorization: true,
							Authorization: `token ${token}`,
						},
					},
				});
			} catch (e) {
				alert("please login");
				navigate("/login");
			}
		})();
	}, [navigate, token]);
	const handleClick = () => {
		navigate("/game");
	};
	return (
		<div className="bg-black flex justify-center items-center h-screen w-screen">
			<div className="bg-white rounded-xl p-4">
				<button type="button" onClick={handleClick}>
					Play A Game
				</button>
			</div>
		</div>
	);
}

export default LandingPage;
