const chart = Highcharts.chart("chart", {
  chart: {
    type: "spline",
    animation: Highcharts.svg, // Mejor rendimiento en navegadores modernos
    marginRight: 10,
  },
  title: { text: "" },
  xAxis: { 
    type: "datetime",
    title: { text: "Hora del Día" },
    min: 5 * 60 * 60 * 1000, // 5:00 AM (inicio)
    max: 22 * 60 * 60 * 1000, // 10:00 PM (final)
    tickInterval: 2 * 60 * 60 * 1000, // Cada 2 horas
    tickPositions: [
      5 * 60 * 60 * 1000,   // 5:00 AM
      7 * 60 * 60 * 1000,   // 7:00 AM
      9 * 60 * 60 * 1000,   // 9:00 AM
      11 * 60 * 60 * 1000,  // 11:00 AM
      13 * 60 * 60 * 1000,  // 1:00 PM
      15 * 60 * 60 * 1000,  // 3:00 PM
      17 * 60 * 60 * 1000,  // 5:00 PM
      19 * 60 * 60 * 1000,  // 7:00 PM
      21 * 60 * 60 * 1000,  // 9:00 PM
      22 * 60 * 60 * 1000   // 10:00 PM
    ],
    labels: {
      formatter: function() {
        const hours = Math.floor(this.value / (60 * 60 * 1000));
        const minutes = Math.floor((this.value % (60 * 60 * 1000)) / (60 * 1000));
        
        // Convertir a formato de 12 horas
        let hours12 = hours;
        let ampm = 'AM';
        
        if (hours === 0) {
          hours12 = 12;
        } else if (hours > 12) {
          hours12 = hours - 12;
          ampm = 'PM';
        } else if (hours === 12) {
          ampm = 'PM';
        }
        
        return `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      }
    }
  },
  yAxis: {
    title: { text: "BPM" },
    min: 0,
    max: 200,
  },
  plotOptions: {
    series: {
      turboThreshold: 200, // Optimizado para manejar hasta 200 puntos eficientemente
      marker: { enabled: false }, // Sin marcadores para mejor desempeño
      lineWidth: 2, // Líneas más visibles
      shadow: false, // Sin sombras para mejor rendimiento
    },
  },
  series: [
    { name: "Adulto Mayor", data: [], color: "#8B4513" },
    { name: "Atleta", data: [], color: "#FF6B35" },
    { name: "Estudiante", data: [], color: "#4A90E2" },
  ],
});

// Rangos base más realistas según la persona
const BASE = {
  mayor: [60, 80],
  gym: [50, 70],
  est: [65, 95],
};

// Modos de actividad con lógica diferenciada
const MODES = {
  reposo: { mayor: [60, 80], gym: [50, 65], est: [65, 85] },
  dormido: { mayor: [55, 70], gym: [40, 55], est: [50, 65] },
  caminar: { mayor: [70, 90], gym: [70, 100], est: [75, 105] },
  trotar: { mayor: [75, 100], gym: [95, 135], est: [85, 120] },
  correr: { mayor: [80, 110], gym: [120, 175], est: [95, 150] },
  paro: { mayor: [0, 0], gym: [0, 0], est: [0, 0] },
};

let intervalId = null;
let currentSimulatedTime = 5 * 60; // Empezar a las 5:00 AM (en minutos desde medianoche)
let dailySchedules = null;

// Rutinas diarias de cada personaje (horarios en minutos desde medianoche)
const DAILY_ROUTINES = {
  mayor: [ // Roberto (Adulto Mayor)
    { time: 300, activity: "dormido", description: "💤 Durmiendo profundamente" }, // 5:00 AM
    { time: 360, activity: "dormido", description: "💤 Todavía durmiendo" },    // 6:00 AM
    { time: 420, activity: "dormido", description: "💤 Sigue durmiendo" },     // 7:00 AM
    { time: 480, activity: "dormido", description: "💤 Último sueño" },        // 8:00 AM
    { time: 540, activity: "reposo", description: "Despertandose" },  // 9:00 AM
    { time: 600, activity: "reposo", description: "Desayuno tranquilo" },   // 10:00 AM
    { time: 660, activity: "caminar", description: "Caminata matutina" },  // 11:00 AM
    { time: 720, activity: "reposo", description: "Viendo noticias" },     // 12:00 PM
    { time: 840, activity: "reposo", description: "Almorzando" },         // 2:00 PM
    { time: 900, activity: "reposo", description: "💤 Siesta obligatoria" },  // 3:00 PM
    { time: 1020, activity: "caminar", description: "Paseo vespertino" }, // 5:00 PM
    { time: 1140, activity: "reposo", description: "Cena temprana" },    // 7:00 PM
    { time: 1280, activity: "dormido", description: "💤 A dormir temprano" } // 9:00 PM
  ],
  
  gym: [ // Miguel (Atleta)
    { time: 300, activity: "dormido", description: "💤 Durmiendo" },          // 5:00 AM
    { time: 330, activity: "reposo", description: "Despertando temprano" }, // 5:30 AM
    { time: 360, activity: "caminar", description: "Calentamiento" },      // 6:00 AM
    { time: 390, activity: "trotar", description: "Cardio matutino" },      // 6:30 AM
    { time: 420, activity: "correr", description: "GYM - Entrenamiento" }, // 7:00 AM
    { time: 480, activity: "trotar", description: "Finalizando rutina" },  // 8:00 AM
    { time: 540, activity: "reposo", description: "Desayuno proteico" },   // 9:00 AM
    { time: 600, activity: "caminar", description: "Camino al trabajo" },  // 10:00 AM
    { time: 720, activity: "reposo", description: "Trabajando" },          // 12:00 PM
    { time: 780, activity: "caminar", description: "Almuerzo saludable" }, // 1:00 PM
    { time: 900, activity: "reposo", description: "Más trabajo" },         // 3:00 PM
    { time: 1140, activity: "reposo", description: "Cena" },   // 7:00 PM
    { time: 1320, activity: "dormido", description: "💤 Descanso muscular" }  // 10:00 PM
  ],

  est: [ // Ana (Estudiante)
    { time: 300, activity: "dormido", description: "💤 Durmiendo" },          // 5:00 AM
    { time: 360, activity: "dormido", description: "💤 Todavía durmiendo" },  // 6:00 AM
    { time: 390, activity: "reposo", description: "Despertando" },       // 6:30 AM
    { time: 420, activity: "caminar", description: "Alistandose" }, // 7:00 AM
    { time: 450, activity: "caminar", description: "Corriendo al taxi" },   // 7:30 AM
    { time: 480, activity: "reposo", description: "Primera clase" },       // 8:00 AM
    { time: 600, activity: "caminar", description: "Educación física" },   // 10:00 AM
    { time: 630, activity: "reposo", description: "Matemáticas" },         // 10:30 AM
    { time: 720, activity: "reposo", description: "Recreo y lunch" },      // 12:00 PM
    { time: 840, activity: "reposo", description: "Última clase" },        // 2:00 PM
    { time: 900, activity: "caminar", description: "Regreso a casa" },     // 3:00 PM
    { time: 1020, activity: "reposo", description: "Tareas escolares" },   // 5:00 PM
    { time: 1140, activity: "reposo", description: "Cena familiar" },     // 7:00 PM
    { time: 1200, activity: "reposo", description: "Tiempo libre" },       // 8:00 PM
    { time: 1320, activity: "dormido", description: "💤 A dormir (escuela mañana)" } // 10:00 PM
  ]
};

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let lastValues = { mayor: 70, gym: 60, est: 75 };

function getBPM(type) {
  // Usar el nuevo sistema basado en horarios personalizados
  return getBPMForPersonActivity(type);
}

function estadoSegunBPM(bpm) {
  if (bpm === 0) return "Sin pulso";
  if (bpm < 60) return "Reposo";
  if (bpm < 90) return "Normal";
  if (bpm < 120) return "Actividad Moderada";
  if (bpm < 150) return "Ejercicio Intenso";
  return "Alto Esfuerzo";
}

// Función para convertir minutos a formato de hora (12 horas con AM/PM)
function formatTime(minutes) {
  const hours24 = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  
  // Convertir a formato de 12 horas
  let hours12 = hours24;
  let ampm = 'AM';
  
  if (hours24 === 0) {
    hours12 = 12; // Medianoche = 12:00 AM
  } else if (hours24 > 12) {
    hours12 = hours24 - 12; // PM hours
    ampm = 'PM';
  } else if (hours24 === 12) {
    ampm = 'PM'; // Mediodía = 12:00 PM
  }
  
  return `${hours12}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

// Función para obtener la actividad actual de una persona según la hora
function getCurrentActivity(personType, currentTime) {
  const routine = DAILY_ROUTINES[personType];
  let currentActivity = routine[0]; // Por defecto la primera actividad
  
  for (let i = 0; i < routine.length; i++) {
    if (currentTime >= routine[i].time) {
      currentActivity = routine[i];
    } else {
      break;
    }
  }
  
  return currentActivity;
}

// Función para obtener los BPM según la persona y su actividad actual
function getBPMForPersonActivity(personType) {
  const activity = getCurrentActivity(personType, currentSimulatedTime);
  const range = MODES[activity.activity][personType];
  const target = randomBetween(range[0], range[1]);
  
  // Suavizado para que no sean saltos bruscos
  const diff = target - lastValues[personType];
  const step = Math.abs(diff) > 8 ? diff * 0.4 : diff * 0.7;
  lastValues[personType] += step;
  return Math.round(lastValues[personType]);
}

// Sistema de tiempo simulado
function advanceSimulatedTime() {
  // Avanzar 15 minutos simulados cada segundo real (acelerado x900)
  currentSimulatedTime += 15;
  
  // Si llegamos a medianoche (1440 minutos), reiniciar el día
  if (currentSimulatedTime >= 1440) {
    currentSimulatedTime = 0;
  }
}

function updateData() {
  // Avanzar el tiempo simulado
  advanceSimulatedTime();
  
  // Convertir el tiempo simulado a milisegundos para Highcharts
  // Solo mostrar datos entre 5:00 AM y 10:00 PM
  let adjustedTime = currentSimulatedTime;
  
  // Si el tiempo está fuera del rango de visualización (10:00 PM a 5:00 AM), no agregamos puntos
  const isInDisplayRange = (adjustedTime >= 5 * 60 && adjustedTime <= 22 * 60); // 5:00 AM a 10:00 PM
  
  if (isInDisplayRange) {
    const simulatedTimeMs = adjustedTime * 60 * 1000; // Convertir minutos a milisegundos
    const mayor = getBPM("mayor");
    const gym = getBPM("gym");
    const est = getBPM("est");

    //Guarda 120 puntos
    chart.series[0].addPoint([simulatedTimeMs, mayor], true, chart.series[0].data.length >= 120);
    chart.series[1].addPoint([simulatedTimeMs, gym], true, chart.series[1].data.length >= 120);
    chart.series[2].addPoint([simulatedTimeMs, est], true, chart.series[2].data.length >= 120);
  }
  
  // Siempre obtener los BPM y actividades para actualizar la interfaz
  const mayor = getBPM("mayor");
  const gym = getBPM("gym");
  const est = getBPM("est");

  // Obtener actividades actuales
  const mayorActivity = getCurrentActivity("mayor", currentSimulatedTime);
  const gymActivity = getCurrentActivity("gym", currentSimulatedTime);
  const estActivity = getCurrentActivity("est", currentSimulatedTime);

  // Actualizar pantalla
  const currentTimeStr = formatTime(currentSimulatedTime);
  document.getElementById("bpmLabel").textContent = `${currentTimeStr} | Roberto: ${mayor} | Miguel: ${gym} | Ana: ${est} BPM`;
  
  // Actualizar indicador de tiempo y actividad global
  document.getElementById("modeIndicator").textContent = `🕐 ${currentTimeStr}`;

  document.getElementById("bpmMayor").textContent = mayor;
  document.getElementById("estadoMayor").textContent = mayorActivity.description;

  document.getElementById("bpmGym").textContent = gym;
  document.getElementById("estadoGym").textContent = gymActivity.description;

  document.getElementById("bpmEst").textContent = est;
  document.getElementById("estadoEst").textContent = estActivity.description;
}

// Iniciar y detener simulación de día completo
document.getElementById("startBtn").addEventListener("click", () => {
  if (!intervalId) {
    intervalId = setInterval(updateData, 2000); // Cada dos segundos
    document.getElementById("bpmLabel").textContent = "Simulación de rutina diaria en curso...";
  }
});

document.getElementById("stopBtn").addEventListener("click", () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    currentSimulatedTime = 5 * 60; // Resetear a las 5:00 AM
    document.getElementById("bpmLabel").textContent = "Simulación detenida.";
    document.getElementById("modeIndicator").textContent = "En espera...";
  }
});