import { BrowserRouter, Routes, Route } from "react-router-dom"
import BuyPage from "./components/BuyPage"
import Layout from "./components/Layout"
import { GlobalContextWrapper } from "./context/GlobalContext"
import AccountPage from "./pages/AccountPage"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import TransactionsPage from "./pages/TransactionsPage"


const App = () => {
	return (
		<BrowserRouter>
			<GlobalContextWrapper>
				<Layout>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/account" element={<AccountPage />} />
						<Route path="/buy" element={<BuyPage />} />
						<Route path="/transactions" element={<TransactionsPage />} />
					</Routes>
				</Layout>
			</GlobalContextWrapper>
		</BrowserRouter>
	)
}

export default App
