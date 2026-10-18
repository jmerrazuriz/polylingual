import type { EuroCourse } from '../../courses/euro'
import { euroCourses } from '../../courses/euroCourses'
import { useProgress } from '../../lib/progress/store'

/** El curso europeo activo (alemán o francés). Fuera de ellos, el alemán (las rutas lo evitan con EuroOnly). */
export function useEuroCourse(): EuroCourse {
  const id = useProgress((s) => s.course)
  return euroCourses[id] ?? euroCourses.de
}
