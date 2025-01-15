import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import PlayerStats from "./pages/PlayerStats";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<Home />} />
      <Route path="player/:username" element={<PlayerStats />} /> {/* Dynamic route */}
    </Route>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
