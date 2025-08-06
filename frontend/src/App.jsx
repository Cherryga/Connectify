import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import Home from "./pages/home";
import Login from "./pages/Login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import ErrorPage from "./pages/ErrorPage";

// Components
import Navbar from './components/Navbar';
import Leftbar from './components/Leftbar';
import Rightbar from './components/Rightbar';
import Chatbot from './components/Chatbot';
import ChatSystem from './components/ChatSystem';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

const queryClient = new QueryClient();

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <Navbar />
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 2 }}>
              <Leftbar />
            </div>
            <div style={{ flex: 6 }}>
              <Outlet />
            </div>
            <div style={{ flex: 2 }}>
              <Rightbar />
            </div>
          </div>
          <Chatbot />
          <ChatSystem />
        </div>
      </QueryClientProvider>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="profile/:id" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;