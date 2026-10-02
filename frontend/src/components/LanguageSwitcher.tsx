import type { Language } from "../i18n/translations";

type LanguageSwitcherProps = {
  language: Language;
  onChange: (language: Language) => void;
};

export default function LanguageSwitcher({
  language,
  onChange,
}: LanguageSwitcherProps) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-xl border border-[#DCE9DE] bg-white p-1"
      role="group"
      aria-label="Choose language / ቋንቋ ይምረጡ"
    >
      <button
        type="button"
        onClick={() => onChange("en")}
        aria-pressed={language === "en"}
        className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
          language === "en"
            ? "bg-[#176B45] text-white"
            : "text-gray-600 hover:bg-[#F0F7F2]"
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => onChange("am")}
        aria-pressed={language === "am"}
        className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
          language === "am"
            ? "bg-[#176B45] text-white"
            : "text-gray-600 hover:bg-[#F0F7F2]"
        }`}
      >
        አማ
      </button>
    </div>
  );
}