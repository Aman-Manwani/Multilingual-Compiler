"use client";
import React, { useState, useEffect , useRef} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Users, Copy, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import toast, { Toaster } from 'react-hot-toast';
import EditorComponent from "../Editor";
import ClientComponent from "./Client";
import {Socket} from 'socket.io-client';
import { initSocket } from "../../socket";
import { useRouter } from 'next/navigation';
import { useUser } from "@/context/UserContext";
 
interface Client {
  socketId: string;
  username: string;
}
 
const Page = ({ params }: { params: { RoomId: string } }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const { username } = useUser();
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    if(!username){
      router.push('/collaboration');
      return;
    }
    const init = async() => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleError(err));
      socketRef.current.on('connect_failed', (err) => handleError(err));
 
      const handleError = (err: any) => {
        console.error(err);
        toast.error('Failed to connect to the server', {
          duration: 3000,
          position: 'top-center',
          icon: '🚨',
        });
        router.push('/collaboration');
      }
 
      socketRef.current.emit('join', {
        roomId :  params.RoomId,
        username: username,
      })
      
      socketRef.current.on('joined', ({clients, username_ser, socketId}) => {
        console.log(clients, username_ser, socketId);
        if(username !== username_ser){
          toast.success(`${username_ser} joined the room`);
        } 
        setClients(clients);
      })

      socketRef.current.on('disconnected', ({socketId, username}) => {
        toast.success(`${username} left the room`);
        setClients((prevClients) => prevClients.filter(client => client.socketId !== socketId));
      })
    }
    init();

    return () => {
      if(socketRef.current){
        socketRef.current.disconnect();
        socketRef.current.off('joined');
        socketRef.current.off('disconnected');
      }
    } 
  },[]);
 
  const copyRoomId = () => {
    navigator.clipboard.writeText(params.RoomId);
    toast.success('Room ID copied to clipboard!', {
      duration: 1000,
      position: 'top-center',
      icon: '📋',
    });
  };
 
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
 
  return (
    <div className="flex h-screen dark">
      <Toaster />
      <TooltipProvider>
        <Card 
          className={`
            transition-all duration-300 ease-in-out 
            ${isCollapsed ? 'w-16' : 'w-64'} 
            h-full rounded-none border-r border-gray-200 dark:border-gray-800 
            bg-white dark:bg-gray-900 relative
            transform ${isCollapsed ? 'translate-x-0' : 'translate-x-0'}
          `}
        >
          <Button
            className="absolute right-2 top-2 z-10 transition-transform duration-300 ease-in-out"
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <CardHeader className={`flex flex-row items-center justify-between ${isCollapsed ? 'px-2' : 'px-4'} pt-12 transition-all duration-300 ease-in-out`}>
            <CardTitle className={`flex items-center space-x-2 ${isCollapsed ? 'justify-center w-full' : ''} transition-all duration-300 ease-in-out`}>
              <Users className="h-6 w-6" />
              {!isCollapsed && <span className="transition-opacity duration-300 ease-in-out">Live Members</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className={`${isCollapsed ? 'px-2' : 'px-4'} transition-all duration-300 ease-in-out`}>
            <div className="space-y-4">
              {clients.map((client) => (
                <ClientComponent key={client.socketId} username={client.username} isCollapsed={isCollapsed} />
              ))}
            </div>
          </CardContent>
          <div className={`mt-auto p-4 space-y-4 ${isCollapsed ? 'px-2' : ''} transition-all duration-300 ease-in-out`}>
            <Separator />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={copyRoomId} className="w-full transition-all duration-300 ease-in-out" variant="outline">
                  <Copy className={`${isCollapsed ? '' : 'mr-2'} h-4 w-4`} />
                  <span className={`${isCollapsed ? 'hidden' : ''} transition-opacity duration-300 ease-in-out`}>Copy Room ID</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Copy Room ID</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300 ease-in-out">
                  <LogOut className={`${isCollapsed ? '' : 'mr-2'} h-4 w-4`} />
                  <span className={`${isCollapsed ? 'hidden' : ''} transition-opacity duration-300 ease-in-out`}>Leave Room</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Leave Room</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </Card>
      </TooltipProvider>
      <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <EditorComponent />
      </div>
    </div>
  );
};
 
export default Page;
