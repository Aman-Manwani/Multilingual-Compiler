"use client"
import { useState } from "react";
import { LANGUAGE_VERSIONS } from "../../../constants/languages";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "text-blue-400";

interface LanguageSelectorProps {
  language: string;
  onSelect: (lang: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onSelect }) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="ml-2 mb-4">
      <p className="mb-2 text-lg text-white">Language:</p>
      <div className="relative inline-block">
        <button className="bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none">
          {language}
        </button>
        isOpen && (
        <ul className="absolute left-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg z-10">
          {languages.map(([lang, version]) => (
            <li
              key={lang}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                lang === language ? "bg-gray-900" : ""
              }`}
              onClick={() => onSelect(lang)}
            >
              <span className={lang === language ? ACTIVE_COLOR : ""}>{lang}</span>
              &nbsp;
              <span className="text-gray-600 text-sm">({version})</span>
            </li>
          ))}
        </ul>)
      </div>
    </div>
  );
};

export default LanguageSelector;
