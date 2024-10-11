import { atom } from 'jotai';
import { Paper } from '../services/Api.ts';

export const cartAtom = atom<Record<number, number>>({}); 

export const addToCartAtom = atom(
    null,
    (get, set, paper: Paper) => {
        const currentCart = get(cartAtom);
       
        set(cartAtom, {
            ...currentCart,
            [paper.id!]: (currentCart[paper.id!] || 0) + 1,
        });
    }
);

