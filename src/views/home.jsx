import React from 'react';
import censoImage from '../images/censo.jpg';  // Asegúrate de que la ruta sea correcta

function Home() {
  return (
    <div className="container mx-auto p-8 text-center bg-gradient-to-r from-green-400 via-green-600 to-green-800 rounded-lg shadow-2xl transform transition duration-500 hover:scale-105">
      {/* Sección de bienvenida */}
      <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
        ¡Bienvenidos a la plataforma de análisis del Censo 2024!
      </h1>
      <p className="text-xl text-gray-100 mb-6 px-4 md:px-16">
        En este proyecto realizamos un análisis exhaustivo sobre los datos recopilados
        en el censo de El Salvador durante el presente año 2024. A través de diferentes
        visualizaciones y análisis, ofrecemos una perspectiva detallada sobre la población,
        la tecnología y los movimientos migratorios del país.
      </p>
      
      {/* Introducción al proyecto */}
      <p className="text-lg text-gray-200 mb-8 px-4 md:px-16">
        A lo largo de esta plataforma, exploraremos estadísticas clave, insights sobre las
        Tecnologías de la Información y Comunicación (TICS), y otros aspectos importantes
        que ayudan a entender el contexto actual de El Salvador. Este análisis tiene como
        objetivo ofrecer una visión clara para la toma de decisiones en políticas públicas
        y otros sectores.
      </p>
      
      {/* Sección de imágenes o gráficos */}
      <div className="mt-8">
        {/* Imagen importada y mostrada */}
        <img
          src={censoImage}  // Usa la imagen importada
          alt="Censo 2024"
          className="rounded-xl shadow-lg mx-auto max-w-2xl" // Limita el ancho máximo de la imagen
        />
      </div>
    </div>
  );
}

export default Home;
