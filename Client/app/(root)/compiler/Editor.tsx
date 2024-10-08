"use client";
import React from "react";
import { useRef, useState } from "react";
import { Editor, Monaco } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../../../constants/languages";
import Output from "./Output";
import { MoonIcon } from "@heroicons/react/24/solid";
import { SunIcon } from "@heroicons/react/20/solid";

const EditorComponent = () => {
  const editorRef = useRef<Monaco | null>(null);
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [isDark, setIsDark] = useState<boolean>(true);

  const onMount = (editor: Monaco) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language: string) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  return (
    <div className="px-4 pt-4 flex space-x-4">
      <div className="w-full">
        <div className="flex justify-between">
          <LanguageSelector language={language} onSelect={onSelect} />
          <div className="flex items-end justify-between pr-3 py-5">
            <button 
                className="flex gap-3 rounded-md bg-gray-800 text-white font-semibold hover:bg-gray-600 px-4 py-3"
                onClick={() => setIsDark(!isDark)}
            >
              <p>{isDark === true ? "Dark" : "Light"}</p>
              {isDark === true ? (
                <MoonIcon className="h-6 w-6" />
              ) : (
                <SunIcon className="h-6 w-6" />
              )}
            </button>
          </div>
          <div className="flex items-end justify-between pr-3 py-5">
            <button className="rounded-md bg-gray-800 text-white font-semibold hover:bg-gray-600 px-4 py-3">
              Publish Your Code
            </button>
          </div>
        </div>
        <Editor
          options={{
            minimap: {
              enabled: true,
            },
          }}
          height="75vh"
          theme={isDark === true ? "vs-dark" : "light"}
          language={language}
          defaultValue={CODE_SNIPPETS[language]}
          onMount={onMount}
          value={value}
          onChange={(value) => setValue(value || "")}
        />
      </div>
      <div className="w-full">
        <Output editorRef={editorRef} language={language} />
      </div>
    </div>
  );
};

export default EditorComponent;
