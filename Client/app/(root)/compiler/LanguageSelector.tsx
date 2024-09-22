"use client";
import { LANGUAGE_VERSIONS } from "../../../constants/languages";

const languages = Object.entries(LANGUAGE_VERSIONS);

interface LanguageSelectorProps {
  language: string;
  onSelect: (lang: string) => void;
}

function capitalizeFirstLetter(str: string) {
  if (!str) return ""; // Handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onSelect,
}) => {
  return (
    <div className="ml-2 mb-4">
      <p className="mb-4 text-2xl font-medium text-white">Language :</p>
      <div className="relative inline-block">
        <select
          className="w-48 bg-gray-800 text-white rounded-md shadow-lg z-10 p-3"
          value={language}
          onChange={(e) => onSelect(e.target.value)} 
        >
          {languages.map(([lang, version]) => (
            <option
              key={lang}
              value={lang}
              className={`cursor-pointer p-2 ${
                lang === language ? "bg-gray-900" : ""
              }`}
            >
              {capitalizeFirstLetter(lang)} &nbsp;{"     "}
              {version}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;
