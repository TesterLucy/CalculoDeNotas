document.addEventListener("DOMContentLoaded", () => {
    const areaTrabajo = document.getElementById("areaTrabajo");
    const resultado = document.getElementById("resultado");
    const modoCortesBtn = document.getElementById("modoCortes");
    const modoActividadesBtn = document.getElementById("modoActividades");

    // Limpia el área de trabajo
    const limpiarArea = () => {
        areaTrabajo.innerHTML = "";
        resultado.innerHTML = "";
    };

    // ======== MODO 1: CALCULAR POR CORTES ========
    modoCortesBtn.addEventListener("click", () => {
        limpiarArea();

        const container = document.createElement("div");
        const btnAgregarCorte = document.createElement("button");
        btnAgregarCorte.textContent = "Agregar Corte";
        btnAgregarCorte.classList.add("btn", "agregar");

        const btnCalcular = document.createElement("button");
        btnCalcular.textContent = "Calcular Definitiva";
        btnCalcular.classList.add("btn");

        const cortesDiv = document.createElement("div");

        container.appendChild(btnAgregarCorte);
        container.appendChild(cortesDiv);
        container.appendChild(btnCalcular);
        areaTrabajo.appendChild(container);

        btnAgregarCorte.addEventListener("click", () => {
            const corte = document.createElement("div");
            corte.classList.add("corte");

            corte.innerHTML = `
                <h3>Corte</h3>
                <label>Nota: </label><input type="number" min="0" max="5" step="0.01" class="notaCorte">
                <label>% del total: </label><input type="number" min="1" max="100" step="1" class="pesoCorte">
                <button class="btn eliminar">Eliminar</button>
            `;

            corte.querySelector(".eliminar").addEventListener("click", () => corte.remove());
            cortesDiv.appendChild(corte);
        });

        btnCalcular.addEventListener("click", () => {
            const notas = [...document.querySelectorAll(".notaCorte")].map(n => parseFloat(n.value) || 0);
            const pesos = [...document.querySelectorAll(".pesoCorte")].map(p => parseFloat(p.value) || 0);

            const totalPeso = pesos.reduce((a,b) => a + b, 0);
            const definitiva = notas.reduce((sum, nota, i) => sum + nota * (pesos[i] / 100), 0);

            if (totalPeso < 100) {
                const faltante = 100 - totalPeso;
                const notaNecesaria = ((3 - definitiva) / (faltante / 100)).toFixed(2);
                resultado.textContent = `Tus cortes suman ${totalPeso}%. Te falta ${faltante}%. Necesitas al menos ${notaNecesaria} para aprobar con 3.0.`;
            } else {
                resultado.textContent = `Tu nota definitiva es: ${definitiva.toFixed(2)}`;
            }
        });
    });

    // ======== MODO 2: CALCULAR POR ACTIVIDADES DETALLADAS ========
    modoActividadesBtn.addEventListener("click", () => {
        limpiarArea();

        const container = document.createElement("div");
        const btnAgregarCorte = document.createElement("button");
        btnAgregarCorte.textContent = "Agregar Corte";
        btnAgregarCorte.classList.add("btn", "agregar");

        const btnCalcular = document.createElement("button");
        btnCalcular.textContent = "Calcular Definitiva";
        btnCalcular.classList.add("btn");

        const cortesDiv = document.createElement("div");
        container.appendChild(btnAgregarCorte);
        container.appendChild(cortesDiv);
        container.appendChild(btnCalcular);
        areaTrabajo.appendChild(container);

        // Añadir cortes dinámicos
        btnAgregarCorte.addEventListener("click", () => {
            const corte = document.createElement("div");
            corte.classList.add("corte");

            corte.innerHTML = `
                <h3>Corte</h3>
                <label>% del total: </label><input type="number" min="1" max="100" step="1" class="pesoCorte">
                <button class="btn agregar">Agregar Parte</button>
                <button class="btn eliminar">Eliminar Corte</button>
                <div class="partes"></div>
            `;

            const partesDiv = corte.querySelector(".partes");
            const btnAgregarParte = corte.querySelector(".agregar");
            const btnEliminarCorte = corte.querySelector(".eliminar");

            btnEliminarCorte.addEventListener("click", () => corte.remove());

            btnAgregarParte.addEventListener("click", () => {
                const parte = document.createElement("div");
                parte.classList.add("parte");
                parte.innerHTML = `
                    <h4>Parte del corte</h4>
                    <label>Nombre: </label><input type="text" placeholder="Ej: Actividades, Taller..." class="nombreParte">
                    <label>, y el porcentaje dentro del corte es: </label><input type="number" min="1" max="100" class="pesoParte">
                    <button class="btn agregar">Agregar Actividad</button>
                    <button class="btn eliminar">Eliminar Parte</button>
                    <div class="actividades"></div>
                `;

                const actividadesDiv = parte.querySelector(".actividades");
                const btnAgregarActividad = parte.querySelector(".agregar");
                const btnEliminarParte = parte.querySelector(".eliminar");

                btnEliminarParte.addEventListener("click", () => parte.remove());

                btnAgregarActividad.addEventListener("click", () => {
                    const act = document.createElement("div");
                    act.classList.add("actividad");
                    act.innerHTML = `
                        <label>Nota de actividad: </label>
                        <input type="number" min="0" max="5" step="0.01" class="notaActividad">
                        <button class="btn eliminar">Eliminar</button>
                    `;
                    act.querySelector(".eliminar").addEventListener("click", () => act.remove());
                    actividadesDiv.appendChild(act);
                });

                partesDiv.appendChild(parte);
            });

            cortesDiv.appendChild(corte);
        });

        // Cálculo final del modo detallado
        btnCalcular.addEventListener("click", () => {
            let definitiva = 0;
            let totalPeso = 0;

            const cortes = document.querySelectorAll(".corte");

            cortes.forEach(corte => {
                const pesoCorte = parseFloat(corte.querySelector(".pesoCorte").value) || 0;
                totalPeso += pesoCorte;

                let notaCorte = 0;
                const partes = corte.querySelectorAll(".parte");

                partes.forEach(parte => {
                    const pesoParte = parseFloat(parte.querySelector(".pesoParte").value) || 0;
                    const notasAct = [...parte.querySelectorAll(".notaActividad")].map(n => parseFloat(n.value) || 0);

                    if (notasAct.length > 0) {
                        const promedioParte = notasAct.reduce((a, b) => a + b, 0) / notasAct.length;
                        notaCorte += promedioParte * (pesoParte / 100);
                    }
                });

                definitiva += notaCorte * (pesoCorte / 100);
            });

            if (totalPeso < 100) {
                const faltante = 100 - totalPeso;
                const notaNecesaria = ((3 - definitiva) / (faltante / 100)).toFixed(2);
                resultado.textContent = `Tus cortes suman ${totalPeso}%. Te falta ${faltante}%. Necesitas al menos ${notaNecesaria} para aprobar con 3.0.`;
            } else {
                resultado.textContent = `Tu nota definitiva es: ${definitiva.toFixed(2)}`;
            }
        });
    });
});
