// Utilidad para enviar eventos al dataLayer de forma consistente

/**
 * Envía un evento al dataLayer para Google Tag Manager
 * @param eventName Nombre del evento
 * @param eventParams Parámetros adicionales del evento
 */
export function sendEvent(eventName: string, eventParams: Record<string, any> = {}) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
      timestamp: new Date().toISOString(),
      page_path: window.location.pathname,
      page_title: document.title,
    })
  }
}

/**
 * Envía un evento de vista de página al dataLayer
 * @param pagePath Ruta de la página
 * @param pageTitle Título de la página
 */
export function sendPageView(pagePath: string, pageTitle: string) {
  sendEvent("page_view", {
    page_path: pagePath,
    page_title: pageTitle,
  })
}

/**
 * Envía un evento de interacción con un elemento al dataLayer
 * @param category Categoría de la interacción (ej: 'button', 'link', 'form')
 * @param action Acción realizada (ej: 'click', 'submit', 'view')
 * @param label Etiqueta descriptiva (opcional)
 * @param value Valor numérico (opcional)
 */
export function sendInteraction(category: string, action: string, label?: string, value?: number) {
  sendEvent("user_interaction", {
    interaction_category: category,
    interaction_action: action,
    interaction_label: label,
    interaction_value: value,
  })
}
