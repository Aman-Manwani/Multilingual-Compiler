"use client";
import { useState } from "react";
import EditorComponent from "../Editor";
import ClientComponent from "./Client";

interface Client {
  socketId: string;
  username: string;
}

const Page = ({ params }: { params: { RoomId: string } }) => {

  const [Clients, setClients] = useState<Client[]>([
    {socketId: "1", username: "Aman Manwani"},
    {socketId: "2", username: "Piyush Aaryan"},
  ]);

  console.log(params.RoomId);

  return (
    <div>
      <div className="flex">
        
        <div className="w-[15%] bg-gray-700 py-4 px-3 flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            <h1 className="font-bold text-xl text-white text-center">Live Members</h1>
            <div className="flex flex-col gap-3">
            {
              Clients.map((client : Client) => {
                return(
                  <ClientComponent 
                    key={client.socketId} 
                    username = {client.username}
                  />
                )
              })
            }
            </div>
          </div>
          <div className="flex flex-col gap-5 text-xl pb-3">
            <button className="bg-green-600 font-bold text-white rounded-md py-2">
              Copy RoomId
            </button>
            <button className="bg-red-600 font-bold text-white rounded-md py-2">
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

export default Page;
