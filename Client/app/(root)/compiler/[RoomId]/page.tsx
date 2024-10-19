"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users, Copy, LogOut, Moon, Sun } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import EditorComponent from "../Editor";
import ClientComponent from "./Client";

interface Client {
  socketId: string;
  username: string;
}

const Page = ({ params }: { params: { RoomId: string } }) => {
  const [clients, setClients] = useState<Client[]>([
    { socketId: "1", username: "Aman Manwani" },
    { socketId: "2", username: "Piyush Aaryan" },
  ]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const copyRoomId = () => {
    navigator.clipboard.writeText(params.RoomId);
    toast.success('Room ID copied to clipboard!', {
      duration: 3000,
      position: 'top-center',
      icon: '📋',
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You would typically update your app's theme here
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Toaster />
      <Card className="w-80 h-full rounded-none border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span>Live Members</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clients.map((client) => (
              <ClientComponent key={client.socketId} username={client.username} />
            ))}
          </div>
        </CardContent>
        <div className="mt-auto p-4 space-y-4">
          <Separator />
          <Button onClick={copyRoomId} className="w-full" variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Copy Room ID
          </Button>
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
            <LogOut className="mr-2 h-4 w-4" />
            Leave Room
          </Button>
        </div>
      </Card>
      <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <EditorComponent />
      </div>
    </div>
  );
};

export default Page;