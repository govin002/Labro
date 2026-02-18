
import { MdAddCircleOutline, MdSearch } from "react-icons/md";

const PatientTable = ({
    filteredPatients,
    columnWidths,
    handleMouseDown,
    totalCount
}) => {
    const HeaderCell = ({ label, col }) => (
        <th
            style={{ width: columnWidths[col] }}
            className="relative px-3 py-2 border-r border-blue-900/30 group last:border-r-0 select-none"
        >
            <div className="flex items-center justify-between overflow-hidden">
                <span className="truncate">{label}</span>
            </div>
            <div
                onMouseDown={(e) => handleMouseDown(e, col)}
                className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 z-10"
            />
        </th>
    );

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden ring-1 ring-slate-100">
            <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead className="sticky top-0 z-20">
                        <tr className="bg-[#00144d] text-white text-[11px] uppercase tracking-wider font-bold">
                            <HeaderCell label={<input type="checkbox" className="w-4 h-4 rounded border-none bg-white/20" />} col="select" />
                            <HeaderCell label="SN" col="sn" />
                            <HeaderCell label="Patient Name" col="patientName" />
                            <HeaderCell label="Age/Gender" col="ageGender" />
                            <HeaderCell label="Mobile" col="mobile" />
                            <HeaderCell label="Testname" col="testName" />
                            <HeaderCell label="Bill No" col="billNo" />
                            <HeaderCell label="Lab No" col="labNo" />
                            <HeaderCell label="Test Date" col="testDate" />
                            <HeaderCell label="Status" col="status" />
                            <HeaderCell label="Referred By" col="referredBy" />
                            <th style={{ width: columnWidths.action }} className="px-3 py-3 text-center text-[11px] select-none">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-slate-600 bg-white">
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient, index) => (
                                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-3 py-2 text-center">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-slate-400 font-bold text-xs">{patient.sn}</span>
                                            <MdAddCircleOutline className="text-blue-900/40 text-xl cursor-pointer hover:text-blue-600 transition-colors" />
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 font-semibold text-slate-700 truncate">{patient.patientName}</td>
                                    <td className="px-3 py-2 text-slate-500 truncate">{patient.ageGender}</td>
                                    <td className="px-3 py-2 text-slate-500 font-medium truncate">{patient.mobile}</td>
                                    <td className="px-3 py-2 leading-tight text-slate-500 uppercase font-medium text-[11px]">
                                        <div className="line-clamp-2">{patient.testName}</div>
                                    </td>
                                    <td className="px-3 py-2 text-blue-900 font-bold truncate">
                                        {patient.billNo}
                                    </td>
                                    <td className="px-3 py-2">
                                        <span className="text-blue-900 font-bold truncate">{patient.labNo}</span>
                                        {patient.hasRemarks && (
                                            <div className="mt-1">
                                                <span className="bg-teal-50 text-teal-600 px-2 py-0.5 rounded text-[10px] font-bold border border-teal-100 uppercase tracking-tighter">
                                                    REMARKS
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 text-slate-500 text-center truncate">{patient.testDate}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex flex-col gap-1 max-w-[100px]">
                                            <span className="bg-teal-500 text-white px-2 py-0.5 rounded-[2px] text-[10px] font-bold text-center uppercase tracking-wide">
                                                User
                                            </span>
                                            <span className="bg-rose-400 text-white px-2 py-0.5 rounded-[2px] text-[10px] font-bold text-center uppercase tracking-wide">
                                                Verified
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-[11px] text-slate-400 italic leading-tight">
                                        <div className="line-clamp-2">{patient.referredBy}</div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex flex-col gap-1 w-full mx-auto">
                                            <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-[10px] font-bold transition-colors uppercase tracking-wide">
                                                Preview
                                            </button>
                                            <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-[10px] font-bold transition-colors uppercase tracking-wide">
                                                Hold
                                            </button>
                                            <button className="bg-[#00144d] hover:bg-blue-900 text-white py-1 px-3 rounded text-[10px] font-bold transition-colors uppercase tracking-wide">
                                                Dispatch
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12" className="px-4 py-8 text-center text-slate-400">
                                    <MdSearch className="text-3xl mx-auto mb-1 opacity-20" />
                                    <p className="text-xs">No records found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Improved Footer - Accessibility Focused */}
            <div className="px-4 py-4 flex justify-between items-center bg-slate-50/50 border-t border-slate-100 backdrop-blur-sm">
                <p className="text-slate-400 text-sm font-medium">
                    Results: <span className="text-slate-900 font-bold">{filteredPatients.length}</span> / {totalCount}
                </p>
                <div className="flex items-center gap-2 text-sm">
                    <button className="px-4 py-1.5 hover:bg-white hover:text-blue-600 disabled:opacity-30 font-bold transition-all rounded border border-slate-200 bg-white">
                        Previous
                    </button>
                    <div className="w-8 h-8 flex items-center justify-center bg-[#00144d] text-white rounded font-bold shadow-md">
                        1
                    </div>
                    <button className="px-4 py-1.5 hover:bg-white hover:text-blue-600 disabled:opacity-30 font-bold transition-all rounded border border-slate-200 bg-white">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientTable;
