import { atom } from 'jotai';
import {Customer} from "../services/Api.ts";

export const customerAtom = atom<Customer | null>(null);

