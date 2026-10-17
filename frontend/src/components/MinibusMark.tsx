type Props = { size?: number; className?: string };

export default function MinibusMark({ size = 27, className }: Props) {
  return (
    <svg className={className} width={size} height={size * 0.72} viewBox="0 0 48 35" fill="none" aria-hidden="true">
      <path d="M5 8.5A5.5 5.5 0 0 1 10.5 3h23.2c2 0 3.9 1.1 4.8 2.9l4.8 9.3c.5 1 .7 2 .7 3.1v8.2a3.5 3.5 0 0 1-3.5 3.5H7.5A3.5 3.5 0 0 1 4 26.5V10a5 5 0 0 1 1-1.5Z" fill="currentColor" />
      <path d="M10 8.2c0-1.2 1-2.2 2.2-2.2h9.3v9.5H10V8.2Zm14.5-2.2h8.1c1.1 0 2.1.6 2.6 1.6l3.9 7.9H24.5V6Z" fill="#DDF1E3" />
      <path d="M7.5 19h33v5h-33z" fill="#fff" fillOpacity=".18" />
      <path d="M8 18h4v3H8zm26 0h4v3h-4z" fill="#FFF4C6" />
      <circle cx="13" cy="28" r="4.5" fill="#173B29" stroke="white" strokeWidth="2" />
      <circle cx="34" cy="28" r="4.5" fill="#173B29" stroke="white" strokeWidth="2" />
    </svg>
  );
}
