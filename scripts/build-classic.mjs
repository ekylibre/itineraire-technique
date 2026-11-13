// Génère js/chart-render.js (script classique, pour une balise <script>) depuis
// le module ES js/rotation-renderer.mjs, sans outil de construction : on retire
// l'import d'ECharts (variable globale `echarts` dans ce cas) et les `export`,
// puis on publie la classe sur window, comme avant.
import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync(new URL("../js/rotation-renderer.mjs", import.meta.url), "utf8");
let classic = source
    .replace(/^\/\/ <echarts-modules>[\s\S]*?^\/\/ <\/echarts-modules>\n/m, "")
    .replace(/^import \* as echarts from "echarts(\/core)?";\n/m, "")
    .replace(/^export default RotationRenderer;\n/m, "")
    .replace(/^export \{[^}]*\};\n/m, "")
    .replace(/^export class /m, "class ");

if (/^\s*(import|export)\b/m.test(classic))
    throw new Error("build-classic : un import ou un export n'a pas été converti.");

classic = "// Fichier généré par `npm run build:js` depuis js/rotation-renderer.mjs : ne pas modifier.\n"
    + classic.trimEnd() + "\n\nwindow.RotationRenderer = RotationRenderer;\n";
writeFileSync(new URL("../js/chart-render.js", import.meta.url), classic);
console.log("js/chart-render.js généré.");
