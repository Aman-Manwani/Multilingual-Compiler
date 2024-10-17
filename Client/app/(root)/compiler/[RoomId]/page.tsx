import React from "react";
import EditorComponent from "../Editor";

const page = ({ params }: { params: { RoomId: string } }) => {
  return (
    <div>
      <div className="flex">
        
        <div className="w-[15%] bg-gray-700 py-4 px-3 flex ">
          <div>
            <h1 className="font-bold text-xl text-white text-center">Live Members</h1>
          </div>
          <div>
            <button>
              Copy RoomId
            </button>
            <button>
              Leave Room
            </button>
          </div>
        </div>
        
        <div className="w-[85%] bg-[rgb(15,10,25)]">
          <EditorComponent />
        </div>

      </div>
    </div>
  );
};

export default page;
