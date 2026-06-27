import { BrowserRouter, Routes, Route } from "react-router-dom";
import  MainLayout from "./components/layouts/MainLayouts";
import Recommendation from "./pages/Recommendation";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>
          <Route path="/"element={<Home />}/>
          <Route path="/rekomendasi"element={<Recommendation />}/>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;