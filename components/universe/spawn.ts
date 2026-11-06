/* Utilidades compartidas por los fondos que hacen aparecer elementos al azar. */

/** Elige un punto al azar fuera de la columna de contenido (px dentro de la sección). */
export function randomSpot(w: number, h: number): { x: number; y: number } {
  const content = Math.min(1100, w - 48); // ancho de .section-container
  const side = (w - content) / 2;
  if (side >= 150) {
    // Pantallas anchas: márgenes laterales.
    const left = Math.random() < 0.5;
    const x = left ? 20 + Math.random() * (side - 130) : w - side + 20 + Math.random() * (side - 150);
    return { x, y: 60 + Math.random() * Math.max(40, h - 160) };
  }
  // Pantallas chicas: franjas de arriba y abajo (el padding de la sección).
  const top = Math.random() < 0.5;
  return { x: 16 + Math.random() * Math.max(20, w - 180), y: top ? 10 + Math.random() * 40 : h - 80 + Math.random() * 30 };
}
