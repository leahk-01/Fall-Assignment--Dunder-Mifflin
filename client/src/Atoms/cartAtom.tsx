import { atom } from 'jotai';
import { PaperDto} from '../services/Api.ts';

interface CartItem {
    paper: PaperDto;
    quantity: number;
    pricePerItem: number;  
    totalPrice: number;
}
export const cartAtom = atom<CartItem[]>([]);

export const addToCartAtom = atom(
    (get) => get(cartAtom),  
    (get, set, { paper, quantity }: { paper: PaperDto, quantity: number }) => {
        const currentCart = get(cartAtom);

        // Check fo rsame id AND unique properties 
        const existingItem = currentCart.find(item =>
            item.paper.id === paper.id && JSON.stringify(item.paper) === JSON.stringify(paper)
        );

        if (existingItem) {
            
            const updatedCart = currentCart.map(item =>
                item.paper.id === paper.id && JSON.stringify(item.paper) === JSON.stringify(paper)
                    ? { ...item, quantity: item.quantity + quantity, totalPrice: (item.quantity + quantity) * item.pricePerItem }
                    : item
            );
            set(cartAtom, updatedCart);  
        } else {
            //  add  as a new item
            const newCartItem = {
                paper,
                quantity,
                pricePerItem: paper.price!,  
                totalPrice: paper.price! * quantity  
            };
            set(cartAtom, [...currentCart, newCartItem]);  
        }
    }
);


export const removeFromCartAtom = atom(
    (get) => get(cartAtom),
    (get, set, { paper, quantityToRemove }: { paper: PaperDto, quantityToRemove: number }) => {  
        const currentCart = get(cartAtom);

        //  the exact product to remove based on id and paper object
        const updatedCart = currentCart.map(item => {
            if (item.paper.id === paper.id && JSON.stringify(item.paper) === JSON.stringify(paper)) {
                if (item.quantity <= quantityToRemove) {
                    return null; 
                }
                
                return {
                    ...item,
                    quantity: item.quantity - quantityToRemove,
                    totalPrice: (item.quantity - quantityToRemove) * item.pricePerItem
                };
            }
            return item;  
        }).filter(item => item !== null); 

        set(cartAtom, updatedCart);  
    }
);
