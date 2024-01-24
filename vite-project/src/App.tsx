// import React from "react";
// import "./App.css";
// import Navigation from "./components/partials/Navigation";
// import Home from "./pages/Home";
// import Login from "./components/Auth/Login";
// import Register from "./components/Auth/Register";

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { AuthProvider } from "./hooks/useAuth";
// import useAuth from "./hooks/useAuth2";

// import CreateGame from "./pages/Game/CreateGame/CreateGame";
// import MyGames from "./pages/Game/MyGames/MyGames";
// import JoinGame from "./pages/Game/JoinGame/JoinGame";
// import Partie from "./pages/Game/Partie/Partie";

// function AuthenticatedRoute({ path, element }: { path: string; element: React.ReactNode }) {
//   const { token, user } = useAuth();

//   if (!token || !user) return <Navigate to="/login" replace />;

//   return <Route path={path} element={element} />;
// }

// const App = () => {
//   return (
//     <Router>
//       <AuthProvider>
//         <Navigation />
//         <div className="App">
//           <Routes>
//             <Route path="/register" element={<Register />} />
//             <Route path="/login" element={<Login />} />
//             <AuthenticatedRoute path="/create-game" element={<CreateGame />} />
//             <AuthenticatedRoute path="/my-games" element={<MyGames />} />
//             <AuthenticatedRoute path="/join-game/:code" element={<JoinGame />} />
//             <AuthenticatedRoute path="/partie" element={<Partie />} />
//             <Route path="/" element={<Home />} />
//           </Routes>
//         </div>
//       </AuthProvider>
//     </Router>
//   );
// };

// export default App;

// import React from "react";
import "./App.css";
import Navigation from "./components/partials/Navigation";
import Home from "./pages/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
} from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
// import useAuth from "./hooks/useAuth2";

import CreateGame from "./pages/Game/CreateGame/CreateGame";
import AllGames from "./pages/Game/AllGames/AllGames";
import JoinGame from "./pages/Game/JoinGame/JoinGame";
import Partie from "./pages/Game/Partie/Partie";
import { QueryClient, QueryClientProvider } from 'react-query';
import MyGames from "./pages/Game/MyGames/MyGames";


const queryClient = new QueryClient();
// function AuthenticatedRoute({ path, element }: { path: string; element: React.ReactNode }) {


//   if (!token || !user) return <Navigate to="/login" replace />;

//   return <Route path={path} element={element} />;
// }



const App = () => {
  // const { token, user } = useAuth();
  return (
    <Router>
      <AuthProvider>
        <Navigation />
        <div className="App">
          <Routes>
            <Route path="/register" element={<QueryClientProvider client={queryClient}><Register /></QueryClientProvider>} />
            <Route path="/login" element={<QueryClientProvider client={queryClient}><Login /></QueryClientProvider>} />

            <Route path="/create-game" element={<QueryClientProvider client={queryClient}><CreateGame /></QueryClientProvider>} />

            <Route path="/all-games" element={<QueryClientProvider client={queryClient}><AllGames /></QueryClientProvider>} />

            <Route path="/my-games" element={<QueryClientProvider client={queryClient}><MyGames /></QueryClientProvider>} />

            <Route path="/join-game/:code" element={<QueryClientProvider client={queryClient}><JoinGame /></QueryClientProvider>} />

            <Route path="/partie" element={<QueryClientProvider client={queryClient}><Partie /></QueryClientProvider>} />
            <Route path="/" element={<QueryClientProvider client={queryClient}><Home /></QueryClientProvider>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
