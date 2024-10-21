"use client";
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import ACTIONS from "./Actions";
import Output from "../../compiler/Output";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CODE_SNIPPETS } from "../../../../constants/languages";
import { Button } from "@/components/ui/button";
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
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [isDark, setIsDark] = useState<boolean>(true);
  const [connectedClients, setConnectedClients] = useState<
    { socketId: string; username: string }[]
  >([]);

  const editorRef = useRef<any>(null);

  const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editorRef.current.focus();
  };

  const handleChangelang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
      roomId,
      language: newLanguage,
    });
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    onEditorReady(); // Trigger onEditorReady once the editor is mounted
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

  const onEditorReady = () => {
    if (editorRef.current) {
      const initialCode = editorRef.current.getValue();
      // Sync initial code with socket or any other initial setup
      socketRef.current.emit(ACTIONS.SYNC_CODE, {
        roomId,
        code: initialCode,
      });
      console.log("Editor is ready, initial code synced");
    }
  };

  const onSelect = (newLanguage: string) => {
    setLanguage(newLanguage);
    setValue(CODE_SNIPPETS[newLanguage]);
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

      socketRef.current.on(
        ACTIONS.JOINED,
        ({
          clients,
          username,
          socketId,
        }: {
          clients: { socketId: string; username: string }[];
          username: string;
          socketId: string;
        }) => {
          setConnectedClients(clients);
        }
      );

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
        socketRef.current.off(ACTIONS.LANGUAGE_CHANGE);
        socketRef.current.off(ACTIONS.JOINED);
      };
    }
  }, [socketRef.current]);

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

export default CodeEditor;
