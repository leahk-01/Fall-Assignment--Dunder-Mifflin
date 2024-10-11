import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import PaperList from "./Components/PaperList.tsx";
import Layout from './Components/Topbar.tsx';
import Home from './Components/Home.tsx';
import Cart from "./Components/Cart.tsx";
import Login from "./Components/Login.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                        <Layout>
                            <Home />
                        </Layout>
                    }
                />
                <Route path="/PaperList" element={
                        <Layout>
                            <PaperList />
                        </Layout>
                    }
                />
                <Route path="/Cart" element={
                    <Layout>
                        <Cart />
                    </Layout>
                  }
                />       
                <Route path="/PaperDetail" element={
                    <Layout>
                        <Login />
                    </Layout>  
                }/>
            </Routes>
        </Router>
    );
}



export default App
