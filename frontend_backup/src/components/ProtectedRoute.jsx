import { Navigate } from 'react-router-dom';

// Placeholder Auth Check
// In a real app, use Firebase Auth state here
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = true; // Mocked for now to allow viewing Dashboard

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
