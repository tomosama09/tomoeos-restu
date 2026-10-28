
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  AppsExplorerWindow: typeof import("../../components/apps/explorer/ExplorerWindow.vue")['default']
  AppsExplorerPaneAbout: typeof import("../../components/apps/explorer/PaneAbout.vue")['default']
  AppsExplorerPaneContact: typeof import("../../components/apps/explorer/PaneContact.vue")['default']
  AppsExplorerPaneExperience: typeof import("../../components/apps/explorer/PaneExperience.vue")['default']
  AppsExplorerPaneFaq: typeof import("../../components/apps/explorer/PaneFaq.vue")['default']
  AppsExplorerPaneMediaLibrary: typeof import("../../components/apps/explorer/PaneMediaLibrary.vue")['default']
  AppsExplorerPaneServices: typeof import("../../components/apps/explorer/PaneServices.vue")['default']
  AppsPlayerTomoePlayer: typeof import("../../components/apps/player/TomoePlayer.vue")['default']
  AppsUtilitiesCalculatorApp: typeof import("../../components/apps/utilities/CalculatorApp.vue")['default']
  AppsUtilitiesGamesApp: typeof import("../../components/apps/utilities/GamesApp.vue")['default']
  AppsUtilitiesNotepadApp: typeof import("../../components/apps/utilities/NotepadApp.vue")['default']
  CommonWindowFrame: typeof import("../../components/common/WindowFrame.vue")['default']
  DesktopAeroTaskbar: typeof import("../../components/desktop/AeroTaskbar.vue")['default']
  DesktopIcon: typeof import("../../components/desktop/DesktopIcon.vue")['default']
  DesktopShell: typeof import("../../components/desktop/DesktopShell.vue")['default']
  DesktopStartMenu: typeof import("../../components/desktop/StartMenu.vue")['default']
  DesktopTaskbarPreview: typeof import("../../components/desktop/TaskbarPreview.vue")['default']
  NuxtWelcome: typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtPage: typeof import("../../../porto baru/node_modules/nuxt/dist/pages/runtime/page-placeholder")['default']
  NoScript: typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyAppsExplorerWindow: LazyComponent<typeof import("../../components/apps/explorer/ExplorerWindow.vue")['default']>
  LazyAppsExplorerPaneAbout: LazyComponent<typeof import("../../components/apps/explorer/PaneAbout.vue")['default']>
  LazyAppsExplorerPaneContact: LazyComponent<typeof import("../../components/apps/explorer/PaneContact.vue")['default']>
  LazyAppsExplorerPaneExperience: LazyComponent<typeof import("../../components/apps/explorer/PaneExperience.vue")['default']>
  LazyAppsExplorerPaneFaq: LazyComponent<typeof import("../../components/apps/explorer/PaneFaq.vue")['default']>
  LazyAppsExplorerPaneMediaLibrary: LazyComponent<typeof import("../../components/apps/explorer/PaneMediaLibrary.vue")['default']>
  LazyAppsExplorerPaneServices: LazyComponent<typeof import("../../components/apps/explorer/PaneServices.vue")['default']>
  LazyAppsPlayerTomoePlayer: LazyComponent<typeof import("../../components/apps/player/TomoePlayer.vue")['default']>
  LazyAppsUtilitiesCalculatorApp: LazyComponent<typeof import("../../components/apps/utilities/CalculatorApp.vue")['default']>
  LazyAppsUtilitiesGamesApp: LazyComponent<typeof import("../../components/apps/utilities/GamesApp.vue")['default']>
  LazyAppsUtilitiesNotepadApp: LazyComponent<typeof import("../../components/apps/utilities/NotepadApp.vue")['default']>
  LazyCommonWindowFrame: LazyComponent<typeof import("../../components/common/WindowFrame.vue")['default']>
  LazyDesktopAeroTaskbar: LazyComponent<typeof import("../../components/desktop/AeroTaskbar.vue")['default']>
  LazyDesktopIcon: LazyComponent<typeof import("../../components/desktop/DesktopIcon.vue")['default']>
  LazyDesktopShell: LazyComponent<typeof import("../../components/desktop/DesktopShell.vue")['default']>
  LazyDesktopStartMenu: LazyComponent<typeof import("../../components/desktop/StartMenu.vue")['default']>
  LazyDesktopTaskbarPreview: LazyComponent<typeof import("../../components/desktop/TaskbarPreview.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtPage: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/pages/runtime/page-placeholder")['default']>
  LazyNoScript: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../../porto baru/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
