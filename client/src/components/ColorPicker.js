import React, { useEffect, useRef } from 'react';
import iro from '@jaames/iro';
import config from '../config'
import io from "socket.io-client";
let socket = ''
const ColorPicker = ({ color, onChange }) => {
  const ref = useRef();
  const colorPicker = useRef();

  useEffect(() => {
    const cp = (colorPicker.current = new iro.ColorPicker(ref.current, {
      color,
      borderWidth: 2,
      borderColor: '#fff',
      width: 300,
    }));
    console.log(color);
    cp.on('color:change', (color) => {
        onChange(color.hexString)
        //When the color changes, send a socket request to our server along with the chatId we're connected to
        socket.emit("send_color", {color: color.hexString, chatId: 'HAUKESECRECTCHAT' });
    });

    //----------------------------------------------------------
    //---------SOCKET CONNECTION ------------------------------
    //setup your socket connection with the server
    socket = io(`${config.API_URL}`);

     // ensure that the user is connected to a specific chat via webSocket    
     socket.emit("join_color_chat", 'HAUKESECRECTCHAT');

     //Handle incoming messages from webSocket
     socket.on("receive_color", (data) => {
         console.log('Got data', data)
         //sending the color back to App.js so that the background updates
         onChange(data)
     }); 

  }, []);

  return (
    <div>
      <div className="px-4 py-5 sm:p-6 flex flex-col justify-center items-center ml-32 mr-16">
        <h2 className="text-2xl text-gray-800 min-w-min font-bold">
          Try the Demo
        </h2>
        <div ref={ref} className="m-4" />
      </div>
    </div>
  );
};
export default ColorPicker;