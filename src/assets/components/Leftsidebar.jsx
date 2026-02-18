
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Profile from "./Profile";
import { FaHome, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsFillPrinterFill } from "react-icons/bs";
import { GiArchiveRegister, GiDoorHandle, GiMicroscope } from "react-icons/gi";
import { LuSettings2 } from "react-icons/lu";
import { AiFillSetting } from "react-icons/ai";
import { SiGooglesearchconsole } from "react-icons/si";
import { MdOutlineScience } from "react-icons/md";

function Leftsidebar() {
    const [isExpanded, setIsExpanded] = useState(true);

    const navItems = [
        { to: "/Home", icon: <FaHome />, label: "Dashboard", end: true },
        { to: "/Home/PatientEntry", icon: <GiArchiveRegister />, label: "Patient Entry" },
        { to: "/Home/ServiceQueue", icon: <SiGooglesearchconsole />, label: "Service Queue" },
        { to: "/Home/ReportEntry", icon: <GiMicroscope />, label: "Report Entry" },
        { to: "/Home/Setting", icon: <AiFillSetting />, label: "Setting" },
    ];

    return (
        <div
            className={`${isExpanded ? "w-52" : "w-16"
                } bg-slate-900 shadow-2xl h-screen transition-all duration-300 ease-in-out flex flex-col border-r border-slate-800 relative group`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -right-3 top-20 bg-blue-600 text-white p-1.5 rounded-full shadow-lg z-50 hover:bg-blue-700 transition-colors border-2 border-slate-900"
                aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
                {isExpanded ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
            </button>

            {/* Header / Logo Section */}
            <div className="pt-10 pb-8 px-4 flex items-center justify-center overflow-hidden">
                <div className={`flex ${isExpanded ? "flex-col items-center text-center" : "items-center justify-center"} transition-all duration-300 gap-4`}>
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 shrink-0 border-2 border-white/10">
                        <MdOutlineScience size={34} />
                    </div>
                    {isExpanded && (
                        <div className="flex flex-col whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
                            <h1 className="text-white font-black text-[16px] tracking-tighter leading-tight uppercase">Govinda Pathology</h1>
                            <span className="text-blue-400 text-[9px] uppercase font-black tracking-[0.3em] opacity-80 mt-1">Digital Lab</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation section */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
                <nav className="px-3 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center px-3 py-2 rounded-lg transition-all duration-200 gap-3 ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`
                            }
                        >
                            <span className="text-xl shrink-0">{item.icon}</span>
                            <span
                                className={`${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                                    } transition-all duration-300 font-black text-[13px] whitespace-nowrap overflow-hidden tracking-tight`}
                            >
                                {item.label}
                            </span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Bottom Section (Profile + Logout) */}
            <div className="border-t border-slate-800 bg-slate-900/50 pt-2 pb-4">
                <Profile isExpanded={isExpanded} />

                <div className="px-3 mt-1">
                    <NavLink
                        to="/"
                        className="flex items-center px-3 py-2 text-rose-400 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg transition-all duration-200 gap-3"
                    >
                        <span className="text-xl shrink-0">
                            <GiDoorHandle />
                        </span>
                        <span
                            className={`${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                                } transition-all duration-300 font-black text-[13px] whitespace-nowrap overflow-hidden tracking-tight`}
                        >
                            Logout
                        </span>
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default Leftsidebar;
