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
  const [openGPT, setOpenGPT] = useState<boolean>(false); // Manage GPT modal state
  const [gptMessages, setGptMessages] = useState<string[]>([]); // Manage GPT chat messages

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
    } finally {
      setIsLoading(false);
    }
  };

  const sendGptMessage = (message: string) => {
    // Add GPT API integration logic here
    setGptMessages((prevMessages) => [...prevMessages, `You: ${message}`, "GPT: Response..."]);
  };

  return (
    <div className="">
      <p className="mb-4 text-2xl font-medium text-white">Output</p>
      <div className="flex justify-between items-center">
        {/* run code button */}
        <button
          className={`border border-green-500 text-green-500 px-4 py-2 rounded-md mb-4 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
          onClick={runCode}
        >
          {isLoading ? "Running..." : "Run Code"}
        </button>
        {/* GPT support button */}
        <button
          className="rounded-md bg-gray-800 text-white font-semibold hover:bg-gray-600 px-4 py-3 mb-3"
          onClick={() => setOpenGPT(!openGPT)}
        >
          GPT Support
        </button>
      </div>

      <div
        className={`h-[75vh] p-3 border rounded-md text-white no-scrollbar ${
          isError ? "border-red-500 text-red-400" : "border-gray-700"
        }`}
        style={{
          maxHeight: "75vh", // Set a maximum height
          overflowY: "auto",
        }}
      >
        {output
          ? output.map((line, i) => <p key={i}>{line}</p>)
          : 'Click "Run Code" to see the output here'}
      </div>

      {/* Modal for GPT Support */}
      {openGPT && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setOpenGPT(false)}
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg text-white"
            onClick={(e) => e.stopPropagation()} // Prevent closing on clicking inside the modal
          >
            <h2 className="text-xl font-semibold mb-4">GPT Support</h2>
            <div className="h-64 overflow-y-auto border border-gray-600 rounded p-3 mb-4">
              {gptMessages.length > 0 ? (
                gptMessages.map((msg, index) => <p key={index}>{msg}</p>)
              ) : (
                <p>No messages yet</p>
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const message = (e.target as any).message.value;
                if (message) {
                  sendGptMessage(message);
                  (e.target as any).message.value = "";
                }
              }}
            >
              <input
                type="text"
                name="message"
                className="w-full p-2 bg-gray-700 rounded mb-2 text-white"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="bg-green-500 px-4 py-2 rounded-md text-white hover:bg-green-600 w-full"
              >
                Send
              </button>
            </form>
            <button
              onClick={() => setOpenGPT(false)}
              className="mt-4 text-sm text-gray-400 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Output;
