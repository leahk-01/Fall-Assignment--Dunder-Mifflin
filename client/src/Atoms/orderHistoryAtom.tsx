import {atom} from "jotai/index";
import {Order} from "../services/Api.ts";

export const orderHistoryAtom = atom<Order[]>([]);