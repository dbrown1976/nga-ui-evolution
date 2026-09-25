'use client'

import { useEffect, useMemo, useState } from 'react'
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
  { id: 'direction', label: 'Design direction', eyebrow: '03', accent: '#a8d3c2' },
]

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

function LegacyUI({ focalPoint }: { focalPoint: boolean }) {
  return <section className="dummy-ui dummy-legacy" aria-label="Legacy authoring interface">
    <header className="legacy-top"><span className="legacy-logo">content<span>desk</span></span><span>Workspace / Spring 2025</span><button aria-label="More options"><MoreHorizontal /></button></header>
    <div className="legacy-toolbar"><button>‹ Back to items</button><span>Page ID: MOR-2048</span><button>Save draft</button></div>
    <div className="legacy-body">
      <div className="legacy-title-row"><div><small>EDIT CONTENT ITEM</small><h2>{CONTENT.title}</h2></div><span className="legacy-status">DRAFT</span></div>
      <div className="legacy-form"><div className="legacy-main"><div className="legacy-panel"><Field label="Product name" value={CONTENT.product} />{focalPoint && <FocalMark />}<Field label="Description" value={CONTENT.description} className="field-tall" /><Field label="Image" value={CONTENT.imageLabel} hint="JPG, PNG or GIF · Max 10MB" /><button className="legacy-upload"><Upload /> Choose file</button></div><div className="legacy-panel"><h3>Details</h3><Field label="Category" value={CONTENT.category} /><Field label="Collection" value={CONTENT.collection} /><Field label="URL slug" value="morrow-carryall-02" /></div></div><aside className="legacy-preview"><h3>Preview</h3><AssetPreview variant="legacy" /><small>Last saved: {CONTENT.updated}</small></aside></div>
      <footer className="legacy-footer"><button>Cancel</button><button className="legacy-primary">Save changes</button></footer>
    </div>
  </section>
}

function ShippedUI({ focalPoint }: { focalPoint: boolean }) {
  return <section className="dummy-ui dummy-shipped" aria-label="NGA shipped authoring interface">
    <header className="shipped-top"><div className="shipped-brand"><span className="brand-mark">N</span><span>Authoring</span></div><nav><span>Content</span><span>Media</span><span>Settings</span></nav><div className="avatar">AM</div></header>
    <div className="shipped-breadcrumb"><span>Spring 2025</span><b>/</b><span>Content items</span><b>/</b><strong>{CONTENT.title}</strong></div>
    <div className="shipped-body"><div className="shipped-heading"><div><span className="section-kicker">PRODUCT STORY · EDITING</span><h2>{CONTENT.title}</h2><p>Build and publish a complete content story.</p></div><div className="shipped-actions"><span className="status-pill"><Check /> {CONTENT.status}</span><button className="button-ghost">Preview</button><button className="button-solid">Publish</button></div></div>
      <div className="shipped-grid"><div className="shipped-column"><div className="shipped-card"><div className="card-heading"><div><h3>Content details</h3><p>Give this story a clear, useful name.</p></div><Info /></div><Field label="Product name" value={CONTENT.product} />{focalPoint && <FocalMark />}<Field label="Description" value={CONTENT.description} className="field-tall" /></div><div className="shipped-card"><div className="card-heading"><div><h3>Classification</h3><p>Help people find this content later.</p></div></div><div className="field-row"><Field label="Category" value={CONTENT.category} /><Field label="Collection" value={CONTENT.collection} /></div></div></div><div className="shipped-column"><div className="shipped-card media-card"><div className="card-heading"><div><h3>Featured image</h3><p>Use a landscape image at least 1600px wide.</p></div><button aria-label="Media options"><MoreHorizontal /></button></div><AssetPreview variant="shipped" /><div className="media-meta"><span>{CONTENT.imageLabel}</span><small>2400 × 1600 · 1.8 MB</small></div></div><div className="shipped-card status-card"><div><h3>Publishing</h3><p>Visible on the Spring 2025 site.</p></div><span className="toggle-on"><span /></span></div></div></div>
    </div>
  </section>
}

function DirectionUI({ focalPoint }: { focalPoint: boolean }) {
  return <section className="dummy-ui dummy-direction" aria-label="Design direction authoring interface">
    <aside className="direction-sidebar"><div className="direction-logo"><span>n</span> northstar</div><div className="direction-rail"><span className="rail-active"><GripVertical /> Library</span><span>Collections</span><span>Media</span></div><div className="direction-help"><Sparkles /><span>Need a hand?<small>Open guidance</small></span></div></aside>
    <div className="direction-main"><header className="direction-header"><div><span className="direction-breadcrumb">LIBRARY / SPRING 2025 / STORY</span><h2>{CONTENT.title}</h2></div><div className="direction-header-actions"><span className="saved-dot"><Check /> Saved</span><button aria-label="More options"><MoreHorizontal /></button></div></header>
      <div className="direction-content"><div className="direction-intro"><div><span className="section-kicker">STORY BUILDER</span><h3>Shape the story behind the product.</h3></div><span className="direction-step">02 <i>/ 04</i></span></div><div className="direction-layout"><div className="direction-editor"><div className="direction-card"><div className="direction-card-top"><div><span className="card-index">01</span><h4>Identity</h4></div><Check /></div><Field label="Product name" value={CONTENT.product} />{focalPoint && <FocalMark />}<div className="direction-inline"><Field label="Category" value={CONTENT.category} /><Field label="Collection" value={CONTENT.collection} /></div></div><div className="direction-card direction-description"><div className="direction-card-top"><div><span className="card-index">02</span><h4>Story</h4></div><span className="card-required">Required</span></div><Field label="Description" value={CONTENT.description} className="field-tall" /><div className="writing-tip"><Sparkles /><span><b>A little more context?</b><small>Stories with a point of view perform better.</small></span></div></div></div><div className="direction-preview"><div className="preview-label"><span>LIVE PREVIEW</span><span className="preview-live"><span /> Autosaved</span></div><AssetPreview variant="direction" /><div className="preview-product"><span>{CONTENT.category}</span><h4>{CONTENT.product}</h4><p>{CONTENT.description}</p></div><div className="preview-footer"><span>{CONTENT.updated}</span><button className="button-solid">Continue <ArrowRight /></button></div></div></div></div>
    </div>
  </section>
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

function CarouselFallback({ selected, setSelected, focalPoint }: { selected: StateId; setSelected: (state: StateId) => void; focalPoint: boolean }) {
  const index = STATES.findIndex((s) => s.id === selected)
  const move = (direction: number) => setSelected(STATES[(index + direction + STATES.length) % STATES.length].id)
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === 'ArrowLeft') move(-1); if (event.key === 'ArrowRight') move(1) }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) })
  return <div className="carousel-fallback"><div className="carousel-tabs">{STATES.map((state) => <button key={state.id} className={cn({ active: state.id === selected })} onClick={() => setSelected(state.id)}><span>{state.eyebrow}</span>{state.label}</button>)}</div><div className="carousel-stage"><button className="carousel-arrow" onClick={() => move(-1)} aria-label="Previous state"><ArrowLeft /></button><div className="carousel-ui"><DummyAuthoringUI state={selected} focalPoint={focalPoint} /></div><button className="carousel-arrow" onClick={() => move(1)} aria-label="Next state"><ArrowRight /></button></div></div>
}

export function OptionA({ mode, focalPoint }: { mode: PreviewMode; focalPoint: boolean }) {
  const [selected, setSelected] = useState<StateId>('direction')
  const mobile = mode !== 'desktop'
  const proportions = selected === 'direction' ? '18 / 18 / 64' : selected === 'legacy' ? '64 / 12 / 24' : '12 / 64 / 24'
  return <div className="option-component option-a"><div className="option-a-desktop" data-mobile={mobile}><div className="pane-grid" data-selected={selected}>{STATES.map((state) => <button key={state.id} className={cn('pane', `pane-${state.id}`, { selected: selected === state.id })} onClick={() => setSelected(state.id)}><div className="pane-label"><span>{state.eyebrow}</span><b>{state.label}</b><i>{selected === state.id ? 'Inspecting' : 'Select'}</i></div><div className="pane-viewport"><DummyAuthoringUI state={state.id} focalPoint={focalPoint} /></div></button>)}</div></div><div className="option-mobile"><CarouselFallback selected={selected} setSelected={setSelected} focalPoint={focalPoint} /></div><DebugReadout mode={mode} width={mode === 'desktop' ? 1120 : mode === 'tablet' ? 760 : 390} selected={selected} interaction={mobile ? 'sequential comparison' : 'expanding three-pane'} proportions={proportions} /></div>
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
