"use client"

export default function SubtleBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#07070f]" aria-hidden="true">
      {/* Orb 1 — violeta, arriba izquierda */}
      <div
        className="aurora-orb"
        style={{
          width: "60vw",
          height: "60vw",
          top: "-20vw",
          left: "-15vw",
          background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)",
          animationDuration: "18s",
          animationDelay: "0s",
        }}
      />
      {/* Orb 2 — índigo, arriba derecha */}
      <div
        className="aurora-orb"
        style={{
          width: "55vw",
          height: "55vw",
          top: "-10vw",
          right: "-20vw",
          background: "radial-gradient(circle, rgba(79,70,229,0.25) 0%, transparent 70%)",
          animationDuration: "24s",
          animationDelay: "-6s",
        }}
      />
      {/* Orb 3 — violeta claro, centro */}
      <div
        className="aurora-orb"
        style={{
          width: "50vw",
          height: "50vw",
          top: "30vh",
          left: "25vw",
          background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)",
          animationDuration: "30s",
          animationDelay: "-12s",
        }}
      />
      {/* Orb 4 — azul profundo, abajo derecha */}
      <div
        className="aurora-orb"
        style={{
          width: "45vw",
          height: "45vw",
          bottom: "-15vw",
          right: "-10vw",
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          animationDuration: "22s",
          animationDelay: "-9s",
        }}
      />
    </div>
  )
}
