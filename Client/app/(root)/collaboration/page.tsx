"use client"
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { redirect } from 'next/navigation'


const Page = () => {

    const[roomId, setRoomId] = useState<string>('');
    const[username, setUsername] = useState<string>('');

    const handleNewRoom = () => {
        const newId = uuidv4();
        setRoomId(newId);
    }

    const handleJoinBtn = () => {
        if(roomId.trim() === '' || username.trim() === '') {
            alert('Please enter a valid ROOM ID and USERNAME');
            return;
        }

        // Redirect to the collaboration page
        redirect(`/collaboration/${roomId}?username=${username}`);
    }


  return (
    <div className="flex items-center justify-center h-[74vh] bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg md:w-3/6 lg:w-4/12">
        <h1 className="text-2xl font-bold text-center text-white mb-6">
          CODY AI Collaboration
        </h1>
        <h2 className="text-lg text-center text-white mb-4">
          Enter the ROOM ID
        </h2>
        <form className="space-y-4">
          <input
            type="text"
            value={roomId}
            placeholder="ROOM ID"
            className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-lg focus:outline-none"
          />
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="USERNAME"
            className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            onSubmit={handleJoinBtn}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            JOIN
          </button>
        </form>
        <div className='flex justify-between mt-4'>
            <p className="text-center text-gray-400">
                Don’t have a room ID?
            </p>
            <button onClick={handleNewRoom} className="text-green-500 hover:underline">
                create New Room
            </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
