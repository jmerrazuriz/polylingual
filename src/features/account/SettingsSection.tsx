import { useSpeech } from '../../lib/audio/useSpeech'
import { DAILY_GOALS, type Settings } from '../../lib/progress/model'
import { useProgress } from '../../lib/progress/store'

type Option<T> = { value: T; label: string }

function Segmented<T extends string | number>(props: {
  label: string
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
}) {
  const { label, value, options, onChange } = props
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-bold">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={String(o.value)}
            onClick={() => onChange(o.value)}
            aria-pressed={o.value === value}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
              o.value === value
                ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink'
                : 'border-slate-300 dark:border-slate-700'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

/** Ajustes de la app. Con cuenta se guardan; como invitado duran hasta cerrar la página. */
export function SettingsSection() {
  const settings = useProgress((s) => s.settings)
  const setSettings = useProgress((s) => s.setSettings)
  const { voiceFound, speak } = useSpeech()
  const set = <K extends keyof Settings>(key: K) => (value: Settings[K]) => setSettings({ [key]: value })

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-extrabold">Ajustes</h2>

      <Segmented
        label="Tema"
        value={settings.theme}
        onChange={set('theme')}
        options={[
          { value: 'system', label: 'Como el sistema' },
          { value: 'light', label: '☀️ Claro' },
          { value: 'dark', label: '🌙 Oscuro' },
        ]}
      />

      <Segmented
        label="Tamaño de letra"
        value={settings.fontScale}
        onChange={set('fontScale')}
        options={[
          { value: 'normal', label: 'Normal' },
          { value: 'large', label: 'Grande' },
        ]}
      />

      <Segmented
        label="Objetivo diario (respuestas por día)"
        value={settings.dailyGoal}
        onChange={set('dailyGoal')}
        options={DAILY_GOALS.map((g) => ({ value: g, label: `${g} · ${g === 10 ? 'suave' : g === 20 ? 'normal' : 'intenso'}` }))}
      />

      {voiceFound ? (
        <>
          <Segmented
            label="Audio"
            value={settings.audio ? 'on' : 'off'}
            onChange={(v) => setSettings({ audio: v === 'on' })}
            options={[
              { value: 'on', label: '🔊 Activado' },
              { value: 'off', label: '🔇 Apagado' },
            ]}
          />
          {settings.audio && (
            <Segmented
              label="Velocidad de la voz"
              value={settings.speechRate}
              onChange={(rate) => {
                setSettings({ speechRate: rate })
                speak('こんにちは')
              }}
              options={[
                { value: 0.6, label: 'Lenta' },
                { value: 0.8, label: 'Normal' },
                { value: 1, label: 'Rápida' },
              ]}
            />
          )}
        </>
      ) : (
        <p className="text-sm text-slate-500">
          Tu navegador no tiene una voz japonesa, así que no hay audio. En Android e iPhone suele venir instalada; en
          Windows se agrega desde Configuración → Hora e idioma → Voz.
        </p>
      )}
    </section>
  )
}
