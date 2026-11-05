import type { SimpleIcon } from 'simple-icons';

type Props = {
  icon: SimpleIcon;
  size?: number;
  /** Color del logo. Por defecto el color oficial de la marca. */
  color?: string;
  title?: string;
};

/** Logo de marca (simple-icons, licencia CC0) como SVG en línea. */
export default function BrandIcon({ icon, size = 20, color, title }: Props) {
  return (
    <svg
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color ?? `#${icon.hex}`}
    >
      <path d={icon.path} />
    </svg>
  );
}
