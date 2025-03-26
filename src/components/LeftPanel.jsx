import { useEffect, useState, useRef } from "react";
import daisyLogo from "../assets/daisy-logo2.png";

export default function LeftPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showContactForm, setShowContactForm] = useState(false);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const emailInputRef = useRef(null);

  useEffect(() => {
    // Activar animaciones después de cargar
    setIsVisible(true);

    // Detectar si es móvil para ajustes de estilo
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Efecto para enfocar el input de email cuando se muestra el formulario
  useEffect(() => {
    if (showContactForm && emailInputRef.current) {
      // Darle más tiempo a la transición celestial para desarrollarse
      const timer = setTimeout(() => {
        emailInputRef.current.focus();

        // Añadir una clase para la animación específica del input
        const formContainer = document.querySelector(".contact-form-container");
        if (formContainer) {
          formContainer.classList.add("visible");
        }
      }, 3000); // Más tiempo para apreciar la transición

      return () => clearTimeout(timer);
    }
  }, [showContactForm]);

  const handleContactClick = () => {
    setShowContactForm(true);
    document.body.style.overflow = "hidden"; // Prevenir scroll

    // Forzar al scroll del panel derecho a estar oculto durante la transición
    const rightPanel = document.querySelector(".right-panel-container");
    if (rightPanel) {
      rightPanel.style.visibility = "hidden";
      rightPanel.style.opacity = "0";
      rightPanel.style.transition = "visibility 0.8s, opacity 0.8s";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSending(true);

    // Efectos visuales durante el envío
    const formContainer = document.querySelector(".contact-form-container");
    if (formContainer) {
      formContainer.style.boxShadow = "0 0 100px rgba(245, 197, 24, 0.8)";
      formContainer.style.transition = "box-shadow 1s ease";
    }

    // Enviar el correo a la URL de notificación especificada con modo no-cors
    const notificationUrl = `https://noti.n0.nu/noti?app=Daisy&noti=Some1+solicited+contact:+${encodeURIComponent(
      email
    )}`;

    // Usar el modo 'no-cors' para evitar el error de CORS
    fetch(notificationUrl, {
      mode: "no-cors",
      method: "GET",
      cache: "no-cache",
    })
      .then(() => {
        // Al usar no-cors, no podemos leer la respuesta, pero suponemos que se envió correctamente
        console.log(
          "Notificación enviada (no se puede confirmar debido a no-cors)"
        );

        // Continuar con los efectos visuales de éxito
        if (formContainer) {
          formContainer.style.boxShadow = "0 0 150px rgba(46, 139, 139, 0.9)";
          formContainer.style.backgroundColor = "rgba(255, 255, 255, 0.97)";
          formContainer.style.transition = "all 0.5s ease";

          const emailInput = formContainer.querySelector("input");
          if (emailInput) {
            emailInput.style.borderColor = "#2e8b8b";
            emailInput.style.animation = "none";
            emailInput.value = "";
          }
        }

        // Mensaje de éxito
        const formTitle = document.querySelector(".contact-form-container h2");
        if (formTitle) {
          formTitle.textContent = "Message Sent!";
          formTitle.style.background =
            "linear-gradient(135deg, #2e8b8b 0%, #43b0b0 100%)";
          formTitle.style.webkitBackgroundClip = "text";
          formTitle.style.webkitTextFillColor = "transparent";
        }

        // Iniciar transición de salida
        setTimeout(() => {
          // Animación de salida celestial
          const heavenlyGlow = document.querySelector(".heavenly-glow");
          const lightRays = document.querySelector(".light-rays");

          if (heavenlyGlow) {
            heavenlyGlow.style.opacity = "1";
            heavenlyGlow.style.transform = "scale(2.5)";
            heavenlyGlow.style.transition =
              "opacity 1s ease-in, transform 1s ease-in";
          }

          if (lightRays) {
            lightRays.style.opacity = "1";
            lightRays.style.transform =
              "translate(-50%, -50%) rotate(180deg) scale(1.5)";
            lightRays.style.transition =
              "opacity 1s ease-in, transform 2s ease-in";
          }

          // Desplazar y desvanecer el formulario
          if (formContainer) {
            formContainer.style.transform = "translateY(-80px) scale(0.9)";
            formContainer.style.opacity = "0";
            formContainer.style.transition =
              "transform 1s ease-in, opacity 1s ease-in";
          }

          // Esperar un momento y luego cerrar el formulario completamente
          setTimeout(() => {
            setEmail("");
            setIsSending(false);
            closeContactForm();

            // Restaurar los estilos originales después de cerrar
            setTimeout(() => {
              if (heavenlyGlow) {
                heavenlyGlow.style = "";
              }
              if (lightRays) {
                lightRays.style = "";
              }
              if (formContainer) {
                formContainer.style = "";
              }
              if (formTitle) {
                formTitle.textContent = "Get in Touch";
                formTitle.style = "";
              }
            }, 500);
          }, 1000);
        }, 1200);
      })
      .catch((error) => {
        // Manejar errores que no sean CORS (que deberían ser pocos con modo no-cors)
        console.error("Error al enviar notificación:", error);

        // Como alternativa, hacer una petición de imagen como fallback
        // Este método evita limitaciones CORS para cargar recursos
        if (!document.getElementById("notification-pixel")) {
          const pixel = document.createElement("img");
          pixel.id = "notification-pixel";
          pixel.src = notificationUrl;
          pixel.style.display = "none";
          document.body.appendChild(pixel);

          // Simular una respuesta exitosa después de intentar cargar la imagen
          setTimeout(() => {
            // Continuar con el flujo de éxito
            if (formContainer) {
              formContainer.style.boxShadow =
                "0 0 150px rgba(46, 139, 139, 0.9)";
              formContainer.style.backgroundColor = "rgba(255, 255, 255, 0.97)";
              formContainer.style.transition = "all 0.5s ease";

              const emailInput = formContainer.querySelector("input");
              if (emailInput) {
                emailInput.style.borderColor = "#2e8b8b";
                emailInput.style.animation = "none";
                emailInput.value = "";
              }
            }

            // Mensaje de éxito
            const formTitle = document.querySelector(
              ".contact-form-container h2"
            );
            if (formTitle) {
              formTitle.textContent = "Message Sent!";
              formTitle.style.background =
                "linear-gradient(135deg, #2e8b8b 0%, #43b0b0 100%)";
              formTitle.style.webkitBackgroundClip = "text";
              formTitle.style.webkitTextFillColor = "transparent";
            }

            // Iniciar transición de salida
            setTimeout(() => {
              // Animación de salida celestial
              const heavenlyGlow = document.querySelector(".heavenly-glow");
              const lightRays = document.querySelector(".light-rays");

              if (heavenlyGlow) {
                heavenlyGlow.style.opacity = "1";
                heavenlyGlow.style.transform = "scale(2.5)";
                heavenlyGlow.style.transition =
                  "opacity 1s ease-in, transform 1s ease-in";
              }

              if (lightRays) {
                lightRays.style.opacity = "1";
                lightRays.style.transform =
                  "translate(-50%, -50%) rotate(180deg) scale(1.5)";
                lightRays.style.transition =
                  "opacity 1s ease-in, transform 2s ease-in";
              }

              // Desplazar y desvanecer el formulario
              if (formContainer) {
                formContainer.style.transform = "translateY(-80px) scale(0.9)";
                formContainer.style.opacity = "0";
                formContainer.style.transition =
                  "transform 1s ease-in, opacity 1s ease-in";
              }

              // Esperar un momento y luego cerrar el formulario completamente
              setTimeout(() => {
                setEmail("");
                setIsSending(false);
                closeContactForm();

                // Restaurar los estilos originales después de cerrar
                setTimeout(() => {
                  if (heavenlyGlow) {
                    heavenlyGlow.style = "";
                  }
                  if (lightRays) {
                    lightRays.style = "";
                  }
                  if (formContainer) {
                    formContainer.style = "";
                  }
                  if (formTitle) {
                    formTitle.textContent = "Get in Touch";
                    formTitle.style = "";
                  }
                }, 500);
              }, 1000);
            }, 1200);
          }, 1500);
        }
      });
  };

  const handleClose = () => {
    closeContactForm();
  };

  const closeContactForm = () => {
    // Quitar la clase de animación del input antes de cerrar
    const formContainer = document.querySelector(".contact-form-container");
    if (formContainer) {
      formContainer.classList.remove("visible");
    }

    setShowContactForm(false);

    // Restaurar la visibilidad del panel derecho después de la transición
    setTimeout(() => {
      const rightPanel = document.querySelector(".right-panel-container");
      if (rightPanel) {
        rightPanel.style.visibility = "visible";
        rightPanel.style.opacity = "1";
        rightPanel.style.transition = "visibility 0.8s, opacity 0.8s";
      }

      // Restaurar scroll después de un tiempo para la transición
      setTimeout(() => {
        document.body.style.overflow = "";
      }, 300);
    }, 800);
  };

  return (
    <>
      <div className="left-panel">
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            maxWidth: "320px",
            marginRight: isMobile ? "0" : "2rem",
          }}
        >
          <img
            src={daisyLogo}
            alt="Daisy Logo"
            className={`fade-in ${isVisible ? "visible" : ""}`}
            style={{
              width: isMobile ? "180px" : "200px",
              marginBottom: "-10px",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
            }}
          />
          <h1
            className={`fade-in delay-1 ${isVisible ? "visible" : ""}`}
            style={{
              fontSize: isMobile ? "3.5rem" : "4rem",
              color: "#2e8b8b",
              fontWeight: 700,
              marginBottom: "1rem",
              background: "linear-gradient(135deg, #2e8b8b 0%, #43b0b0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Daisy
          </h1>

          <p
            className={`fade-in delay-2 ${isVisible ? "visible" : ""}`}
            style={{
              margin: "1rem 0",
              maxWidth: "300px",
              lineHeight: "1.6",
              fontSize: "1.1rem",
              padding: isMobile ? "0 1rem" : "0",
            }}
          >
            An intuitive ERP experience that helps your business flourish.
          </p>
          <button
            className={`btn-hover fade-in delay-3 ${
              isVisible ? "visible" : ""
            }`}
            style={{
              padding: "0.8rem 1.8rem",
              backgroundColor: "#f5c518",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1.1rem",
              marginTop: "0.8rem",
              boxShadow: "0 4px 8px rgba(245, 197, 24, 0.2)",
            }}
            onClick={handleContactClick}
          >
            Contact
          </button>
        </div>
      </div>

      {/* Overlay para el formulario de contacto con efectos mejorados */}
      <div className={`contact-overlay ${showContactForm ? "visible" : ""}`}>
        {/* Efecto de brillo celestial */}
        <div className="heavenly-glow"></div>

        {/* Nuevo efecto de rayos de luz */}
        <div className="light-rays"></div>

        <div className="contact-form-container">
          <h2>Get in Touch</h2>
          <form onSubmit={handleSubmit}>
            <input
              ref={emailInputRef}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSending}
              className="email-input" // Añadida clase para estilos específicos
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={isSending}
                style={{
                  backgroundColor: "#e0e0e0",
                  color: "#333",
                  opacity: isSending ? "0.5" : "1",
                  cursor: isSending ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <div
                className={`sending-animation ${isSending ? "visible" : ""}`}
              >
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <button
                type="submit"
                disabled={isSending}
                style={{
                  opacity: isSending ? "0.7" : "1",
                  cursor: isSending ? "not-allowed" : "pointer",
                }}
              >
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
