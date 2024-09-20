"use client";
import { useState } from "react";
import { executeCode } from "../../../api/CodeEditorApi";

interface OutputProps {
  editorRef: React.RefObject<any>;
  language: string;
}

const Output: React.FC<OutputProps> = ({ editorRef, language }) => {
  const [output, setOutput] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      setIsError(!!result.stderr);
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to run code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <p className="mb-2 text-2xl font-medium text-white">Output</p>
      <button
        className={`border border-green-500 text-green-500 px-4 py-2 rounded-md mb-4 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
        onClick={runCode}
      >
        {isLoading ? "Running..." : "Run Code"}
      </button>
      <div
        className={`h-[75vh] p-3 border rounded-md text-white ${
          isError ? "border-red-500 text-red-400" : "border-gray-700"
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
