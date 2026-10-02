import {
  ChartLine, Circle, ClipboardCheck, Database, Gauge, GraduationCap, Handshake, HeartHandshake,
  HouseHeart, Layers, LucideIconData, Mountain, Network, Puzzle, Ruler, Server, ShieldCheck,
  Workflow
} from 'lucide-angular';

/**
 * Los íconos que se pueden nombrar desde `contenido.json`.
 *
 * Solo entran al paquete los que están aquí (Lucide trae más de mil). Para
 * usar uno nuevo en el contenido: importarlo y agregarlo con su nombre de
 * https://lucide.dev, en minúsculas con guiones.
 */
const ICONOS: Record<string, LucideIconData> = {
  'chart-line': ChartLine,
  'clipboard-check': ClipboardCheck,
  'database': Database,
  'gauge': Gauge,
  'graduation-cap': GraduationCap,
  'handshake': Handshake,
  'heart-handshake': HeartHandshake,
  'house-heart': HouseHeart,
  'layers': Layers,
  'mountain': Mountain,
  'network': Network,
  'puzzle': Puzzle,
  'ruler': Ruler,
  'server': Server,
  'shield-check': ShieldCheck,
  'workflow': Workflow
};

/** El ícono con ese nombre; si no está registrado, un círculo y un aviso en consola. */
export function icono(nombre: string): LucideIconData {
  const i = ICONOS[nombre];
  if (!i) {
    console.warn(`[MetroTech] Ícono «${nombre}» no registrado en src/app/marca/iconos.ts`);
  }
  return i ?? Circle;
}
