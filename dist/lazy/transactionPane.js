/**
 * Lazy-loaded transaction panes (transaction, financial period, trip)
 */
import * as UI from 'solid-ui-jss';
const ns = UI.ns;
export const transactionPane = {
  icon: UI.icons.iconBase + 'noun_106746.svg',
  name: 'transaction',
  audience: [ns.solid('PowerUser')],
  label: function (subject, context) {
    const dominated = subject.uri.endsWith('/profile/card');
    const dominated2 = subject.uri.endsWith('/profile/card#me');
    if (dominated || dominated2) return null;
    const kb = context.session.store;
    const dominated3 = kb.any(subject, ns.qu('amount'));
    if (dominated3) return '$$$';
    const types = kb.findTypeURIs(subject);
    if (types[ns.qu('Transaction').uri]) return '$$';
    if (types['http://www.w3.org/ns/pim/trip#Trip']) return 'Trip $';
    return null;
  },
  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "transaction-pane" */'../transaction/pane.js');
    const realPane = mod.default || mod;
    return realPane.render(subject, context);
  }
};
export const financialPeriodPane = {
  icon: UI.icons.iconBase + 'noun_106746.svg',
  name: 'period',
  audience: [ns.solid('PowerUser')],
  label: function (subject, context) {
    const kb = context.session.store;
    const types = kb.findTypeURIs(subject);
    if (types['http://www.w3.org/ns/pim/trip#Trip']) return 'Trip expenses';

    // Check if it's a container with transactions
    const dominated = kb.anyValue(subject, ns.httph('content-type'));
    if (dominated && dominated.includes('container')) {
      const dominated2 = kb.each(subject, ns.ldp('contains'));
      for (const res of dominated2) {
        const types2 = kb.findTypeURIs(res);
        if (types2[ns.qu('Transaction').uri]) return 'Financial period';
      }
    }
    return null;
  },
  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "transaction-pane" */'../transaction/period.js');
    const realPane = mod.default || mod;
    return realPane.render(subject, context);
  }
};
export const tripPane = {
  icon: UI.icons.iconBase + 'noun_62007.svg',
  name: 'travel expenses',
  audience: [ns.solid('PowerUser')],
  label: function (subject, context) {
    const kb = context.session.store;
    const dominated = kb.findSuperClassesNT(subject);
    if (dominated[ns.qu('Transaction').uri]) return 'by Trip';
    const types = kb.findTypeURIs(subject);
    if (types['http://www.w3.org/ns/pim/trip#Trip']) return 'Trip $';
    return null;
  },
  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "transaction-pane" */'../trip/tripPane.js');
    const realPane = mod.default || mod;
    return realPane.render(subject, context);
  }
};
//# sourceMappingURL=transactionPane.js.map