"use client";
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import ACTIONS from "./Actions";

interface CodeEditorProps {
  socketRef: React.MutableRefObject<any>;
  roomId: string;
  onCodeChange: (code: string) => void;
}

const editoptions = {
  fontSize: 16,
};

const CodeEditor: React.FC<CodeEditorProps> = ({ socketRef, roomId, onCodeChange }) => {
  const [language, setLanguage] = useState<string>("c");
  const [theme, setTheme] = useState<string>("vs-dark");

  const editorRef = useRef<any>(null);

  const handleChangelang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
      roomId,
      language: newLanguage,
    });
  };

  const handleChangetheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleChange = (code: string | undefined) => {
    if (code !== undefined) {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code,
      });
      onCodeChange(code);
    }
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }: { code: string }) => {
        if (code != null && editorRef.current) {
          const currentValue = editorRef.current.getValue();
          if (currentValue !== code) {
            editorRef.current.setValue(code);
          }
        }
      });

      socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, ({ language }: { language: string }) => {
        setLanguage(language);
      });

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
        socketRef.current.off(ACTIONS.LANGUAGE_CHANGE);
      };
    }
  }, [socketRef.current]);

  return (
    <div className="editcon">
      <div className="optionsContainer">
        <div className="language cont">
          <label htmlFor="language">Language</label>

          <select
            name="language"
            value={language}
            id="lang"
            onChange={handleChangelang}
          >
            <option value="c">c</option>
            <option value="javascript">javascript</option>
            <option value="typescript">typescript</option>
            <option value="python">python</option>
          </select>
        </div>
        <div className="theme cont">
          <label htmlFor="theme">Themes</label>

          <select
            name="theme"
            id="the"
            value={theme}
            onChange={handleChangetheme}
          >
            <option value="light">Light</option>
            <option value="vs-dark">Dark</option>
          </select>
        </div>
      </div>
      <div className="edit">
        <Editor
          height="100%"
          theme={theme}
          options={editoptions}
          language={language}
          onMount={handleEditorDidMount}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default CodeEditor;