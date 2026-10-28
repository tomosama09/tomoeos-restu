
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


export const AppsExplorerWindow: typeof import("../components/apps/explorer/ExplorerWindow.vue")['default']
export const AppsExplorerPaneAbout: typeof import("../components/apps/explorer/PaneAbout.vue")['default']
export const AppsExplorerPaneContact: typeof import("../components/apps/explorer/PaneContact.vue")['default']
export const AppsExplorerPaneExperience: typeof import("../components/apps/explorer/PaneExperience.vue")['default']
export const AppsExplorerPaneFaq: typeof import("../components/apps/explorer/PaneFaq.vue")['default']
export const AppsExplorerPaneMediaLibrary: typeof import("../components/apps/explorer/PaneMediaLibrary.vue")['default']
export const AppsExplorerPaneServices: typeof import("../components/apps/explorer/PaneServices.vue")['default']
export const AppsPlayerTomoePlayer: typeof import("../components/apps/player/TomoePlayer.vue")['default']
export const AppsUtilitiesCalculatorApp: typeof import("../components/apps/utilities/CalculatorApp.vue")['default']
export const AppsUtilitiesGamesApp: typeof import("../components/apps/utilities/GamesApp.vue")['default']
export const AppsUtilitiesNotepadApp: typeof import("../components/apps/utilities/NotepadApp.vue")['default']
export const CommonWindowFrame: typeof import("../components/common/WindowFrame.vue")['default']
export const DesktopAeroTaskbar: typeof import("../components/desktop/AeroTaskbar.vue")['default']
export const DesktopIcon: typeof import("../components/desktop/DesktopIcon.vue")['default']
export const DesktopShell: typeof import("../components/desktop/DesktopShell.vue")['default']
export const DesktopStartMenu: typeof import("../components/desktop/StartMenu.vue")['default']
export const DesktopTaskbarPreview: typeof import("../components/desktop/TaskbarPreview.vue")['default']
export const NuxtWelcome: typeof import("../../porto baru/node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../../porto baru/node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../../porto baru/node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../../porto baru/node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../../porto baru/node_modules/nuxt/dist/pages/runtime/page-placeholder")['default']
export const NoScript: typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyAppsExplorerWindow: LazyComponent<typeof import("../components/apps/explorer/ExplorerWindow.vue")['default']>
export const LazyAppsExplorerPaneAbout: LazyComponent<typeof import("../components/apps/explorer/PaneAbout.vue")['default']>
export const LazyAppsExplorerPaneContact: LazyComponent<typeof import("../components/apps/explorer/PaneContact.vue")['default']>
export const LazyAppsExplorerPaneExperience: LazyComponent<typeof import("../components/apps/explorer/PaneExperience.vue")['default']>
export const LazyAppsExplorerPaneFaq: LazyComponent<typeof import("../components/apps/explorer/PaneFaq.vue")['default']>
export const LazyAppsExplorerPaneMediaLibrary: LazyComponent<typeof import("../components/apps/explorer/PaneMediaLibrary.vue")['default']>
export const LazyAppsExplorerPaneServices: LazyComponent<typeof import("../components/apps/explorer/PaneServices.vue")['default']>
export const LazyAppsPlayerTomoePlayer: LazyComponent<typeof import("../components/apps/player/TomoePlayer.vue")['default']>
export const LazyAppsUtilitiesCalculatorApp: LazyComponent<typeof import("../components/apps/utilities/CalculatorApp.vue")['default']>
export const LazyAppsUtilitiesGamesApp: LazyComponent<typeof import("../components/apps/utilities/GamesApp.vue")['default']>
export const LazyAppsUtilitiesNotepadApp: LazyComponent<typeof import("../components/apps/utilities/NotepadApp.vue")['default']>
export const LazyCommonWindowFrame: LazyComponent<typeof import("../components/common/WindowFrame.vue")['default']>
export const LazyDesktopAeroTaskbar: LazyComponent<typeof import("../components/desktop/AeroTaskbar.vue")['default']>
export const LazyDesktopIcon: LazyComponent<typeof import("../components/desktop/DesktopIcon.vue")['default']>
export const LazyDesktopShell: LazyComponent<typeof import("../components/desktop/DesktopShell.vue")['default']>
export const LazyDesktopStartMenu: LazyComponent<typeof import("../components/desktop/StartMenu.vue")['default']>
export const LazyDesktopTaskbarPreview: LazyComponent<typeof import("../components/desktop/TaskbarPreview.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/pages/runtime/page-placeholder")['default']>
export const LazyNoScript: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../../porto baru/node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
