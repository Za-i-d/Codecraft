document.addEventListener("DOMContentLoaded", function() {
    const niveles = document.querySelectorAll(".nivel");

    niveles.forEach(nivel => {
        nivel.addEventListener("click", function(event) {
            // Verifica si el clic ocurrió en un enlace dentro de las actividades
            if (event.target.tagName === "A") {
                return; // Sale del evento si se hace clic en un enlace
            }

            event.preventDefault();
            const nivelId = this.getAttribute("data-nivel");
            const actividades = document.getElementById(`actividades-nivel-${nivelId}`);

            // Si las actividades están expandidas, las contrae; de lo contrario, las expande.
            if (actividades.classList.contains("expanded")) {
                actividades.classList.remove("expanded");
                actividades.style.maxHeight = null;
            } else {
                // Cierra otras actividades abiertas
                document.querySelectorAll(".actividades.expanded").forEach(other => {
                    other.classList.remove("expanded");
                    other.style.maxHeight = null;
                });

                actividades.classList.add("expanded");
                actividades.style.maxHeight = actividades.scrollHeight + "px";
            }
        });
    });
});