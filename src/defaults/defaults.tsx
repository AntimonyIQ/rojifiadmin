import Handshake from "@/hash/handshake";
import { session, SessionData } from "@/session/session";

export default class Defaults {

    public static readonly API_BASE_URL = "http://localhost:9009/api/v1"; // "https://api.rojifi.com/api/v1"; // 

    public static readonly HEADERS = {
        "Accept": "*/*",
        "Content-Type": "application/json",
        'x-rojifi-client': 'web.rojifi.com',
        'x-rojifi-version': '0.1.0',
        'x-rojifi-location': 'Unknown',
    };

    public static PARSE_DATA = (data: string, key: string, handshake: string) => {
        const secret: string = Handshake.secret(key, handshake);
        const decryptedData: string = Handshake.decrypt(data, secret);
        const dataObject = JSON.parse(decryptedData);
        return dataObject;
    };

    public static LOGIN_STATUS = () => {
        const sd: SessionData = session.getUserData();
        if (!sd || !sd.isLoggedIn || !sd.user) {
            return false;
        }

        // Skip loginLastAt check if it doesn't exist (might be a new session format)
        if (!sd.user.loginLastAt) {
            return true; // Assume valid if no timestamp
        }

        const loginLastAt: Date = new Date(sd.user.loginLastAt);
        const now: Date = new Date();
        const diffMinutes: number = Math.floor((now.getTime() - loginLastAt.getTime()) / 1000 / 60);
        console.log("diff: ", diffMinutes);

        if (diffMinutes >= 60) {
            session.updateSession({ ...sd, isLoggedIn: false });
            return false; // Let ProtectedRoute handle redirects
        }

        return true;
    };
}