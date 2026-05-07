import { useMemo, useState } from 'react'
import { useEditor } from './store/editor'
import { LeftPanel } from './components/LeftPanel'
import { CenterPanel } from './components/CenterPanel'
import { RightPanel } from './components/RightPanel'
import { composeAuto } from './lib/composer'
import { validate } from './lib/validate'
import { t, type Lang } from './lib/i18n'

type Tab = 'setup' | 'blocks' | 'prompt'

function App() {
  const recipe = useEditor((s) => s.recipe)
  const generation = useEditor((s) => s.generation)
  const lang = useEditor((s) => s.lang)

  const composed = useMemo(() => composeAuto(recipe), [recipe])
  const issues = useMemo(() => validate({ generation, recipe }), [generation, recipe])

  const [tab, setTab] = useState<Tab>('blocks')

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 min-h-0 hidden lg:grid grid-cols-[280px_minmax(0,1fr)_minmax(0,1fr)] gap-4 px-5 py-4">
        <aside className="overflow-auto pr-1">
          <LeftPanel issues={issues} />
        </aside>
        <main className="overflow-auto pr-1">
          <CenterPanel />
        </main>
        <section className="overflow-hidden flex flex-col">
          <RightPanel composed={composed} issues={issues} />
        </section>
      </div>

      <div className="lg:hidden flex flex-col flex-1 min-h-0">
        <nav className="flex border-b border-ink-700 bg-ink-800">
          {([
            { id: 'setup' as Tab, key: 'tab.setup' },
            { id: 'blocks' as Tab, key: 'tab.blocks' },
            { id: 'prompt' as Tab, key: 'tab.prompt' },
          ]).map((tt) => (
            <button
              key={tt.id}
              type="button"
              onClick={() => setTab(tt.id)}
              className={
                'flex-1 py-3 text-sm font-medium border-b-2 transition-colors ' +
                (tab === tt.id ? 'border-accent-500 text-white' : 'border-transparent text-ink-300')
              }
            >
              {t(lang, tt.key)}
            </button>
          ))}
        </nav>
        <div className="flex-1 min-h-0 overflow-auto p-4">
          {tab === 'setup' && <LeftPanel issues={issues} />}
          {tab === 'blocks' && <CenterPanel />}
          {tab === 'prompt' && <RightPanel composed={composed} issues={issues} />}
        </div>
      </div>
    </div>
  )
}

function Header() {
  const lang = useEditor((s) => s.lang)
  const setLang = useEditor((s) => s.setLang)
  return (
    <header className="border-b border-ink-700 bg-ink-800/80 backdrop-blur sticky top-0 z-10">
      <div className="px-5 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Logo />
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-ink-100 leading-tight">{t(lang, 'app.title')}</h1>
            <p className="text-[11px] text-ink-400 truncate">{t(lang, 'app.subtitle')}</p>
          </div>
        </div>
        <LangSwitcher lang={lang} onChange={setLang} />
      </div>
    </header>
  )
}

function LangSwitcher({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div
      className="flex p-0.5 bg-ink-700 rounded-md text-xs"
      role="tablist"
      aria-label={t(lang, 'header.lang')}
    >
      {(['en', 'ru'] as const).map((code) => {
        const active = lang === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            className={
              'px-2.5 py-1 rounded font-medium uppercase transition-colors ' +
              (active ? 'bg-accent-500 text-white' : 'text-ink-300 hover:text-white')
            }
            aria-selected={active}
            role="tab"
          >
            {code}
          </button>
        )
      })}
    </div>
  )
}

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="shrink-0">
      <rect x="2" y="2" width="28" height="28" rx="7" fill="#1b1f26" stroke="#3a4150" />
      <rect x="6" y="6" width="8" height="8" rx="2" fill="#7c8cff" />
      <rect x="18" y="6" width="8" height="8" rx="2" fill="#3a4150" />
      <rect x="6" y="18" width="8" height="8" rx="2" fill="#3a4150" />
      <rect x="18" y="18" width="8" height="8" rx="2" fill="#7c8cff" />
    </svg>
  )
}

export default App
