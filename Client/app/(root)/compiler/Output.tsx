import React, { useState, useRef } from "react";
import { executeCode } from "../../../api/CodeEditorApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface OutputProps {
  editorRef: React.RefObject<any>;
  language: string;
  code: string;
}

const Output: React.FC<OutputProps> = ({ editorRef, language, code }) => {
  const [output, setOutput] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [gptMessages, setGptMessages] = useState<{ role: string; content: string }[]>([]);
  const [isGptLoading, setIsGptLoading] = useState<boolean>(false);
  const messageInputRef = useRef<HTMLInputElement>(null);

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

  const sendGptMessage = async (message: string) => {
    setIsGptLoading(true);
    
    const currentCode = editorRef.current?.getValue() || "";
    const currentOutput = output ? output.join("\n") : "";
    const errorContext = isError ? "Error in output:" : "No errors in output.";
    
    // Add only the user's message to the visible chat
    setGptMessages((prev) => [...prev, { role: "user", content: message }]);
    
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OpenAI API key is not set");
      setGptMessages((prev) => [...prev, { role: "assistant", content: "Error: API key is not configured." }]);
      setIsGptLoading(false);
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are a helpful coding assistant." },
            { 
              role: "system", 
              content: `Current code:\n\`\`\`${language}\n${currentCode}\n\`\`\`\n\nOutput:\n\`\`\`\n${currentOutput}\n\`\`\`\n\n${errorContext}`
            },
            ...gptMessages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: "user", content: message }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from GPT');
      }

      const data = await response.json();
      const gptResponse = data.choices[0].message.content;
      setGptMessages((prev) => [...prev, { role: "assistant", content: gptResponse }]);
    } catch (error) {
      console.error("Error sending message to GPT:", error);
      setGptMessages((prev) => [...prev, { role: "assistant", content: `Error: ${error}` }]);
    } finally {
      setIsGptLoading(false);
    }
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

        <Popover>
          <PopoverTrigger asChild>
            <Button className="button">
              <div className="dots_border"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="sparkle"
              >
                {/* SVG paths remain the same */}
              </svg>
              <span className="text_button">GPT Support</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[30vw] h-[70vh] flex flex-col mr-2 mt-2">
            <ScrollArea className="flex-grow pr-4">
              {gptMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded-lg ${
                    msg.role === "user" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {isGptLoading && (
                <div className="flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
            </ScrollArea>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const message = messageInputRef.current?.value;
                if (message) {
                  sendGptMessage(message);
                  if (messageInputRef.current) messageInputRef.current.value = "";
                }
              }}
              className="flex items-center mt-4"
            >
              <Input
                ref={messageInputRef}
                placeholder="Type your message..."
                className="flex-grow mr-2"
              />
              <Button type="submit" disabled={isGptLoading}>Send</Button>
            </form>
          </PopoverContent>
        </Popover>
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
    </div>
  );
};

export default Output;