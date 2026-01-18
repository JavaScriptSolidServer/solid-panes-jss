import { DataBrowserContext, PaneRegistry } from 'pane-registry'
import { getOutliner } from '../index'
import { SolidLogic } from 'solid-logic-jss'
import { LiveStore } from 'rdflib'

export function createContext (
  dom: HTMLDocument,
  paneRegistry: PaneRegistry,
  store: LiveStore,
  logic: SolidLogic
): DataBrowserContext {
  return {
    dom,
    getOutliner,
    session: {
      paneRegistry,
      store,
      // Cast to any to bridge solid-logic-jss and solid-logic type differences
      logic: logic as any
    }
  }
}
