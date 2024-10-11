import { useAtom } from 'jotai';
import { cartAtom } from '../Atoms/cartAtom.tsx';
import { papersAtom } from '../Atoms/papersAtom.tsx';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cart] = useAtom(cartAtom);
    const [papers] = useAtom(papersAtom);
    const navigate = useNavigate();

    const getPaperById = (id: number) => papers.find((paper) => paper.id === id);

    return (
        <div className="cart">
            <h1>Your Cart</h1>
            {Object.keys(cart).length === 0 ? (
                <p>No items in the cart.</p>
            ) : (
                <ul>
                    {Object.keys(cart).map((paperId) => {
                        const paper = getPaperById(Number(paperId));
                        return (
                            <li key={paperId}>
                                {paper?.name} - {cart[Number(paperId)]} x {paper?.price} kr
                            </li>
                        );
                    })}
                </ul>
            )}
            <button onClick={() => navigate('/')}>Back to Products</button>
        </div>
    );
};

export default Cart;
