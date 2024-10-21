import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
 
interface ClientComponentProps {
  username: string;
  isCollapsed: boolean;
}
 
const ClientComponent: React.FC<ClientComponentProps> = ({ username, isCollapsed }) => {
  const initials = username.split(' ').map(name => name[0]).join('').toUpperCase();
 
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-4 cursor-pointer">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {initials}
            </div>
            {!isCollapsed && <div className="font-medium">{username}</div>}
          </div>
        </TooltipTrigger>
        <TooltipContent side={isCollapsed ? "right" : "top"}>
          <p>{username}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
 
export default ClientComponent;
