// App.jsx
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MyContext, MyProvider } from './services/MyContext.jsx';
import CamposLogin from './components/users/common/CamposLogin';
import UserApp from './UserApp';
import AdminApp from './AdminApp';

function App() {

  const { user } = useContext(MyContext);

  return (
      <Routes>
        <Route path="/login" element={<CamposLogin />} />
        <Route path="/*" element={user?.role === 'admin' ? <AdminApp /> : <UserApp />} />
      </Routes>
  );
}

export default function MainApp() {
  return (
    <MyProvider>
      <App />
    </MyProvider>
  );
}
