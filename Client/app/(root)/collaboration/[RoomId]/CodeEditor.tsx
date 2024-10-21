"use client";
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import ACTIONS from "./Actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CODE_SNIPPETS } from "../../../../constants/languages";
import Output from "../../compiler/Output";
import { MoonIcon, SunIcon } from "lucide-react";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";


interface CodeEditorProps {
  socketRef: React.MutableRefObject<any>;
  roomId: string;
  onCodeChange: (code: string) => void;
}

const editoptions = {
  fontSize: 16,
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  socketRef,
  roomId,
  onCodeChange,
}) => {
  const [language, setLanguage] = useState<string>("javascript");
  const [isDark, setIsDark] = useState<boolean>(true);
  const [value, setValue] = useState<string>("");

  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editorRef.current.focus();
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
      socketRef.current.on(
        ACTIONS.CODE_CHANGE,
        ({ code }: { code: string }) => {
          if (code != null && editorRef.current) {
            const currentValue = editorRef.current.getValue();
            if (currentValue !== code) {
              editorRef.current.setValue(code);
            }
          }
        }
      );

      socketRef.current.on(
        ACTIONS.LANGUAGE_CHANGE,
        ({ language }: { language: string }) => {
          setLanguage(language);
        }
      );

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
        socketRef.current.off(ACTIONS.LANGUAGE_CHANGE);
      };
    }
  }, [socketRef.current]);

  const onSelect = (newLanguage: string) => {
    setLanguage(newLanguage);
    setValue(CODE_SNIPPETS[newLanguage]);
    if (editorRef.current) {
      const initialCode = editorRef.current.getValue();
      socketRef.current.emit(ACTIONS.SYNC_CODE, {
        roomId,
        code: initialCode,
      });
      console.log("Editor is ready, initial code synced");
    }
    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
      roomId,
      language: newLanguage,
    });
  };

  return (
    <div>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="">
            <div className=" flex items-center justify-between py-3 px-3">
              <div className="border-white border-2 rounded-lg">
                <Select value={language} onValueChange={onSelect}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(CODE_SNIPPETS).map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsDark(!isDark)}
                >
                  {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
                </Button>
                <Button>Publish Your Code</Button>
              </div>
            </div>
            <div className="edit">
              <Editor
                height="100%"
                theme={isDark ? "vs-dark" : "light"}
                options={editoptions}
                defaultValue={CODE_SNIPPETS[language]}
                language={language}
                value={value}
                onMount={handleEditorDidMount}
                onChange={handleChange}
              />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <Output code={value} editorRef={editorRef} language={language} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CodeEditor;
