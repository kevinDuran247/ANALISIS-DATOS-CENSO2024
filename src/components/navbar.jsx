import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; // Importando íconos para el modo claro y nocturno
import logo from '../images/pandas.webp'; // Asegúrate de que la ruta sea correcta
import { Dropdown } from 'react-bootstrap'; // Importando el componente Dropdown de react-bootstrap

function Navbar({ setCurrentView, toggleDarkMode, isDarkMode }) {
  return (
    <nav className={`bg-green-600 dark:bg-green-800 p-4 shadow-md transition-all`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo y título pegado al lado izquierdo */}
        <div className="flex items-center space-x-2">
     
          <div className="text-white text-2xl font-bold">
          CENSO Analysis
          </div>
        </div>

        {/* Enlaces de navegación */}
        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentView('home')}
            className="text-white hover:bg-green-500 hover:text-black dark:hover:bg-green-700 dark:hover:text-white px-4 py-2 rounded-md transition-all">
            Inicio
          </button>
          <button
            onClick={() => setCurrentView('poblacion')}
            className="text-white hover:bg-green-500 hover:text-black dark:hover:bg-green-700 dark:hover:text-white px-4 py-2 rounded-md transition-all">
            Población
          </button>
          <button
            onClick={() => setCurrentView('tics')}
            className="text-white hover:bg-green-500 hover:text-black dark:hover:bg-green-700 dark:hover:text-white px-4 py-2 rounded-md transition-all">
            TICS
          </button>
          <button
            onClick={() => setCurrentView('migracion')}
            className="text-white hover:bg-green-500 hover:text-black dark:hover:bg-green-700 dark:hover:text-white px-4 py-2 rounded-md transition-all">
            Migración
          </button>
          <button
            onClick={() => setCurrentView('idiomas2')}
            className="text-white hover:bg-green-500 hover:text-black dark:hover:bg-green-700 dark:hover:text-white px-4 py-2 rounded-md transition-all">
            Idiomas
          </button>

          {/* Dropdown para Discapacidades */}
          <Dropdown>
            <Dropdown.Toggle 
              variant="success"  // Usamos el estilo success para que sea similar al color de los otros botones
              className="text-white hover:bg-green-500 hover:text-black dark:hover:bg-green-700 dark:hover:text-white px-4 py-2 rounded-md transition-all"
            >
              Discapacidades
            </Dropdown.Toggle>
            <Dropdown.Menu className="bg-green-600 dark:bg-green-800">
              <Dropdown.Item 
                onClick={() => setCurrentView('discapacidades')}
                className="text-dark hover:bg-green-500 dark:hover:bg-green-700">
                Tipos
              </Dropdown.Item>
              <Dropdown.Item 
                onClick={() => setCurrentView('discapacidades1')}
                className="text-dark hover:bg-green-500 dark:hover:bg-green-700">
                Población Disc.
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Botón de modo nocturno */}
        <button
          onClick={toggleDarkMode}
          className="ml-4 text-white hover:text-black dark:text-white px-4 py-2 bg-gray-800 dark:bg-green-800 rounded-md hover:bg-white dark:hover:bg-green-700 transition-all">
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
