import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from '../routes/Login';
import SignIn from '../routes/SignIn';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {
            <Route path="/" element={<Login />} />
          }
          {
            <Route path="/sign" element={<SignIn />} />
          }
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
