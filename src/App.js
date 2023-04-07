import { Provider } from "react-redux";
import store from './redux/store'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from "./pages/homePage";
import Login from "./pages/login";
 
function App() {
  return (
     <Provider store={store}>
      <div className="App">
       
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </Router>
         
      </div>
    </Provider>
   );
}

export default App;
