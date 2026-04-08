"use client"
import React, { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Save, Trash2, FileText } from 'lucide-react'

interface NoteProps {
  selectedDate: Date;
}

export default function Note({ selectedDate }: NoteProps) {
    const [note, setNote] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const savedNotes = JSON.parse(localStorage.getItem("notes") || "{}");
        const dateKey = selectedDate.toDateString();
        const existingNote = savedNotes[dateKey] || "";
        setNote(existingNote);
        
        setIsOpen(false); 
    }, [selectedDate]);

    const saveNote = () => {
        const savedNotes = JSON.parse(localStorage.getItem("notes") || "{}");
        const dateKey = selectedDate.toDateString();
        if (note.trim()) {
            savedNotes[dateKey] = note;
        } else {
            delete savedNotes[dateKey];
        }
        localStorage.setItem("notes", JSON.stringify(savedNotes));
        
        setIsOpen(false);
        

        window.dispatchEvent(new Event('notesUpdated'));
    }

    const deleteNote = () => {
        const savedNotes = JSON.parse(localStorage.getItem("notes") || "{}");
        const dateKey = selectedDate.toDateString();
        delete savedNotes[dateKey];
        localStorage.setItem("notes", JSON.stringify(savedNotes));
        setNote("");
        setIsOpen(false);
        window.dispatchEvent(new Event('notesUpdated'));
    }

    return (
        <div className="flex flex-col h-full">
            {/* folded box*/}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between p-4 cursor-pointer transition-all duration-300 rounded-xl
                    ${isOpen ? "bg-green-50 text-green-800 rounded-b-none" : "bg-white border border-gray-100 hover:border-green-200 shadow-sm"}
                `}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${note ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        <FileText size={18} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest leading-none mb-1">
                            {note ? "Saved Note" : "No Note"}
                        </h2>
                        <p className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                            {selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-green-600" /> : <ChevronDown size={20} className="text-gray-400" />}
            </div>

            {/* wrting area*/}
            <div className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
            `}>
                <div className="p-4 bg-green-50 border-x border-b border-green-100 rounded-b-xl">
                    <textarea
                        className="w-full h-40 bg-white border border-green-200 rounded-xl p-4 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-inner resize-none mb-4"
                        placeholder="Write your note here..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />

                    <div className="flex gap-2">
                        <button 
                            onClick={saveNote}
                            className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md active:scale-95"
                        >
                            <Save size={16} /> Save & Close
                        </button>
                        <button 
                            onClick={deleteNote}
                            className="flex items-center justify-center w-12 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-400 py-3 rounded-xl transition-all active:scale-95"
                            title="Delete note"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>


            {!isOpen && note && (
                <div className="mt-2 px-1">
                    <p className="text-xs text-gray-500 italic line-clamp-2 pl-4 border-l-2 border-green-300">
                        "{note}"
                    </p>
                </div>
            )}
        </div>
    )
}
