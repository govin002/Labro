import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAddCircleOutline, MdSearch, MdFilterList, MdAssignment,
  MdCheckCircle, MdTimer, MdHourglassEmpty, MdChevronRight,
  MdVisibility, MdPrint, MdMail, MdMoreVert, MdEdit,
  MdFactCheck, MdVerified, MdSend, MdSmartphone, MdRemove
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

function ServiceQueue() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [testSearch, setTestSearch] = useState("");
  const [activeActionRow, setActiveActionRow] = useState(null);
  const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false);
  const [days, setDays] = useState("0");
  const [activeQueue, setActiveQueue] = useState("All");

  // Initialize dates
  const now = new Date();
  const [startDate, setStartDate] = useState(now.toISOString().slice(0, 16));
  const [endDate, setEndDate] = useState(now.toISOString().slice(0, 16));

  const patients = [
    {
      sn: 1,
      patientId: "2863",
      patientName: "JAMUNA RAJKARNIKAR",
      ageGender: "53Y / F",
      mobile: "9851076760",
      testName: "VITAMIN B12, CBC COMPLETE",
      billNo: "CS82/83-0007815",
      sampleNo: "2082-N10228",
      sampleDate: "2082/04/15",
      labNo: "041510228",
      testDate: "2082/04/15",
      status: "Verified",
      referredBy: "Dr. CHANDA SHRIVASTAVA",
    },
    {
      sn: 2,
      patientId: "8052",
      patientName: "SHANTI PANDIT",
      ageGender: "53Y / F",
      mobile: "9849896601",
      testName: "VITAMIN B12, LIPID PROFILE",
      billNo: "CS82/83-0007873",
      sampleNo: "2082-N10234",
      sampleDate: "2082/04/15",
      labNo: "041510234",
      testDate: "2082/04/15",
      status: "Pending",
      referredBy: "Prof. Dr. DEEPAK PRAKASH MAHARA",
    },
    {
      sn: 3,
      patientId: "81012632",
      patientName: "BISHNU KHATRI",
      ageGender: "42Y / M",
      mobile: "9813885905",
      testName: "VITAMIN D, LIVER FUNCTION TEST",
      billNo: "CS82/83-0007931",
      sampleNo: "2082-N10238",
      sampleDate: "2082/04/15",
      labNo: "041510238",
      testDate: "2082/04/15",
      status: "Authorized",
      referredBy: "Prof. Dr. UTTAM KUMAR SHARMA",
      hasRemarks: true,
    },
    {
      sn: 4,
      patientId: "2863",
      patientName: "JAMUNA RAJKARNIKAR",
      ageGender: "53Y / F",
      mobile: "9851076760",
      testName: "CBC (COMPLETE BLOOD COUNT)",
      billNo: "CS82/83-0007816",
      sampleNo: "2082-N10229",
      sampleDate: "2082/04/15",
      labNo: "041510229",
      testDate: "2082/04/15",
      status: "Verified",
      referredBy: "Dr. CHANDA SHRIVASTAVA",
    },
  ];

  const queues = [
    { id: 'All', label: 'All Requests', icon: <MdAssignment />, count: patients.length, color: 'text-slate-600' },
    { id: 'Pending', label: 'Pending', icon: <MdHourglassEmpty />, count: 12, color: 'text-amber-600' },
    { id: 'Processing', label: 'In Progress', icon: <MdTimer />, count: 5, color: 'text-blue-600' },
    { id: 'Verified', label: 'Verified', icon: <MdCheckCircle />, count: 8, color: 'text-emerald-600' },
    { id: 'Authorized', label: 'Authorized', icon: <MdCheckCircle />, count: 4, color: 'text-indigo-600' },
  ];

  // Column resizing state
  const [columnWidths, setColumnWidths] = useState({
    select: 40,
    patientName: 180,
    ageGender: 80,
    mobile: 110,
    testName: 180,
    billNo: 150,
    labNo: 120,
    testDate: 100,
    status: 100,
    referredBy: 120,
    action: 140
  });

  const resizerRef = useRef({ col: null, startX: 0, startWidth: 0 });

  const handleMouseDown = (e, col) => {
    resizerRef.current = {
      col,
      startX: e.pageX,
      startWidth: columnWidths[col]
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (!resizerRef.current.col) return;
    const { col, startX, startWidth } = resizerRef.current;
    const newWidth = Math.max(40, startWidth + (e.pageX - startX));
    setColumnWidths(prev => ({ ...prev, [col]: newWidth }));
  };

  const handleMouseUp = () => {
    resizerRef.current = { col: null, startX: 0, startWidth: 0 };
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  };

  const availableTests = useMemo(() => {
    const tests = patients.map(p => p.testName);
    return [...new Set(tests)];
  }, []);

  const filteredTests = availableTests.filter(test =>
    test.toLowerCase().includes(testSearch.toLowerCase())
  );

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch =
        patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTest =
        testSearch === "" || patient.testName.toLowerCase().includes(testSearch.toLowerCase());

      const matchesQueue =
        activeQueue === 'All' || patient.status === activeQueue;

      return matchesSearch && matchesTest && matchesQueue;
    });
  }, [searchTerm, testSearch, activeQueue]);

  const handleDaysChange = (value) => {
    setDays(value);
    const numDays = parseInt(value) || 0;
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - numDays);

    setStartDate(start.toISOString().slice(0, 16));
    setEndDate(end.toISOString().slice(0, 16));
  };

  const HeaderCell = ({ label, col }) => (
    <th
      style={{ width: columnWidths[col] }}
      className="relative px-3 py-2.5 border-r border-slate-700 group last:border-r-0 select-none bg-slate-800"
    >
      <div className="flex items-center justify-between overflow-hidden">
        <span className="truncate text-slate-300 font-black text-[9px] uppercase tracking-[0.15em] leading-none">{label}</span>
      </div>
      <div
        onMouseDown={(e) => handleMouseDown(e, col)}
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </th>
  );

  return (
    <div className="w-full h-screen p-6 bg-[#f8fafc] font-sans flex flex-col overflow-hidden">
      {/* Title & Queue Selectors */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Service Queue</h1>
          <p className="text-slate-500 text-xs font-medium">Manage and track live patient test requests</p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-sm">
          {queues.map(q => (
            <button
              key={q.id}
              onClick={() => setActiveQueue(q.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all relative whitespace-nowrap ${activeQueue === q.id
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
            >
              <span className={`${activeQueue === q.id ? q.color : 'text-slate-400'} text-lg`}>
                {q.icon}
              </span>
              <div className="flex flex-col items-start leading-none">
                <span className={`text-[10px] font-black uppercase tracking-wider ${activeQueue === q.id ? 'text-slate-900' : 'text-slate-500'}`}>
                  {q.label}
                </span>
                <span className="text-[9px] font-bold opacity-60">{q.count} Items</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 mb-6 flex items-center gap-6">
        <div className="flex-1 relative group">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-all" size={20} />
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl text-sm border-none outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 font-medium"
            placeholder="Search by Patient Name, ID or Lab No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-px h-10 bg-slate-200 mx-2" />

        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 ml-1">Test Category</label>
            <div className="relative">
              <MdFilterList className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="All Tests"
                className="pl-9 pr-4 py-2 bg-slate-50 rounded-xl text-xs border-none outline-none focus:ring-2 focus:ring-blue-500/10 w-48 font-bold"
                value={testSearch}
                onFocus={() => setIsTestDropdownOpen(true)}
                onChange={(e) => setTestSearch(e.target.value)}
              />
              {isTestDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-2 max-h-48 overflow-auto animate-in fade-in zoom-in duration-200">
                  <div
                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-[10px] font-black uppercase text-blue-600 tracking-widest"
                    onClick={() => {
                      setTestSearch("");
                      setIsTestDropdownOpen(false);
                    }}
                  >
                    All Tests
                  </div>
                  {filteredTests.map((test, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-[10px] font-bold text-slate-600 uppercase tracking-tight"
                      onClick={() => {
                        setTestSearch(test);
                        setIsTestDropdownOpen(false);
                      }}
                    >
                      {test}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 ml-1">Period</label>
            <select
              className="px-3 py-2 bg-slate-50 rounded-xl text-xs border-none outline-none focus:ring-2 focus:ring-blue-500/10 font-bold appearance-none cursor-pointer"
              value={days}
              onChange={(e) => handleDaysChange(e.target.value)}
            >
              <option value="0">Today</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last Month</option>
            </select>
          </div>

          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95">
            Execute Search
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="flex-1 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20 border-b border-slate-700">
              <tr className="bg-slate-800 text-white">
                <HeaderCell label={<input type="checkbox" className="w-3.5 h-3.5 accent-blue-600 rounded" />} col="select" />
                <HeaderCell label="Identity / PID" col="patientName" />
                <HeaderCell label="Age/Sex" col="ageGender" />
                <HeaderCell label="Contact" col="mobile" />
                <HeaderCell label="Lab ID / Bill" col="labNo" />
                <HeaderCell label="Test Info" col="testName" />
                <HeaderCell label="Date" col="testDate" />
                <HeaderCell label="Status" col="status" />
                <HeaderCell label="Referral" col="referredBy" />
                <th style={{ width: columnWidths.action }} className="px-3 py-2.5 text-right text-[9px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 border-l border-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm bg-white divide-y divide-slate-50">
              {filteredPatients.map((patient, index) => (
                <tr
                  key={patient.labNo || index}
                  className={`transition-all group border-b border-slate-100 ${activeActionRow === patient.labNo ? 'bg-blue-50/50 z-30 relative' : 'hover:bg-slate-50'}`}
                >
                  <td className="px-3 py-1.5 text-center">
                    <input type="checkbox" className="w-3.5 h-3.5 accent-blue-600 rounded cursor-pointer" />
                  </td>
                  <td className="px-3 py-1.5">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 uppercase tracking-tight leading-none text-[11px] mb-0.5">{patient.patientName}</span>
                      <span className="text-[8px] font-black text-blue-600/70 uppercase tracking-tighter">PID: {patient.patientId}</span>
                    </div>
                  </td>
                  <td className="px-3 py-1.5 text-slate-600 font-bold text-[10px] uppercase">{patient.ageGender}</td>
                  <td className="px-3 py-1.5 text-slate-500 font-black text-[9px] tracking-tighter">{patient.mobile}</td>
                  <td className="px-3 py-1.5">
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-black tracking-widest text-[10px] leading-none mb-0.5">{patient.labNo}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{patient.billNo}</span>
                    </div>
                  </td>
                  <td className="px-3 py-1.5">
                    <div className="truncate text-[9px] font-bold text-slate-500 uppercase tracking-tighter max-w-[180px]" title={patient.testName}>
                      {patient.testName}
                    </div>
                  </td>
                  <td className="px-3 py-1.5 text-slate-400 text-[9px] font-black tracking-tighter uppercase">{patient.testDate}</td>
                  <td className="px-3 py-1.5">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${patient.status === 'Authorized' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                      patient.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        patient.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-slate-500 font-black text-[9px] uppercase truncate max-w-[120px]">{patient.referredBy}</td>
                  <td className="px-3 py-1.5 sticky right-0 bg-white/95 backdrop-blur-sm z-10 border-l border-slate-50 shadow-[-10px_0_15px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Primary Quick Action */}
                      <button
                        onClick={() => navigate('/Home/ReportEntry', { state: { labNo: patient.labNo } })}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-blue-600 transition-all font-black text-[9px] uppercase tracking-widest shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <MdEdit size={12} /> Entry
                      </button>

                      {/* Action Toggle */}
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveActionRow(activeActionRow === patient.labNo ? null : patient.labNo); }}
                          className={`p-1.5 rounded-lg border transition-all ${activeActionRow === patient.labNo
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                            : "bg-white border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600"
                            }`}
                        >
                          <MdMoreVert size={16} />
                        </button>

                        {/* Floating Action Menu */}
                        {activeActionRow === patient.labNo && (
                          <>
                            <div
                              className="fixed inset-0 z-40 cursor-default"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveActionRow(null);
                              }}
                            />
                            <div
                              className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="px-3 py-2 mb-1 border-b border-slate-50">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operations</span>
                              </div>

                              {/* Printing Group */}
                              {(patient.status === 'Verified' || patient.status === 'Authorized') && (
                                <div className="space-y-1 mb-2">
                                  <button onClick={() => window.print()} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-all font-bold text-[10px] uppercase tracking-tight">
                                    <MdPrint size={14} /> Print Standard
                                  </button>
                                  <div className="grid grid-cols-2 gap-1 px-2">
                                    <button className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-50/50 text-emerald-600 hover:bg-emerald-100 text-[8px] font-black italic">H-LESS</button>
                                    <button className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-50/50 text-emerald-600 hover:bg-emerald-100 text-[8px] font-black italic">F-LESS</button>
                                  </div>
                                </div>
                              )}

                              {/* Communication & Sharing */}
                              <div className="space-y-1">
                                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-all font-bold text-[11px]">
                                  <MdVisibility size={16} /> Quick Preview
                                </button>

                                {(patient.status === 'Pending' || patient.status === 'Processing') && (
                                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-all font-bold text-[11px]">
                                    <MdFactCheck size={16} /> Verify Now
                                  </button>
                                )}

                                {(patient.status === 'Verified' || patient.status === 'Authorized') && (
                                  <>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-green-600 hover:bg-green-50 transition-all font-bold text-[11px]">
                                      <FaWhatsapp size={16} /> WhatsApp Report
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-bold text-[11px]">
                                      <MdMail size={16} /> Email Patient
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modern Pagination Footer */}
        <div className="px-8 py-4 bg-white border-t border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs shadow-inner">
              {filteredPatients.length}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Entries in Queue</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Prev</button>
            <div className="flex gap-1">
              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-lg">1</span>
              <span className="w-8 h-8 rounded-xl bg-transparent text-slate-400 flex items-center justify-center text-xs font-black hover:bg-slate-50 transition-all cursor-pointer">2</span>
            </div>
            <button className="px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceQueue;
