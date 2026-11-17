document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. BARRA DE PROGRESO DE LECTURA (ESTILO HINOMARU)
  // ==========================================
  const progressBar = document.createElement("div");
  progressBar.id = "reading-progress";
  Object.assign(progressBar.style, {
    position: "fixed",
    top: "0",
    left: "0",
    height: "4px",
    width: "0%",
    backgroundColor: "#bc002d", // Rojo bandera de Japón
    zIndex: "9999",
    transition: "width 0.1s ease-out"
  });
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercent}%`;
  });

  // ==========================================
  // 2. RESALTAR SECCIÓN ACTIVA EN EL MENÚ (SCROLLSPY)
  // ==========================================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-pills .nav-link");

  window.addEventListener("scroll", () => {
    let currentSection = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 130;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      link.style.backgroundColor = "";
      link.style.color = "";

      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
        link.style.backgroundColor = "#bc002d";
        link.style.color = "#ffffff";
      }
    });
  });

  // ==========================================
  // 3. ANIMACIÓN DE APARICIÓN AL HACER SCROLL
  // ==========================================
  const animatedElements = document.querySelectorAll(".card-jp, .city-box, .card-resumen");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(25px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(el);
  });

  // ==========================================
  // 4. VISOR DE IMÁGENES EN PANTALLA COMPLETA (LIGHTBOX)
  // ==========================================
  const images = document.querySelectorAll(".img-jp, .img-city");

  // Crear modal oscuro para las imágenes
  const lightbox = document.createElement("div");
  Object.assign(lightbox.style, {
    position: "fixed",
    inset: "0",
    backgroundColor: "rgba(28, 25, 23, 0.92)",
    display: "none",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "10000",
    padding: "20px",
    cursor: "zoom-out"
  });

  const lightboxImg = document.createElement("img");
  Object.assign(lightboxImg.style, {
    maxWidth: "90%",
    maxHeight: "80vh",
    borderRadius: "10px",
    border: "3px solid #c59b27", // Borde dorado Kintsugi
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
  });

  const lightboxCaption = document.createElement("p");
  Object.assign(lightboxCaption.style, {
    color: "#fafaf9",
    marginTop: "15px",
    fontSize: "1rem",
    textAlign: "center"
  });

  lightbox.appendChild(lightboxImg);
  lightbox.appendChild(lightboxCaption);
  document.body.appendChild(lightbox);

  images.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.title = "Haz clic para ampliar";

    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightboxCaption.textContent = img.alt || "Imagen de Japón";
      lightbox.style.display = "flex";
    });
  });

  lightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  // Cerrar visor con la tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") lightbox.style.display = "none";
  });

  // ==========================================
  // 5. CHECKLIST INTERACTIVO DE SUEÑOS EN JAPÓN
  // ==========================================
  const resumenSection = document.getElementById("resumen");
  if (resumenSection) {
    const checklistContainer = document.createElement("div");
    checklistContainer.className = "mt-4 pt-3 border-top border-secondary";
    checklistContainer.innerHTML = `
      <h3 class="h6 text-uppercase fw-bold mb-3" style="color: #f9a8d4;">
        ⛩️ Mi lista de deseos para el viaje (haz clic para marcar):
      </h3>
      <div id="japan-bucket-list" class="d-flex flex-column gap-2"></div>
    `;
    resumenSection.appendChild(checklistContainer);

    const bucketItems = [
      "Cruzar Shibuya de noche en Tokio",
      "Caminar bajo los portales rojos de Fushimi Inari en Kioto",
      "Ver el Monte Fuji frente al lago Kawaguchiko",
      "Viajar en el tren bala Shinkansen a 300 km/h",
      "Ir a una reunión de autos JDM en Daikoku PA"
    ];

    const listContainer = document.getElementById("japan-bucket-list");
    const savedProgress = JSON.parse(localStorage.getItem("japonChecklist")) || {};

    bucketItems.forEach((item, index) => {
      const label = document.createElement("label");
      label.className = "d-flex align-items-center gap-2 small";
      label.style.cursor = "pointer";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "form-check-input m-0";
      checkbox.checked = !!savedProgress[index];

      const span = document.createElement("span");
      span.textContent = item;
      if (checkbox.checked) {
        span.style.textDecoration = "line-through";
        span.style.opacity = "0.6";
      }

      checkbox.addEventListener("change", () => {
        savedProgress[index] = checkbox.checked;
        localStorage.setItem("japonChecklist", JSON.stringify(savedProgress));
        span.style.textDecoration = checkbox.checked ? "line-through" : "none";
        span.style.opacity = checkbox.checked ? "0.6" : "1";
      });

      label.appendChild(checkbox);
      label.appendChild(span);
      listContainer.appendChild(label);
    });
  }

  // ==========================================
  // 6. BOTÓN FLOTANTE PARA VOLVER ARRIBA
  // ==========================================
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.innerHTML = "↑";
  scrollTopBtn.title = "Volver arriba";
  Object.assign(scrollTopBtn.style, {
    position: "fixed",
    bottom: "25px",
    right: "25px",
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    backgroundColor: "#bc002d",
    color: "#ffffff",
    border: "2px solid #ffffff",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    opacity: "0",
    pointerEvents: "none",
    transition: "opacity 0.3s ease, transform 0.2s ease",
    zIndex: "999"
  });

  document.body.appendChild(scrollTopBtn);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollTopBtn.style.opacity = "1";
      scrollTopBtn.style.pointerEvents = "auto";
    } else {
      scrollTopBtn.style.opacity = "0";
      scrollTopBtn.style.pointerEvents = "none";
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
const formJapon = document.getElementById("form-japon");
const alertaExito = document.getElementById("alerta-exito");

if (formJapon) {
  formJapon.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita que la página se recargue
    alertaExito.classList.remove("d-none"); // Muestra el saludo en japonés
    formJapon.reset(); // Limpia los campos del formulario
  });
}