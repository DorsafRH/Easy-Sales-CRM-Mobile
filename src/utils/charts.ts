/**
 * @file charts.ts
 * @description Helpers de tracé SVG réutilisables (courbes lissées, aires, segments de donut).
 * @author Riahi Dorsaf
 */

export interface Point {
  x: number;
  y: number;
}

/** Chemin SVG d'une courbe lissée (Bézier) passant par les points. */
export const buildLinePath = (pts: Point[]): string => {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const cpx = (pts[i - 1].x + pts[i].x) / 2;
    d += ` C ${cpx.toFixed(1)},${pts[i - 1].y.toFixed(1)} ${cpx.toFixed(1)},${pts[i].y.toFixed(1)} ${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
  }
  return d;
};

/** Chemin SVG de l'aire sous la courbe (jusqu'à `bottom`). */
export const buildFillPath = (pts: Point[], bottom: number): string => {
  const line = buildLinePath(pts);
  if (!line) return '';
  const last = pts[pts.length - 1];
  return `${line} L ${last.x.toFixed(1)},${bottom} L ${pts[0].x.toFixed(1)},${bottom} Z`;
};

/** Chemin SVG d'un segment de donut (arc extérieur + arc intérieur). */
export const buildDonutArc = (
  cx: number, cy: number, rOut: number, rIn: number,
  startDeg: number, endDeg: number,
): string => {
  if (Math.abs(endDeg - startDeg) < 0.01) return '';
  if (endDeg - startDeg >= 360) endDeg = startDeg + 359.9;
  const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const f = (v: number) => v.toFixed(2);
  const osx = cx + rOut * Math.cos(rad(startDeg));
  const osy = cy + rOut * Math.sin(rad(startDeg));
  const oex = cx + rOut * Math.cos(rad(endDeg));
  const oey = cy + rOut * Math.sin(rad(endDeg));
  const iex = cx + rIn * Math.cos(rad(endDeg));
  const iey = cy + rIn * Math.sin(rad(endDeg));
  const isx = cx + rIn * Math.cos(rad(startDeg));
  const isy = cy + rIn * Math.sin(rad(startDeg));
  const lg = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${f(osx)},${f(osy)} A ${rOut},${rOut} 0 ${lg} 1 ${f(oex)},${f(oey)} L ${f(iex)},${f(iey)} A ${rIn},${rIn} 0 ${lg} 0 ${f(isx)},${f(isy)} Z`;
};

/** Met à l'échelle une série de valeurs en points SVG dans une zone donnée. */
export const buildChartPts = (
  values: number[],
  width: number,
  height: number,
  padX = 8,
  padY = 8,
): Point[] => {
  if (values.length === 0) return [];
  const max = Math.max(...values, 1);
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const step = values.length > 1 ? innerW / (values.length - 1) : 0;
  return values.map((v, i) => ({
    x: padX + step * i,
    y: padY + innerH * (1 - v / max),
  }));
};
