import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { getRnaStructure, getSpherePositions, getUnfoldedPositions, type RnaMode, type Vec3 } from '../data/rna'

const DURATION = 16
const TAU = Math.PI * 2
const BASE_COLORS: Record<string, string> = {
  A: '#8bf0c5',
  U: '#74cfe3',
  G: '#e6c985',
  C: '#c3a6d9',
}

interface RnaSceneProps {
  mode: RnaMode
  view: '2d' | '3d' | 'orb'
  playing: boolean
  variant?: 'hero' | 'page'
}

declare global {
  interface Window {
    __SCENE_READY__?: boolean
    __seek?: (time: number) => void
    __RNA_STATS__?: { fps: number; drawCalls: number; nucleotides: number; renderer: string }
  }
}

const tempVectorA = new THREE.Vector3()
const tempVectorB = new THREE.Vector3()
const tempMidpoint = new THREE.Vector3()
const tempDirection = new THREE.Vector3()
const tempQuaternion = new THREE.Quaternion()
const tempScale = new THREE.Vector3()
const tempMatrix = new THREE.Matrix4()
const yAxis = new THREE.Vector3(0, 1, 0)

function smoothFold(time: number) {
  return 0.22 + 0.78 * (0.5 - 0.5 * Math.cos(TAU * time / DURATION))
}

function interpolatedPositions(time: number, folded: Vec3[], unfolded: Vec3[]) {
  const fold = smoothFold(time)
  return folded.map((target, index) => {
    const origin = unfolded[index]
    const breathing = Math.sin(TAU * time / DURATION + index * 0.21) * 0.025 * fold
    return [
      origin[0] + (target[0] - origin[0]) * fold,
      origin[1] + (target[1] - origin[1]) * fold + breathing,
      origin[2] + (target[2] - origin[2]) * fold,
    ] as Vec3
  })
}

function setRodTransform(mesh: THREE.InstancedMesh, index: number, a: Vec3, b: Vec3) {
  tempVectorA.set(...a)
  tempVectorB.set(...b)
  tempMidpoint.copy(tempVectorA).add(tempVectorB).multiplyScalar(0.5)
  tempDirection.copy(tempVectorB).sub(tempVectorA)
  const length = Math.max(0.001, tempDirection.length())
  tempQuaternion.setFromUnitVectors(yAxis, tempDirection.normalize())
  tempScale.set(1, length, 1)
  tempMatrix.compose(tempMidpoint, tempQuaternion, tempScale)
  mesh.setMatrixAt(index, tempMatrix)
}

export default function RnaScene({ mode, view, playing, variant = 'hero' }: RnaSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playingRef = useRef(playing)
  const timeRef = useRef(8)
  const compact = variant === 'page'

  useEffect(() => {
    playingRef.current = playing
  }, [playing])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const structure = getRnaStructure(mode)
    const foldedPositions = view === 'orb' ? getSpherePositions(structure) : structure.positions3D
    const unfolded = getUnfoldedPositions(structure.sequence.length)
    const query = new URLSearchParams(window.location.search)
    const captureTime = query.has('t') ? Number(query.get('t')) : null
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (captureTime !== null) document.documentElement.classList.add('capture-mode')
    let currentTime = Number.isFinite(captureTime) ? Number(captureTime) : timeRef.current
    let animationFrame = 0
    let previousFrame = performance.now()
    let statsTime = previousFrame
    let statsFrames = 0
    let disposed = false
    let renderer: THREE.WebGLRenderer | null = null
    let canvas: HTMLCanvasElement | null = null
    let renderFrame: (time: number) => void = () => {}
    let resize = () => {}
    let cleanUpScene = () => {}
    let degradeQuality = () => {}

    const initialize2D = () => {
      canvas = document.createElement('canvas')
      canvas.className = 'rna-canvas'
      canvas.setAttribute('aria-hidden', 'true')
      container.appendChild(canvas)
      const context = canvas.getContext('2d')
      if (!context) return
      let width = 1
      let height = 1
      let dpr = 1

      resize = () => {
        width = Math.max(1, container.clientWidth)
        height = Math.max(1, container.clientHeight)
        dpr = Math.min(window.devicePixelRatio || 1, 1.5)
        canvas!.width = Math.round(width * dpr)
        canvas!.height = Math.round(height * dpr)
        canvas!.style.width = `${width}px`
        canvas!.style.height = `${height}px`
        context.setTransform(dpr, 0, 0, dpr, 0, 0)
      }

      renderFrame = (time: number) => {
        const folded3D = structure.positions2D.map(([x, y]) => [x, y, 0] as Vec3)
        const points = interpolatedPositions(time, folded3D, unfolded)
        const mobile = width < 700
        const centerX = mobile ? width * 0.5 : width * (compact ? 0.76 : 0.73)
        const centerY = mobile ? height * (compact ? 0.7 : 0.62) : height * (compact ? 0.5 : 0.47)
        const scale = mobile
          ? Math.min(width / (compact ? 10.5 : 8.4), height / (compact ? 11.5 : 9.5))
          : Math.min(width / (compact ? 10.4 : 9.2), height / (compact ? 6.8 : 6.1))
        const projected = points.map(([x, y]) => [centerX + x * scale, centerY - y * scale] as [number, number])

        context.clearRect(0, 0, width, height)
        context.lineCap = 'round'
        context.lineJoin = 'round'

        context.strokeStyle = 'rgba(148, 212, 194, 0.19)'
        context.lineWidth = 1
        structure.pairs.forEach(([left, right]) => {
          context.beginPath()
          context.moveTo(...projected[left])
          context.lineTo(...projected[right])
          context.stroke()
        })

        const backboneGradient = context.createLinearGradient(centerX - scale * 2, 0, centerX + scale * 2, 0)
        backboneGradient.addColorStop(0, 'rgba(91, 197, 170, 0.28)')
        backboneGradient.addColorStop(0.55, 'rgba(139, 240, 197, 0.76)')
        backboneGradient.addColorStop(1, 'rgba(116, 207, 227, 0.34)')
        context.strokeStyle = backboneGradient
        context.lineWidth = mobile ? 1.2 : 1.6
        context.beginPath()
        projected.forEach(([x, y], index) => {
          if (index === 0) context.moveTo(x, y)
          else context.lineTo(x, y)
        })
        context.stroke()

        projected.forEach(([x, y], index) => {
          const base = structure.sequence[index]
          context.beginPath()
          context.fillStyle = BASE_COLORS[base] || BASE_COLORS.A
          context.globalAlpha = 0.88
          context.shadowColor = context.fillStyle as string
          context.shadowBlur = mobile ? 5 : 8
          context.arc(x, y, mobile ? 2.2 : 2.8, 0, TAU)
          context.fill()
        })
        context.globalAlpha = 1
        context.shadowBlur = 0
        window.__RNA_STATS__ = { fps: window.__RNA_STATS__?.fps ?? 0, drawCalls: 1, nucleotides: structure.sequence.length, renderer: 'Canvas2D' }
      }
    }

    const initialize3D = () => {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      renderer.setClearColor(0x07110f, 0)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.15
      renderer.domElement.className = 'rna-canvas'
      renderer.domElement.setAttribute('aria-hidden', 'true')
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60)
      camera.position.set(0, 0, 8)
      camera.lookAt(0, 0, 0)

      const molecule = new THREE.Group()
      scene.add(molecule)
      scene.add(new THREE.HemisphereLight(0xb8f5df, 0x102a26, 2.1))
      const key = new THREE.DirectionalLight(0xe4fff4, 3.2)
      key.position.set(-3, 5, 6)
      scene.add(key)
      const fill = new THREE.DirectionalLight(0x74cfe3, 1.4)
      fill.position.set(4, -2, 3)
      scene.add(fill)

      const count = structure.sequence.length
      const nucleotideGeometry = new THREE.SphereGeometry(0.067, 8, 6)
      const nucleotideMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.28,
        metalness: 0.08,
        emissive: 0x0b2b23,
        emissiveIntensity: 0.75,
      })
      const nucleotides = new THREE.InstancedMesh(nucleotideGeometry, nucleotideMaterial, count)
      structure.sequence.split('').forEach((base, index) => {
        nucleotides.setColorAt(index, new THREE.Color(BASE_COLORS[base] || BASE_COLORS.A))
      })
      nucleotides.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      molecule.add(nucleotides)

      const rodGeometry = new THREE.CylinderGeometry(0.018, 0.018, 1, 6, 1, true)
      const backboneMaterial = new THREE.MeshStandardMaterial({
        color: 0x76cdb2,
        emissive: 0x1c6553,
        emissiveIntensity: 0.7,
        roughness: 0.45,
      })
      const backbone = new THREE.InstancedMesh(rodGeometry, backboneMaterial, count - 1)
      backbone.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      molecule.add(backbone)

      const pairGeometry = new THREE.CylinderGeometry(0.011, 0.011, 1, 5, 1, true)
      const pairMaterial = new THREE.MeshBasicMaterial({ color: 0xa8d9cb, transparent: true, opacity: 0.34 })
      const pairRods = new THREE.InstancedMesh(pairGeometry, pairMaterial, structure.pairs.length)
      pairRods.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      molecule.add(pairRods)

      const haloGeometry = new THREE.BufferGeometry()
      const haloPositions = new Float32Array(count * 3)
      haloGeometry.setAttribute('position', new THREE.BufferAttribute(haloPositions, 3))
      const haloMaterial = new THREE.PointsMaterial({
        color: 0x82e8c3,
        size: 0.19,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const halo = new THREE.Points(haloGeometry, haloMaterial)
      molecule.add(halo)

      const dustGeometry = new THREE.BufferGeometry()
      const dustPositions = new Float32Array(72 * 3)
      for (let index = 0; index < 72; index += 1) {
        const angle = index * 2.399963
        const radius = 2.8 + (index % 9) * 0.34
        dustPositions[index * 3] = Math.cos(angle) * radius
        dustPositions[index * 3 + 1] = Math.sin(angle) * radius * 0.7
        dustPositions[index * 3 + 2] = -1.5 - (index % 7) * 0.42
      }
      dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
      const dustMaterial = new THREE.PointsMaterial({ color: 0x6ea897, size: 0.025, transparent: true, opacity: 0.38 })
      const dust = new THREE.Points(dustGeometry, dustMaterial)
      scene.add(dust)

      let pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      let mobile = false
      resize = () => {
        const width = Math.max(1, container.clientWidth)
        const height = Math.max(1, container.clientHeight)
        mobile = width < 700
        renderer!.setPixelRatio(pixelRatio)
        renderer!.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        molecule.scale.setScalar(mobile ? (compact ? 0.26 : 0.34) : (compact ? 0.78 : 1))
        molecule.position.set(mobile ? 0 : (compact ? 1.8 : 1.65), mobile ? (compact ? -1.05 : -0.68) : (compact ? 0 : 0.08), 0)
      }

      degradeQuality = () => {
        const nextRatio = Math.max(0.85, pixelRatio - 0.25)
        if (nextRatio < pixelRatio) {
          pixelRatio = nextRatio
          resize()
        }
      }

      renderFrame = (time: number) => {
        const points = interpolatedPositions(time, foldedPositions, unfolded)
        points.forEach((point, index) => {
          tempVectorA.set(...point)
          tempMatrix.makeTranslation(tempVectorA.x, tempVectorA.y, tempVectorA.z)
          nucleotides.setMatrixAt(index, tempMatrix)
          haloPositions[index * 3] = point[0]
          haloPositions[index * 3 + 1] = point[1]
          haloPositions[index * 3 + 2] = point[2]
          if (index < count - 1) setRodTransform(backbone, index, point, points[index + 1])
        })
        structure.pairs.forEach(([left, right], index) => setRodTransform(pairRods, index, points[left], points[right]))
        nucleotides.instanceMatrix.needsUpdate = true
        backbone.instanceMatrix.needsUpdate = true
        pairRods.instanceMatrix.needsUpdate = true
        haloGeometry.attributes.position.needsUpdate = true
        molecule.rotation.y = Math.sin(TAU * time / DURATION) * (view === 'orb' ? 0.72 : 0.25)
        molecule.rotation.x = Math.cos(TAU * time / DURATION) * 0.08 - 0.04
        dust.rotation.z = Math.sin(TAU * time / DURATION) * 0.05
        renderer!.render(scene, camera)
        window.__RNA_STATS__ = {
          fps: window.__RNA_STATS__?.fps ?? 0,
          drawCalls: renderer!.info.render.calls,
          nucleotides: count,
          renderer: 'WebGL',
        }
      }

      cleanUpScene = () => {
        ;[nucleotideGeometry, rodGeometry, pairGeometry, haloGeometry, dustGeometry].forEach((geometry) => geometry.dispose())
        ;[nucleotideMaterial, backboneMaterial, pairMaterial, haloMaterial, dustMaterial].forEach((material) => material.dispose())
      }
    }

    if (view === '3d' || view === 'orb') {
      try {
        initialize3D()
      } catch {
        const failedRenderer = renderer as THREE.WebGLRenderer | null
        failedRenderer?.dispose()
        failedRenderer?.domElement.remove()
        renderer = null
        initialize2D()
      }
    } else {
      initialize2D()
    }

    resize()
    const resizeObserver = new ResizeObserver(() => {
      resize()
      renderFrame(currentTime)
    })
    resizeObserver.observe(container)

    const animate = (now: number) => {
      if (disposed) return
      const delta = Math.min(0.05, (now - previousFrame) / 1000)
      previousFrame = now
      const active = playingRef.current && captureTime === null && !reducedMotion
      if (active) {
        currentTime += delta
        timeRef.current = currentTime
        renderFrame(currentTime)
        statsFrames += 1
      }
      if (now - statsTime > 1000 && window.__RNA_STATS__) {
        const measuredFps = active ? Math.round(statsFrames * 1000 / (now - statsTime)) : 0
        window.__RNA_STATS__.fps = measuredFps
        if (active && measuredFps > 0 && measuredFps < 24) degradeQuality()
        statsFrames = 0
        statsTime = now
      }
      animationFrame = requestAnimationFrame(animate)
    }

    renderFrame(currentTime)
    window.__SCENE_READY__ = true
    window.__seek = (time: number) => {
      currentTime = time
      timeRef.current = time
      renderFrame(time)
    }
    animationFrame = requestAnimationFrame(animate)

    return () => {
      disposed = true
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      cleanUpScene()
      renderer?.dispose()
      renderer?.domElement.remove()
      canvas?.remove()
      document.documentElement.classList.remove('capture-mode')
      if (window.__SCENE_READY__) window.__SCENE_READY__ = false
    }
  }, [mode, view, compact])

  return (
    <div className="rna-scene" ref={containerRef} aria-hidden="true">
      <div className="rna-poster" />
    </div>
  )
}
