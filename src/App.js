import React, { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import Poblacion from './views/poblacion';
import Tics from './views/tics';
import Home from './views/home';
import Migracion from './views/migracion';
import Idiomas2 from './views/idiomas2';
import Discapacidades from './views/discapacidades';
import Discapacidades1 from './views/discapacidades1';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Cambiar el modo nocturno
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Efecto para cargar la preferencia de modo nocturno al iniciar la aplicación
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Actualizar el localStorage cuando el tema cambie
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'poblacion':
        return <Poblacion />;
      case 'tics':
        return <Tics />;
      case 'migracion':
        return <Migracion />;
      case 'idiomas2':
        return <Idiomas2 />;
      case 'discapacidades':
        return <Discapacidades />;
      case 'discapacidades1':
        return <Discapacidades1 />;
      default:
        return <h1>Ninguna Vista Cargada</h1>;
    }
  };

  return (
    <div>
      <Navbar
        setCurrentView={setCurrentView}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      {renderView()}
    </div>
  );
}

export default App;
