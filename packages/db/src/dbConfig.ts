import "dotenv/config.js";
import fs from "node:fs";

const connection = {
	user: "avnadmin",
	password: "AVNS_smxDbBtKUBEygUN7Yx6",
	host: "pg-2671a67f-abhishekrana8818-3277.b.aivencloud.com",
	port: 23371,
	database: "website_db",
	ssl: {
		rejectUnauthorized: true,
		ca: fs.readFileSync("./ca.pem").toString(),
	},
};

export default connection;
