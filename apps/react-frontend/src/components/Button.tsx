const Button = ({
	handleClick,
	children,
}: {
	handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	children: React.ReactNode;
}) => {
	return (
		<div>
			<button
				onClick={handleClick}
				type="button"
				className="rounded-xl text-xl bg-black p-5 text-white font-bold"
			>
				{children}
			</button>
		</div>
	);
};

export default Button;
