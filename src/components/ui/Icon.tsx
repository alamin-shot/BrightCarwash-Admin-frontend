"use client";

interface IconProps {
  name: string;
  width?: number;
  height?: number;
  className?: string;
}

export function Icon({ name, width = 20, height = 20, className = "" }: IconProps) {
  return (
    <img
      src={`/icons/svgs/${name}.svg`}
      alt={`${name} icon`}
      width={width}
      height={height}
      className={className}
      style={{ width, height }}
    />
  );
}