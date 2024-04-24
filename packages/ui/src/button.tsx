import { ReactNode } from "react";

interface ButtonProps {
	children: ReactNode;
	className?: string;
}

export const RepoButton = ({ children, className }: ButtonProps) => {
	return (
		<button
			className={className}
			onClick={() => alert(`Hello from your  app!`)}
		>
			{children}
		</button>
	);
};
