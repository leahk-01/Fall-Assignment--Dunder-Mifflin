import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './Components/Topbar.tsx'; 
import PaperList from './Components/PaperList.tsx';
import Cart from "./Components/Cart.tsx";
import Profile from "./Components/Profile.tsx";
import PaperDetail from "./Components/PaperDetail.tsx";
import Home from './Components/Home.tsx';
import AddProduct from './Components/Addproduct.tsx';
import History from "./Components/History.tsx";
import OrderHistory from "./Components/OrderHistory.tsx";

function App() {
    // @ts-ignore
    // @ts-ignore
    return (
        <Router>
            <Routes>
             
                <Route path="/" element={
                    <Layout>
                    <Home />
                </Layout>} />
                <Route path="/PaperList" element={<Layout>
                    <PaperList />
                </Layout>} />
                <Route path="/Cart" element={<Layout>
                    <Cart />
                </Layout>} />
                <Route path="/Profile" element={<Layout>
                    <Profile />
                </Layout>} />
                <Route path="/AddProduct" element={<Layout>
                    <AddProduct />
                </Layout>} />

                <Route path="/history/:customerId" element={<Layout>
                    <History />
                </Layout>} />

     
                <Route path="/paper/:paperId" element={<PaperDetail />} />

                <Route path="/All-orders" element={<Layout>
                    <OrderHistory />
                </Layout>} />
            </Routes>
        </Router>
    );
}

export default App;
