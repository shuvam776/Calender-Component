"use client"
import Image from "next/image";
import Calender from "./components/Calender";
import { useEffect } from "react";
export default function Home() {
  return (
   <div className="p-4 min-h-screen bg-gray-50 flex items-center justify-center">
    <Calender />
   </div>
  );
}
