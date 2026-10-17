import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

function makeBallTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024; canvas.height = 512
  const ctx = canvas.getContext('2d')
  const bg = ctx.createLinearGradient(0, 0, 1024, 512)
  bg.addColorStop(0, '#f8f8f4'); bg.addColorStop(.5, '#d9dad6'); bg.addColorStop(1, '#ffffff')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 1024, 512)
  // Repeating stitched pentagon/hexagon panel motif, painted onto a spherical texture.
  const rows = 5, cols = 10, r = 39
  for (let y = -1; y < rows + 1; y++) for (let x = -1; x < cols + 1; x++) {
    const cx = x * 106 + (y % 2 ? 53 : 0), cy = y * 105 + 12
    const dark = (x + y * 2) % 3 === 0 || (x - y) % 7 === 0
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 3 * i + Math.PI / 6
      const px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)
    }
    ctx.closePath()
    if (dark) { ctx.fillStyle = '#101111'; ctx.fill(); ctx.strokeStyle = '#343535' }
    else { ctx.fillStyle = '#f6f6f2'; ctx.fill(); ctx.strokeStyle = '#aeb0ad' }
    ctx.lineWidth = 3; ctx.stroke()
    // Fine seam highlights create the tactile, stitched leather look.
    ctx.beginPath(); ctx.moveTo(cx-r*.55,cy-r*.65); ctx.lineTo(cx-r*.1,cy-r*.91)
    ctx.strokeStyle = dark ? '#4c4d4d' : '#fff'; ctx.lineWidth = 1.5; ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function Football({ ballRef }) {
  const mountRef = useRef(null)
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let renderer, scene, camera, ball, frame, disposed = false
    try {
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
      camera.position.set(0, 0, 5.6)
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.12
      mount.appendChild(renderer.domElement)
      const geometry = new THREE.SphereGeometry(1.22, 96, 64)
      const material = new THREE.MeshStandardMaterial({ map: makeBallTexture(), roughness: .52, metalness: .015 })
      ball = new THREE.Mesh(geometry, material)
      ball.rotation.set(.22, -.35, .18)
      ballRef.current = ball
      scene.add(ball)
      scene.add(new THREE.HemisphereLight(0xe9f4ec, 0x101510, 2.0))
      const key = new THREE.DirectionalLight(0xffffff, 4.0); key.position.set(-3, 4, 5); scene.add(key)
      const rim = new THREE.DirectionalLight(0x8cff52, 2.5); rim.position.set(4, -1, -3); scene.add(rim)
      const fill = new THREE.PointLight(0xffffff, 14, 12); fill.position.set(1, 2, 4); scene.add(fill)
      const resize = () => {
        const w = Math.max(1, mount.clientWidth), h = Math.max(1, mount.clientHeight)
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix()
      }
      resize(); const observer = new ResizeObserver(resize); observer.observe(mount)
      const render = () => { if (disposed) return; renderer.render(scene, camera); frame = requestAnimationFrame(render) }
      render()
      return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); geometry.dispose(); material.map?.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove(); ballRef.current = null }
    } catch (e) {
      console.warn('3D rendering unavailable; showing CSS fallback.', e)
      mount.classList.add('webgl-fallback')
    }
  }, [ballRef])
  return <div className="ball-canvas" ref={mountRef} aria-label="Rotating black-and-white football" role="img"><div className="fallback-ball" /></div>
}

const metrics = [
  { value: '120+', label: 'COUNTRIES', note: 'One game. Every corner.' },
  { value: '3.5B', label: 'FANS WORLDWIDE', note: 'A global heartbeat.' },
  { value: '90′', label: 'MINUTES', note: 'Every second matters.' },
]
const microWords = ['PASSION', 'TEAMWORK', 'ONE WORLD', 'FOOTBALL', 'ENERGY', 'BELIEVE', 'THE BEAUTIFUL GAME', 'NO LIMITS', 'PLAY BOLD', 'UNITY', 'EVERY TOUCH', 'ONE LOVE', 'MAKE IT COUNT', 'FEEL THE GAME', 'ITZFIZZ']

export default function App() {
  const rootRef = useRef(null), heroRef = useRef(null), ballWrapRef = useRef(null), ballRef = useRef(null), trailRef = useRef(null), headlineRef = useRef(null), cardsRef = useRef([]), microRef = useRef([])
  useEffect(() => {
    const root = rootRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(ballWrapRef.current, { x: 0, rotation: 0 })
        gsap.set(cardsRef.current, { opacity: 1, y: 0 })
        gsap.set(microRef.current, { opacity: 1, y: 0, x: 0 })
        return
      }
      const travel = () => Math.max(0, window.innerWidth - (window.innerWidth < 600 ? 190 : window.innerWidth < 900 ? 260 : 360))
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        trigger: heroRef.current, start: 'top top', end: () => `+=${Math.round(window.innerHeight * 2.5)}`,
        scrub: 0.7, pin: true, anticipatePin: 1, invalidateOnRefresh: true
      }})
      tl.fromTo(ballWrapRef.current, { x: () => -travel() * .42, rotation: -18 }, { x: () => travel() * .53, rotation: 710, duration: 1 }, 0)
        .fromTo(trailRef.current, { scaleX: .08, opacity: .2 }, { scaleX: 1, opacity: .82, duration: .75 }, 0.06)
        .fromTo(headlineRef.current.querySelectorAll('.headline-line'), { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%', stagger: .08, duration: .62 }, 0.03)
        .fromTo(cardsRef.current, { y: 32, opacity: 0 }, { y: 0, opacity: 1, stagger: .12, duration: .28 }, .46)
        .to(cardsRef.current, { y: -10, duration: .12, stagger: .04 }, .88)
        .fromTo(microRef.current, { opacity: 0, y: (i) => (i % 2 ? 18 : -18), x: (i) => (i % 3 - 1) * 26, scale: .88 }, { opacity: 1, y: 0, x: 0, scale: 1, stagger: { each: .045, from: 'random' }, duration: .22 }, .12)
        .to(microRef.current, { y: (i) => (i % 2 ? -9 : 9), opacity: .48, stagger: { each: .018, from: 'end' }, duration: .2 }, .77)
      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh)
      return () => window.removeEventListener('load', refresh)
    }, root)
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('resize', refresh)
    return () => { window.removeEventListener('resize', refresh); ctx.revert() }
  }, [])

  return <main id="top" ref={rootRef}>
    <section className="hero" ref={heroRef}>
      <div className="topbar"><a className="wordmark" href="#top" aria-label="ITZFIZZ home">ITZ<span>FIZZ</span><i>®</i></a><span className="top-note">THE BEAUTIFUL GAME, IN MOTION</span><a className="menu-link" href="#numbers">SCROLL <span>↘</span></a></div>
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <div className="hero-copy" ref={headlineRef}>
        <div className="eyebrow"><span className="live-dot"/> A GAME WITHOUT BORDERS <span className="eyebrow-line"/></div>
        <h1><span className="headline-line white-line">WELCOME</span><span className="headline-line green-line">ITZFIZZ</span></h1>
        <p className="intro">BUILT ON PASSION.<br/>DRIVEN BY THE GAME.</p>
      </div>
      <div className="micro-cloud" aria-hidden="true">{microWords.map((word, i) => <span className={`micro-word micro-${i % 5}`} key={word} ref={el => microRef.current[i] = el}>{word}</span>)}</div>
      <div className="ball-stage" aria-hidden="true">
        <div className="light-trail" ref={trailRef}/><div className="ball-shadow"/><div className="ball-wrap" ref={ballWrapRef}><Football ballRef={ballRef}/></div>
      </div>
      <div className="hero-bottom"><span>01 / THE WORLD'S GAME</span><span className="scroll-cue"><i/> SCROLL TO MOVE</span><span>EST. EVERYWHERE</span></div>
      <div className="metrics" id="numbers">{metrics.map((m, i) => <article className="metric-card" key={m.value} ref={el => cardsRef.current[i] = el}><div className="metric-index">0{i+1} <span>—</span> FIELD NOTES</div><strong>{m.value}</strong><div className="metric-label">{m.label}</div><p>{m.note}</p><span className="card-arrow">↗</span></article>)}</div>
    </section>
  </main>
}
