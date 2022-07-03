import { BrowserRouter, Routes, Route } from "react-router-dom"
import BuyPage from "./components/BuyPage"
import ForgotPasswordPage from "./components/ForgotPasswordPage"
import Layout from "./components/Layout"
import ResetPasswordPage from "./components/ResetPasswordPage"
import { GlobalContextWrapper } from "./context/GlobalContext"
import AccountPage from "./pages/AccountPage"

import DashboardPage from "./pages/DashboardPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import TermsConditionsPage from "./pages/TermsConditionsPage"


const App = () => {
	return (
		<BrowserRouter>
			<GlobalContextWrapper>
				<Layout>
					<Routes>
						<Route path="/" element={<DashboardPage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/forgot-password" element={<ForgotPasswordPage />} />
						<Route path="/reset-password" element={<ResetPasswordPage />} />
						<Route path="/account" element={<AccountPage />} />
						<Route path="/buy" element={<BuyPage />} />
						<Route path="/terms" element={<TermsConditionsPage />} />
					</Routes>
				</Layout>
			</GlobalContextWrapper>
		</BrowserRouter>
	)
}

export default App
