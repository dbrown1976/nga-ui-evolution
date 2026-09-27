'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Eye, GripVertical, Image as ImageIcon, Info, Maximize2, Minimize2, MoreHorizontal, Plus, Sparkles, Upload, X } from 'lucide-react'
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
    legacy: '/images/1-blog-content-legacy.png',
    shipped: '/images/2-blog-content-shipped.png',
    direction: '/images/3-blog-content-final.png',
  },
  recipe: {
    legacy: '/images/1-recipe-page-legacy.png',
    shipped: '/images/2-recipe-page-shipped.png',
    direction: '/images/3-recipe-page-final.png',
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

type ThreePaneLayout = 'breakout' | 'contained'

export function ThreePaneView({ mode, focalPoint, layout = 'breakout', example: controlledExample, onExampleChange, showExampleSelector = true }: { mode: PreviewMode; focalPoint: boolean; layout?: ThreePaneLayout; example?: ExampleId; onExampleChange?: (example: ExampleId) => void; showExampleSelector?: boolean }) {
  const [selected, setSelected] = useState<StateId>('direction')
  const [internalExample, setInternalExample] = useState<ExampleId>('hero')
  const example = controlledExample ?? internalExample
  const setExample = onExampleChange ?? setInternalExample
  const paneGridRef = useRef<HTMLDivElement>(null)
  const [sharedViewportHeight, setSharedViewportHeight] = useState<number | null>(null)
  const mobile = mode !== 'desktop'

  useLayoutEffect(() => {
    const grid = paneGridRef.current
    if (!grid || mobile) return

    const updateSharedHeight = () => {
      const styles = getComputedStyle(grid)
      const columnGap = parseFloat(styles.columnGap) || 0
      const availableWidth = grid.clientWidth - columnGap * 2
      const selectedWidth = availableWidth * 0.76
      setSharedViewportHeight(selectedWidth * (10 / 16))
    }

    updateSharedHeight()
    const observer = new ResizeObserver(updateSharedHeight)
    observer.observe(grid)
    return () => observer.disconnect()
  }, [mobile])
  const carouselTabs = OPTION_A_PANES.map((pane) => ({ id: pane.id, eyebrow: pane.title.slice(0, 2), label: pane.tabLabel.replace(/^\d{2} · /, '') }))
  const renderPane = (state: StateId) => <OptionAExampleShot state={state} example={example} focalPoint={focalPoint} />
  return (
    <div className={cn('option-component', 'option-a', `option-a-${layout}`)}>
      {showExampleSelector && <OptionAExampleSelector example={example} setExample={setExample} />}
      <div className="option-a-desktop" data-mobile={mobile}>
        <div className="pane-comparison">
        <div
          ref={paneGridRef}
          className="pane-grid"
          data-selected={selected}
          data-example={example}
          style={sharedViewportHeight ? { '--option-a-shot-height': `${sharedViewportHeight}px` } as React.CSSProperties : undefined}
        >
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

export function OptionA(props: { mode: PreviewMode; focalPoint: boolean }) {
  return <ThreePaneView {...props} layout="breakout" />
}

function OptionB(props: { mode: PreviewMode; focalPoint: boolean }) {
  return <ThreePaneView {...props} layout="contained" />
}

function OptionC(props: { mode: PreviewMode; focalPoint: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const [example, setExample] = useState<ExampleId>('hero')

  return (
    <div className={cn('option-c-variant', { 'is-expanded': expanded })}>
      <div className="option-c-example-nav">
        <OptionAExampleSelector example={example} setExample={setExample} />
      </div>
      <PreviewFrame mode={props.mode}>
        <div className="option-c-shell">
          <div className="option-c-viewer-toolbar">
            <button
              type="button"
              className="option-c-expand-control"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              aria-label={expanded ? 'Collapse comparison' : 'Expand comparison'}
            >
              {expanded ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
              <span>{expanded ? 'Collapse' : 'Expand'}</span>
            </button>
          </div>
          <ThreePaneView {...props} layout="contained" example={example} onExampleChange={setExample} showExampleSelector={false} />
        </div>
      </PreviewFrame>
    </div>
  )
}

function OptionD(props: { mode: PreviewMode; focalPoint: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const [example, setExample] = useState<ExampleId>('hero')

  return (
    <div className={cn('option-c-variant', 'option-d-variant', { 'is-expanded': expanded })}>
      <div className="option-d-controls">
        <div className="option-c-example-nav">
          <OptionAExampleSelector example={example} setExample={setExample} />
        </div>
        <button
          type="button"
          className="option-c-expand-control"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse comparison' : 'Expand comparison'}
        >
          <span className="option-d-expand-icon" aria-hidden="true">
            <Maximize2 className="option-d-icon-expand" />
            <Minimize2 className="option-d-icon-collapse" />
          </span>
          <span className="option-d-expand-label" aria-hidden="true">
            <span className="option-d-label-expand">Expand</span>
            <span className="option-d-label-collapse">Collapse</span>
          </span>
        </button>
      </div>
      <PreviewFrame mode={props.mode}>
        <div className="option-c-shell">
          <ThreePaneView {...props} layout="contained" example={example} onExampleChange={setExample} showExampleSelector={false} />
        </div>
      </PreviewFrame>
    </div>
  )
}

export function PrototypePage() {
  const [mode, setMode] = useState<PreviewMode>('desktop')
  const [focalPoint, setFocalPoint] = useState(false)
  return <main className="prototype-page"><header className="prototype-header"><div className="prototype-kicker"><span className="kicker-rule" /> Interaction prototype <span>·</span> NGA reflection</div><div className="prototype-heading"><div><h1>Four ways to place the three-pane view.</h1><p>Testing the same three-pane comparison as a breakout treatment and within the portfolio grid.</p></div><div className="prototype-meta"><span>Prototype 01</span><span>September 2026</span></div></div><div className="prototype-controls"><ModeToggle mode={mode} setMode={setMode} /><label className="focal-toggle"><input type="checkbox" checked={focalPoint} onChange={(event) => setFocalPoint(event.target.checked)} /><span className="toggle-track"><Eye /></span> Show focal point</label><span className="control-note">Controls are testing-only · component width: {mode === 'desktop' ? '1120' : mode === 'tablet' ? '760' : '390'}px</span></div></header><section className="intro-note"><div className="intro-number">01</div><div><span className="section-kicker">SHARED TEST CONTENT</span><h2>One authoring task, three moments in its life.</h2><p>All four variants use the same content examples, screenshots and interaction model. Only the relationship to the portfolio grid and controls changes.</p></div></section><PrototypeOption id="A" title="Three-pane view, break the grid" description="The locked three-pane interaction breaks beyond the portfolio rail so the selected evidence remains large enough to inspect." render={(props) => <OptionA {...props} />} mode={mode} focalPoint={focalPoint} /><PrototypeOption id="B" title="Three-pane view, within the grid" description="The same interaction, images and 12 / 12 / 76 split constrained to the portfolio’s existing 1120px content rail." render={(props) => <OptionB {...props} />} mode={mode} focalPoint={focalPoint} /><PrototypeOption id="C" title="Three-pane view, expandable" description="Starts within the 1120px portfolio rail, then expands in place to the breakout width for closer inspection." render={(props) => <OptionC {...props} />} mode={mode} focalPoint={focalPoint} /><PrototypeOption id="D" title="Three-pane view, unified controls" description="A facsimile of Option C with Expand / Collapse promoted beside the example selector and tighter spacing into the viewer." render={(props) => <OptionD {...props} />} mode={mode} focalPoint={focalPoint} /><footer className="handoff"><div><span className="section-kicker">HANDOFF CHECKLIST</span><h2>Portable by design.</h2></div><div className="handoff-grid"><p><b>Copy the selected component</b><span>One Option file, the shared types/data, and the scoped stylesheet.</span></p><p><b>Keep the harness out</b><span>Preview sizing, readouts, focal-point tooling and labels stay in this prototype.</span></p><p><b>Bring your real data</b><span>Replace the dummy content contract with the case study&apos;s three UI renderers and assets.</span></p></div></footer></main>
}

function PrototypeOption({ id, title, description, render, mode, focalPoint }: { id: string; title: string; description: string; render: (props: { mode: PreviewMode; focalPoint: boolean }) => React.ReactNode; mode: PreviewMode; focalPoint: boolean }) {
  const content = render({ mode, focalPoint })
  return <section className="prototype-option"><div className="option-header"><div className="option-title"><span className="option-index">OPTION {id}</span><h2>{title}</h2></div><p>{description}</p></div>{id === 'C' || id === 'D' ? content : <PreviewFrame mode={mode}>{content}</PreviewFrame>}</section>
}

export default PrototypePage
