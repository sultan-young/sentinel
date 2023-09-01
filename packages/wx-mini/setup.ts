import { proxyApp, proxyNetwork } from "./proxy";

export function setupApp() {
    proxyApp();
    proxyNetwork()
}