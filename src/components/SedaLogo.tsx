import React from 'react'

interface SedaLogoProps {
  size?: number
  className?: string
  style?: React.CSSProperties
}

export const SedaLogo: React.FC<SedaLogoProps> = ({ size = 90, className = '', style }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        {/* Gradients for the heart and orbit */}
        <linearGradient id="sedaHeartGrad" x1="60" y1="60" x2="140" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7CC9BE" />
          <stop offset="100%" stopColor="#59B98A" />
        </linearGradient>
        <linearGradient id="sedaHeartRight" x1="100" y1="70" x2="150" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#59B98A" />
          <stop offset="100%" stopColor="#439A72" />
        </linearGradient>
      </defs>

      {/* Main Circle Outline */}
      <circle
        cx="100"
        cy="100"
        r="62"
        stroke="#5E8FC0"
        strokeWidth="9"
        fill="none"
      />

      {/* Heart Base Shape (Left lobe and main body) */}
      <path
        d="M100 148 C94 142 62 116 62 88 C62 72 74 62 88 62 C96 62 100 68 100 68 C100 68 104 62 112 62 C126 62 138 72 138 88 C138 116 106 142 100 148 Z"
        fill="url(#sedaHeartGrad)"
      />

      {/* Heart Right Shading / Split for artistic depth */}
      <path
        d="M100 68 C100 68 104 62 112 62 C126 62 138 72 138 88 C138 116 106 142 100 148 C100 148 115 130 126 112 C134 98 136 86 136 86 C136 74 126 64 112 64 C106 64 100 68 100 68 Z"
        fill="url(#sedaHeartRight)"
        opacity="0.3"
      />

      {/* Wave / Artery river flow inside heart */}
      <path
        d="M85 125 C92 120 96 108 104 94 C112 80 120 74 130 68"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M92 136 C97 128 103 115 111 102 C118 90 126 84 135 78"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Orbit Ring (Elliptical outer ring encircling the emblem) */}
      <path
        d="M38 126 C28 118 36 102 62 90 C88 78 126 72 152 78 C172 82 178 92 170 102 C160 114 132 128 100 134 C68 140 45 132 38 126 Z"
        stroke="#5E8FC0"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inner overlay white flow blending with orbit */}
      <path
        d="M58 124 C72 118 88 112 100 102 C114 90 126 78 140 70"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
    </svg>
  )
}
