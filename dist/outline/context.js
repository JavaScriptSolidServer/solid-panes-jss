import { getOutliner } from '../index';
export function createContext(dom, paneRegistry, store, logic) {
  return {
    dom,
    getOutliner,
    session: {
      paneRegistry,
      store,
      // Cast to any to bridge solid-logic-jss and solid-logic type differences
      logic: logic
    }
  };
}
//# sourceMappingURL=context.js.map