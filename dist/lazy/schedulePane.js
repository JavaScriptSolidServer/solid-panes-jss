/**
 * Lazy-loaded schedule pane wrapper
 */
import * as UI from 'solid-ui-jss';
const ns = UI.ns;
export const schedulePane = {
  icon: UI.icons.iconBase + 'noun_346777.svg',
  name: 'schedule',
  audience: [ns.solid('PowerUser')],
  label: function (subject, context) {
    const kb = context.session.store;
    const types = kb.findTypeURIs(subject);
    if (types['http://www.w3.org/ns/pim/schedule#SchedulableEvent']) {
      return 'Scheduling poll';
    }
    return null;
  },
  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "schedule-pane" */'../schedule/schedulePane.js');
    const realPane = mod.schedulePane || mod.default || mod;
    return realPane.render(subject, context);
  },
  mintNew: async function (context, options) {
    const mod = await import(/* webpackChunkName: "schedule-pane" */'../schedule/schedulePane.js');
    const realPane = mod.schedulePane || mod.default || mod;
    if (realPane.mintNew) {
      return realPane.mintNew(context, options);
    }
    return null;
  },
  mintClass: ns.sched('SchedulableEvent')
};
//# sourceMappingURL=schedulePane.js.map