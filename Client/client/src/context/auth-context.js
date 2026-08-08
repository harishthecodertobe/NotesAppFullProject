import { createContext } from "react";

// Kept in its own file (not a .jsx component file) so react-refresh
// can fast-refresh AuthProvider and hooks/useAuth.js without warnings.
export const AuthContext = createContext(null);
