export const generateHash = async (
	password: string,
	providedSalt?: Uint8Array,
): Promise<string> => {
	const encoder = new TextEncoder();

	const salt = providedSalt ?? crypto.getRandomValues(new Uint8Array(16));

	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		encoder.encode(password),
		{ name: "PBKDF2" },
		false,
		["deriveKey", "deriveBits"],
	);

	const key = await crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt: salt,
			iterations: 1000,
			hash: "SHA-256",
		},
		keyMaterial,
		{ name: "AES-GCM", length: 256 },
		true,
		["encrypt", "decrypt"],
	);

	const importKey = (await crypto.subtle.exportKey("raw", key)) as ArrayBuffer;
	const hexBuffer = new Uint8Array(importKey);
	const hexHash = Array.from(hexBuffer)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	const saltHex = Array.from(salt)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
	return `${saltHex}:${hexHash}`;
};

export const verifyPassword = async (
	providedHex: string,
	password: string,
): Promise<boolean> => {
	const [saltHex, originalHex] = providedHex.split(":");
	const matchedPat = saltHex?.match(/.{1,2}/g);
	if (!matchedPat) throw new Error("invalid salt hex");
	const salt = new Uint8Array(matchedPat.map((b) => Number.parseInt(b, 16)));
	const matchedHexWithSalt = await generateHash(password, salt);
	const [, matchHex] = matchedHexWithSalt.split(":");
	return matchHex === originalHex;
};
