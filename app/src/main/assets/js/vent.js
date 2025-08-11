function getBeaufort(knots) {
  const levels = [
    "0 - Calme",
    "1 - Très légère brise",
    "2 - Légère brise",
    "3 - Petite brise",
    "4 - Jolie brise",
    "5 - Bonne brise",
    "6 - Vent frais",
    "7 - Grand frais",
    "8 - Coup de vent",
    "9 - Fort coup de vent",
    "10 - Tempête",
    "11 - Violente tempête",
    "12 - Ouragan"
  ];
  const limits = [1, 3, 6, 10, 16, 21, 27, 33, 40, 47, 55, 63];
  for (let i = 0; i < limits.length; i++) {
    if (knots < limits[i]) return `🌊 ${i} - ${levels[i]}`;
  }
  return `🌊 12 - Ouragan`;
}

function getDirectionText(deg) {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                "S", "SSO", "SO", "OSO", "O", "ONO", "NO", "NNO"];
  return dirs[Math.round(deg / 22.5) % 16];
}

window.parseVentData = function(text) {
  try {
    const data = text.split(" ");
    if (data[0] !== "12345") throw "Format inattendu";

    const now = parseFloat(data[2]);
    const avg1 = parseFloat(data[1]);
    const avg10 = parseFloat(data[158]);
    const dirDeg = parseInt(data[3]);

    const nowKmh = (now * 1.852).toFixed(1);
    const avg1Kmh = (avg1 * 1.852).toFixed(1);
    const avg10Kmh = (avg10 * 1.852).toFixed(1);
    const beaufort = getBeaufort(avg10);

    document.getElementById("direction").innerHTML = `${getDirectionText(dirDeg)} (${dirDeg}°)`;
    document.getElementById("now").innerHTML = `${now.toFixed(1)} nds / ${nowKmh} km/h`;
    document.getElementById("avg1").innerHTML = `${avg1.toFixed(1)} nds / ${avg1Kmh} km/h`;
    document.getElementById("avg10").innerHTML = `${avg10.toFixed(1)} nds / ${avg10Kmh} km/h`;
    document.getElementById("beaufort").innerHTML = beaufort;
  } catch (e) {
    document.body.innerHTML = `<p style="color:red;text-align:center;">Erreur parsing : ${e}</p>`;
  }
};
