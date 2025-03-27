import { useEffect } from "react";
import "./App.css";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

function App() {
  useEffect(() => {
    // Añadir clase para activar animaciones cuando la página está cargada
    document.body.classList.add("loaded");

    // Solo hacemos scroll to top inicial una vez
    window.scrollTo(0, 0);

    // Prevenir scroll en body en desktop
    const handleResize = () => {
      if (window.innerWidth > 768) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
        // Eliminamos el scrollTo que causaba el comportamiento errático
      }
    };

    // Inicializa
    handleResize();

    // Escucha cambios de tamaño
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app-container">
      <div className="left-panel-container">
        <LeftPanel />
      </div>

      <div className="right-panel-container">
        <RightPanel />
      </div>
    </div>
  );
}

export default App;
