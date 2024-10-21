// import { currentUser } from "@clerk/nextjs/server";
import EditorComponent from "./Editor";
import { redirect } from "next/navigation";

const CodeEditor: React.FC = () => {

  // const user = await currentUser();

  // if(!user) {
  //   redirect('/sign-in');
  // }

  return (
    <div className="min-h-screen bg-[rgb(15,10,25)]">
      <EditorComponent />
    </div>
  );
};

export default CodeEditor;
