"use client"
import React, { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Save, Trash2, FileText } from 'lucide-react'

interface NoteProps {
  selectedDate: Date;
}

export default function Note({ selectedDate }: NoteProps) {
    const [note, setNote] = useState("");
    const [memo, setMemo] = useState("");
    const [activeTab, setActiveTab] = useState<'note' | 'memo'>('note');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const savedNotes = JSON.parse(localStorage.getItem("notes") || "{}");
        const dateKey = selectedDate.toDateString();
        const existingNote = savedNotes[dateKey] || "";
        setNote(existingNote);
        
        const monthKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}`;
        const savedMemos = JSON.parse(localStorage.getItem("monthlyMemos") || "{}");
        const existingMemo = savedMemos[monthKey] || "";
        setMemo(existingMemo);

        setIsOpen(false); 
    }, [selectedDate]);

    const saveContent = () => {
        if (activeTab === 'note') {
            const savedNotes = JSON.parse(localStorage.getItem("notes") || "{}");
            const dateKey = selectedDate.toDateString();
            if (note.trim()) {
                savedNotes[dateKey] = note;
            } else {
                delete savedNotes[dateKey];
            }
            localStorage.setItem("notes", JSON.stringify(savedNotes));
            window.dispatchEvent(new Event('notesUpdated'));
        } else {
            const monthKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}`;
            const savedMemos = JSON.parse(localStorage.getItem("monthlyMemos") || "{}");
            if (memo.trim()) {
                savedMemos[monthKey] = memo;
            } else {
                delete savedMemos[monthKey];
            }
            localStorage.setItem("monthlyMemos", JSON.stringify(savedMemos));
        }
        setIsOpen(false);
    }

    const deleteContent = () => {
        if (activeTab === 'note') {
            const savedNotes = JSON.parse(localStorage.getItem("notes") || "{}");
            const dateKey = selectedDate.toDateString();
            delete savedNotes[dateKey];
            localStorage.setItem("notes", JSON.stringify(savedNotes));
            setNote("");
            window.dispatchEvent(new Event('notesUpdated'));
        } else {
            const monthKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}`;
            const savedMemos = JSON.parse(localStorage.getItem("monthlyMemos") || "{}");
            delete savedMemos[monthKey];
            localStorage.setItem("monthlyMemos", JSON.stringify(savedMemos));
            setMemo("");
        }
        setIsOpen(false);
    }

    return (
        <div className="flex flex-col h-full">
            {/* Tab Switcher */}
            <div className="flex gap-2 mb-2 px-1">
                <button 
                    onClick={() => { setActiveTab('note'); setIsOpen(true); }}
                    className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all ${activeTab === 'note' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                    Day Note
                </button>
                <button 
                    onClick={() => { setActiveTab('memo'); setIsOpen(true); }}
                    className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition-all ${activeTab === 'memo' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                    Month Memo
                </button>
            </div>

            {/* folded box */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between p-4 cursor-pointer transition-all duration-300 rounded-xl
                    ${isOpen ? "bg-green-50 text-green-800 rounded-b-none" : "bg-white border border-gray-100 hover:border-green-200 shadow-sm"}
                `}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${ (activeTab === 'note' ? note : memo) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        <FileText size={18} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest leading-none mb-1">
                            {activeTab === 'note' ? (note ? "Saved Note" : "No Note") : (memo ? "Saved Memo" : "No Memo")}
                        </h2>
                        <p className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                            {activeTab === 'note' 
                                ? selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
                                : `${selectedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} Memo`
                            }
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
                        className="w-full h-40 bg-white border border-green-200 rounded-xl p-4 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-green-400 transition-all shadow-inner resize-none mb-4"
                        placeholder={activeTab === 'note' ? "Write your day note..." : `Write a memo for ${selectedDate.toLocaleDateString(undefined, { month: 'long' })}...`}
                        value={activeTab === 'note' ? note : memo}
                        onChange={(e) => activeTab === 'note' ? setNote(e.target.value) : setMemo(e.target.value)}
                    />

                    <div className="flex gap-2">
                        <button 
                            onClick={saveContent}
                            className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white text-[10px] font-bold py-3 rounded-xl transition-all shadow-md active:scale-95"
                        >
                            <Save size={14} /> Save & Close
                        </button>
                        <button 
                            onClick={deleteContent}
                            className="flex items-center justify-center w-10 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-400 py-3 rounded-xl transition-all active:scale-95"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>


            {!isOpen && (activeTab === 'note' ? note : memo) && (
                <div className="mt-2 px-1">
                    <p className="text-xs text-gray-500 italic line-clamp-2 pl-4 border-l-2 border-green-300">
                        {activeTab === 'note' ? note : memo}
                    </p>
                </div>
            )}
        </div>
    )
}
