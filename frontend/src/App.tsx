import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
				toastStyle={{
					fontSize: '14px',
					borderRadius: '8px',
				}}
			/>
		</Router>
	);
}

export default App;
