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
import MyGames from "./pages/Game/MyGames/MyGames";
import JoinGame from "./pages/Game/JoinGame/JoinGame";
import Partie from "./pages/Game/Partie/Partie";

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
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route path="/create-game" element={<CreateGame />} />

            <Route path="/my-games" element={<MyGames />} />

            <Route path="/join-game/:code" element={<JoinGame />} />

            <Route path="/partie" element={<Partie />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
