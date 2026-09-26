'use client'

import { useEffect, useMemo, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Eye, GripVertical, Image as ImageIcon, Info, MoreHorizontal, Plus, Sparkles, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StateId = 'legacy' | 'shipped' | 'direction'
export type PreviewMode = 'desktop' | 'tablet' | 'mobile'

export type DummyContent = {
  title: string
  product: string
  description: string
  category: string
  collection: string
  status: string
  updated: string
  imageLabel: string
}

export const CONTENT: DummyContent = {
  title: 'Spring collection / hero story',
  product: 'Morrow Carryall 02',
  description: 'A considered everyday tote made from recycled nylon, designed for the space between work and weekend.',
  category: 'Travel / Carry goods',
  collection: 'Spring 2025',
  status: 'Ready to publish',
  updated: 'Edited 14 min ago by Alex Morgan',
  imageLabel: 'morrow-carryall-02.jpg',
}

export const STATES: { id: StateId; label: string; eyebrow: string; accent: string }[] = [
  { id: 'legacy', label: 'Legacy', eyebrow: '01', accent: '#8e6b55' },
  { id: 'shipped', label: 'NGA · Shipped', eyebrow: '02', accent: '#42768a' },
  { id: 'direction', label: 'Final', eyebrow: '03', accent: '#a8d3c2' },
]

/** Option A comparison chrome — quiet portfolio annotation (copy only). */
const OPTION_A_PANES: { id: StateId; title: string; meta: string; metaDetail: string | null; tabLabel: string }[] = [
  { id: 'legacy', title: '01 · Shipped 2018', meta: 'Authoring v1.0', metaDetail: null, tabLabel: '01 · Shipped 2018' },
  { id: 'shipped', title: '02 · Shipped 2026', meta: 'Authoring v2.0', metaDetail: 'Existing CMS shell', tabLabel: '02 · Shipped 2026' },
  { id: 'direction', title: '03 · Approved direction', meta: 'Authoring workbench', metaDetail: 'Reworked CMS shell', tabLabel: '03 · Approved direction' },
]

type ExampleId = 'hero' | 'blog' | 'recipe'

const OPTION_A_EXAMPLES: { id: ExampleId; label: string }[] = [
  { id: 'hero', label: 'Simple hero banner' },
  { id: 'blog', label: 'Structured blog content' },
  { id: 'recipe', label: 'Composable recipe page' },
]

/** Per-example pane assets (three examples × three panes). */
const OPTION_A_EXAMPLE_SHOTS: Record<ExampleId, Record<StateId, string>> = {
  hero: {
    legacy: '/images/1-hero-banner-legacy.png',
    shipped: '/images/2-hero-banner-shipped.png',
    direction: '/images/3-hero-banner-final.png',
  },
  blog: {
    legacy: '/images/1-blog-legacy.png',
    shipped: '/images/2-blog-shipped.png',
    direction: '/images/3-blog-final.png',
  },
  recipe: {
    legacy: '/images/1-recipe-legacy.png',
    shipped: '/images/2-recipe-shipped.png',
    direction: '/images/3-recipe-final.png',
  },
}

function paneClass(state: StateId) {
  if (state === 'legacy') return 'dummy-legacy'
  if (state === 'shipped') return 'dummy-shipped'
  return 'dummy-direction'
}

export function stateLabel(id: StateId) {
  return STATES.find((state) => state.id === id)?.label ?? id
}

function Field({ label, value, className, hint }: { label: string; value: string; className?: string; hint?: string }) {
  return <label className={cn('proto-field', className)}><span>{label}</span><strong>{value}</strong>{hint && <small>{hint}</small>}</label>
}

function AssetPreview({ variant }: { variant: StateId }) {
  return <div className={cn('asset-preview', `asset-${variant}`)}>
    <div className="asset-shape asset-shape-a" /><div className="asset-shape asset-shape-b" />
    <div className="asset-copy"><span>MORROW</span><b>CARRYALL</b><i>02</i></div>
    <span className="asset-file">{CONTENT.imageLabel}</span>
  </div>
}

export function DummyAuthoringUI({ state, focalPoint = false }: { state: StateId; focalPoint?: boolean }) {
  if (state === 'legacy') return <LegacyUI focalPoint={focalPoint} />
  if (state === 'shipped') return <ShippedUI focalPoint={focalPoint} />
  return <DirectionUI focalPoint={focalPoint} />
}

function FocalMark() { return <span className="focal-mark" aria-label="Temporary focal point" /> }

function GenerationShot({ src, alt, className, focalPoint }: { src: string | null; alt: string; className: string; focalPoint: boolean }) {
  return <section className={cn('dummy-ui generation-shot-wrap', className, !src && 'generation-placeholder')} aria-label={alt}>
    {src ? <img className="generation-shot" src={src} alt="" /> : <div className="generation-shot generation-shot-blank" aria-hidden="true" />}
    {focalPoint && <FocalMark />}
  </section>
}

function LegacyUI({ focalPoint }: { focalPoint: boolean }) {
  return <GenerationShot className="dummy-legacy" src="/images/1-hero-banner-legacy.png" alt="Legacy authoring interface" focalPoint={focalPoint} />
}

function ShippedUI({ focalPoint }: { focalPoint: boolean }) {
  return <GenerationShot className="dummy-shipped" src="/images/2-hero-banner-shipped.png" alt="NGA shipped authoring interface" focalPoint={focalPoint} />
}

function DirectionUI({ focalPoint }: { focalPoint: boolean }) {
  return <GenerationShot className="dummy-direction" src="/images/3-hero-banner-final.png" alt="Final authoring interface" focalPoint={focalPoint} />
}

function OptionAExampleShot({ state, example, focalPoint }: { state: StateId; example: ExampleId; focalPoint: boolean }) {
  const src = OPTION_A_EXAMPLE_SHOTS[example][state]
  const labels = { legacy: 'Legacy', shipped: 'NGA shipped', direction: 'Approved direction' } as const
  return <GenerationShot className={paneClass(state)} src={src} alt={`${labels[state]} — ${OPTION_A_EXAMPLES.find((e) => e.id === example)?.label ?? example}`} focalPoint={focalPoint} />
}

function OptionAExampleSelector({ example, setExample }: { example: ExampleId; setExample: (id: ExampleId) => void }) {
  const index = OPTION_A_EXAMPLES.findIndex((item) => item.id === example)
  const selectAt = (i: number) => {
    const next = OPTION_A_EXAMPLES[(i + OPTION_A_EXAMPLES.length) % OPTION_A_EXAMPLES.length]
    setExample(next.id)
    requestAnimationFrame(() => {
      const el = document.querySelector(`.option-a .example-selector-option[data-example="${next.id}"]`) as HTMLButtonElement | null
      el?.focus()
    })
  }
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      selectAt(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      selectAt(index - 1)
    } else if (event.key === '1' || event.key === '2' || event.key === '3') {
      event.preventDefault()
      selectAt(Number(event.key) - 1)
    }
  }
  return (
    <div className="example-selector" role="tablist" aria-label="Content example" onKeyDown={onKeyDown}>
      {OPTION_A_EXAMPLES.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          data-example={item.id}
          aria-selected={example === item.id}
          tabIndex={example === item.id ? 0 : -1}
          className={cn('example-selector-option', { selected: example === item.id })}
          onClick={() => setExample(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

function ModeToggle({ mode, setMode }: { mode: PreviewMode; setMode: (mode: PreviewMode) => void }) {
  return <div className="mode-toggle" role="group" aria-label="Preview size"><span>Preview</span>{(['desktop', 'tablet', 'mobile'] as PreviewMode[]).map((item) => <button key={item} className={cn({ active: mode === item })} onClick={() => setMode(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}</div>
}

function DebugReadout({ mode, width, selected, interaction, proportions }: { mode: PreviewMode; width: number; selected: StateId; interaction: string; proportions?: string }) {
  return <div className="debug-readout"><span><b>width</b> {width}px</span><span><b>mode</b> {mode}</span><span><b>state</b> {stateLabel(selected)}</span><span><b>interaction</b> {interaction}</span>{proportions && <span><b>split</b> {proportions}</span>}</div>
}

function PreviewFrame({ mode, children }: { mode: PreviewMode; children: React.ReactNode }) {
  const width = mode === 'desktop' ? 1120 : mode === 'tablet' ? 760 : 390
  return <div className={cn('preview-frame-wrap', `preview-${mode}`)}><div className={cn('preview-canvas', `viewport-${mode}`)} style={{ '--preview-width': `${width}px` } as React.CSSProperties}>{children}</div></div>
}

function CarouselFallback({ selected, setSelected, focalPoint, tabs, renderPane }: { selected: StateId; setSelected: (state: StateId) => void; focalPoint: boolean; tabs?: { id: StateId; eyebrow: string; label: string }[]; renderPane?: (state: StateId) => React.ReactNode }) {
  const items = tabs ?? STATES.map((state) => ({ id: state.id, eyebrow: state.eyebrow, label: state.label }))
  const index = items.findIndex((s) => s.id === selected)
  const move = (direction: number) => setSelected(items[(index + direction + items.length) % items.length].id)
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === 'ArrowLeft') move(-1); if (event.key === 'ArrowRight') move(1) }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) })
  return <div className="carousel-fallback"><div className="carousel-tabs">{items.map((state) => <button key={state.id} className={cn({ active: state.id === selected })} onClick={() => setSelected(state.id)}><span>{state.eyebrow}</span>{state.label}</button>)}</div><div className="carousel-stage"><button className="carousel-arrow" onClick={() => move(-1)} aria-label="Previous state"><ArrowLeft /></button><div className="carousel-ui">{renderPane ? renderPane(selected) : <DummyAuthoringUI state={selected} focalPoint={focalPoint} />}</div><button className="carousel-arrow" onClick={() => move(1)} aria-label="Next state"><ArrowRight /></button></div></div>
}

export function OptionA({ mode, focalPoint }: { mode: PreviewMode; focalPoint: boolean }) {
  const [selected, setSelected] = useState<StateId>('direction')
  const [example, setExample] = useState<ExampleId>('hero')
  const mobile = mode !== 'desktop'
  const carouselTabs = OPTION_A_PANES.map((pane) => ({ id: pane.id, eyebrow: pane.title.slice(0, 2), label: pane.tabLabel.replace(/^\d{2} · /, '') }))
  const renderPane = (state: StateId) => <OptionAExampleShot state={state} example={example} focalPoint={focalPoint} />
  return (
    <div className="option-component option-a">
      <OptionAExampleSelector example={example} setExample={setExample} />
      <div className="option-a-desktop" data-mobile={mobile}>
        <div className="pane-comparison">
        <div className="pane-grid" data-selected={selected} data-example={example}>
          {OPTION_A_PANES.map((pane) => (
            <button
              key={pane.id}
              type="button"
              className={cn('pane', `pane-${pane.id}`, { selected: selected === pane.id })}
              onClick={() => setSelected(pane.id)}
              aria-pressed={selected === pane.id}
              aria-label={pane.tabLabel}
            >
              <div className="pane-label">
                <span className="pane-label-title">{pane.title}</span>
                <span className="pane-label-meta">
                  {pane.meta}
                  {pane.metaDetail && (
                    <span className="pane-label-meta-detail"> · {pane.metaDetail}</span>
                  )}
                </span>
              </div>
              <div className="pane-viewport">
                <OptionAExampleShot key={`${example}-${pane.id}`} state={pane.id} example={example} focalPoint={focalPoint} />
              </div>
            </button>
          ))}
        </div>
        </div>
      </div>
      <div className="option-mobile">
        <CarouselFallback selected={selected} setSelected={setSelected} focalPoint={focalPoint} tabs={carouselTabs} renderPane={renderPane} />
      </div>
    </div>
  )
}

export function OptionB({ mode, focalPoint }: { mode: PreviewMode; focalPoint: boolean }) {
  const [selected, setSelected] = useState<StateId>('direction')
  const historical = selected !== 'direction'
  const mobile = mode !== 'desktop'
  return <div className="option-component option-b"><div className="option-b-desktop" data-mobile={mobile}><div className={cn('hero-layout', { 'history-open': historical })}><button className="inset inset-legacy" onClick={() => setSelected('legacy')}><span className="inset-label">01 · Legacy</span><div><DummyAuthoringUI state="legacy" focalPoint={focalPoint} /></div></button><div className="hero-direction"><div className="hero-caption"><span>03 · Primary direction</span><button className={cn({ active: selected === 'direction' })} onClick={() => setSelected('direction')}>Return to direction <X /></button></div><div className="hero-viewport"><DummyAuthoringUI state="direction" focalPoint={focalPoint} /></div></div><button className="inset inset-shipped" onClick={() => setSelected('shipped')}><span className="inset-label">02 · NGA · Shipped</span><div><DummyAuthoringUI state="shipped" focalPoint={focalPoint} /></div></button></div></div><div className="option-mobile"><CarouselFallback selected={selected} setSelected={setSelected} focalPoint={focalPoint} /></div><DebugReadout mode={mode} width={mode === 'desktop' ? 1120 : mode === 'tablet' ? 760 : 390} selected={selected} interaction={mobile ? 'sequential comparison' : historical ? 'historical inset expanded' : 'direction hero + insets'} /></div>
}

export function OptionC({ mode, focalPoint }: { mode: PreviewMode; focalPoint: boolean }) {
  const [selected, setSelected] = useState<StateId>('direction')
  const selectedIndex = STATES.findIndex((state) => state.id === selected)
  const others = STATES.filter((state) => state.id !== selected)
  const mobile = mode !== 'desktop'
  return <div className="option-component option-c"><div className="option-c-desktop" data-mobile={mobile}><div className="focus-shell"><aside className="comparison-rail"><div className="rail-heading"><span>EVOLUTION</span><small>Choose a state</small></div>{STATES.map((state) => <button key={state.id} className={cn({ active: state.id === selected })} onClick={() => setSelected(state.id)}><span className="rail-number">{state.eyebrow}</span><span><b>{state.label}</b><small>{state.id === 'legacy' ? 'The original system' : state.id === 'shipped' ? 'What shipped' : 'A possible next step'}</small></span>{state.id === selected && <Check />}</button>)}<div className="rail-note"><Info /><span>One high-fidelity state at a time keeps craft inspectable.</span></div></aside><div className="focus-canvas"><div className="focus-canvas-top"><span>COMPARISON CANVAS</span><span>{selectedIndex + 1} / 3</span></div><div className="focus-ui"><DummyAuthoringUI state={selected} focalPoint={focalPoint} /></div><div className="focus-neighbours">{others.map((state) => <button key={state.id} onClick={() => setSelected(state.id)}><span>{state.eyebrow} · {state.label}</span><div><DummyAuthoringUI state={state.id} /></div><ArrowRight /></button>)}</div></div></div></div><div className="option-mobile"><CarouselFallback selected={selected} setSelected={setSelected} focalPoint={focalPoint} /></div><DebugReadout mode={mode} width={mode === 'desktop' ? 1120 : mode === 'tablet' ? 760 : 390} selected={selected} interaction={mobile ? 'sequential comparison' : 'focus + comparison rail'} /></div>
}

export function PrototypePage() {
  const [mode, setMode] = useState<PreviewMode>('desktop')
  const [focalPoint, setFocalPoint] = useState(false)
  return <main className="prototype-page"><header className="prototype-header"><div className="prototype-kicker"><span className="kicker-rule" /> Interaction prototype <span>·</span> NGA reflection</div><div className="prototype-heading"><div><h1>Three ways to show a system evolving.</h1><p>Exploring how Legacy, NGA · Shipped and Design direction can share one story without flattening the detail of any state.</p></div><div className="prototype-meta"><span>Prototype 01</span><span>September 2026</span></div></div><div className="prototype-controls"><ModeToggle mode={mode} setMode={setMode} /><label className="focal-toggle"><input type="checkbox" checked={focalPoint} onChange={(event) => setFocalPoint(event.target.checked)} /><span className="toggle-track"><Eye /></span> Show focal point</label><span className="control-note">Controls are testing-only · component width: {mode === 'desktop' ? '1120' : mode === 'tablet' ? '760' : '390'}px</span></div></header><section className="intro-note"><div className="intro-number">01</div><div><span className="section-kicker">SHARED TEST CONTENT</span><h2>One authoring task, three moments in its life.</h2><p>Each candidate uses the same fictional Morrow Carryall story. The interfaces are intentionally different generations, but the product name, description, image, taxonomy and publishing state remain traceable.</p></div></section><PrototypeOption id="A" title="Expanding three-pane" description="A simultaneous view where the selected state takes the room it needs, while the other two remain spatially present." render={(props) => <OptionA {...props} />} mode={mode} focalPoint={focalPoint} /><PrototypeOption id="B" title="Direction hero + expanding insets" description="A direction-first composition that keeps the future-facing state dominant, with historical states growing into the hero context when inspected." render={(props) => <OptionB {...props} />} mode={mode} focalPoint={focalPoint} /><PrototypeOption id="C" title="Focus + comparison rail" description="One high-fidelity canvas, a persistent chronology and restrained previews that keep the relationship between generations visible." render={(props) => <OptionC {...props} />} mode={mode} focalPoint={focalPoint} /><footer className="handoff"><div><span className="section-kicker">HANDOFF CHECKLIST</span><h2>Portable by design.</h2></div><div className="handoff-grid"><p><b>Copy the selected component</b><span>One Option file, the shared types/data, and the scoped stylesheet.</span></p><p><b>Keep the harness out</b><span>Preview sizing, readouts, focal-point tooling and labels stay in this prototype.</span></p><p><b>Bring your real data</b><span>Replace the dummy content contract with the case study&apos;s three UI renderers and assets.</span></p></div></footer></main>
}

function PrototypeOption({ id, title, description, render, mode, focalPoint }: { id: string; title: string; description: string; render: (props: { mode: PreviewMode; focalPoint: boolean }) => React.ReactNode; mode: PreviewMode; focalPoint: boolean }) {
  return <section className="prototype-option"><div className="option-header"><div className="option-title"><span className="option-index">OPTION {id}</span><h2>{title}</h2></div><p>{description}</p></div><PreviewFrame mode={mode}>{render({ mode, focalPoint })}</PreviewFrame></section>
}

export default PrototypePage
