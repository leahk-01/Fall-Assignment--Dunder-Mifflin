import { atom } from 'jotai';
import {Paper} from "../services/Api.ts";

export const papersAtom = atom<Paper[]>([]);

