/**
 * =============================================================================
 *  NEXORA — APPLICATION ROUTES
 * =============================================================================
 *
 *  This module owns two responsibilities:
 *
 *    1. `AppRoutes` — the top-level router for the entire application. It
 *       wires together public marketing/browse pages, authenticated
 *       dashboard pages (behind `ProtectedRoute`), and a catch-all 404.
 *       All route-level pages are lazy-loaded via `React.lazy` so the
 *       initial bundle only pays for the shell (router + layouts), not
 *       every page in the app.
 *
 *    2. `NexoraIntro` — a one-time, four-second animated splash screen
 *       shown on first mount, styled as a "portal" boot sequence. It is
 *       intentionally over-produced relative to a typical splash screen:
 *       it layers a perspective-based 3D ring system, animated SVG energy
 *       tendrils, a HUD-style telemetry overlay, orbiting glyphs, and a
 *       scrolling boot-sequence ticker, all built from Tailwind utility
 *       classes plus a small scoped `<style>` block of custom keyframes.
 *
 *  -----------------------------------------------------------------------
 *  WHY A SCOPED <style> BLOCK INSTEAD OF PURE TAILWIND?
 *  -----------------------------------------------------------------------
 *  Tailwind's `animate-*` utilities cover simple cases well (spin, pulse,
 *  bounce), but this splash screen needs animations Tailwind doesn't ship
 *  out of the box: multi-stage flicker, stroke-dashoffset "line draw"
 *  effects for the SVG tendrils, CSS-variable-driven orbit radii for the
 *  glyphs, and text shimmer via animated background-position. Rather than
 *  reach for arbitrary one-off `animate-[keyframes_...]` utilities
 *  scattered across dozens of elements (which becomes unreadable fast),
 *  every custom keyframe lives in one `nx-`-prefixed block at the top of
 *  `NexoraIntro`, with small `.nx-anim-*` utility classes wiring them to
 *  elements. This keeps the keyframe definitions co-located, named, and
 *  documented, while the JSX below stays a normal class-name list.
 *
 *  -----------------------------------------------------------------------
 *  PERFORMANCE NOTES
 *  -----------------------------------------------------------------------
 *  - The splash unmounts entirely after `finishIntro` fires (`showIntro`
 *    flips to `false`), so none of its animations, listeners, or DOM
 *    nodes persist once the real app is interactive.
 *  - The `pointermove` listener used for the parallax tilt effect is
 *    registered only while the intro is mounted and is cleaned up on
 *    unmount, so it never leaks into the rest of the app.
 *  - All decorative layers use `pointer-events-none` so they never
 *    intercept clicks/taps, and purely visual containers are marked
 *    `aria-hidden` where practical to keep screen readers focused on
 *    real content once the app loads.
 *
 *  -----------------------------------------------------------------------
 *  EXTENDING THIS FILE
 *  -----------------------------------------------------------------------
 *  - New public pages: add a `lazy(() => import(...))` declaration in the
 *    "LAZY PAGES" section below, then a matching `<Route>` under PUBLIC.
 *  - New authenticated pages: same pattern, but nest the `<Route>` inside
 *    the `<Route element={<ProtectedRoute />}>` block under PROTECTED.
 *  - Splash timing: the 4000ms auto-dismiss lives in `NexoraIntro`'s
 *    `useEffect`; the CSS transition/animation durations for individual
 *    layers are independent of that and can be retuned per-element via
 *    the `.nx-anim-*` classes above without touching the timer.
 *
 * =============================================================================
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState, useCallback } from "react";

// ===============================
// LAYOUTS
// ===============================

import MainLayout from "../layouts/MainLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";

// ===============================
// AUTH
// ===============================

import ProtectedRoute from "../components/ProtectedRoute.jsx";

// ===============================
// LAZY PAGES
// ===============================

// Public
const Home = lazy(() => import("../pages/Home.jsx"));
const Login = lazy(() => import("../pages/auth/Login.jsx"));
const Register = lazy(() => import("../pages/auth/Register.jsx"));

const Developers = lazy(() => import("../pages/Developers.jsx"));

const DeveloperProfile = lazy(() =>
  import("../pages/DeveloperProfile.jsx")
);

const Companies = lazy(() => import("../pages/Companies.jsx"));

const CompanyDetail = lazy(() =>
  import("../pages/CompanyDetail.jsx")
);

const ResumeBuilder = lazy(() =>
  import("../pages/ResumeBuilder.jsx")
);

const AllProjects = lazy(() =>
  import("../pages/AllProjects.jsx")
);

// Dashboard
const Dashboards = lazy(() =>
  import("../pages/Dashboards.jsx")
);

const Profile = lazy(() =>
  import("../pages/dashboard/Profile.jsx")
);

const Portfolio = lazy(() =>
  import("../pages/dashboard/Portfolio.jsx")
);

const Messages = lazy(() =>
  import("../pages/dashboard/Messages.jsx")
);

const Notifications = lazy(() =>
  import("../pages/dashboard/Notifications.jsx")
);

const Settings = lazy(() =>
  import("../pages/dashboard/Settings.jsx")
);

const Discover = lazy(() =>
  import("../pages/dashboard/Discover.jsx")
);

const Proposals = lazy(() =>
  import("../pages/dashboard/Proposals.jsx")
);

const AdminDashboard = lazy(() =>
  import("../pages/admin/AdminDashboard.jsx")
);

// ======================================================
// PARTICLES
// ======================================================

const particles = [
  [8, 18, 2, 1],
  [14, 72, 1, 2],
  [21, 34, 2, 3],
  [27, 84, 1, 1],
  [32, 14, 2, 2],
  [39, 68, 1, 3],
  [44, 26, 2, 1],
  [49, 90, 1, 2],
  [55, 12, 2, 3],
  [61, 76, 1, 1],
  [67, 29, 2, 2],
  [72, 63, 1, 3],
  [78, 18, 2, 1],
  [84, 81, 1, 2],
  [91, 39, 2, 3],
  [5, 51, 1, 2],
  [17, 91, 2, 1],
  [25, 9, 1, 3],
  [35, 48, 2, 2],
  [47, 5, 1, 1],
  [58, 45, 2, 3],
  [69, 94, 1, 2],
  [76, 47, 2, 1],
  [88, 14, 1, 3],
  [95, 68, 2, 2],
];

// ======================================================
// ACCESSIBILITY — REDUCED MOTION
// ======================================================
//
// The splash screen is animation-heavy by design, which is a poor
// experience for anyone with `prefers-reduced-motion: reduce` set at
// the OS level (vestibular disorders, motion sensitivity, or simple
// preference). This hook tracks that media query live, including
// changes made mid-session, so `NexoraIntro` can drop back to a
// near-static presentation without a page reload.

const usePrefersReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined;
    }

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(query.matches);

    const handleChange = (event) => {
      setPrefersReduced(event.matches);
    };

    // Older Safari only supports addListener/removeListener; modern
    // browsers support addEventListener. Support both so this hook
    // doesn't silently no-op on slightly older WebKit.
    if (query.addEventListener) {
      query.addEventListener("change", handleChange);
      return () => query.removeEventListener("change", handleChange);
    }

    query.addListener(handleChange);
    return () => query.removeListener(handleChange);
  }, []);

  return prefersReduced;
};

// ======================================================
// NEXORA INTRO
// ======================================================

// ======================================================
// SUBSYSTEM STATUS PANEL
// ======================================================
//
// A tiny self-contained "boot sequence" widget: a fixed list of
// subsystem labels, each rendered as a thin animated progress bar
// that fills from 0 to its target percentage shortly after mount.
// Extracted as its own component (rather than inlined in
// `NexoraIntro`) so the fill-in-on-mount behavior — which needs its
// own effect to trigger the width transition — stays isolated and
// easy to reason about independently of the rest of the splash.

const SUBSYSTEMS = [
  { label: "PORTAL RING ARRAY", target: 100 },
  { label: "ENERGY CONTAINMENT", target: 96 },
  { label: "DEVELOPER GRAPH SYNC", target: 88 },
  { label: "QUANTUM SEAL", target: 100 },
];

const SubsystemBar = ({ label, target, delay }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Start at 0 so the browser registers the initial state, then
    // flip to the target width on the next tick (plus a stagger
    // delay) so the CSS `transition` actually has something to
    // animate between.
    const timer = setTimeout(() => {
      setWidth(target);
    }, delay);

    return () => clearTimeout(timer);
  }, [target, delay]);

  return (
    <div className="w-44">
      <div className="mb-1 flex items-center justify-between">
        <span className="nx-hud-text text-[8px] tracking-[0.2em] text-green-300/60">
          {label}
        </span>
        <span className="nx-hud-text text-[8px] text-green-300/40">
          {width}%
        </span>
      </div>
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-green-300 to-lime-200 shadow-[0_0_8px_rgba(74,222,128,0.7)] transition-all duration-[1400ms] ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

const SubsystemStatusPanel = () => {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[calc(50%+270px)] flex -translate-x-1/2 flex-col gap-2.5">
      {SUBSYSTEMS.map((system, i) => (
        <SubsystemBar
          key={system.label}
          label={system.label}
          target={system.target}
          delay={300 + i * 220}
        />
      ))}
    </div>
  );
};

const NexoraIntro = ({ onFinish }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [flashActive, setFlashActive] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Total time the intro stays mounted before handing off to the app.
  const INTRO_DURATION_MS = 4000;

  // How long before the end of the intro the "portal opened" flash
  // should trigger. Kept short and near the very end so it reads as
  // a payoff moment rather than an early interruption.
  const FLASH_LEAD_TIME_MS = 380;

  useEffect(() => {
    const dismissTimer = setTimeout(() => {
      onFinish();
    }, INTRO_DURATION_MS);

    const flashTimer = setTimeout(() => {
      setFlashActive(true);
    }, INTRO_DURATION_MS - FLASH_LEAD_TIME_MS);

    return () => {
      clearTimeout(dismissTimer);
      clearTimeout(flashTimer);
    };
  }, [onFinish]);

  // Pointer-driven parallax — this is what gives the portal
  // its "8D" depth: every ring/layer reacts to the cursor at a
  // different intensity, so they appear to sit at different
  // distances from the screen plane.
  useEffect(() => {
    const handleMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      setTilt({ x: nx, y: ny });
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div
      className={
        "fixed inset-0 z-[99999] overflow-hidden bg-[#010402] text-white" +
        (prefersReducedMotion ? " nx-reduced-motion" : "")
      }
    >

      {/* =====================================================================
          NEXORA INTRO — DEDICATED KEYFRAME LIBRARY
          =====================================================================
          Every custom animation used by the splash screen lives here, scoped
          under an `nx-` prefix so nothing collides with Tailwind's own
          keyframes or with animation names used elsewhere in the app.

          Organized into logical groups:
            1. Portal & ring motion        (breathing, flicker, surge)
            2. Atmosphere & energy         (tendrils, chromatic shift)
            3. HUD / sci-fi overlay        (scanlines, grid drift, blink)
            4. Typography & branding       (glitch, flare sweep)
            5. Ambient particle motion     (drift, twinkle)
      ===================================================================== */}

      <style>
        {`
          /* -----------------------------------------------------------
             GROUP 1 — PORTAL & RING MOTION
             ----------------------------------------------------------- */

          @keyframes nx-ring-breathe {
            0%   { transform: scale(1);     opacity: 0.55; }
            50%  { transform: scale(1.045); opacity: 0.9;  }
            100% { transform: scale(1);     opacity: 0.55; }
          }

          @keyframes nx-ring-breathe-slow {
            0%   { transform: scale(1);      opacity: 0.4; }
            50%  { transform: scale(1.08);   opacity: 0.75; }
            100% { transform: scale(1);      opacity: 0.4; }
          }

          @keyframes nx-core-flicker {
            0%, 100% { opacity: 1;    filter: brightness(1);   }
            8%       { opacity: 0.85; filter: brightness(1.3); }
            9%       { opacity: 1;    filter: brightness(0.9); }
            32%      { opacity: 1;    filter: brightness(1);   }
            33%      { opacity: 0.8;  filter: brightness(1.4); }
            34%      { opacity: 1;    filter: brightness(1);   }
            70%      { opacity: 1;    filter: brightness(1);   }
            71%      { opacity: 0.88; filter: brightness(1.25);}
            72%      { opacity: 1;    filter: brightness(1);   }
          }

          @keyframes nx-energy-surge {
            0%   { opacity: 0.35; transform: scale(0.94); }
            45%  { opacity: 1;    transform: scale(1.06); }
            100% { opacity: 0.35; transform: scale(0.94); }
          }

          @keyframes nx-vortex-wobble {
            0%   { transform: translate(-50%, -50%) rotate(0deg)   scale(1);    }
            25%  { transform: translate(-50%, -50%) rotate(90deg)  scale(1.03); }
            50%  { transform: translate(-50%, -50%) rotate(180deg) scale(0.98); }
            75%  { transform: translate(-50%, -50%) rotate(270deg) scale(1.02); }
            100% { transform: translate(-50%, -50%) rotate(360deg) scale(1);    }
          }

          /* -----------------------------------------------------------
             GROUP 2 — ATMOSPHERE & ENERGY
             ----------------------------------------------------------- */

          @keyframes nx-tendril-flow {
            0%   { stroke-dashoffset: 240; opacity: 0;   }
            10%  { opacity: 0.9;                          }
            50%  { opacity: 1;                            }
            90%  { opacity: 0.7;                          }
            100% { stroke-dashoffset: 0;   opacity: 0;    }
          }

          @keyframes nx-tendril-glow-pulse {
            0%, 100% { filter: drop-shadow(0 0 6px rgba(74,222,128,0.55)); }
            50%      { filter: drop-shadow(0 0 16px rgba(163,230,53,0.9)); }
          }

          @keyframes nx-chromatic-shift {
            0%   { filter: drop-shadow(-1.5px 0 0 rgba(255,80,80,0.35)) drop-shadow(1.5px 0 0 rgba(74,222,128,0.55)); }
            50%  { filter: drop-shadow(1.5px 0 0 rgba(255,80,80,0.35))  drop-shadow(-1.5px 0 0 rgba(74,222,128,0.55)); }
            100% { filter: drop-shadow(-1.5px 0 0 rgba(255,80,80,0.35)) drop-shadow(1.5px 0 0 rgba(74,222,128,0.55)); }
          }

          @keyframes nx-orbit-glyph {
            from { transform: rotate(0deg)   translateX(var(--nx-orbit-radius, 150px)) rotate(0deg);   }
            to   { transform: rotate(360deg) translateX(var(--nx-orbit-radius, 150px)) rotate(-360deg); }
          }

          @keyframes nx-orbit-glyph-reverse {
            from { transform: rotate(360deg) translateX(var(--nx-orbit-radius, 150px)) rotate(-360deg); }
            to   { transform: rotate(0deg)   translateX(var(--nx-orbit-radius, 150px)) rotate(0deg);   }
          }

          /* -----------------------------------------------------------
             GROUP 3 — HUD / SCI-FI OVERLAY
             ----------------------------------------------------------- */

          @keyframes nx-scanline-sweep {
            0%   { transform: translateY(-100%); opacity: 0;   }
            10%  { opacity: 0.5;                                }
            90%  { opacity: 0.5;                                }
            100% { transform: translateY(100vh); opacity: 0;   }
          }

          @keyframes nx-grid-drift {
            0%   { background-position: 0px 0px;   }
            100% { background-position: 60px 60px; }
          }

          @keyframes nx-hud-blink {
            0%, 100% { opacity: 1;    }
            50%      { opacity: 0.25; }
          }

          @keyframes nx-hud-border-glow {
            0%, 100% { box-shadow: 0 0 0px rgba(74,222,128,0);   }
            50%      { box-shadow: 0 0 14px rgba(74,222,128,0.6); }
          }

          @keyframes nx-readout-fade-in {
            0%   { opacity: 0; transform: translateY(4px); }
            100% { opacity: 1; transform: translateY(0);   }
          }

          /* -----------------------------------------------------------
             GROUP 4 — TYPOGRAPHY & BRANDING
             ----------------------------------------------------------- */

          @keyframes nx-logo-glitch {
            0%, 92%, 100% {
              transform: translate(0, 0);
              opacity: 1;
            }
            93% {
              transform: translate(-2px, 1px);
              opacity: 0.85;
            }
            95% {
              transform: translate(2px, -1px);
              opacity: 0.95;
            }
            97% {
              transform: translate(-1px, 0);
              opacity: 0.9;
            }
          }

          @keyframes nx-flare-sweep {
            0%   { transform: translateX(-140%) skewX(-18deg); opacity: 0;   }
            15%  { opacity: 0.8;                                             }
            50%  { opacity: 0.9;                                             }
            85%  { opacity: 0.2;                                             }
            100% { transform: translateX(140%) skewX(-18deg);  opacity: 0;   }
          }

          @keyframes nx-tagline-shimmer {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center;  }
          }

          /* -----------------------------------------------------------
             GROUP 5 — AMBIENT PARTICLE MOTION
             ----------------------------------------------------------- */

          @keyframes nx-particle-drift-a {
            0%   { transform: translate(0px, 0px);     }
            50%  { transform: translate(6px, -10px);   }
            100% { transform: translate(0px, 0px);     }
          }

          @keyframes nx-particle-drift-b {
            0%   { transform: translate(0px, 0px);     }
            50%  { transform: translate(-8px, 8px);    }
            100% { transform: translate(0px, 0px);     }
          }

          @keyframes nx-star-twinkle {
            0%, 100% { opacity: 0.15; transform: scale(0.8); }
            50%      { opacity: 0.9;  transform: scale(1.15);}
          }

          /* -----------------------------------------------------------
             UTILITY CLASSES — wire the keyframes above to elements
             without bloating the JSX with long inline style objects.
             ----------------------------------------------------------- */

          .nx-anim-ring-breathe        { animation: nx-ring-breathe 4s ease-in-out infinite; }
          .nx-anim-ring-breathe-slow   { animation: nx-ring-breathe-slow 7s ease-in-out infinite; }
          .nx-anim-core-flicker        { animation: nx-core-flicker 3.6s linear infinite; }
          .nx-anim-energy-surge        { animation: nx-energy-surge 2.4s ease-in-out infinite; }
          .nx-anim-vortex-wobble       { animation: nx-vortex-wobble 5s linear infinite; }
          .nx-anim-tendril-flow        { animation: nx-tendril-flow 2.6s ease-in-out infinite; }
          .nx-anim-tendril-glow        { animation: nx-tendril-glow-pulse 1.8s ease-in-out infinite; }
          .nx-anim-chromatic-shift     { animation: nx-chromatic-shift 2.2s ease-in-out infinite; }
          .nx-anim-orbit-glyph         { animation: nx-orbit-glyph 9s linear infinite; }
          .nx-anim-orbit-glyph-reverse { animation: nx-orbit-glyph-reverse 11s linear infinite; }
          .nx-anim-scanline            { animation: nx-scanline-sweep 3.2s linear infinite; }
          .nx-anim-grid-drift          { animation: nx-grid-drift 5s linear infinite; }
          .nx-anim-hud-blink           { animation: nx-hud-blink 1.6s ease-in-out infinite; }
          .nx-anim-hud-border-glow     { animation: nx-hud-border-glow 2.4s ease-in-out infinite; }
          .nx-anim-readout-fade-in     { animation: nx-readout-fade-in 0.6s ease-out both; }
          .nx-anim-logo-glitch         { animation: nx-logo-glitch 3.8s steps(1) infinite; }
          .nx-anim-flare-sweep         { animation: nx-flare-sweep 3.4s ease-in-out infinite; }
          .nx-anim-tagline-shimmer     {
            background-image: linear-gradient(
              90deg,
              rgba(134,239,172,0.4) 0%,
              rgba(255,255,255,0.95) 50%,
              rgba(134,239,172,0.4) 100%
            );
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: nx-tagline-shimmer 3.2s linear infinite;
          }
          .nx-anim-particle-drift-a    { animation: nx-particle-drift-a 3.4s ease-in-out infinite; }
          .nx-anim-particle-drift-b    { animation: nx-particle-drift-b 4.1s ease-in-out infinite; }
          .nx-anim-star-twinkle        { animation: nx-star-twinkle 2.6s ease-in-out infinite; }

          .nx-grid-overlay {
            background-image:
              linear-gradient(rgba(74,222,128,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74,222,128,0.06) 1px, transparent 1px);
            background-size: 42px 42px;
          }

          .nx-hud-corner {
            position: absolute;
            width: 46px;
            height: 46px;
            border-color: rgba(134,239,172,0.55);
          }

          .nx-hud-text {
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            letter-spacing: 0.18em;
          }

          /* -----------------------------------------------------------
             REDUCED MOTION OVERRIDE
             -----------------------------------------------------------
             When .nx-reduced-motion is present on the intro root
             (driven by usePrefersReducedMotion), every custom
             animation defined above — plus Tailwind's own spin/pulse/
             bounce utilities used throughout the splash — is collapsed
             to a single static frame. Layout, color, and glow are all
             preserved; only motion is removed.
             ----------------------------------------------------------- */

          .nx-reduced-motion [class*="nx-anim-"],
          .nx-reduced-motion [class*="animate-"] {
            animation: none !important;
            transition: none !important;
          }
        `}
      </style>

      {/* =================================================
          DEEP BACKGROUND
      ================================================= */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,120,0.07)_0%,rgba(0,20,10,0.35)_28%,#010402_70%)]" />

      {/* =====================================================================
          HOLOGRAPHIC GRID OVERLAY
          =====================================================================
          A faint, slowly-drifting grid gives the whole scene a sense of a
          "projected" HUD surface rather than a flat gradient background.
          Kept at very low opacity so it reads as texture, not noise.
      ===================================================================== */}

      <div className="nx-grid-overlay nx-anim-grid-drift pointer-events-none absolute inset-0 opacity-40" />

      {/* =====================================================================
          VERTICAL SCANLINE SWEEP
          =====================================================================
          A single soft band of light travels top-to-bottom on a loop,
          reinforcing the "scanning / initializing" narrative of the intro.
      ===================================================================== */}

      <div
        className="nx-anim-scanline pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-transparent via-green-300/10 to-transparent"
      />

      {/* =====================================================================
          LENS FLARE SWEEP
          =====================================================================
          A wide, angled streak of light periodically sweeps across the
          entire scene — a cheap but effective way to sell "camera lens"
          realism on top of an otherwise flat 2D composition.
      ===================================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="nx-anim-flare-sweep absolute top-0 h-full w-[35%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
        />
      </div>

      {/* =====================================================================
          HUD FRAME — CORNER BRACKETS + TELEMETRY READOUT
          =====================================================================
          Four sci-fi style corner brackets with small monospace status
          labels. Purely decorative, but they turn the splash into a
          believable "system boot" screen rather than a plain loader.
      ===================================================================== */}

      <div className="pointer-events-none absolute inset-6 sm:inset-10">

        {/* Top-left */}
        <div className="nx-hud-corner nx-anim-hud-border-glow absolute left-0 top-0 border-l-2 border-t-2">
          <p className="nx-hud-text absolute left-2 top-2 text-[9px] text-green-300/70">
            SYS.CORE // ONLINE
          </p>
        </div>

        {/* Top-right */}
        <div className="nx-hud-corner nx-anim-hud-border-glow absolute right-0 top-0 border-r-2 border-t-2">
          <p className="nx-hud-text absolute right-2 top-2 text-right text-[9px] text-green-300/70">
            REL 5.0.0
          </p>
        </div>

        {/* Bottom-left */}
        <div className="nx-hud-corner nx-anim-hud-border-glow absolute bottom-0 left-0 border-b-2 border-l-2">
          <p className="nx-hud-text absolute bottom-2 left-2 text-[9px] text-green-300/70">
            SYNC // LOCKED
          </p>
        </div>

        {/* Bottom-right */}
        <div className="nx-hud-corner nx-anim-hud-border-glow absolute bottom-0 right-0 border-b-2 border-r-2">
          <p className="nx-hud-text absolute bottom-2 right-2 text-right text-[9px] text-green-300/70">
            PWR // 98.4%
          </p>
        </div>

      </div>

      {/* =====================================================================
          SIDE TELEMETRY TICKERS
          =====================================================================
          Thin vertical strips of scrolling monospace readouts along the
          left and right edges — evokes a mission-control / spacecraft
          console without competing visually with the portal itself.
      ===================================================================== */}

      <div className="pointer-events-none absolute left-3 top-1/2 hidden -translate-y-1/2 flex-col gap-2 sm:flex">
        {[
          "QNTM.FLUX  0x2A91",
          "NODE.LINK  STABLE",
          "GATE.SEAL  ARMED",
          "MASS.DRIFT 0.002%",
          "CORE.TEMP  -4.1K",
        ].map((line, i) => (
          <p
            key={line}
            className="nx-hud-text nx-anim-hud-blink text-[9px] text-green-400/40"
            style={{ animationDelay: `${i * 0.35}s` }}
          >
            {line}
          </p>
        ))}
      </div>

      <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-2 sm:flex">
        {[
          "ORBIT.CALC OK",
          "BEAM.ARRAY  x6",
          "VOID.SCAN  CLEAR",
          "ECHO.DELAY  12ms",
          "NEXORA.OS  v9.2",
        ].map((line, i) => (
          <p
            key={line}
            className="nx-hud-text nx-anim-hud-blink text-right text-[9px] text-green-400/40"
            style={{ animationDelay: `${i * 0.4 + 0.2}s` }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Large atmospheric glow */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[900px]
          w-[900px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-green-500/[0.05]
          blur-[150px]
          animate-pulse
        "
      />

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[550px]
          w-[550px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-emerald-400/[0.07]
          blur-[100px]
        "
      />

      {/* =====================================================================
          ENERGY CONTAINMENT FIELD
          =====================================================================
          A set of very large, faint, slowly-breathing concentric rings
          centered on the portal. These sit far outside the portal's own
          ring system (380px) and establish a sense of a much bigger
          "containment field" surrounding the whole scene — the portal
          reads as the visible core of something far larger, rather than
          the full extent of the effect.
      ===================================================================== */}

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[
          { size: 1180, opacity: "border-green-300/[0.05]", duration: "nx-anim-ring-breathe-slow" },
          { size: 980, opacity: "border-green-300/[0.07]", duration: "nx-anim-ring-breathe" },
          { size: 780, opacity: "border-green-300/[0.09]", duration: "nx-anim-ring-breathe-slow" },
          { size: 640, opacity: "border-green-300/[0.11]", duration: "nx-anim-ring-breathe" },
        ].map((ring, i) => (
          <div
            key={ring.size}
            className={`absolute rounded-full border ${ring.opacity} ${ring.duration}`}
            style={{
              width: `${ring.size}px`,
              height: `${ring.size}px`,
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>

      {/* =================================================
          PARTICLES
      ================================================= */}

      <div
        className="pointer-events-none absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${tilt.x * 10}px, ${tilt.y * 10}px)`,
        }}
      >

        {particles.map(([left, top, size, delay], index) => (
          <span
            key={index}
            className="
              absolute
              rounded-full
              bg-green-300
              shadow-[0_0_8px_rgba(74,222,128,0.9)]
              animate-pulse
            "
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay * 0.4}s`,
              animationDuration: `${1.5 + delay * 0.4}s`,
            }}
          />
        ))}

      </div>

      {/* =================================================
          CENTER STAGE
      ================================================= */}

      <div className="relative z-20 flex min-h-screen items-center justify-center">

        <div className="relative flex flex-col items-center justify-center">

          {/* =================================================
              HUGE ENERGY RAYS
          ================================================= */}

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[850px] w-[850px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out"
            style={{
              transform: `translate(${tilt.x * -18}px, ${tilt.y * -18}px)`,
            }}
          >

            {/* Vertical */}

            <div
              className="
                absolute
                left-1/2
                top-0
                h-[280px]
                w-[3px]
                -translate-x-1/2
                bg-gradient-to-b
                from-transparent
                via-green-300
                to-transparent
                opacity-70
                blur-[2px]
                animate-pulse
              "
            />

            <div
              className="
                absolute
                bottom-0
                left-1/2
                h-[280px]
                w-[3px]
                -translate-x-1/2
                bg-gradient-to-t
                from-transparent
                via-green-300
                to-transparent
                opacity-70
                blur-[2px]
                animate-pulse
              "
            />

            {/* Horizontal */}

            <div
              className="
                absolute
                left-0
                top-1/2
                h-[3px]
                w-[280px]
                -translate-y-1/2
                bg-gradient-to-r
                from-transparent
                via-green-300
                to-transparent
                opacity-70
                blur-[2px]
                animate-pulse
              "
            />

            <div
              className="
                absolute
                right-0
                top-1/2
                h-[3px]
                w-[280px]
                -translate-y-1/2
                bg-gradient-to-l
                from-transparent
                via-green-300
                to-transparent
                opacity-70
                blur-[2px]
                animate-pulse
              "
            />

            {/* Diagonal rays */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-[500px]
                w-[2px]
                origin-center
                -translate-x-1/2
                -translate-y-1/2
                rotate-45
                bg-gradient-to-b
                from-transparent
                via-green-400/60
                to-transparent
                blur-[2px]
              "
            />

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-[500px]
                w-[2px]
                origin-center
                -translate-x-1/2
                -translate-y-1/2
                -rotate-45
                bg-gradient-to-b
                from-transparent
                via-emerald-300/60
                to-transparent
                blur-[2px]
              "
            />

          </div>

          {/* =================================================
              PORTAL SYSTEM — 8D DEPTH STAGE
              A perspective wrapper turns every ring/layer into
              its own "depth plane": each one gets a distinct
              translateZ + rotateX/rotateY so the whole portal
              reads as a real volumetric tunnel instead of a
              flat spinning graphic. Layers react to the cursor
              at different strengths (parallax) to sell the depth.
          ================================================= */}

          <div
            className="relative h-[380px] w-[380px]"
            style={{ perspective: "1400px" }}
          >

            {/* =================================================
                LIGHTNING TENDRILS
                =================================================
                Six jagged energy arcs radiate outward from the rim
                of the portal at staggered intervals, each drawn as
                an SVG path animated via stroke-dashoffset so they
                appear to "crawl" outward and fade — classic portal/
                rift visual language, layered underneath the rings.
            ================================================= */}

            <svg
              className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-visible"
              viewBox="0 0 520 520"
              fill="none"
            >
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <g
                  key={angle}
                  style={{
                    transformOrigin: "260px 260px",
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <path
                    d="M260,150 L266,120 L258,95 L268,60 L255,25"
                    stroke={i % 2 === 0 ? "#86efac" : "#bef264"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="240"
                    className="nx-anim-tendril-flow nx-anim-tendril-glow"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                </g>
              ))}
            </svg>

            {/* =================================================
                ORBITING SCI-FI GLYPHS
                =================================================
                A ring of small geometric "runes" circling the
                portal at a fixed radius, alternating spin direction
                per orbit so they visually interlock rather than
                moving as a single flat wheel.
            ================================================= */}

            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0"
            >
              {["◆", "▲", "●", "◇", "▶", "■", "◈", "△"].map((glyph, i) => (
                <span
                  key={glyph + i}
                  className={
                    "absolute left-0 top-0 text-[10px] text-green-300/70 " +
                    (i % 2 === 0
                      ? "nx-anim-orbit-glyph"
                      : "nx-anim-orbit-glyph-reverse")
                  }
                  style={{
                    "--nx-orbit-radius": `${168 + (i % 3) * 10}px`,
                    animationDelay: `${i * -1.1}s`,
                    textShadow: "0 0 8px rgba(74,222,128,0.8)",
                  }}
                >
                  {glyph}
                </span>
              ))}
            </div>

            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateX(${tilt.y * -14}deg) rotateY(${tilt.x * 14}deg)`,
              }}
            >

              {/* Outer aura */}

              <div
                className="
                  absolute
                  -inset-[70px]
                  rounded-full
                  bg-green-400/[0.05]
                  blur-[45px]
                  animate-pulse
                "
                style={{ transform: "translateZ(-160px)" }}
              />

              {/* Farthest depth ring — deep background layer */}

              <div
                className="
                  absolute
                  -inset-[20px]
                  rounded-full
                  border
                  border-green-200/20
                  shadow-[0_0_50px_rgba(34,197,94,0.25)]
                  animate-[spin_9s_linear_infinite_reverse]
                "
                style={{ transform: "translateZ(-120px) scale(1.15)" }}
              />

              {/* Outer rotating ring */}

              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  border
                  border-green-300/40
                  shadow-[0_0_35px_rgba(34,197,94,0.45),0_0_90px_rgba(34,197,94,0.3),0_0_180px_rgba(34,197,94,0.15)]
                  animate-[spin_6s_linear_infinite]
                "
                style={{ transform: "translateZ(-80px)" }}
              />

              {/* Outer broken energy ring */}

              <div
                className="
                  absolute
                  inset-[12px]
                  rounded-full
                  border-[3px]
                  border-dashed
                  border-green-400/60
                  shadow-[0_0_30px_rgba(34,197,94,0.35)]
                  animate-[spin_3.5s_linear_infinite_reverse]
                "
                style={{ transform: "translateZ(-40px)" }}
              />

              {/* Third ring */}

              <div
                className="
                  absolute
                  inset-[30px]
                  rounded-full
                  border
                  border-emerald-300/50
                  shadow-[0_0_25px_rgba(52,211,153,0.4),inset_0_0_35px_rgba(34,197,94,0.25)]
                  animate-[spin_4.5s_linear_infinite]
                "
                style={{ transform: "translateZ(-10px)" }}
              />

              {/* Inner rotating ring */}

              <div
                className="
                  absolute
                  inset-[48px]
                  rounded-full
                  border-2
                  border-green-400/30
                  border-dotted
                  animate-[spin_2.5s_linear_infinite_reverse]
                "
                style={{ transform: "translateZ(20px)" }}
              />

              {/* Fine tilted ring — closest ring, tilts opposite the
                  outer ones so the tunnel appears to rotate around
                  more than one axis at once */}

              <div
                className="
                  absolute
                  inset-[40px]
                  rounded-full
                  border
                  border-lime-200/25
                  animate-[spin_7s_linear_infinite]
                "
                style={{
                  transform: "translateZ(35px) rotateX(55deg)",
                }}
              />

              {/* =================================================
                  THICK ORBITAL LIGHT BEAMS
                  Heavy, saturated green beams sweeping around the
                  outside of the portal at speed — this is the
                  "atmosphere" layer: it reads less like a UI ring
                  and more like real energy circling a live portal.
              ================================================= */}

              <div
                className="absolute -inset-[38px] animate-[spin_3s_linear_infinite]"
                style={{ transform: "translateZ(-55px)" }}
              >
                <div
                  className="
                    absolute
                    left-1/2
                    top-[-9px]
                    h-[70px]
                    w-[14px]
                    -translate-x-1/2
                    rounded-full
                    bg-gradient-to-b
                    from-transparent
                    via-green-300
                    to-emerald-400
                    blur-[3px]
                    shadow-[0_0_25px_10px_rgba(74,222,128,0.7)]
                  "
                />
                <div
                  className="
                    absolute
                    left-1/2
                    bottom-[-9px]
                    h-[70px]
                    w-[14px]
                    -translate-x-1/2
                    rounded-full
                    bg-gradient-to-t
                    from-transparent
                    via-green-300
                    to-emerald-400
                    blur-[3px]
                    shadow-[0_0_25px_10px_rgba(74,222,128,0.7)]
                  "
                />
              </div>

              <div
                className="absolute -inset-[38px] animate-[spin_4.2s_linear_infinite_reverse]"
                style={{ transform: "translateZ(-55px) rotate(90deg)" }}
              >
                <div
                  className="
                    absolute
                    left-1/2
                    top-[-7px]
                    h-[55px]
                    w-[10px]
                    -translate-x-1/2
                    rounded-full
                    bg-gradient-to-b
                    from-transparent
                    via-lime-200
                    to-green-400
                    blur-[3px]
                    shadow-[0_0_20px_8px_rgba(163,230,53,0.6)]
                  "
                />
                <div
                  className="
                    absolute
                    left-1/2
                    bottom-[-7px]
                    h-[55px]
                    w-[10px]
                    -translate-x-1/2
                    rounded-full
                    bg-gradient-to-t
                    from-transparent
                    via-lime-200
                    to-green-400
                    blur-[3px]
                    shadow-[0_0_20px_8px_rgba(163,230,53,0.6)]
                  "
                />
              </div>

              {/* Continuous thick ring of orbiting light — a full
                  circling halo rather than isolated beams, closest
                  to the portal rim for maximum "atmosphere" feel */}

              <div
                className="
                  absolute
                  -inset-[10px]
                  rounded-full
                  animate-[spin_2.2s_linear_infinite]
                "
                style={{
                  transform: "translateZ(-25px)",
                  background:
                    "conic-gradient(from 0deg, rgba(74,222,128,0) 0deg, rgba(74,222,128,0.9) 25deg, rgba(190,242,100,0.95) 45deg, rgba(74,222,128,0) 75deg, rgba(74,222,128,0) 360deg)",
                  WebkitMask:
                    "radial-gradient(farthest-side, transparent calc(100% - 10px), black calc(100% - 10px))",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 10px), black calc(100% - 10px))",
                  filter: "blur(2px)",
                }}
              />

              {/* =================================================
                  PORTAL CORE
              ================================================= */}

              <div
                className="
                  absolute
                  inset-[65px]
                  overflow-hidden
                  rounded-full
                  bg-[#010603]
                  shadow-[inset_0_0_60px_rgba(34,197,94,0.95),inset_0_0_140px_rgba(34,197,94,0.5),0_0_60px_rgba(34,197,94,0.6),0_0_130px_rgba(34,197,94,0.35)]
                "
                style={{ transform: "translateZ(45px)" }}
              >

                {/* Core glow */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[200px]
                    w-[200px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-green-400/[0.16]
                    blur-[50px]
                    animate-pulse
                  "
                />

                {/* Deep tunnel ring — sits visually "behind" the
                    other vortex rings via low opacity + heavy blur,
                    giving the core actual sense of depth rather
                    than a flat spinning disc */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[160px]
                    w-[160px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    border-2
                    border-green-500/25
                    blur-[1px]
                    animate-[spin_6s_linear_infinite_reverse]
                  "
                />

                {/* Core vortex */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[135px]
                    w-[135px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    border
                    border-green-300/40
                    shadow-[0_0_35px_rgba(34,197,94,0.5),inset_0_0_35px_rgba(34,197,94,0.4)]
                    animate-[spin_1.8s_linear_infinite]
                  "
                />

                {/* Secondary vortex, counter-spinning, slightly
                    offset scale — adds a "tunneling" flicker */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[105px]
                    w-[105px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    border
                    border-lime-200/50
                    shadow-[0_0_25px_rgba(163,230,53,0.5)]
                    animate-[spin_1.1s_linear_infinite_reverse]
                  "
                />

                {/* Innermost vortex ring — fastest spin, right at
                    the mouth of the core, tightens the "pull" feel */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[88px]
                    w-[88px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    border
                    border-green-200/60
                    shadow-[0_0_20px_rgba(190,242,100,0.6)]
                    animate-[spin_0.9s_linear_infinite]
                  "
                />

                {/* Core center */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    h-[75px]
                    w-[75px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-[radial-gradient(circle,rgba(220,255,230,0.95)_0%,rgba(134,239,172,0.8)_18%,rgba(34,197,94,0.35)_38%,rgba(0,0,0,0.95)_72%)]
                    shadow-[0_0_45px_rgba(220,255,230,1),0_0_100px_rgba(74,222,128,0.75),0_0_170px_rgba(34,197,94,0.45)]
                    animate-pulse
                  "
                />

              </div>

              {/* =================================================
                  ENERGY POINTS — pushed slightly forward (positive Z)
                  so they read as sparks flying off the front rim
              ================================================= */}

              <div
                className="absolute inset-0 animate-[spin_3.8s_linear_infinite]"
                style={{ transform: "translateZ(50px)" }}
              >

                <span
                  className="
                    absolute
                    left-1/2
                    top-[-5px]
                    h-10
                    w-2
                    -translate-x-1/2
                    rounded-full
                    bg-green-200
                    shadow-[0_0_12px_#86efac,0_0_30px_#22c55e,0_0_60px_#22c55e]
                  "
                />

                <span
                  className="
                    absolute
                    bottom-[-5px]
                    left-1/2
                    h-10
                    w-2
                    -translate-x-1/2
                    rounded-full
                    bg-green-300
                    shadow-[0_0_12px_#86efac,0_0_30px_#22c55e]
                  "
                />

                <span
                  className="
                    absolute
                    left-[-5px]
                    top-1/2
                    h-2
                    w-10
                    -translate-y-1/2
                    rounded-full
                    bg-green-300
                    shadow-[0_0_12px_#86efac,0_0_30px_#22c55e]
                  "
                />

                <span
                  className="
                    absolute
                    right-[-5px]
                    top-1/2
                    h-2
                    w-10
                    -translate-y-1/2
                    rounded-full
                    bg-green-300
                    shadow-[0_0_12px_#86efac,0_0_30px_#22c55e]
                  "
                />

              </div>

              {/* Secondary energy points on the opposite spin
                  direction and a different Z depth, for extra
                  layered motion parallax */}

              <div
                className="absolute inset-0 animate-[spin_2.6s_linear_infinite_reverse]"
                style={{ transform: "translateZ(-30px) rotate(45deg)" }}
              >

                <span
                  className="
                    absolute
                    left-1/2
                    top-[6px]
                    h-6
                    w-[6px]
                    -translate-x-1/2
                    rounded-full
                    bg-lime-200/80
                    shadow-[0_0_10px_#bef264,0_0_24px_#22c55e]
                  "
                />

                <span
                  className="
                    absolute
                    bottom-[6px]
                    left-1/2
                    h-6
                    w-[6px]
                    -translate-x-1/2
                    rounded-full
                    bg-lime-200/80
                    shadow-[0_0_10px_#bef264,0_0_24px_#22c55e]
                  "
                />

              </div>

            </div>

          </div>

          {/* =====================================================================
              PORTAL STATUS READOUT
              =====================================================================
              A small monospace console beneath the ring system, listing a
              handful of fake telemetry values. Each line fades in with a
              slight stagger so it reads as "live data populating" rather
              than static text.
          ===================================================================== */}

          <div className="pointer-events-none absolute left-1/2 top-[calc(50%+210px)] flex -translate-x-1/2 flex-col items-center gap-1">
            {[
              "PORTAL INTEGRITY ..... 100%",
              "QUANTUM FLUX ......... STABLE",
              "DEVELOPER UPLINK ..... ESTABLISHED",
            ].map((line, i) => (
              <p
                key={line}
                className="nx-hud-text nx-anim-readout-fade-in text-[9px] tracking-[0.25em] text-green-300/50"
                style={{ animationDelay: `${1.1 + i * 0.35}s` }}
              >
                {line}
              </p>
            ))}
          </div>

          {/* =====================================================================
              SUBSYSTEM STATUS BARS
              =====================================================================
              A small cluster of horizontal "loading" bars, each labeled like a
              boot-sequence subsystem. Every bar fills via a CSS transition
              triggered on mount (width 0 -> target), staggered so they don't
              all complete at once — this is what makes a boot screen feel
              like it's actually doing work rather than just looping a spinner.
          ===================================================================== */}

          <SubsystemStatusPanel />

          {/* =================================================
              NEXORA LOGO
          ================================================= */}

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">

            <div className="relative flex flex-col items-center">

              <div
                className="
                  absolute
                  inset-0
                  bg-green-400/30
                  blur-[30px]
                "
              />

              <h1
                className="
                  nx-anim-chromatic-shift
                  nx-anim-logo-glitch
                  relative
                  whitespace-nowrap
                  text-5xl
                  font-black
                  tracking-[0.32em]
                  text-white
                  drop-shadow-[0_0_10px_rgba(134,239,172,0.9)]
                  drop-shadow-[0_0_30px_rgba(34,197,94,0.7)]
                "
              >
                NEXORA
              </h1>

            </div>

          </div>

          {/* =================================================
              WELCOME TEXT
          ================================================= */}

          <div className="mt-16 text-center">

            <p
              className="
                nx-anim-tagline-shimmer
                text-sm
                font-semibold
                uppercase
                tracking-[0.6em]
                drop-shadow-[0_0_12px_rgba(74,222,128,0.8)]
              "
            >
              WELCOME DEVELOPERS
            </p>

            <p
              className="
                mt-4
                text-xs
                font-medium
                uppercase
                tracking-[0.45em]
                text-gray-500
              "
            >
              BUILD • CONNECT • CREATE
            </p>

          </div>

          {/* =================================================
              LOADING PROGRESS
          ================================================= */}

          <div className="mt-9">

            <div className="h-[2px] w-56 overflow-hidden rounded-full bg-white/10">

              <div
                className="
                  h-full
                  w-full
                  origin-left
                  bg-gradient-to-r
                  from-transparent
                  via-green-300
                  to-transparent
                  animate-[scaleX_3.7s_ease-in-out_forwards]
                "
              />

            </div>

            <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-gray-600">
              Initializing Nexora
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================================
          SECONDARY STARFIELD LAYER
          =====================================================================
          A sparser, slower, twinkling layer of tiny points sits above the
          main particle field. Where `particles` reads as "energy motes"
          near the portal, this layer reads as distant background stars,
          adding an extra sense of scale/depth to the whole scene.
      ===================================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {[
          [4, 8], [12, 22], [19, 61], [27, 40], [33, 77],
          [41, 15], [48, 58], [56, 33], [63, 88], [71, 12],
          [77, 66], [84, 29], [90, 71], [96, 44], [8, 90],
          [15, 48], [23, 4], [31, 95], [38, 30], [46, 82],
          [53, 6], [61, 55], [68, 18], [74, 92], [82, 52],
          [88, 8], [93, 63], [3, 35], [59, 96], [97, 24],
        ].map(([left, top], i) => (
          <span
            key={`star-${i}`}
            className={
              "nx-anim-star-twinkle absolute rounded-full bg-emerald-100 " +
              (i % 2 === 0 ? "nx-anim-particle-drift-a" : "nx-anim-particle-drift-b")
            }
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: "1px",
              height: "1px",
              animationDelay: `${(i % 7) * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* =====================================================================
          BOTTOM TELEMETRY TICKER
          =====================================================================
          A thin strip of scrolling monospace text along the very bottom
          edge of the screen — a small but effective detail that makes the
          splash feel like a real console boot sequence rather than a
          static loading graphic.
      ===================================================================== */}

      <div className="pointer-events-none absolute inset-x-0 bottom-3 overflow-hidden">
        <div className="nx-hud-text whitespace-nowrap text-[9px] tracking-[0.3em] text-green-400/30">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="mr-16">
              NEXORA.OS BOOT SEQUENCE — CALIBRATING PORTAL ARRAY — SYNCING
              DEVELOPER GRAPH — VERIFYING QUANTUM SEAL — LOADING WORKSPACE —
            </span>
          ))}
        </div>
      </div>

      {/* =====================================================================
          PORTAL-OPENED COMPLETION FLASH
          =====================================================================
          A brief, bright white-green flash that fades in during the final
          moments of the intro (see `FLASH_LEAD_TIME_MS`), then fades back
          out just as `onFinish` fires. It gives the transition into the
          real app a small "payoff" beat instead of an abrupt cut, without
          adding to the fixed 4-second total duration.
      ===================================================================== */}

      <div
        className={
          "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_0%,rgba(190,242,100,0.4)_35%,transparent_70%)] transition-opacity duration-300 ease-in " +
          (flashActive ? "opacity-70" : "opacity-0")
        }
      />

      {/* =================================================
          VIGNETTE
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          shadow-[inset_0_0_180px_rgba(0,0,0,0.9)]
        "
      />

    </div>
  );
};

// ======================================================
// PAGE LOADER
// ======================================================

const PageLoader = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-950 text-white">

      <div className="flex flex-col items-center gap-4">

        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-green-500" />

        <p className="text-sm text-gray-400">
          Loading...
        </p>

      </div>

    </div>
  );
};

// ======================================================
// APP ROUTES
// ======================================================

const AppRoutes = () => {

  const [showIntro, setShowIntro] = useState(true);

  const finishIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <BrowserRouter>

      {/* =========================================
          NEXORA SPLASH
      ========================================= */}

      {showIntro && (
        <NexoraIntro onFinish={finishIntro} />
      )}

      {/* =========================================
          ROUTES
      ========================================= */}

      <Suspense fallback={<PageLoader />}>

        <Routes>

          {/* PUBLIC */}

          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />

          <Route
            path="/login"
            element={
              <MainLayout>
                <Login />
              </MainLayout>
            }
          />

          <Route
            path="/register"
            element={
              <MainLayout>
                <Register />
              </MainLayout>
            }
          />

          <Route
            path="/developers"
            element={
              <MainLayout>
                <Developers />
              </MainLayout>
            }
          />

          <Route
            path="/developers/:username"
            element={
              <MainLayout>
                <DeveloperProfile />
              </MainLayout>
            }
          />

          <Route
            path="/companies"
            element={
              <MainLayout>
                <Companies />
              </MainLayout>
            }
          />

          <Route
            path="/companies/:id"
            element={
              <MainLayout>
                <CompanyDetail />
              </MainLayout>
            }
          />

          <Route
            path="/resume-builder"
            element={
              <MainLayout>
                <ResumeBuilder />
              </MainLayout>
            }
          />

          <Route
            path="/projects"
            element={
              <MainLayout>
                <AllProjects />
              </MainLayout>
            }
          />

          {/* PROTECTED */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <Dashboards />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/profile"
              element={
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/portfolio"
              element={
                <DashboardLayout>
                  <Portfolio />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/messages"
              element={
                <DashboardLayout>
                  <Messages />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/notifications"
              element={
                <DashboardLayout>
                  <Notifications />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/settings"
              element={
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/discover"
              element={
                <DashboardLayout>
                  <Discover />
                </DashboardLayout>
              }
            />

            <Route
              path="/dashboard/proposals"
              element={
                <DashboardLayout>
                  <Proposals />
                </DashboardLayout>
              }
            />

            <Route
              path="/admin"
              element={
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              }
            />

          </Route>

          {/* 404 */}

          <Route
            path="*"
            element={
              <MainLayout>

                <div className="min-h-[70vh] flex items-center justify-center bg-gray-950 text-white">

                  <div className="text-center">

                    <h1 className="text-5xl font-bold mb-3">
                      404
                    </h1>

                    <p className="text-gray-400">
                      Page Not Found
                    </p>

                  </div>

                </div>

              </MainLayout>
            }
          />

        </Routes>

      </Suspense>

    </BrowserRouter>
  );
};

export default AppRoutes;
