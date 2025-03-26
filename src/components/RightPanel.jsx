import { useEffect, useState, useRef } from "react";

const slides = [
  {
    title: "Boosts Carousel",
    description:
      "Visually separate original posts and re-shared posts (boosted posts).",
    imageUrl: "https://picsum.photos/seed/boosts/800/800",
  },
  {
    title: "Timeline Design",
    description:
      "Clean, chronological display of activity with a modern aesthetic.",
    imageUrl: "https://picsum.photos/seed/timeline/800/800",
  },
  {
    title: "Built for Focus",
    description:
      "Everything you need, nothing you don't. Focus on the content.",
    imageUrl: "https://picsum.photos/seed/focus/800/800",
  },
];

export default function RightPanel() {
  const [visibleCards, setVisibleCards] = useState({});
  const observers = useRef([]);
  const cardRefs = useRef([]);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Configurar observadores para detección de scroll
    cardRefs.current = cardRefs.current.slice(0, slides.length);

    // Limpia observadores anteriores
    observers.current.forEach((obs) => obs && obs.disconnect());
    observers.current = [];

    // Configura nuevos observadores para cada tarjeta
    cardRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => ({ ...prev, [index]: true }));
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -10% 0px",
        }
      );

      observer.observe(ref);
      observers.current.push(observer);
    });

    // Enfoque en el contenedor para mejor navegación
    if (containerRef.current) {
      containerRef.current.focus();
    }

    // Nueva implementación de scroll suave usando requestAnimationFrame
    const rightPanelContainer = document.querySelector(
      ".right-panel-container"
    );

    if (rightPanelContainer && !isMobile) {
      let scrollAnimationId = null;
      let scrollTarget = 0;
      let isScrolling = false;

      const lerp = (start, end, factor) => start * (1 - factor) + end * factor;

      const smoothScrollAnimation = () => {
        if (!isScrolling) return;

        const currentScrollTop = rightPanelContainer.scrollTop;
        const newScrollTop = lerp(currentScrollTop, scrollTarget, 0.1);

        if (Math.abs(newScrollTop - scrollTarget) < 1) {
          rightPanelContainer.scrollTop = scrollTarget;
          isScrolling = false;
          return;
        }

        rightPanelContainer.scrollTop = newScrollTop;
        scrollAnimationId = requestAnimationFrame(smoothScrollAnimation);
      };

      const handleWheel = (e) => {
        e.preventDefault();

        const delta = e.deltaY;
        // Incrementar factor a 1.2 para scroll más rápido
        scrollTarget = rightPanelContainer.scrollTop + delta * 1.2;

        // Limitar scrollTarget para que no se salga de los límites
        scrollTarget = Math.max(
          0,
          Math.min(
            scrollTarget,
            rightPanelContainer.scrollHeight - rightPanelContainer.clientHeight
          )
        );

        if (!isScrolling) {
          isScrolling = true;
          scrollAnimationId = requestAnimationFrame(smoothScrollAnimation);
        }
      };

      rightPanelContainer.addEventListener("wheel", handleWheel, {
        passive: false,
      });

      return () => {
        observers.current.forEach((obs) => obs && obs.disconnect());
        window.removeEventListener("resize", handleResize);
        rightPanelContainer.removeEventListener("wheel", handleWheel);

        if (scrollAnimationId) {
          cancelAnimationFrame(scrollAnimationId);
        }
      };
    }

    return () => {
      observers.current.forEach((obs) => obs && obs.disconnect());
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: isMobile ? "1.5rem" : "3rem",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        height: "100%",
        outline: "none", // Quitar outline al hacer focus
      }}
      tabIndex="0" // Hacer focusable para mejorar navegación con teclado
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          ref={(el) => (cardRefs.current[index] = el)}
          className={`card-hover fade-in card-container ${
            visibleCards[index] ? "visible" : ""
          }`}
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            overflow: "hidden",
            marginBottom: isMobile
              ? "2rem"
              : index === slides.length - 1
              ? "5rem"
              : "3.5rem",
            width: isMobile ? "90%" : "85%",
            maxWidth: "550px",
            height: isMobile ? "auto" : "auto", // Cambiado a auto para asegurar que todo el contenido se vea
            minHeight: isMobile ? "420px" : "550px", // Aumentado para dar más espacio
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            transitionDelay: `${0.1 + index * 0.1}s`,
            marginTop: index === 0 ? "1.5rem" : "0",
            position: "relative", // Para posicionamiento absoluto interno
            transform: visibleCards[index]
              ? "translateY(0)"
              : "translateY(30px)", // Efecto adicional al aparecer
            opacity: visibleCards[index] ? 1 : 0,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: isMobile ? "auto" : "50%", // Reducido para dar más espacio al contenido
              paddingTop: isMobile ? "65%" : "0", // Solo usar paddingTop en móvil
              overflow: "hidden",
            }}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              style={{
                position: isMobile ? "absolute" : "relative",
                top: 0,
                left: 0,
                width: "100%",
                height: isMobile ? "100%" : "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
                transform: visibleCards[index] ? "scale(1)" : "scale(1.1)",
              }}
            />
          </div>
          <div
            style={{
              padding: isMobile ? "1.5rem" : "2rem",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: isMobile ? "auto" : "50%", // Aumentado para dar más espacio
              boxSizing: "border-box",
              position: "relative", // Para posicionamiento de elementos hijos
              overflow: "visible", // Asegurar que el contenido no se corte
            }}
          >
            <div>
              <h2
                style={{
                  marginBottom: "1rem",
                  color: "#2e8b8b",
                  fontSize: isMobile ? "1.8rem" : "2.2rem",
                  background:
                    "linear-gradient(135deg, #2e8b8b 0%, #43b0b0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: "1.2",
                }}
              >
                {slide.title}
              </h2>
              <p
                style={{
                  margin: 0,
                  lineHeight: "1.7",
                  fontSize: isMobile ? "1.05rem" : "1.15rem",
                  color: "#444",
                }}
              >
                {slide.description}
              </p>
            </div>
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "flex-end",
                position: isMobile ? "relative" : "absolute", // Posicionamiento absoluto en desktop
                zIndex: 2,
                bottom: isMobile ? "auto" : "1.5rem", // Posicionado en la parte inferior en desktop
                right: isMobile ? "auto" : "2rem", // Alineado a la derecha en desktop
                width: isMobile ? "100%" : "auto",
                marginBottom: "0.5rem", // Espacio adicional al final
              }}
            >
              <span
                className="feature-tag"
                style={{
                  display: "inline-block",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  background: "rgba(46, 139, 139, 0.1)",
                  color: "#2e8b8b",
                }}
              >
                Feature {index + 1}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Espacio adicional al final para mejor sensación de scroll */}
      <div
        style={{
          height: isMobile ? "80px" : "150px",
          width: "100%",
          paddingBottom: isMobile ? "30px" : "60px",
        }}
      ></div>
    </div>
  );
}
