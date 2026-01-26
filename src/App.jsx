import { 
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import NavBar from "./Components/NavBar";
import Test from "./Components/Test";
import UserList from "./Components/Users/UserList";
import NewUserForm from "./Components/Users/NewUserForm";
import EditUserForm from "./Components/Users/EditUserForm";
import DynamicForm from "./Components/Users/DynamicForm";

function App() {
  return (
    <>
      <Router>
        <NavBar/>
        <main className="pt-20 max-w-7xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<></>}/>
            <Route path="/users" element={<UserList/>}/>
            <Route path="/new-user" element={<NewUserForm/>}/>
            <Route path="/edit-user/:id" element={<EditUserForm/>}/>
            <Route path="/test" element={<Test/>}/>
           
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
