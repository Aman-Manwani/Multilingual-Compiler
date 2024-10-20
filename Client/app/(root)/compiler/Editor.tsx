'use client';
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoonIcon, SunIcon } from "lucide-react";
import { CODE_SNIPPETS } from "../../../constants/languages";
import Output from "./Output";

const EditorComponent = () => {
  const editorRef = useRef<any>(null);
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [isDark, setIsDark] = useState<boolean>(true);


  useEffect(() => {
    const init = async () => {
      editorRef.current.on("code-change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  },[])


  const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editorRef.current.focus();
  };



  const onSelect = (newLanguage: string) => {
    setLanguage(newLanguage);
    setValue(CODE_SNIPPETS[newLanguage]);
  };

  return (
    <div className="h-screen bg-background text-foreground">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
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
            <div className="flex-grow">
              <Editor
                options={{
                  minimap: { enabled: true },
                }}
                height="100%"
                theme={isDark ? "vs-dark" : "light"}
                language={language}
                defaultValue={CODE_SNIPPETS[language]}
                onMount={onMount}
                value={value}
                onChange={(value) => setValue(value || "")}
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

export default EditorComponent;