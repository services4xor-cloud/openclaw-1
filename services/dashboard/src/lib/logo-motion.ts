/* eslint-disable */
// The 4XOR header logo in motion, ported 1:1 from 4xor.de (src/components/Logo.astro)
// so both sites play the exact same frames. Header mode only: the pyramid spins with
// the scroll, hovering a header link nudges it, a click on a link or button sends it
// into a backflip, and flip() lets the page trigger the same backflip (the map does
// this when the Explorer picks a country). With reduced motion nothing moves.

// The 4XOR logo in motion, on any <svg data-logo-motion> that holds the logo's
// .pyr, .ring and .dot (plus the glow, sun, mirror and burst elements).
// data-logo-motion="scroll" (header): the pyramid spins with the scroll, and a
// click on a link or button makes it do a backflip. "view" (closing panel): the sun
// piece plays when the mark comes into view, again after a pause while it stays,
// and on hover. With reduced motion nothing moves.
//
// Everything is drawn in 3D and projected: a square-based pyramid seen from above
// at an angle, chosen so the resting projection is the flat logo. At rest the ring
// faces the viewer; while it moves it stands at the pyramid's centre and spins.
const NS = 'http://www.w3.org/2000/svg'
const REST_PYR = 'M26.5 8 2.5 47l24 11 24-11ZM26.5 8v50M2.5 47l24-12 24 12'
const REST_RING = 'M15.3 40.6A12.5 12.5 0 1 1 37.7 40.6'
const LIT = 1 // header glow once the storyboard has played
const DURATION = 14.2 // seconds of story time, one pass through the storyboard
const PHI = (1 + Math.sqrt(5)) / 2
// The piece, start to end:
//   the arc closes into a circle, and the pyramid alone twitches left and right
//   the pyramid is spun about its own axis like a top: it starts slowly, gathers
//   speed, and at full speed a mirrored pyramid standing on its point
//   materialises around it like a hologram, with its own gold ball; as the spin
//   slows the hologram dissolves and the pyramid comes to rest, the circle still
//   both gold balls sink to the heart and become one small pulsing sun of pure
//   light; the circle stands up and spins into a sphere, and the pyramid turns
//   and rolls around the sun
//   the sun shrinks back into the dot, which rises to the apex and bursts, the
//   circle settles facing the viewer and opens back into the arc
const TWITCH_A = 0.6,
  TWITCH_B = 2.4,
  TWITCH = -40
// The spin is 4 whole turns, so it lands exactly on the logo (see spinCurve).
const SPIN_A = 2.2,
  SPIN_B = 7.4,
  SPIN = 1440
const MOVE_A = 7.6,
  MOVE_B = 12.4 // the one continuous turn
const PART2 = MOVE_A - 0.8 // where a play starts
const MOVE_MID = (MOVE_A + MOVE_B) / 2
const TUMBLE = (MOVE_B - MOVE_A) / PHI // the tumble's share of the turn
// Slow motion: as the pyramid rolls over, time itself eases down to about a third
// of its pace and back up over 2 s, centred on the middle of the roll, so the
// sphere opens back into a ring for a moment and the roll is seen.
const SLOW_DEPTH = 0.65,
  SLOW_W = 2
const SLOW_A = MOVE_MID + (SLOW_DEPTH * SLOW_W) / 4 - SLOW_W / 2
const REAL_DURATION = DURATION + (SLOW_DEPTH * SLOW_W) / 2
// Real seconds to story seconds: the integral of a clock rate that dips as
// 1 - depth * sin^2, so the slowdown starts, holds and ends without a seam.
const story = (t: number) => {
  const x = Math.min(Math.max(t - SLOW_A, 0), SLOW_W)
  return t - SLOW_DEPTH * (x / 2 - (SLOW_W / (4 * Math.PI)) * Math.sin((2 * Math.PI * x) / SLOW_W))
}
const PAUSE = 9 // seconds at rest before it plays again

type V = [number, number, number]
const SIN_P = 11.5 / 24 // camera pitch: base depth 11.5 against half-width 24
const COS_P = Math.sqrt(1 - SIN_P * SIN_P)
const R = 24 // base half-diagonal
const H = 38.75 / COS_P // apex height
const RING_Y = 11.7 / COS_P // height of the logo ring's centre on the axis
// The mirrored pyramid is the first one turned over about the circle's centre, so
// the star they make is centred on the circle.
const MIRROR = 2 * RING_Y
// Centre of the pyramid's inscribed sphere: where the ring spins and the dot glows.
const BALL_Y = 11.7
const proj = ([x, y, z]: V) => [26.5 + x, 46.75 - y * COS_P + z * SIN_P]
const pt = (p: V) =>
  proj(p)
    .map((n) => n.toFixed(2))
    .join(' ')

// Rotation about an axis through the origin (Rodrigues).
const rotate = ([x, y, z]: V, [ax, ay, az]: V, a: number): V => {
  const c = Math.cos(a),
    s = Math.sin(a),
    d = (ax * x + ay * y + az * z) * (1 - c)
  return [
    x * c + (ay * z - az * y) * s + ax * d,
    y * c + (az * x - ax * z) * s + ay * d,
    z * c + (ax * y - ay * x) * s + az * d,
  ]
}
// The pyramid rolls forward over a level axis through the centre of its inscribed
// sphere, so the sphere (the spinning ring) stays still at the heart of the logo
// while the pyramid turns around it.
const PIVOT = BALL_Y
const TUMBLE_AXIS: V = [1, 0, 0]
const pose = (p: V, yaw: number, tumble: number): V => {
  const q = rotate(p, [0, 1, 0], yaw)
  const t = rotate([q[0], q[1] - PIVOT, q[2]], TUMBLE_AXIS, tumble)
  return [t[0], t[1] + PIVOT, t[2]]
}

const clamp = (n: number) => Math.min(Math.max(n, 0), 1)
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a))
// Smootherstep: starts and stops with zero speed and zero acceleration, so motion
// built from it never jerks. speed() is its rate of change, scaled to peak at 1.
const smoother = (s: number) => s * s * s * (s * (6 * s - 15) + 10)
// The spin's progress, 0 to 1. Its speed is x^1.5 (1 - x)^2.25: it starts from
// rest, builds to full speed two fifths of the way in, then runs down more
// slowly than it built up, to rest again. Integrated once into a table.
const SPIN_CURVE = (() => {
  const n = 400,
    c = [0]
  for (let i = 1; i <= n; i++) {
    const x = (i - 0.5) / n
    c.push(c[i - 1] + x ** 1.5 * (1 - x) ** 2.25)
  }
  return c.map((v) => v / c[n])
})()
const spinCurve = (x: number) => {
  const i = x * 400,
    k = Math.floor(i)
  return k >= 400 ? 1 : SPIN_CURVE[k] + (SPIN_CURVE[k + 1] - SPIN_CURVE[k]) * (i - k)
}
// Where the spin is fastest: x = 1.5 / (1.5 + 2.25).
const SPIN_PEAK_X = 0.4
const speed = (s: number) => 16 * s * s * (1 - s) * (1 - s)
// An underdamped spring from 0 to 1: overshoots a little and rings down.
const spring = (s: number) =>
  s >= 1 ? 1 : 1 - Math.exp(-6 * s) * (Math.cos(9 * s) + (6 / 9) * Math.sin(9 * s))
const bump = (s: number) => Math.sin(Math.PI * s)
const deg = Math.PI / 180

// Sparks for the burst: fixed pseudo-random spots along the four upper edges.
const BITS = Array.from({ length: 18 }, (_, i) => {
  const r = (n: number) => (((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1
  return {
    edge: i % 4,
    along: 0.12 + 0.6 * r(1),
    drift: (r(2) - 0.5) * 8,
    fall: 10 + 14 * r(3),
    delay: 0.25 * r(4),
    size: 0.6 + 0.6 * r(5),
    green: r(6) > 0.72,
  }
})

export type LogoMotion = { flip: () => void; stop: () => void }

export function startLogoMotion(svg: SVGSVGElement): LogoMotion | null {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  const $ = <T extends SVGElement>(s: string) => svg.querySelector<T>(s)!
  const pyr = $<SVGPathElement>('.pyr'),
    ring = $<SVGPathElement>('.ring'),
    orbit = $<SVGPathElement>('.orbit')
  const trail = svg.querySelector<SVGPathElement>('.trail')
  const sun = svg.querySelector<SVGCircleElement>('.sun'),
    corona = svg.querySelector<SVGCircleElement>('.corona')
  const halo2 = svg.querySelector<SVGCircleElement>('.halo2'),
    sunrays = svg.querySelector<SVGPathElement>('.sunrays')
  const faces = Array.from(svg.querySelectorAll<SVGPathElement>('.face'))
  const logoBox = svg.closest<HTMLElement>('.logo')
  const pyr2 = svg.querySelector<SVGPathElement>('.pyr2'),
    dot2 = svg.querySelector<SVGCircleElement>('.dot2')
  const rays = $<SVGPathElement>('.rays'),
    dot = $<SVGCircleElement>('.dot'),
    halo = $<SVGCircleElement>('.halo')
  // Sparks, orbit and rays take the dot's gold; some sparks take the ring's green.
  const gold = getComputedStyle(dot).fill,
    green = getComputedStyle(ring).stroke
  orbit.setAttribute('stroke', gold)
  rays.setAttribute('stroke', gold)
  const bits = BITS.map((b) => {
    const c = document.createElementNS(NS, 'circle')
    c.setAttribute('r', String(b.size))
    c.setAttribute('fill', b.green ? green : gold)
    c.setAttribute('opacity', '0')
    $('.bits').append(c)
    return c
  })
  // The glow's resting strength comes from the page (none in the header).
  const glow = parseFloat(getComputedStyle(halo).opacity) || 0
  // The header ends lit: the glow fades up after the burst and stays.
  const scrollMode = true
  const endGlow = scrollMode ? LIT : glow

  // The motion is one flow of energy, not a list of steps. After the swing a
  // single rotation carries everything: its speed rises and
  // falls on one smooth curve, with no stop anywhere and no jerk at either end. The
  // tumble sits in the middle of that turn, its window the turn's length divided by
  // the golden ratio. The spin's energy shows as light; as the spin slows the
  // energy gathers into the dot, which then releases it as the burst, and the ring
  // springs back to face the viewer.
  // Only the second part is played now (from the balls going to the heart to the
  // end); its first moments bring in the full circle and the lower ball, which
  // the scroll and the spin would otherwise have raised.
  const intro = (t: number) => smoother(seg(t, PART2, PART2 + 0.6))
  const draw = (t: number) => {
    const main = seg(t, MOVE_A, MOVE_B)
    const roll = seg(t, MOVE_MID - TUMBLE / 2, MOVE_MID + TUMBLE / 2)
    // Speed of the turn and of the tumble, each 0 to 1; their mean is the energy.
    const spin = speed(main),
      flip = speed(roll)
    const energy = (spin + flip) / 2
    // The opening spin, flicked and left to run down.
    const opening = SPIN * spinCurve(seg(t, SPIN_A, SPIN_B))
    // The twitch: A sin(2 pi x) sin(pi x), one gentle there and back, from rest
    // to rest.
    const wx = seg(t, TWITCH_A, TWITCH_B)
    const twitch = TWITCH * Math.sin(2 * Math.PI * wx) * Math.sin(Math.PI * wx)
    const yaw = (360 * smoother(main) + opening + twitch) * deg
    const tumble = smoother(roll) * 2 * Math.PI

    // One circle. It closes, stands upright at the pyramid's centre and spins on
    // its vertical axis three times for each turn of the pyramid, fast enough at
    // the peak to read as a sphere; then it springs back to face the viewer and
    // reopens into the logo's arc.
    const close = intro(t) * (1 - smoother(seg(t, MOVE_B + 0.9, MOVE_B + 1.7)))
    const inside =
      smoother(seg(t, MOVE_A, MOVE_A + 1)) * (1 - spring(seg(t, MOVE_B - 0.3, MOVE_B + 1)))
    // The circle spins only during the turn, twice for each turn of the pyramid;
    // during the swings it holds still.
    const twirl = 2 * 360 * smoother(main) * deg
    const span = 232.8 + 127.2 * close
    const start = -26.4 - 63.6 * close

    const corners = [0, 1, 2, 3].map((k) =>
      pose(
        [R * Math.cos(Math.PI + (k * Math.PI) / 2), 0, R * Math.sin(Math.PI + (k * Math.PI) / 2)],
        yaw,
        tumble
      )
    )
    const apex = pose([0, H, 0], yaw, tumble)
    const [a, b, c, d] = corners.map(pt)
    const top = pt(apex)
    pyr.setAttribute('d', `M${a}L${b}L${c}L${d}ZM${top}L${a}M${top}L${b}M${top}L${c}M${top}L${d}`)

    // As the spin gathers speed a second pyramid appears standing on its point,
    // the first one mirrored top to bottom within the same height, with its own
    // gold ball below: spinning together they read as one star, a faint hologram
    // in the ring's green. Its timing follows the spin's own: it draws itself in,
    // flickering softly, all the while the spin speeds up, and is whole exactly as
    // the spin reaches full speed; it holds a moment, then dissolves all the while
    // the spin slows, gone a little before it stops. Its ball stays once drawn, so
    // both balls can go to the heart.
    const spinX = seg(t, SPIN_A, SPIN_B)
    const built = smoother(seg(spinX, 0.08, SPIN_PEAK_X))
    const holo = built * (1 - smoother(seg(spinX, SPIN_PEAK_X + 0.1, 0.88)))
    const flicker = 1 - 0.35 * (1 - built) * (0.5 + 0.5 * Math.sin(53 * t) * Math.sin(17 * t))
    const ghost = 0.45 * holo * flicker
    const flipY = (q: V): V => [q[0], MIRROR - q[1], q[2]]
    if (pyr2 && dot2) {
      const g = [0, 1, 2, 3].map((k) =>
        pt(
          pose(
            flipY([
              R * Math.cos(Math.PI + (k * Math.PI) / 2),
              0,
              R * Math.sin(Math.PI + (k * Math.PI) / 2),
            ]),
            yaw,
            tumble
          )
        )
      )
      const gTop = pt(pose(flipY([0, H, 0]), yaw, tumble))
      pyr2.setAttribute(
        'd',
        `M${g[0]}L${g[1]}L${g[2]}L${g[3]}ZM${gTop}L${g[0]}M${gTop}L${g[1]}M${gTop}L${g[2]}M${gTop}L${g[3]}`
      )
      pyr2.setAttribute('opacity', ghost.toFixed(3))
      pyr2.setAttribute('stroke-dashoffset', (1 - built).toFixed(3))
    }

    // At rest the ring faces the viewer (its "up" is the screen's up); inside, it
    // stands upright, centred on the pyramid's inscribed sphere.
    const phi = Math.asin(SIN_P) * (1 - inside)
    const up: V = [0, Math.cos(phi), -Math.sin(phi)]
    const cy = RING_Y + (BALL_Y - RING_Y) * inside
    // The ring keeps the logo's size the whole way through.
    const ringR = 12.5
    const circle = (psi: number, from: number, sweep: number) => {
      const across: V = [Math.cos(psi), 0, Math.sin(psi)]
      const pts: string[] = []
      for (let i = 0; i <= 64; i++) {
        const th = (from + (sweep * i) / 64) * deg
        const x = ringR * Math.cos(th),
          y = ringR * Math.sin(th)
        pts.push(pt(pose([x * across[0], cy + y * up[1], x * across[2] + y * up[2]], 0, tumble)))
      }
      return `M${pts.join('L')}`
    }
    ring.setAttribute('d', circle(twirl, start, span))
    // At full speed two faint after-images trail the ring, as the eye sees them.
    if (trail) {
      const lag = 14 * deg * spin
      trail.setAttribute('d', circle(twirl - lag, 0, 360) + circle(twirl - 2 * lag, 0, 360))
      trail.setAttribute('opacity', (0.3 * spin * spin).toFixed(3))
    }

    // The dot leaves the apex as the turn begins, sinks to the heart of the pyramid
    // (the still centre it rolls around) and glows there, then rises back to the
    // apex just before the turn ends, in time for the burst.
    const tip: V = [0, H + 2.85, 0]
    const sink =
      smoother(seg(t, MOVE_A + 0.2, MOVE_A + 1.4)) *
      (1 - smoother(seg(t, MOVE_B - 1.2, MOVE_B - 0.1)))
    const heart: V = [0, BALL_Y + (tip[1] - BALL_Y) * (1 - sink), 0]
    const [dx, dy] = proj(pose(heart, yaw, tumble))
    dot.setAttribute('cx', dx.toFixed(2))
    dot.setAttribute('cy', dy.toFixed(2))

    // The energy the turn has spent collects in the dot, which swells with it and
    // lets it go at once as the burst when the turn comes to rest.
    const burst = seg(t, MOVE_B, MOVE_B + 1.3)
    const charge = smoother(main) * (1 - smoother(seg(burst, 0, 0.25)))
    dot.setAttribute('r', (3.75 * (1 + 0.3 * charge)).toFixed(2))

    // The sun: once the balls reach the heart they swell into a small sun, white
    // at the centre and golden at the rim, that pulses gently on two out-of-step
    // beats with a corona of light breathing around it; before the turn ends it
    // gathers back into the dot.
    const core =
      smoother(seg(t, MOVE_A + 1.0, MOVE_A + 1.7)) *
      (1 - smoother(seg(t, MOVE_B - 1.5, MOVE_B - 1.0)))
    dot.setAttribute('opacity', (1 - core).toFixed(3))
    if (dot2) {
      const sink2 = smoother(seg(t, MOVE_A + 0.2, MOVE_A + 1.4))
      const low = MIRROR - (H + 2.85)
      const [ex, ey] = proj(pose([0, low + (BALL_Y - low) * sink2, 0], yaw, tumble))
      dot2.setAttribute('cx', ex.toFixed(2))
      dot2.setAttribute('cy', ey.toFixed(2))
      dot2.setAttribute(
        'opacity',
        (intro(t) * built * (1 - smoother(seg(t, MOVE_A + 1.0, MOVE_A + 1.7)))).toFixed(3)
      )
      // Its light builds up like a sphere as the hologram forms, and goes with it
      // into the heart.
      if (halo2) {
        halo2.setAttribute('cx', ex.toFixed(2))
        halo2.setAttribute('cy', ey.toFixed(2))
        halo2.setAttribute('r', (16 * built * intro(t)).toFixed(2))
        halo2.style.opacity = (
          intro(t) *
          built *
          (1 - smoother(seg(t, MOVE_A + 1.0, MOVE_A + 1.7)))
        ).toFixed(3)
      }
    }
    if (sun && corona) {
      const [sx2, sy2] = proj(pose([0, BALL_Y, 0], yaw, tumble))
      const beat =
        1 + 0.12 * Math.sin(2 * Math.PI * 1.2 * t) + 0.05 * Math.sin(2 * Math.PI * 2.7 * t + 1)
      for (const el of [sun, corona]) {
        el.setAttribute('cx', sx2.toFixed(2))
        el.setAttribute('cy', sy2.toFixed(2))
      }
      sun.setAttribute('r', (11 * core * beat).toFixed(2))
      corona.setAttribute(
        'r',
        (26 * core * (1 + 0.2 * Math.sin(2 * Math.PI * 1.2 * t - 0.6))).toFixed(2)
      )
      // Twelve soft rays turn slowly around the sun and reach out and back with
      // its beat.
      if (sunrays) {
        const inner = 12 * core * beat,
          reach = inner * (1.55 + 0.25 * Math.sin(2 * Math.PI * 0.6 * t))
        const turnRays = t * 0.35
        sunrays.setAttribute(
          'd',
          Array.from({ length: 12 }, (_, i) => {
            const th = turnRays + (i / 12) * 2 * Math.PI
            const len = i % 2 ? reach * 0.82 : reach
            return `M${(sx2 + inner * Math.cos(th)).toFixed(2)} ${(sy2 + inner * Math.sin(th)).toFixed(2)}L${(sx2 + len * Math.cos(th)).toFixed(2)} ${(sy2 + len * Math.sin(th)).toFixed(2)}`
          }).join('')
        )
        sunrays.setAttribute('opacity', (0.75 * core).toFixed(3))
      }
    }
    halo.setAttribute('cx', dx.toFixed(2))
    halo.setAttribute('cy', dy.toFixed(2))
    // The dot glows wherever it is: on the apex from the first moment, twice as
    // wide at the heart, and on into the lit end.
    const ending = smoother(seg(t, MOVE_B + 0.4, DURATION))
    const shining = 0.45 * smoother(seg(t, 0, 0.8)) * (1 - ending)
    // The top ball's light swells as a sphere with the hologram too.
    halo.setAttribute(
      'r',
      (12 * (1 + 0.35 * built * (1 - sink)) * (1 + core) * (1 + 0.3 * bump(burst))).toFixed(2)
    )
    halo.style.opacity = Math.min(
      1,
      glow +
        shining +
        0.4 * energy +
        0.3 * sink +
        0.35 * charge +
        0.6 * bump(burst) +
        (endGlow - glow) * ending
    ).toFixed(3)

    // The release: rays from the dot, and sparks drifting down the pyramid's edges.
    const r = seg(t, MOVE_B, MOVE_B + 0.8)
    const inner = 5 + 3 * smoother(r),
      outer = 6 + 6 * smoother(r)
    rays.setAttribute(
      'd',
      Array.from({ length: 8 }, (_, i) => {
        const th = (i / 8) * 2 * Math.PI - Math.PI / 2
        return `M${(dx + inner * Math.cos(th)).toFixed(2)} ${(dy + inner * Math.sin(th)).toFixed(2)}L${(dx + outer * Math.cos(th)).toFixed(2)} ${(dy + outer * Math.sin(th)).toFixed(2)}`
      }).join('')
    )
    rays.setAttribute('opacity', (r > 0 && r < 1 ? bump(r) : 0).toFixed(3))
    const [tx, ty] = proj(tip)
    BITS.forEach((bit, i) => {
      const s = seg(t, MOVE_B + 0.05 + bit.delay, MOVE_B + 1.35 + bit.delay)
      const [cx, cy] = proj(corners[bit.edge])
      const x = tx + (cx - tx) * bit.along + bit.drift * smoother(s)
      const y = ty + (cy - ty) * bit.along + bit.fall * s * s
      bits[i].setAttribute('cx', x.toFixed(2))
      bits[i].setAttribute('cy', y.toFixed(2))
      bits[i].setAttribute(
        'opacity',
        (s > 0 && s < 1 ? Math.min(1, s * 6) * (1 - s) : 0).toFixed(3)
      )
    })
  }

  const rest = () => {
    pyr.setAttribute('d', REST_PYR)
    ring.setAttribute('d', REST_RING)
    ring.removeAttribute('opacity')
    dot.setAttribute('cx', '26.5')
    dot.setAttribute('cy', '5.5')
    halo.setAttribute('cx', '26.5')
    halo.setAttribute('cy', '5.5')
    halo.setAttribute('r', '12')
    halo.style.opacity = ''
    for (const el of [orbit, rays, ...bits]) el.setAttribute('opacity', '0')
    trail?.setAttribute('opacity', '0')
    dot.setAttribute('r', '3.75')
    dot.removeAttribute('opacity')
    pyr2?.setAttribute('opacity', '0')
    dot2?.setAttribute('opacity', '0')
    sun?.setAttribute('r', '0')
    corona?.setAttribute('r', '0')
    halo2?.setAttribute('r', '0')
    sunrays?.setAttribute('opacity', '0')
    for (const f of faces) f.setAttribute('opacity', '0')
    svg.classList.add('idle')
  }

  let playing = false,
    visible = false,
    timer = 0
  const play = () => {
    clearTimeout(timer)
    if (playing || !visible) return
    playing = true
    svg.classList.remove('idle')
    const start = performance.now()
    const step = (now: number) => {
      const t = PART2 + (now - start) / 1000
      if (t < REAL_DURATION) {
        draw(story(t))
        requestAnimationFrame(step)
      } else {
        rest()
        playing = false
        if (scrollMode) settle()
        else timer = window.setTimeout(play, PAUSE * 1000)
      }
    }
    requestAnimationFrame(step)
  }
  // Header: the logo shines brighter while the page is scrolled, and goes back to
  // its resting glow at the very top.
  const settle = () => {
    if (!playing) svg.classList.toggle('lit', scrollY > 0)
  }

  // The header pyramid spins with the scroll, heavy as a real pyramid: ordinary
  // scrolling only nudges it round, it takes long or fast scrolling to get it
  // going, and once going it coasts. As scrolling starts the arc closes into a
  // full circle; kept up, the spin raises the hologram with its second ball, the
  // circle fades and both glowing balls travel to the centre of the star. When
  // scrolling stops it all goes back: the balls return, the hologram fades, the
  // circle opens into the arc, and a spring settles the pyramid on the logo.
  let spinYaw = 0,
    spinVel = 0,
    spinning = false,
    lastY = scrollY,
    lastT = 0,
    lastScroll = 0
  let spinClose = 0,
    spinHolo = 0,
    lastSectionY = scrollY
  const towards = (v: number, to: number, rate: number, dt: number) =>
    v + (to - v) * (1 - Math.exp(-rate * dt))
  // A click sends the logo into one backflip, on top of whatever spin is running:
  // it dips, springs up, turns over backwards about the circle's centre, and lands
  // with a small give. Everything turns with it, the circle and the dot included.
  // Its progress runs on the frames actually drawn (each step capped at 1/20 s), so
  // it always plays the whole turn from start to landing, even after a stalled
  // frame or a hidden tab; clicks during a flip are ignored.
  let flipT = -1
  const flipOf = () => {
    const x = flipT < 0 ? 1 : flipT
    const turn = -2 * Math.PI * smoother(seg(x, 0.12, 0.82))
    const lift =
      -0.8 * Math.sin(Math.PI * seg(x, 0, 0.14)) +
      4 * Math.sin(Math.PI * seg(x, 0.1, 0.84)) -
      0.6 * Math.sin(Math.PI * seg(x, 0.82, 1))
    return {
      done: x >= 1,
      place: (q: V): V => {
        if (x >= 1) return q
        const r = rotate([q[0], q[1] - RING_Y, q[2]], [1, 0, 0], turn)
        return [r[0], r[1] + RING_Y + lift, r[2]]
      },
    }
  }
  const spinFrame = (F: (q: V) => V) => {
    const P = (q: V) => pt(F(q))
    const corners4 = (mirror: boolean) =>
      [0, 1, 2, 3].map((k) => {
        const q: V = [
          R * Math.cos(Math.PI + (k * Math.PI) / 2),
          0,
          R * Math.sin(Math.PI + (k * Math.PI) / 2),
        ]
        return P(pose(mirror ? [q[0], MIRROR - q[1], q[2]] : q, spinYaw * deg, 0))
      })
    const shape = (c: string[], top: string) =>
      `M${c[0]}L${c[1]}L${c[2]}L${c[3]}ZM${top}L${c[0]}M${top}L${c[1]}M${top}L${c[2]}M${top}L${c[3]}`
    pyr.setAttribute('d', shape(corners4(false), P([0, H, 0])))
    // Kept up, the spin fills the faces with colour as well as the edges: each
    // face is lit by how squarely it turns towards the viewer.
    if (faces.length) {
      const h3 = smoother(spinHolo)
      const apex3: V = [0, H, 0]
      const base3 = [0, 1, 2, 3].map((k) =>
        rotate(
          [R * Math.cos(Math.PI + (k * Math.PI) / 2), 0, R * Math.sin(Math.PI + (k * Math.PI) / 2)],
          [0, 1, 0],
          spinYaw * deg
        )
      )
      faces.forEach((f, k) => {
        const p1 = base3[k],
          p2 = base3[(k + 1) % 4]
        const u: V = [p1[0] - apex3[0], p1[1] - apex3[1], p1[2] - apex3[2]]
        const v: V = [p2[0] - apex3[0], p2[1] - apex3[1], p2[2] - apex3[2]]
        let n: V = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
        const mid: V = [(p1[0] + p2[0]) / 2, H / 3, (p1[2] + p2[2]) / 2]
        if (n[0] * mid[0] + n[2] * mid[2] < 0) n = [-n[0], -n[1], -n[2]]
        const facing = (n[1] * SIN_P + n[2] * COS_P) / Math.hypot(...n)
        f.setAttribute('d', `M${P(apex3)}L${P(p1)}L${P(p2)}Z`)
        f.setAttribute('opacity', (h3 * (0.06 + 0.3 * Math.max(0, facing))).toFixed(3))
      })
    }
    // The arc, closing into the full circle and opening again, facing the viewer.
    const c = smoother(spinClose)
    const from = -26.4 - 63.6 * c,
      sweep = 232.8 + 127.2 * c
    const pts: string[] = []
    for (let i = 0; i <= 64; i++) {
      const th = (from + (sweep * i) / 64) * deg
      const x = 12.5 * Math.cos(th),
        y = 12.5 * Math.sin(th)
      pts.push(P([x, RING_Y + y * COS_P, -y * SIN_P]))
    }
    ring.setAttribute('d', `M${pts.join('L')}`)
    const h = smoother(spinHolo)
    // As the hologram comes, the circle fades and both glowing balls travel to the
    // centre of the star; as it goes, they return and the circle comes back. Where
    // the two glows meet they swell into one larger light.
    ring.setAttribute('opacity', (1 - h).toFixed(3))
    const gather = smoother(Math.min(Math.max((h - 0.3) / 0.7, 0), 1))
    const merged = smoother(seg(gather, 0.7, 1))
    logoBox?.style.setProperty('--glow', merged.toFixed(3))
    const along = (from: number) => proj(F([0, from + (RING_Y - from) * gather, 0]))
    const [tx, ty] = along(H + 2.85)
    dot.setAttribute('cx', tx.toFixed(2))
    dot.setAttribute('cy', ty.toFixed(2))
    halo.setAttribute('cx', tx.toFixed(2))
    halo.setAttribute('cy', ty.toFixed(2))
    halo.setAttribute('r', (12 * (1 + 1.3 * merged)).toFixed(2))
    if (pyr2 && dot2) {
      pyr2.setAttribute('d', shape(corners4(true), P([0, MIRROR - H, 0])))
      pyr2.setAttribute('opacity', (0.45 * h).toFixed(3))
      pyr2.setAttribute('stroke-dashoffset', (1 - h).toFixed(3))
      const [ex, ey] = along(MIRROR - H - 2.85)
      dot2.setAttribute('cx', ex.toFixed(2))
      dot2.setAttribute('cy', ey.toFixed(2))
      dot2.setAttribute('opacity', h.toFixed(3))
      if (halo2) {
        halo2.setAttribute('cx', ex.toFixed(2))
        halo2.setAttribute('cy', ey.toFixed(2))
        halo2.setAttribute('r', (12 * h * (1 + 1.3 * merged)).toFixed(2))
        halo2.style.opacity = getComputedStyle(halo).opacity
      }
    }
  }
  const spinStep = (now: number) => {
    const dt = Math.min((now - lastT) / 1000, 0.05)
    lastT = now
    if (playing) return void (spinning = false)
    const scrolling = now - lastScroll < 160
    const speed = Math.abs(spinVel)
    if (speed > 40 || scrolling) {
      spinVel *= Math.exp(-1.1 * dt)
    } else {
      const target = Math.round(spinYaw / 90) * 90
      spinVel += ((target - spinYaw) * 60 - spinVel * 12) * dt
    }
    spinYaw += spinVel * dt
    // A flip always turns a full circle: the arc closes quickly as it dips and
    // opens again only after it has landed.
    const flipping = flipT >= 0
    spinClose = towards(
      spinClose,
      scrolling || flipping || speed > 80 ? 1 : 0,
      flipping ? 14 : scrolling ? 5 : 2.5,
      dt
    )
    spinHolo = towards(
      spinHolo,
      scrolling ? Math.min(Math.max((speed - 160) / 320, 0), 1) : 0,
      scrolling ? 1.2 : 1.6,
      dt
    )
    if (flipT >= 0) flipT = Math.min(flipT + dt / 1.7, 1)
    const flip = flipOf()
    if (flip.done) flipT = -1
    const atRest =
      Math.abs(Math.round(spinYaw / 90) * 90 - spinYaw) < 0.05 && Math.abs(spinVel) < 0.5
    if (!scrolling && atRest && flip.done && spinClose < 0.002 && spinHolo < 0.002) {
      spinYaw = spinVel = spinClose = spinHolo = 0
      spinning = false
      pyr.setAttribute('d', REST_PYR)
      ring.setAttribute('d', REST_RING)
      ring.removeAttribute('opacity')
      dot.setAttribute('cx', '26.5')
      dot.setAttribute('cy', '5.5')
      halo.setAttribute('cx', '26.5')
      halo.setAttribute('cy', '5.5')
      halo.setAttribute('r', '12')
      pyr2?.setAttribute('opacity', '0')
      dot2?.setAttribute('opacity', '0')
      halo2?.setAttribute('r', '0')
      for (const f of faces) f.setAttribute('opacity', '0')
      logoBox?.style.setProperty('--glow', '0')
      return
    }
    spinFrame(flip.place)
    requestAnimationFrame(spinStep)
  }
  const scrollSpin = () => {
    const dy = scrollY - lastY
    lastY = scrollY
    if (playing) return
    lastScroll = performance.now()
    kick(dy * 0.8)
  }
  function kick(v: number) {
    if (playing) return
    spinVel = Math.max(-700, Math.min(700, spinVel + v))
    if (!spinning) {
      spinning = true
      lastT = performance.now()
      requestAnimationFrame(spinStep)
    }
  }

  rest()
  visible = true
  let stopped = false
  const onScroll = () => (scrollSpin(), settle())
  const onHover = () => kick(60)
  const onClick = (ev: MouseEvent) => {
    if (!(ev.target as Element).closest('a, button, summary')) return
    flip()
  }
  function flip() {
    if (stopped) return
    if (flipT < 0) flipT = 0
    kick(0)
  }
  const hoverTargets = Array.from(document.querySelectorAll('header a, header summary'))
  addEventListener('scroll', onScroll, { passive: true })
  hoverTargets.forEach((el) => el.addEventListener('pointerenter', onHover))
  document.addEventListener('click', onClick)
  settle()
  return {
    flip,
    stop: () => {
      stopped = true
      removeEventListener('scroll', onScroll)
      hoverTargets.forEach((el) => el.removeEventListener('pointerenter', onHover))
      document.removeEventListener('click', onClick)
      clearTimeout(timer)
    },
  }
}
