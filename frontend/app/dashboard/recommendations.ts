type RecentRecord = {
  created_at?: string | null
}

type HealthRecord = RecentRecord & {
  temperature?: number | null
  weight?: number | null
  symptoms?: string[] | null
}

type FeedingRecord = RecentRecord & {
  frequency?: number | null
}

type ActivityRecord = RecentRecord & {
  duration?: string | number | null
}

export type RecommendationTone = 'success' | 'info' | 'warning' | 'critical'
export type RecommendationIcon = 'check' | 'info' | 'warning' | 'critical'

export interface DashboardRecommendationItem {
  text: string
  tone: RecommendationTone
  icon: RecommendationIcon
}

export interface DashboardRecommendationState {
  statusLabel: string
  statusTone: RecommendationTone
  summary: string
  recommendations: DashboardRecommendationItem[]
}

interface BuildRecommendationsInput {
  petName: string
  healthRecords: HealthRecord[]
  feedingRecords: FeedingRecord[]
  activityRecords: ActivityRecord[]
}

const MAX_RECOMMENDATIONS = 4
const HEALTHY_TEMPERATURE_MIN = 37.5
const HEALTHY_TEMPERATURE_MAX = 39.5

function daysSince(dateValue?: string | null) {
  if (!dateValue) return null
  const timestamp = Date.parse(dateValue)
  if (Number.isNaN(timestamp)) return null
  return Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24))
}

function parseDurationMinutes(duration?: string | number | null) {
  if (typeof duration === 'number') return Number.isFinite(duration) ? duration : null
  if (typeof duration !== 'string') return null

  const match = duration.match(/\d+(?:\.\d+)?/)
  if (!match) return null

  const parsed = Number.parseFloat(match[0])
  return Number.isFinite(parsed) ? parsed : null
}

function countRecent(records: RecentRecord[], maxAgeDays: number) {
  return records.filter(record => {
    const age = daysSince(record.created_at)
    return age !== null && age <= maxAgeDays
  }).length
}

function sumRecentMinutes(records: ActivityRecord[], maxAgeDays: number) {
  return records.reduce((total, record) => {
    const age = daysSince(record.created_at)
    if (age === null || age > maxAgeDays) return total

    const minutes = parseDurationMinutes(record.duration)
    return total + (minutes ?? 0)
  }, 0)
}

function latestAge(records: RecentRecord[]) {
  return daysSince(records[0]?.created_at)
}

function item(text: string, tone: RecommendationTone, icon: RecommendationIcon): DashboardRecommendationItem {
  return { text, tone, icon }
}

export function buildPetRecommendations({
  petName,
  healthRecords,
  feedingRecords,
  activityRecords,
}: BuildRecommendationsInput): DashboardRecommendationState {
  const safePetName = petName.trim() || 'tu mascota'
  const latestHealth = healthRecords[0]
  const previousHealth = healthRecords[1]
  const latestHealthAge = latestAge(healthRecords)
  const latestFeedingAge = latestAge(feedingRecords)
  const latestActivityAge = latestAge(activityRecords)

  const recentHealthCount = countRecent(healthRecords, 30)
  const recentFeedingCount = countRecent(feedingRecords, 7)
  const recentActivityCount = countRecent(activityRecords, 7)
  const recentActivityMinutes = sumRecentMinutes(activityRecords, 7)

  const recommendations: DashboardRecommendationItem[] = []

  if (!healthRecords.length && !feedingRecords.length && !activityRecords.length) {
    return {
      statusLabel: 'Sin registros',
      statusTone: 'info',
      summary: `${safePetName} todavía no tiene historial suficiente para generar recomendaciones personalizadas.`,
      recommendations: [
        item(`Empieza registrando un control de salud para crear la línea base de ${safePetName}.`, 'info', 'info'),
        item('Añade un registro de alimentación para seguir su dieta habitual.', 'success', 'check'),
        item('Registra una sesión de actividad para medir su rutina semanal.', 'success', 'check'),
      ],
    }
  }

  if (latestHealth) {
    const symptoms = Array.isArray(latestHealth.symptoms) ? latestHealth.symptoms : []

    if (symptoms.length > 0) {
      recommendations.push(item(
        `${safePetName} tiene ${symptoms.length} síntoma${symptoms.length > 1 ? 's' : ''} registrado${symptoms.length > 1 ? 's' : ''}; revisa si conviene agendar una consulta veterinaria.`,
        'critical',
        'critical'
      ))
    }

    if (typeof latestHealth.temperature === 'number') {
      if (latestHealth.temperature < HEALTHY_TEMPERATURE_MIN) {
        recommendations.push(item(
          `La temperatura más reciente de ${safePetName} es ${latestHealth.temperature}°C, por debajo del rango esperado; conviene vigilarla.`,
          'critical',
          'critical'
        ))
      } else if (latestHealth.temperature > HEALTHY_TEMPERATURE_MAX) {
        recommendations.push(item(
          `La temperatura más reciente de ${safePetName} es ${latestHealth.temperature}°C, por encima del rango esperado; considera una revisión.`,
          'critical',
          'critical'
        ))
      }
    }

    if (typeof latestHealth.weight === 'number' && typeof previousHealth?.weight === 'number') {
      const previousWeight = previousHealth.weight
      if (previousWeight > 0) {
        const change = Math.abs(latestHealth.weight - previousWeight)
        const changePct = (change / previousWeight) * 100
        if (changePct >= 10) {
          recommendations.push(item(
            `El peso de ${safePetName} cambió ${changePct.toFixed(1)}% entre los dos últimos controles; revisa su evolución con más detalle.`,
            'warning',
            'warning'
          ))
        }
      }
    }

    if (latestHealthAge !== null && latestHealthAge > 30) {
      recommendations.push(item(
        `El último control de salud de ${safePetName} tiene ${latestHealthAge} días; actualiza el registro para no perder seguimiento.`,
        'warning',
        'warning'
      ))
    }
  } else {
    recommendations.push(item(
      `Aún no hay un control de salud para ${safePetName}; registrar uno ayudaría a detectar cambios temprano.`,
      'info',
      'info'
    ))
  }

  if (feedingRecords.length > 0) {
    if (recentFeedingCount === 0) {
      recommendations.push(item(
        `No hay registros de alimentación en los últimos 7 días para ${safePetName}; conviene volver a registrar su dieta.`,
        'warning',
        'warning'
      ))
    } else if (recentFeedingCount < 3) {
      recommendations.push(item(
        `Solo tienes ${recentFeedingCount} registro${recentFeedingCount > 1 ? 's' : ''} de alimentación reciente para ${safePetName}; añade más datos para ver mejor sus patrones.`,
        'info',
        'info'
      ))
    }

    if (latestFeedingAge !== null && latestFeedingAge > 3) {
      recommendations.push(item(
        `El último registro de comida de ${safePetName} ya tiene ${latestFeedingAge} días; actualiza su rutina si hubo cambios.`,
        'warning',
        'warning'
      ))
    }
  } else {
    recommendations.push(item(
      `Comienza a registrar la alimentación de ${safePetName} para ajustar horarios, cantidades y frecuencia.`,
      'success',
      'check'
    ))
  }

  if (activityRecords.length > 0) {
    if (recentActivityCount === 0) {
      recommendations.push(item(
        `No hay actividad registrada en los últimos 7 días para ${safePetName}; intenta recuperar su rutina de movimiento.`,
        'warning',
        'warning'
      ))
    }

    if (recentActivityMinutes < 90) {
      recommendations.push(item(
        `La actividad semanal de ${safePetName} suma solo ${recentActivityMinutes} minutos; intenta acercarte a 90 minutos o más.`,
        'info',
        'info'
      ))
    }

    if (latestActivityAge !== null && latestActivityAge > 7) {
      recommendations.push(item(
        `La última sesión de actividad de ${safePetName} fue hace ${latestActivityAge} días; registra una nueva para mantener el seguimiento.`,
        'warning',
        'warning'
      ))
    }
  } else {
    recommendations.push(item(
      `Registra sesiones de actividad de ${safePetName} para comparar su energía y progreso semanal.`,
      'success',
      'check'
    ))
  }

  if (recommendations.length === 0) {
    recommendations.push(item(
      `El historial de ${safePetName} se ve estable; mantén los registros al día para conservar esta tendencia.`,
      'success',
      'check'
    ))
  }

  const recentSignals = recentHealthCount + recentFeedingCount + recentActivityCount
  const overallTone: RecommendationTone = recommendations.some(entry => entry.tone === 'critical')
    ? 'critical'
    : recommendations.some(entry => entry.tone === 'warning')
      ? 'warning'
      : recentSignals >= 4
        ? 'success'
        : 'info'

  const statusLabel =
    overallTone === 'critical' ? 'Atención'
      : overallTone === 'warning' ? 'Revisar'
      : overallTone === 'success' ? 'Buen ritmo'
      : 'En análisis'

  const summary =
    overallTone === 'critical'
      ? `${safePetName} muestra señales que conviene revisar con prioridad.`
      : overallTone === 'warning'
        ? `${safePetName} tiene algunos indicadores para reforzar esta semana.`
        : overallTone === 'success'
          ? `${safePetName} mantiene un historial consistente y estable.`
          : `${safePetName} sigue generando datos útiles para afinar sus recomendaciones.`

  return {
    statusLabel,
    statusTone: overallTone,
    summary,
    recommendations: recommendations.slice(0, MAX_RECOMMENDATIONS),
  }
}