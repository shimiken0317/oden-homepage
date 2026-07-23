import Image from "next/image";

type OdenChanProps = {
  className?: string;
  priority?: boolean;
  label?: string;
};

export function OdenChan({ className = "", priority = false, label = "おでんちゃん" }: OdenChanProps) {
  return (
    <div className={`oden-chan-original ${className}`} role="img" aria-label={label}>
      <Image
        src="/characters/oden-sketch-sheet.png"
        alt=""
        width={1395}
        height={1154}
        priority={priority}
      />
    </div>
  );
}
