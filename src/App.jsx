import { 
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import NavBar from "./Components/NavBar";
import Test from "./Components/Test";
import UserList from "./Components/Users/UserList";
import NewUserForm from "./Components/Users/NewUserForm";

function App() {
  return (
    <>
      <Router>
        <NavBar/>
        <Routes>
          <Route path="/" element={<></>}/>
          <Route path="/users" element={<UserList/>}/>
          <Route path="/new-user" element={<NewUserForm/>}/>
          <Route path="/edit-user/:id" element={<></>}/>
          <Route path="/test" element={<Test/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
