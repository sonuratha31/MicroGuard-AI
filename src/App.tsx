import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AssessmentProvider } from "./context/AssessmentContext";
import Assessment from "./pages/Assessment";
import Dashboard from "./pages/Dashboard";
import Explorer from "./pages/Explorer";
import Home from "./pages/Home";
import PollutionMap from "./pages/PollutionMap";
import Research from "./pages/Research";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AssessmentProvider>
        <div className="app">
          <Navbar />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/research" element={<Research />} />
              <Route path="/map" element={<PollutionMap />} />
              <Route path="/360view" element={<PollutionMap />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AssessmentProvider>
    </BrowserRouter>
  );
}

export default App;