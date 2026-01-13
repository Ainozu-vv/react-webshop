import { 
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import NavBar from "./Components/NavBar";
import Test from "./Components/Test";

function App() {
  return (
    <>
      <Router>
        <NavBar/>
        <Routes>
          <Route path="/" element={<></>}/>
          <Route path="/users" element={<></>}/>
          <Route path="/new-user" element={<></>}/>
          <Route path="/edit-user/:id" element={<></>}/>
          <Route path="/test" element={<Test/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
