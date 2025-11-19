import axios from "@/helpers/instance";
import { IMe } from "@/types/account/account/account.type";

export const meApi = () => axios.post<IMe>("/user/me", {});
