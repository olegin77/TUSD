"use client";

import { useI18n } from "@/lib/i18n/provider";
import { locales, localeNames } from "@/lib/i18n/config";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="language-switcher">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as any)}
        className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-sm"
        aria-label="Select language"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}
