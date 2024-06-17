import { useEffect, useRef, useState } from "react";
import { socket } from "../Lib/socket";

const useSocket = () => {
  const socketInstance = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socketInstance.current) {
      socketInstance.current = socket();
    }

    const instance = socketInstance.current;

    instance.on("connect", () => setIsConnected(true));
    instance.on("disconnect", () => setIsConnected(false));

    return () => {
      instance.off("connect");
      instance.off("disconnect");
      instance.disconnect();
    };
  }, []);

  return { socketInstance: socketInstance.current, isConnected };
};

export default useSocket;
