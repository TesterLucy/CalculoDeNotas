const numCortesInput = document.getElementById('numCortes');
const cortesContainer = document.getElementById('cortesContainer');
const btnGenerar = document.getElementById('btnGenerar');
const btnCalcular = document.getElementById('btnCalcular');
const resultadoDiv = document.getElementById('resultado');

btnGenerar.addEventListener('click', () => {
  const num = parseInt(numCortesInput.value);
  cortesContainer.innerHTML = '';
  resultadoDiv.innerHTML = '';
  btnCalcular.style.display = 'inline-block';

  for (let i = 1; i <= num; i++) {
    cortesContainer.innerHTML += `
      <div class="corte">
        <h3>Corte ${i}</h3>
        <label>Porcentaje (%):</label>
        <input type="number" id="porcentaje${i}" min="1" max="100" required>
        <label>Nota (deja vacío si aún no la tienes):</label>
        <input type="number" step="0.01" id="nota${i}" min="0" max="5">
      </div>
    `;
  }
});

btnCalcular.addEventListener('click', () => {
  const num = parseInt(numCortesInput.value);
  let porcentajes = [];
  let notas = [];

  for (let i = 1; i <= num; i++) {
    porcentajes.push(parseFloat(document.getElementById(`porcentaje${i}`).value) || 0);
    notas.push(parseFloat(document.getElementById(`nota${i}`).value) || null);
  }

  const totalPorcentaje = porcentajes.reduce((a, b) => a + b, 0);
  if (totalPorcentaje !== 100) {
    alert('⚠️ La suma de los porcentajes debe ser exactamente 100%.');
    return;
  }

  // Calcular acumulado
  let porcentajeAcumulado = 0;
  let notaAcumulada = 0;
  for (let i = 0; i < num; i++) {
    if (notas[i] !== null) {
      porcentajeAcumulado += porcentajes[i];
      notaAcumulada += notas[i] * (porcentajes[i] / 100);
    }
  }

  if (porcentajeAcumulado >= 50) {
    resultadoDiv.innerHTML = `
      <p>✅ Ya tienes más del 50% del curso (${porcentajeAcumulado.toFixed(1)}%).</p>
      <p>Vamos a calcular la nota mínima que necesitas en los cortes restantes para aprobar.</p>
    `;
  }

  // Cálculo de notas faltantes
  const porcentajeRestante = 100 - porcentajeAcumulado;
  const notaObjetivo = 3.0;
  const puntosRestantes = notaObjetivo - notaAcumulada;

  if (puntosRestantes <= 0) {
    resultadoDiv.innerHTML += `<p>🎉 ¡Ya tienes lo suficiente para aprobar!</p>`;
    return;
  }

  // Cálculo opción 1: misma nota en todos los cortes faltantes
  const cortesRestantes = porcentajes
    .map((p, i) => ({ p, nota: notas[i] }))
    .filter(c => c.nota === null);

  const mismaNota = puntosRestantes / (porcentajeRestante / 100);

  // Cálculo opción 2: distribución proporcional
  let proporcional = cortesRestantes.map(c => ({
    porcentaje: c.p,
    nota: (puntosRestantes * (c.p / porcentajeRestante)) / (c.p / 100)
  }));

  resultadoDiv.innerHTML += `
    <div class="resultado-opcion">
      <h3>📏 Opción 1: Misma nota en todos los cortes restantes</h3>
      <p>Necesitas <strong>${mismaNota.toFixed(2)}</strong> en cada corte faltante.</p>
    </div>

    <div class="resultado-opcion">
      <h3>⚖️ Opción 2: Distribución proporcional</h3>
      ${proporcional.map((c, i) => `
        <p>Corte ${i + 1 + (num - cortesRestantes.length)} (${c.porcentaje}%): 
        <strong>${c.nota.toFixed(2)}</strong></p>
      `).join('')}
    </div>
  `;
});
