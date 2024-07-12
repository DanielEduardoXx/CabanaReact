// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { MyContext, MyProvider } from './services/MyContext.jsx';
import CamposLogin from './components/users/common/CamposLogin';
import UserApp from './UserApp';
import AdminApp from './AdminApp';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <MyProvider value={{ user, setUser }}>
      <Routes>
        <Route path="/login" element={<CamposLogin />} />
        <Route path="/*" element={user?.role === 'admin' ? <AdminApp /> : <UserApp />} />
      </Routes>
    </MyProvider>
  );
}

export default function MainApp() {
  return (
    <MyProvider>
      <App />
    </MyProvider>
  );
}
