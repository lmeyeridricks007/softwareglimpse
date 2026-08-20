"use client";

import { READINESS_DIMENSIONS, type ReadinessDimensionDef } from "@/services/readiness-assessment/catalog";
import type { DimensionScoreResult } from "@/services/readiness-assessment/score";

type Props = {
  dimensions: DimensionScoreResult[];
  catalogDimensions?: ReadinessDimensionDef[];
};

/** Accessible SVG radar — values also listed as bars in the parent. */
export function ReadinessRadar({
  dimensions,
  catalogDimensions = READINESS_DIMENSIONS,
}: Props) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 100;
  const n = catalogDimensions.length;

  const point = (index: number, score: number) => {
    const angle = (-Math.PI / 2) + (index / n) * Math.PI * 2;
    const r = (score / 100) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const gridLevels = [25, 50, 75, 100];
  const polygon = catalogDimensions.map((dim, i) => {
    const row = dimensions.find((d) => d.dimensionId === dim.id);
    const p = point(i, row?.score ?? 0);
    return `${p.x},${p.y}`;
  }).join(" ");

  return (
    <div className="flex justify-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full max-w-[280px]"
        role="img"
        aria-label="Radar chart of readiness scores across readiness dimensions"
      >
        {gridLevels.map((level) => (
          <polygon
            key={level}
            fill="none"
            stroke="var(--sg-color-border)"
            strokeWidth={1}
            points={catalogDimensions.map((_, i) => {
              const p = point(i, level);
              return `${p.x},${p.y}`;
            }).join(" ")}
          />
        ))}
        {catalogDimensions.map((dim, i) => {
          const outer = point(i, 100);
          return (
            <line
              key={dim.id}
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--sg-color-border)"
              strokeWidth={1}
            />
          );
        })}
        <polygon
          points={polygon}
          fill="rgba(37, 99, 235, 0.2)"
          stroke="var(--sg-color-primary)"
          strokeWidth={2}
        />
        {catalogDimensions.map((dim, i) => {
          const row = dimensions.find((d) => d.dimensionId === dim.id);
          const p = point(i, row?.score ?? 0);
          const label = point(i, 118);
          return (
            <g key={`pt-${dim.id}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r={3.5}
                fill="var(--sg-color-primary)"
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-[var(--sg-color-text-muted)]"
                fontSize={8}
              >
                {dim.shortTitle.length > 10
                  ? dim.shortTitle.slice(0, 9) + "…"
                  : dim.shortTitle}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
