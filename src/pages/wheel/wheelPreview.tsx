import { WheelSegment } from "@/interfaces/wheel";

interface WheelPreviewProps {
  segments: WheelSegment[];
  size?: number;
}

export const WheelPreview = ({ segments, size = 300 }: WheelPreviewProps) => {
  const radius = size / 2;
  const center = radius;
  const labelRadius = radius * 0.7;

  const totalWeight = segments.reduce(
    (sum, s) => sum + (Number(s.weight) || 0),
    0,
  );

  if (segments.length === 0 || totalWeight === 0) {
    return (
      <svg width={size} height={size}>
        <circle
          cx={center}
          cy={center}
          r={radius - 2}
          fill="#f0f0f0"
          stroke="#ccc"
          strokeDasharray="5,5"
        />
        <text x={center} y={center} textAnchor="middle" fill="#999">
          No segments added
        </text>
      </svg>
    );
  }

  let currentAngle = 0;

  return (
    <svg
      width={size}
      height={size}
      style={{ filter: "drop-shadow(0px 4px 10px rgba(0,0,0,0.1))" }}
    >
      {segments.map((segment, index) => {
        const segmentAngle =
          (Number(segment.weight) / totalWeight) * 2 * Math.PI;
        const startAngle = currentAngle;
        const endAngle = currentAngle + segmentAngle;

        const getCoords = (ang: number, r: number) => ({
          x: center + r * Math.cos(ang),
          y: center + r * Math.sin(ang),
        });

        const start = getCoords(startAngle, radius);
        const end = getCoords(endAngle, radius);
        const largeArcFlag = segmentAngle > Math.PI ? 1 : 0;

        const pathData = [
          `M ${center} ${center}`,
          `L ${start.x} ${start.y}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
          "Z",
        ].join(" ");

        const midAngle = startAngle + segmentAngle / 2;
        const labelPos = getCoords(midAngle, labelRadius);
        const rotation = (midAngle * 180) / Math.PI;

        currentAngle += segmentAngle;

        return (
          <g key={segment.id || index}>
            <path
              d={pathData}
              fill={segment.color || "#ccc"}
              stroke="#fff"
              strokeWidth="1"
            />
            <text
              x={labelPos.x}
              y={labelPos.y}
              fill="#fff"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${rotation}, ${labelPos.x}, ${labelPos.y})`}
              style={{
                pointerEvents: "none",
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {segment.label.length > 10
                ? segment.label.substring(0, 8) + ".."
                : segment.label}
            </text>
          </g>
        );
      })}
      <circle cx={center} cy={center} r={6} fill="#fff" />
    </svg>
  );
};
