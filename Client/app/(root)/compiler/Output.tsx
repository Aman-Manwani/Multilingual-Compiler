"use client";
import React, { useState } from "react";
import { executeCode } from "../../../api/CodeEditorApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OutputProps {
  editorRef: React.RefObject<any>;
  language: string;
  code: string;
}

const Output: React.FC<OutputProps> = ({ editorRef, language, code }) => {
  const [output, setOutput] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [openGPT, setOpenGPT] = useState<boolean>(false);
  const [gptMessages, setGptMessages] = useState<string[]>([]);

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;
    
    setIsLoading(true);
    try {
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      setIsError(!!result.stderr);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setOutput(["An error occurred while executing the code."]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendGptMessage = (message: string) => {
    // Add GPT API integration logic here
    setGptMessages((prevMessages) => [...prevMessages, `You: ${message}`, "GPT: Response..."]);
  };

  return (
    <div className="p-3 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          onClick={runCode}
          disabled={isLoading}
        >
          {isLoading ? "Running..." : "Run Code"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => setOpenGPT(true)}
        >
          GPT Support
        </Button>
      </div>

      <div
        className={`flex-grow p-3 border rounded-md overflow-auto ${
          isError ? "border-red-500 text-red-400" : "border-gray-700 text-white"
        }`}
      >
        {output
          ? output.map((line, i) => <p key={i}>{line}</p>)
          : 'Click "Run Code" to see the output here'}
      </div>

      <Dialog open={openGPT} onOpenChange={setOpenGPT}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>GPT Support</DialogTitle>
          </DialogHeader>
          <div className="h-64 overflow-y-auto border border-gray-200 rounded p-3 mb-4 dark:border-gray-700">
            {gptMessages.length > 0 ? (
              gptMessages.map((msg, index) => <p key={index}>{msg}</p>)
            ) : (
              <p>No messages yet</p>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const message = formData.get('message') as string;
              if (message) {
                sendGptMessage(message);
                e.currentTarget.reset();
              }
            }}
            className="flex gap-2"
          >
            <Input
              type="text"
              name="message"
              placeholder="Type your message..."
              className="flex-grow"
            />
            <Button type="submit">Send</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Output;