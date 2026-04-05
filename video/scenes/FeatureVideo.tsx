import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

// ── Color Palette ─────────────────────────────────────────────────
const COLORS = {
  bgDark: "#0a0a1a",
  bgMid: "#111133",
  accent: "#7c6aff",
  accentGlow: "#a78bfa",
  accentOrange: "#f97316",
  accentGreen: "#22c55e",
  accentCyan: "#06b6d4",
  accentPink: "#ec4899",
  textPrimary: "#ffffff",
  textSecondary: "#94a3b8",
  cardBg: "rgba(255,255,255,0.05)",
  cardBorder: "rgba(124,106,255,0.3)",
};

// ── Shared Components ─────────────────────────────────────────────
const GradientBackground: React.FC<{
  color1?: string;
  color2?: string;
  angle?: number;
}> = ({ color1 = COLORS.bgDark, color2 = COLORS.bgMid, angle = 135 }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
    }}
  />
);

const GridOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.03 }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `
        linear-gradient(rgba(124,106,255,${opacity}) 1px, transparent 1px),
        linear-gradient(90deg, rgba(124,106,255,${opacity}) 1px, transparent 1px)
      `,
      backgroundSize: "60px 60px",
    }}
  />
);

const FloatingOrb: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  frame: number;
  speed?: number;
}> = ({ x, y, size, color, frame, speed = 0.02 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y + Math.sin(frame * speed) * 20,
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color}40, ${color}00)`,
      filter: "blur(40px)",
    }}
  />
);

// ── Scene 1: Intro (0-210 frames = 7 sec) ─────────────────────────
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ fps, frame, config: { damping: 15, mass: 1.2 }, delay: 15 });
  const subtitleSpring = spring({ fps, frame, config: { damping: 12 }, delay: 40 });
  const badgeSpring = spring({ fps, frame, config: { damping: 10 }, delay: 65 });
  const lineSpring = spring({ fps, frame, config: { damping: 20 }, delay: 30 });

  const titleY = interpolate(titleSpring, [0, 1], [60, 0]);
  const subtitleY = interpolate(subtitleSpring, [0, 1], [40, 0]);

  // Exit fade
  const exitOpacity = interpolate(frame, [180, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      <GradientBackground />
      <GridOverlay />
      <FloatingOrb x={200} y={150} size={400} color={COLORS.accent} frame={frame} />
      <FloatingOrb x={1400} y={600} size={300} color={COLORS.accentPink} frame={frame} speed={0.03} />
      <FloatingOrb x={800} y={300} size={350} color={COLORS.accentCyan} frame={frame} speed={0.015} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {/* Decorative line */}
        <div
          style={{
            position: "absolute",
            top: 340,
            width: interpolate(lineSpring, [0, 1], [0, 200]),
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
          }}
        />

        {/* Title */}
        <div
          style={{
            transform: `translateY(${titleY}px)`,
            opacity: titleSpring,
            fontSize: 88,
            fontWeight: 800,
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: COLORS.textPrimary,
            letterSpacing: "-2px",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Claude Power
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentCyan})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Setup
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 30,
            transform: `translateY(${subtitleY}px)`,
            opacity: subtitleSpring,
            fontSize: 28,
            fontWeight: 400,
            color: COLORS.textSecondary,
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            letterSpacing: "0.5px",
          }}
        >
          Multi-agent orchestration for Claude Code
        </div>

        {/* Install badge */}
        <div
          style={{
            marginTop: 40,
            transform: `scale(${badgeSpring})`,
            opacity: badgeSpring,
            padding: "14px 32px",
            borderRadius: 12,
            background: "rgba(124,106,255,0.15)",
            border: `1px solid ${COLORS.cardBorder}`,
            fontFamily: "'Courier New', monospace",
            fontSize: 22,
            color: COLORS.accentGlow,
            letterSpacing: "1px",
          }}
        >
          $ npx claude-power-setup
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: Mode Switching (210-420 frames = 7 sec) ──────────────
const ModeSwitchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ fps, frame, config: { damping: 15 }, delay: 10 });
  const titleY = interpolate(titleSpring, [0, 1], [40, 0]);

  const modes = [
    { cmd: "cdev", desc: "TDD + quality gates", color: COLORS.accentGreen, icon: ">" },
    { cmd: "corchestrate", desc: "Team lead / swarm", color: COLORS.accent, icon: ">" },
    { cmd: "creview", desc: "Security-first review", color: COLORS.accentOrange, icon: ">" },
    { cmd: "cresearch", desc: "Read-only research", color: COLORS.accentCyan, icon: ">" },
  ];

  const exitOpacity = interpolate(frame, [180, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      <GradientBackground color1="#0a0a1a" color2="#0d1a2a" />
      <GridOverlay opacity={0.02} />
      <FloatingOrb x={100} y={100} size={300} color={COLORS.accentGreen} frame={frame} />
      <FloatingOrb x={1500} y={700} size={250} color={COLORS.accent} frame={frame} speed={0.025} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {/* Section title */}
        <div
          style={{
            position: "absolute",
            top: 120,
            opacity: titleSpring,
            transform: `translateY(${titleY}px)`,
            fontSize: 18,
            fontWeight: 600,
            color: COLORS.accent,
            fontFamily: "system-ui, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "4px",
          }}
        >
          Mode Switching
        </div>

        <div
          style={{
            position: "absolute",
            top: 160,
            opacity: titleSpring,
            fontSize: 52,
            fontWeight: 700,
            color: COLORS.textPrimary,
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          Four purpose-built modes
        </div>

        {/* Mode cards */}
        <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
          {modes.map((mode, i) => {
            const cardSpring = spring({ fps, frame, config: { damping: 12 }, delay: 35 + i * 18 });
            const cardY = interpolate(cardSpring, [0, 1], [60, 0]);

            return (
              <div
                key={mode.cmd}
                style={{
                  transform: `translateY(${cardY}px)`,
                  opacity: cardSpring,
                  width: 380,
                  padding: "36px 30px",
                  borderRadius: 16,
                  background: COLORS.cardBg,
                  border: `1px solid ${mode.color}30`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: 26,
                    fontWeight: 700,
                    color: mode.color,
                    marginBottom: 12,
                  }}
                >
                  {mode.icon} {mode.cmd}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    color: COLORS.textSecondary,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {mode.desc}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 3: Agent Teams Swarm (420-660 frames = 8 sec) ───────────
const SwarmScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ fps, frame, config: { damping: 15 }, delay: 10 });

  const agents = [
    { name: "architect", angle: 0, color: COLORS.accent },
    { name: "backend", angle: 60, color: COLORS.accentGreen },
    { name: "frontend", angle: 120, color: COLORS.accentCyan },
    { name: "tester", angle: 180, color: COLORS.accentOrange },
    { name: "reviewer", angle: 240, color: COLORS.accentPink },
    { name: "docs", angle: 300, color: COLORS.textSecondary },
  ];

  const orbitRadius = 220;
  const rotationSpeed = 0.008;

  const exitOpacity = interpolate(frame, [210, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      <GradientBackground color1="#0a0a1a" color2="#1a0a2a" />
      <GridOverlay opacity={0.02} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {/* Title */}
        <div
          style={{
            position: "absolute",
            top: 80,
            opacity: titleSpring,
            fontSize: 18,
            fontWeight: 600,
            color: COLORS.accentPink,
            fontFamily: "system-ui, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "4px",
          }}
        >
          Agent Teams
        </div>
        <div
          style={{
            position: "absolute",
            top: 120,
            opacity: titleSpring,
            fontSize: 52,
            fontWeight: 700,
            color: COLORS.textPrimary,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Swarm Mode
        </div>

        {/* Central node */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Central hub */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${COLORS.accent}60, ${COLORS.accent}10)`,
              border: `2px solid ${COLORS.accent}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: "translate(-50%, -50%)",
              fontSize: 14,
              fontWeight: 700,
              color: COLORS.textPrimary,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            YOU
          </div>

          {/* Orbiting agents */}
          {agents.map((agent, i) => {
            const agentSpring = spring({ fps, frame, config: { damping: 10 }, delay: 30 + i * 12 });
            const currentAngle = ((agent.angle + frame * rotationSpeed * 57.3) * Math.PI) / 180;
            const x = Math.cos(currentAngle) * orbitRadius * agentSpring;
            const y = Math.sin(currentAngle) * orbitRadius * agentSpring;

            // Draw connection line
            const lineOpacity = interpolate(agentSpring, [0.5, 1], [0, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            return (
              <React.Fragment key={agent.name}>
                {/* Connection line */}
                <svg
                  style={{
                    position: "absolute",
                    top: -50,
                    left: -50,
                    width: orbitRadius * 2 + 100,
                    height: orbitRadius * 2 + 100,
                    overflow: "visible",
                    pointerEvents: "none",
                  }}
                >
                  <line
                    x1="50"
                    y1="50"
                    x2={50 + x}
                    y2={50 + y}
                    stroke={agent.color}
                    strokeWidth="1"
                    opacity={lineOpacity}
                  />
                </svg>

                {/* Agent node */}
                <div
                  style={{
                    position: "absolute",
                    left: x - 50,
                    top: y - 25,
                    width: 100,
                    height: 50,
                    borderRadius: 12,
                    background: `${agent.color}15`,
                    border: `1px solid ${agent.color}50`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 13,
                    fontWeight: 600,
                    color: agent.color,
                    fontFamily: "system-ui, sans-serif",
                    opacity: agentSpring,
                    transform: `scale(${agentSpring})`,
                  }}
                >
                  {agent.name}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom label */}
        <div
          style={{
            position: "absolute",
            bottom: 100,
            opacity: interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            fontSize: 22,
            color: COLORS.textSecondary,
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          Each agent works in an isolated worktree with fresh context
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 4: Automation Pipelines (660-900 frames = 8 sec) ────────
const AutomationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ fps, frame, config: { damping: 15 }, delay: 10 });

  const pipelines = [
    {
      name: "cpipeline",
      steps: ["Implement", "De-slop", "Verify", "Commit"],
      desc: "Sequential pipeline",
      color: COLORS.accentGreen,
    },
    {
      name: "crouted",
      steps: ["Opus Research", "Sonnet Code", "Opus Review", "Fix & Commit"],
      desc: "Model-routed",
      color: COLORS.accent,
    },
    {
      name: "claude-loop",
      steps: ["Iterate", "Quality Gate", "Progress Track", "Complete"],
      desc: "Continuous loop",
      color: COLORS.accentOrange,
    },
  ];

  const exitOpacity = interpolate(frame, [210, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      <GradientBackground color1="#0a0a1a" color2="#0a1a1a" />
      <GridOverlay opacity={0.02} />
      <FloatingOrb x={300} y={200} size={300} color={COLORS.accentGreen} frame={frame} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 80,
            opacity: titleSpring,
            fontSize: 18,
            fontWeight: 600,
            color: COLORS.accentOrange,
            fontFamily: "system-ui, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "4px",
          }}
        >
          Automation
        </div>
        <div
          style={{
            position: "absolute",
            top: 120,
            opacity: titleSpring,
            fontSize: 52,
            fontWeight: 700,
            color: COLORS.textPrimary,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Pipeline Orchestration
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, marginTop: 40, width: 1400 }}>
          {pipelines.map((pipeline, pi) => {
            const rowSpring = spring({ fps, frame, config: { damping: 12 }, delay: 30 + pi * 25 });
            const rowY = interpolate(rowSpring, [0, 1], [40, 0]);

            return (
              <div
                key={pipeline.name}
                style={{
                  transform: `translateY(${rowY}px)`,
                  opacity: rowSpring,
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  padding: "24px 32px",
                  borderRadius: 16,
                  background: COLORS.cardBg,
                  border: `1px solid ${pipeline.color}20`,
                }}
              >
                <div style={{ minWidth: 200 }}>
                  <div
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: 22,
                      fontWeight: 700,
                      color: pipeline.color,
                    }}
                  >
                    {pipeline.name}
                  </div>
                  <div style={{ fontSize: 14, color: COLORS.textSecondary, fontFamily: "system-ui, sans-serif", marginTop: 4 }}>
                    {pipeline.desc}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                  {pipeline.steps.map((step, si) => {
                    const stepProgress = interpolate(frame, [50 + pi * 25 + si * 20, 70 + pi * 25 + si * 20], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    });

                    return (
                      <React.Fragment key={step}>
                        <div
                          style={{
                            padding: "10px 20px",
                            borderRadius: 8,
                            background: stepProgress > 0.5 ? `${pipeline.color}20` : "rgba(255,255,255,0.03)",
                            border: `1px solid ${stepProgress > 0.5 ? pipeline.color : "rgba(255,255,255,0.1)"}40`,
                            fontSize: 15,
                            fontWeight: 500,
                            color: stepProgress > 0.5 ? pipeline.color : COLORS.textSecondary,
                            fontFamily: "system-ui, sans-serif",
                            transition: "all 0.3s",
                            opacity: interpolate(stepProgress, [0, 1], [0.3, 1]),
                          }}
                        >
                          {step}
                        </div>
                        {si < pipeline.steps.length - 1 && (
                          <div style={{ color: COLORS.textSecondary, fontSize: 18, opacity: stepProgress }}>
                            {"\u2192"}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 5: Self-Improvement (900-1140 frames = 8 sec) ───────────
const LearningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ fps, frame, config: { damping: 15 }, delay: 10 });

  const layers = [
    { name: "Observe", desc: "Every tool use", icon: "\uD83D\uDC41", color: COLORS.accentCyan },
    { name: "Detect", desc: "Patterns emerge", icon: "\uD83E\uDDE0", color: COLORS.accent },
    { name: "Learn", desc: "Create instincts", icon: "\uD83D\uDCA1", color: COLORS.accentGreen },
    { name: "Promote", desc: "Project \u2192 global", icon: "\u2B06", color: COLORS.accentOrange },
    { name: "Evolve", desc: "Instincts \u2192 skills", icon: "\uD83D\uDE80", color: COLORS.accentPink },
  ];

  const exitOpacity = interpolate(frame, [210, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      <GradientBackground color1="#0a0a1a" color2="#1a0a1a" />
      <GridOverlay opacity={0.02} />
      <FloatingOrb x={1200} y={300} size={400} color={COLORS.accentPink} frame={frame} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 80,
            opacity: titleSpring,
            fontSize: 18,
            fontWeight: 600,
            color: COLORS.accentGreen,
            fontFamily: "system-ui, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "4px",
          }}
        >
          Recursive Self-Improvement
        </div>
        <div
          style={{
            position: "absolute",
            top: 120,
            opacity: titleSpring,
            fontSize: 52,
            fontWeight: 700,
            color: COLORS.textPrimary,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          It gets smarter every session
        </div>

        {/* Vertical pipeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 60 }}>
          {layers.map((layer, i) => {
            const layerSpring = spring({ fps, frame, config: { damping: 12 }, delay: 30 + i * 20 });
            const layerX = interpolate(layerSpring, [0, 1], [-100, 0]);

            return (
              <React.Fragment key={layer.name}>
                <div
                  style={{
                    transform: `translateX(${layerX}px)`,
                    opacity: layerSpring,
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    padding: "20px 40px",
                    borderRadius: 14,
                    background: COLORS.cardBg,
                    border: `1px solid ${layer.color}25`,
                    width: 700,
                  }}
                >
                  <div style={{ fontSize: 36 }}>{layer.icon}</div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: layer.color, fontFamily: "system-ui, sans-serif" }}>
                      {layer.name}
                    </div>
                    <div style={{ fontSize: 16, color: COLORS.textSecondary, fontFamily: "system-ui, sans-serif" }}>
                      {layer.desc}
                    </div>
                  </div>
                  {/* Confidence bar */}
                  <div style={{ marginLeft: "auto", width: 120, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)" }}>
                    <div
                      style={{
                        width: interpolate(layerSpring, [0, 1], [0, 100 - i * 10]),
                        height: "100%",
                        borderRadius: 3,
                        background: `linear-gradient(90deg, ${layer.color}, ${layer.color}80)`,
                      }}
                    />
                  </div>
                </div>
                {i < layers.length - 1 && (
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: 24,
                      color: COLORS.textSecondary,
                      opacity: layerSpring * 0.5,
                    }}
                  >
                    {"\u2193"}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 6: CTA / Outro (1140-1350 frames = 7 sec) ──────────────
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ fps, frame, config: { damping: 12, mass: 1.5 }, delay: 15 });
  const cmdSpring = spring({ fps, frame, config: { damping: 10 }, delay: 50 });
  const statsSpring = spring({ fps, frame, config: { damping: 12 }, delay: 80 });

  const titleY = interpolate(titleSpring, [0, 1], [50, 0]);

  const stats = [
    { label: "Context Modes", value: "4", color: COLORS.accentGreen },
    { label: "Automation Scripts", value: "3", color: COLORS.accent },
    { label: "Learned Instincts", value: "4", color: COLORS.accentOrange },
    { label: "Slash Commands", value: "30+", color: COLORS.accentCyan },
  ];

  return (
    <AbsoluteFill>
      <GradientBackground />
      <GridOverlay />
      <FloatingOrb x={300} y={200} size={500} color={COLORS.accent} frame={frame} />
      <FloatingOrb x={1300} y={500} size={400} color={COLORS.accentPink} frame={frame} speed={0.025} />
      <FloatingOrb x={800} y={700} size={350} color={COLORS.accentCyan} frame={frame} speed={0.015} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            transform: `translateY(${titleY}px)`,
            opacity: titleSpring,
            fontSize: 72,
            fontWeight: 800,
            fontFamily: "system-ui, sans-serif",
            color: COLORS.textPrimary,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          One command.
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentGreen})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Unlimited power.
          </span>
        </div>

        {/* Install command */}
        <div
          style={{
            marginTop: 48,
            transform: `scale(${cmdSpring})`,
            opacity: cmdSpring,
            padding: "18px 48px",
            borderRadius: 14,
            background: "rgba(124,106,255,0.12)",
            border: `2px solid ${COLORS.accent}60`,
            fontFamily: "'Courier New', monospace",
            fontSize: 28,
            fontWeight: 600,
            color: COLORS.accentGlow,
          }}
        >
          $ npx claude-power-setup
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 48, marginTop: 60 }}>
          {stats.map((stat, i) => {
            const statSpring = spring({ fps, frame, config: { damping: 12 }, delay: 80 + i * 12 });
            return (
              <div
                key={stat.label}
                style={{
                  opacity: statSpring,
                  transform: `translateY(${interpolate(statSpring, [0, 1], [20, 0])}px)`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 44,
                    fontWeight: 800,
                    color: stat.color,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    color: COLORS.textSecondary,
                    fontFamily: "system-ui, sans-serif",
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* GitHub */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            opacity: interpolate(frame, [100, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            fontSize: 20,
            color: COLORS.textSecondary,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          github.com/shyamsridhar123/claude-power-setup
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Main Composition ─────────────────────────────────────────────
export const FeatureVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={210}>
        <IntroScene />
      </Sequence>
      <Sequence from={210} durationInFrames={210}>
        <ModeSwitchScene />
      </Sequence>
      <Sequence from={420} durationInFrames={240}>
        <SwarmScene />
      </Sequence>
      <Sequence from={660} durationInFrames={240}>
        <AutomationScene />
      </Sequence>
      <Sequence from={900} durationInFrames={240}>
        <LearningScene />
      </Sequence>
      <Sequence from={1140} durationInFrames={210}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
