import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignUpPage from "./pages/signup";
import SignInPage from "./pages/signin";
import DashboardPage from "./pages/dashboard";


function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<SignUpPage />} />
				<Route path="/login" element={<SignInPage />} />
				<Route path="/dashboard" element={<DashboardPage />} />
				
			</Routes>
		</Router>
	);
}

export default App;
