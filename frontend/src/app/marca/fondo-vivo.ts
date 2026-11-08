import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, viewChild
} from '@angular/core';

interface Regla {
  y: number;
  x: number;
  largo: number;
  velocidad: number;
  fase: number;
  periodo: number;
}

interface Ruta {
  puntos: { x: number; y: number }[];
  largo: number;
  t: number;
  velocidad: number;
  fase: number;
  periodo: number;
}

/**
 * Fondo en movimiento para las zonas oscuras, con el lenguaje del monograma:
 * reglas con sus marcas (la M) que se desplazan despacio y se desvanecen, y
 * líneas de nodos en ángulo recto (la T) por las que viaja el rombo celeste
 * dejando una estela. Opacidad baja, sin saturar: acompaña, no compite con
 * el texto. Con movimiento reducido se dibuja una sola vez, quieto; fuera de
 * pantalla se pausa.
 *
 * Uso: dentro de una sección con `position: relative`, `<mt-fondo-vivo />`.
 */
@Component({
  selector: 'mt-fondo-vivo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `<canvas #lienzo></canvas>`,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      z-index: var(--z-decoracion);
      overflow: hidden;
      pointer-events: none;
    }

    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `
})
export class FondoVivo {
  /** Multiplica la cantidad de reglas y rutas. */
  readonly densidad = input(1);
  /** Opacidad general (0–1). */
  readonly intensidad = input(1);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');

  constructor() {
    const destruir = inject(DestroyRef);
    afterNextRender(() => destruir.onDestroy(this.iniciar()));
  }

  private iniciar(): () => void {
    const el: HTMLElement = this.host.nativeElement;
    const cv = this.lienzo().nativeElement;
    const ctx = cv.getContext('2d');
    if (!ctx) return () => {};

    const celeste = rgb(getComputedStyle(el).getPropertyValue('--celeste').trim() || '#158DB4');
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let reglas: Regla[] = [];
    let rutas: Ruta[] = [];
    let raf = 0;
    let previo = 0;

    const azar = (a: number, b: number) => a + Math.random() * (b - a);

    const nuevaRuta = (): Ruta => {
      // Una ruta ortogonal de 3 a 5 tramos, como un circuito de esquina viva.
      const paso = 48;
      let x = Math.round(azar(0, w) / paso) * paso;
      let y = Math.round(azar(0, h) / paso) * paso;
      const puntos = [{ x, y }];
      let horizontal = Math.random() < 0.5;
      const tramos = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < tramos; i++) {
        const d = (Math.random() < 0.5 ? -1 : 1) * paso * (2 + Math.floor(Math.random() * 4));
        if (horizontal) x += d;
        else y += d;
        puntos.push({ x, y });
        horizontal = !horizontal;
      }
      let largo = 0;
      for (let i = 1; i < puntos.length; i++) {
        largo += Math.abs(puntos[i].x - puntos[i - 1].x) + Math.abs(puntos[i].y - puntos[i - 1].y);
      }
      return { puntos, largo, t: 0, velocidad: azar(0.035, 0.07), fase: azar(0, Math.PI * 2), periodo: azar(9000, 15000) };
    };

    const preparar = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const area = (w * h) / 220000;
      const nReglas = Math.max(2, Math.min(7, Math.round(area * 1.4 * this.densidad())));
      const nRutas = Math.max(2, Math.min(8, Math.round(area * 1.8 * this.densidad())));
      reglas = Array.from({ length: nReglas }, (_, i) => ({
        y: ((i + 0.5) / nReglas) * h + azar(-24, 24),
        x: azar(-w * 0.2, w * 0.6),
        largo: azar(w * 0.25, w * 0.6),
        velocidad: azar(0.006, 0.014) * (Math.random() < 0.5 ? -1 : 1),
        fase: azar(0, Math.PI * 2),
        periodo: azar(10000, 18000)
      }));
      rutas = Array.from({ length: nRutas }, nuevaRuta);
      if (quieto) dibujar(0);
    };

    /** Opacidad que respira entre 0 y 1: así todo aparece y se desvanece. */
    const respiro = (t: number, fase: number, periodo: number) =>
      0.5 - 0.5 * Math.cos((t / periodo) * Math.PI * 2 + fase);

    const color = (a: number) => `rgba(${celeste},${a * this.intensidad()})`;

    const dibujarRegla = (r: Regla, a: number) => {
      // Desvanecido en los extremos de cada regla.
      const g = ctx.createLinearGradient(r.x, 0, r.x + r.largo, 0);
      g.addColorStop(0, color(0));
      g.addColorStop(0.2, color(0.22 * a));
      g.addColorStop(0.8, color(0.22 * a));
      g.addColorStop(1, color(0));
      ctx.strokeStyle = g;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x + r.largo, r.y);
      const inicio = Math.ceil(r.x / 12) * 12;
      for (let x = inicio, i = Math.round(inicio / 12); x < r.x + r.largo; x += 12, i++) {
        const alto = i % 5 === 0 ? 10 : 5;
        ctx.moveTo(x, r.y);
        ctx.lineTo(x, r.y - alto);
      }
      ctx.stroke();
    };

    const puntoEn = (ruta: Ruta, d: number) => {
      let resto = d;
      for (let i = 1; i < ruta.puntos.length; i++) {
        const p = ruta.puntos[i - 1];
        const q = ruta.puntos[i];
        const tramo = Math.abs(q.x - p.x) + Math.abs(q.y - p.y);
        if (resto <= tramo) {
          const k = tramo ? resto / tramo : 0;
          return { x: p.x + (q.x - p.x) * k, y: p.y + (q.y - p.y) * k };
        }
        resto -= tramo;
      }
      return ruta.puntos[ruta.puntos.length - 1];
    };

    const rombo = (x: number, y: number, s: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.lineTo(x + s, y);
      ctx.lineTo(x, y + s);
      ctx.lineTo(x - s, y);
      ctx.closePath();
      ctx.fill();
    };

    const dibujarRuta = (ruta: Ruta, a: number) => {
      ctx.strokeStyle = color(0.16 * a);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ruta.puntos.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
      // Los nodos: el cuadro pequeño del monograma en cada esquina.
      ctx.fillStyle = color(0.3 * a);
      for (const p of ruta.puntos) ctx.fillRect(p.x - 2.5, p.y - 2.5, 5, 5);
      // La estela y el rombo que recorren la ruta.
      const d = ruta.t * ruta.largo;
      const pasos = 14;
      for (let i = pasos; i >= 0; i--) {
        const q = puntoEn(ruta, Math.max(0, d - i * 6));
        ctx.fillStyle = color(0.5 * a * (1 - i / pasos));
        ctx.fillRect(q.x - 1, q.y - 1, 2, 2);
      }
      const p = puntoEn(ruta, d);
      ctx.fillStyle = color(0.85 * a);
      rombo(p.x, p.y, 5);
    };

    const dibujar = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const r of reglas) dibujarRegla(r, quieto ? 0.7 : respiro(t, r.fase, r.periodo));
      for (const ruta of rutas) dibujarRuta(ruta, quieto ? 0.7 : respiro(t, ruta.fase, ruta.periodo));
    };

    const paso = (t: number) => {
      raf = requestAnimationFrame(paso);
      const dt = Math.min(48, t - (previo || t));
      previo = t;
      for (const r of reglas) {
        r.x += r.velocidad * dt;
        if (r.x > w) r.x = -r.largo;
        if (r.x + r.largo < 0) r.x = w;
      }
      for (let i = 0; i < rutas.length; i++) {
        const ruta = rutas[i];
        ruta.t += (ruta.velocidad * dt) / ruta.largo * 4;
        if (ruta.t >= 1) rutas[i] = { ...nuevaRuta(), fase: ruta.fase };
      }
      dibujar(t);
    };

    const vista = new IntersectionObserver(([e]) => {
      if (quieto) return;
      if (e.isIntersecting && !raf) {
        previo = 0;
        raf = requestAnimationFrame(paso);
      } else if (!e.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    const tamano = new ResizeObserver(() => preparar());

    preparar();
    tamano.observe(el);
    vista.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      vista.disconnect();
      tamano.disconnect();
    };
  }
}

/** '#158DB4' → '21,141,180' para armar colores con transparencia. */
function rgb(hex: string): string {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
