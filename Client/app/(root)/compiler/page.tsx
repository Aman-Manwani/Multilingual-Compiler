"use client";
import { useRef, useState } from "react";
import { Editor, Monaco } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../../../constants/languages";
import Output from "./Output";

const CodeEditor: React.FC = () => {
  const editorRef = useRef<Monaco | null>(null);
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");

  const onMount = (editor: Monaco) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language: string) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  return (
    <div className="pb-4 bg-[rgb(15,10,25)]">
      <div className="px-4 pt-4 flex space-x-4">
        <div className="w-full">
          <LanguageSelector language={language} onSelect={onSelect} />
          <Editor
            options={{
              minimap: {
                enabled: true,
              },
            }}
            height="75vh"
            theme="vs-dark"
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
    </div>
  );
};

export default CodeEditor;
