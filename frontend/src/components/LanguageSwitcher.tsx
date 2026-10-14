import type { Language } from "../i18n/translations";

type LanguageSwitcherProps = {
  language: Language;
  onChange: (language: Language) => void;
  label: string;
};

export default function LanguageSwitcher({ language, onChange, label }: LanguageSwitcherProps) {
  return (
    <div className="language-switcher" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange("en")}
        aria-pressed={language === "en"}
        lang="en"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onChange("am")}
        aria-pressed={language === "am"}
        lang="am"
      >
        አማ
      </button>
    </div>
  );
}
