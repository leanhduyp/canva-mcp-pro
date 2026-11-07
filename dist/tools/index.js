import { registerVisualTools } from "./visual-tools.js";
import { registerConnectTools } from "./connect-tools.js";
import { registerTasteTools } from "./taste-tools.js";
export function registerAllTools(server) {
    registerVisualTools(server);
    registerConnectTools(server);
    registerTasteTools(server);
}
//# sourceMappingURL=index.js.map