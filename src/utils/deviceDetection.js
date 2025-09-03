/**
 * Device Detection Utilities
 * Détection des types d'appareils pour optimiser l'expérience utilisateur
 */

/**
 * Détecte si l'appareil est un mobile
 * @returns {boolean} true si mobile, false sinon
 */
export function isMobile() {
  // Vérifier la largeur de l'écran
  const screenWidth = window.innerWidth || document.documentElement.clientWidth
  
  // Vérifier le user agent pour les appareils mobiles
  const mobileUserAgents = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
  const isMobileUserAgent = mobileUserAgents.test(navigator.userAgent)
  
  // Vérifier si c'est un écran tactile
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  // Considérer comme mobile si largeur < 768px OU user agent mobile OU écran tactile avec largeur < 1024px
  return screenWidth < 768 || isMobileUserAgent || (isTouchDevice && screenWidth < 1024)
}

/**
 * Détecte si l'appareil est une tablette
 * @returns {boolean} true si tablette, false sinon
 */
export function isTablet() {
  const screenWidth = window.innerWidth || document.documentElement.clientWidth
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const tabletUserAgents = /iPad|Android.*(?!Mobile)/i
  
  // Tablette si largeur entre 768px et 1024px avec écran tactile
  // OU si user agent indique une tablette
  return (screenWidth >= 768 && screenWidth <= 1024 && isTouchDevice) || 
         tabletUserAgents.test(navigator.userAgent)
}

/**
 * Détecte si l'appareil est un desktop
 * @returns {boolean} true si desktop, false sinon
 */
export function isDesktop() {
  return !isMobile() && !isTablet()
}

/**
 * Détecte si l'application peut être installée comme PWA
 * @returns {boolean} true si PWA installable, false sinon
 */
export function isPWAInstallable() {
  // Vérifier si beforeinstallprompt est disponible
  return 'serviceWorker' in navigator && window.matchMedia('(display-mode: standalone)').matches === false
}

/**
 * Détecte si l'application est déjà installée comme PWA
 * @returns {boolean} true si PWA installée, false sinon
 */
export function isPWAInstalled() {
  // Vérifier si l'app est en mode standalone
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true // iOS Safari
}

/**
 * Obtient le type d'appareil sous forme de string
 * @returns {'mobile'|'tablet'|'desktop'} type d'appareil
 */
export function getDeviceType() {
  if (isMobile()) return 'mobile'
  if (isTablet()) return 'tablet'
  return 'desktop'
}

/**
 * Obtient les classes CSS appropriées selon le type d'appareil
 * @returns {string} classes CSS séparées par des espaces
 */
export function getDeviceClasses() {
  const deviceType = getDeviceType()
  const classes = [`device-${deviceType}`]
  
  if (isPWAInstalled()) {
    classes.push('pwa-installed')
  }
  
  return classes.join(' ')
}

/**
 * Hook réactif pour Vue 3 - Détection d'appareil
 * À utiliser dans les composants Vue pour une détection réactive
 * @returns {object} objet réactif avec les propriétés de détection
 */
export function useDeviceDetection() {
  // Import dynamique pour éviter les erreurs si Vue n'est pas disponible
  let ref, onMounted, onUnmounted
  
  try {
    const vue = require('vue')
    ref = vue.ref
    onMounted = vue.onMounted
    onUnmounted = vue.onUnmounted
  } catch {
    // Fallback si Vue n'est pas disponible
    return {
      deviceType: getDeviceType(),
      isMobile: isMobile(),
      isTablet: isTablet(),
      isDesktop: isDesktop(),
      isPWAInstallable: isPWAInstallable(),
      isPWAInstalled: isPWAInstalled()
    }
  }
  
  const deviceType = ref(getDeviceType())
  const isMobileDevice = ref(isMobile())
  const isTabletDevice = ref(isTablet())
  const isDesktopDevice = ref(isDesktop())
  const isPWAInstallableDevice = ref(isPWAInstallable())
  const isPWAInstalledDevice = ref(isPWAInstalled())
  
  const updateDeviceInfo = () => {
    deviceType.value = getDeviceType()
    isMobileDevice.value = isMobile()
    isTabletDevice.value = isTablet()
    isDesktopDevice.value = isDesktop()
    isPWAInstallableDevice.value = isPWAInstallable()
    isPWAInstalledDevice.value = isPWAInstalled()
  }
  
  onMounted(() => {
    updateDeviceInfo()
    window.addEventListener('resize', updateDeviceInfo)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateDeviceInfo)
  })
  
  return {
    deviceType: deviceType.value,
    isMobile: isMobileDevice.value,
    isTablet: isTabletDevice.value,
    isDesktop: isDesktopDevice.value,
    isPWAInstallable: isPWAInstallableDevice.value,
    isPWAInstalled: isPWAInstalledDevice.value
  }
}
