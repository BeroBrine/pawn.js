import type { User } from "./User";

class SocketManager {
	private static instance: SocketManager;
	private roomSocket = new Map<string, User[]>();
	private userRoomMapping = new Map<string, string>();

	static getInstance() {
		if (SocketManager.instance) return SocketManager.instance;
		SocketManager.instance = new SocketManager();
		return SocketManager.instance;
	}

	addUser(gameId: string, user: User) {
		this.roomSocket.set(gameId, [...(this.roomSocket.get(gameId) || []), user]);
		this.userRoomMapping.set(user.dbId, gameId);
		console.log("setting room id for ", user.dbId);
		console.log("total users in the room ");
		const userArr = this.roomSocket.get(gameId);
		if (!userArr) return;
		for (const user of userArr) {
			console.log(user.dbId);
		}
	}

	removeUser(gameId: string, user: User) {
		const roomId = this.userRoomMapping.get(user.dbId);
		console.log("roomId is ", roomId);
		if (!roomId) {
			console.log("the user was not interested in any rooms.");
			return;
		}
		const users = this.roomSocket.get(roomId) ?? [];
		const remainingUsers = users.filter((elem) => elem !== user);
		this.roomSocket.set(gameId, remainingUsers);
		if (this.roomSocket.get(gameId)?.length === 0) {
			this.roomSocket.delete(gameId);
		}
		this.userRoomMapping.delete(user.dbId);
	}
}

export const socketManager = SocketManager.getInstance();
