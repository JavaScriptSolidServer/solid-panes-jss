/**
 * Lazy-loaded dashboard and preferences panes
 */
import * as UI from 'solid-ui-jss'

const ns = UI.ns

export const dashboardPane = {
  icon: UI.icons.iconBase + 'noun_547570.svg',
  name: 'dashboard',

  label: function (subject, context) {
    // Dashboard only shows for site root
    if (subject.site && subject.uri === subject.site().uri) {
      return 'Dashboard'
    }
    return null
  },

  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "dashboard-pane" */ '../dashboard/dashboardPane')
    const realPane = mod.default || mod
    return realPane.render(subject, context)
  }
}

export const basicPreferencesPane = {
  icon: UI.icons.iconBase + 'noun_547570.svg',
  name: 'basicPreferences',

  label: function (subject, context) {
    return null // Controlled by dashboard
  },

  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "dashboard-pane" */ '../dashboard/basicPreferences')
    const realPane = mod.default || mod
    return realPane.render(subject, context)
  }
}

export const trustedApplicationsPane = {
  icon: UI.icons.iconBase + 'noun_15177.svg',
  name: 'trustedApplications',
  global: true,

  label: function (subject, context) {
    return null // Global pane, doesn't match subjects
  },

  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "dashboard-pane" */ '../trustedApplications/trustedApplications.view')
    const realPane = mod.default || mod
    return realPane.render(subject, context)
  }
}
