"use client";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter
import toast from "react-hot-toast";
import { useUser } from '@/context/UserContext';

const Page = () => {
  const [roomId, setRoomId] = useState<string>("");
  const { username, setUsername } = useUser(); 
  const router = useRouter();

  // console.log(username);
  const handleNewRoom = (event: React.FormEvent) => {
    event.preventDefault();
    const newId = uuidv4();
    setRoomId(newId);
    toast.success("New Room Created");
  };

  const handleJoinBtn = (event: React.FormEvent) => {
    event.preventDefault();

    if (roomId.trim() === "" || username.trim() === "") {
      toast.error("Please enter a valid Room ID and Username");
      return;
    }

    router.push(`/collaboration/${roomId}`);
    toast.success("Welcome to the Room");
  };

  return (
    <div className="flex items-center justify-center h-[74vh] bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg md:w-3/6 lg:w-4/12">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          CODY AI Collaboration
        </h1>
        <h2 className="text-lg text-center text-white mb-4">
          Enter the ROOM ID
        </h2>
        <form className="space-y-4" onSubmit={handleJoinBtn}>
          <input
            type="text"
            value={roomId}
            placeholder="ROOM ID"
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-lg focus:outline-none"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="USERNAME"
            className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            JOIN
          </button>
        </form>
        <div className="flex justify-between mt-4">
          <p className="text-center text-gray-400">Don’t have a Room ID?</p>
          <button
            onClick={handleNewRoom}
            className="text-green-500 hover:underline"
          >
            Create New Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
