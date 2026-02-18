import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  MdSearch, MdSave, MdClose, MdPrint, MdEdit, MdHistory,
  MdCheckCircle, MdPendingActions, MdVerified, MdFactCheck,
  MdQrCode2, MdRefresh, MdCancel, MdCheckBox, MdCheckBoxOutlineBlank,
  MdWarning, MdInfo, MdComment, MdExpandMore, MdExpandLess,
  MdAdd, MdArrowUpward, MdArrowDownward, MdRemove, MdChevronLeft
} from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

// Simple toast notification component
const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
    type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
      'bg-blue-50 border-blue-200 text-blue-800';

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColor} shadow-lg animate-in slide-in-from-top-2 duration-300`}>
      {type === 'error' && <MdWarning size={20} />}
      {type === 'success' && <MdCheckCircle size={20} />}
      <span className="text-sm font-bold">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <MdClose size={16} />
      </button>
    </div>
  );
};

// Simple Code 128 Barcode Generator Component (SVG)
const Barcode128 = ({ value, className }) => {
  if (!value) return null;
  const bars = value.split('').map((char, i) => {
    const width = (char.charCodeAt(0) % 3) + 1;
    return <rect key={i} x={i * 4} y="0" width={width} height="40" fill="black" />;
  });

  return (
    <svg viewBox={`0 0 ${value.length * 4} 40`} className={className} preserveAspectRatio="none">
      {bars}
    </svg>
  );
};

// Patient Info Header Component
const PatientInfoHeader = ({ patient, labNo }) => (
  <div className="bg-white px-4 py-2 border-b border-slate-300 flex items-center justify-between text-xs text-slate-800 shadow-sm gap-4">
    <div className="flex flex-col">
      <span className="font-bold text-slate-600 uppercase text-[9px] tracking-widest">Patient Name</span>
      <span className="font-black text-slate-800 text-[14px] uppercase tracking-tight truncate max-w-[200px]" title={patient.patientName}>
        {patient.patientName}
      </span>
    </div>
    <div className="w-px h-8 bg-slate-200"></div>
    <div className="flex flex-col">
      <span className="font-bold text-slate-600 uppercase text-[9px] tracking-widest">Age / Gender</span>
      <span className="font-black text-rose-600 text-[12px] uppercase tracking-tight">{patient.ageGender}</span>
    </div>
    <div className="w-px h-8 bg-slate-200"></div>
    <div className="flex flex-col flex-1">
      <span className="font-bold text-slate-600 uppercase text-[9px] tracking-widest">Ref. Doctor</span>
      <span className="font-black text-rose-600 uppercase text-[12px] tracking-tight truncate" title={patient.refBy}>
        {patient.refBy}
      </span>
    </div>
    <div className="w-px h-8 bg-slate-200"></div>
    <div className="flex flex-col items-end">
      <span className="font-bold text-slate-600 uppercase text-[9px] tracking-widest text-right">Lab ID No</span>
      <span className="font-black text-slate-900 bg-amber-100 px-2 py-0.5 border border-amber-200 rounded text-[13px] tracking-tight">
        {labNo}
      </span>
    </div>
  </div>
);

// Method & Remarks Section Component (Expandable)
const MethodRemarksSection = ({
  method,
  remarks,
  remarksHistory,
  onMethodChange,
  onRemarksChange,
  onAddNewMethod,
  isExpanded,
  onToggleExpand,
  isLocked
}) => {
  return (
    <div className="border-b border-slate-200 bg-white">
      {/* Header - Always visible */}
      <div
        className="px-4 py-2 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-4">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700">Method </span>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            {method && <span className="bg-blue-50 px-2 py-0.5 rounded">Method: {method}</span>}

          </div>
        </div>
        {isExpanded ? <MdExpandLess size={20} className="text-slate-500" /> : <MdExpandMore size={20} className="text-slate-500" />}
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-200 grid grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-200">
          {/* Method Column */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <MdInfo size={12} /> Method
            </label>
            <input
              type="text"
              value={method || ''}
              onChange={(e) => onMethodChange(e.target.value)}
              placeholder="Enter test method..."
              disabled={isLocked}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
            />
            <button
              onClick={onAddNewMethod}
              disabled={isLocked}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 mt-1 disabled:text-slate-400"
            >
              <MdAdd size={14} /> Add New Method
            </button>
          </div>

          {/* Remarks Column */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <MdComment size={12} /> Remarks
            </label>
            <select
              value={remarks || ''}
              onChange={(e) => onRemarksChange(e.target.value)}
              disabled={isLocked}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-slate-50"
            >
              <option value="">Select Remarks</option>
              <option value="Sample hemolyzed">Sample hemolyzed</option>
              <option value="Sample lipemic">Sample lipemic</option>
              <option value="Sample icteric">Sample icteric</option>
              <option value="Insufficient sample">Insufficient sample</option>
              <option value="Repeat test required">Repeat test required</option>
              <option value="Confirmed by pathologist">Confirmed by pathologist</option>
              <option value="Borderline result">Borderline result</option>
              <option value="Critical value reported">Critical value reported</option>
            </select>
          </div>

          {/* Remarks History Column */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <MdHistory size={12} /> Remarks History
            </label>
            <div className="border border-slate-200 rounded-lg h-24 overflow-auto bg-slate-50 p-2">
              {remarksHistory && remarksHistory.length > 0 ? (
                remarksHistory.map((item, idx) => (
                  <div key={idx} className="text-[11px] py-1 border-b border-slate-100 last:border-0 text-slate-600">
                    {item}
                  </div>
                ))
              ) : (
                <div className="text-[11px] text-slate-400 italic text-center mt-6">No history available</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Test Sidebar Component
const TestSidebar = ({
  tests,
  activeTest,
  onTestSelect,
  onPrintBarcode,
  onPrintSelected,
  selectedTests,
  onTestToggle
}) => {
  const pendingTests = tests.filter(t => t.status === 'pending');
  const completedTests = tests.filter(t => ['completed', 'verified', 'authorized', 'cancelled'].includes(t.status));

  const getStatusColor = (status) => {
    switch (status) {
      case 'authorized': return 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200';
      case 'verified': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200';
      case 'completed': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'cancelled': return 'bg-rose-50 text-rose-700 hover:bg-rose-100 opacity-60';
      default: return 'bg-white hover:bg-blue-50 text-slate-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'authorized': return <MdVerified size={15} className="text-indigo-600" />;
      case 'verified': return <MdFactCheck size={15} className="text-emerald-600" />;
      case 'completed': return <MdSave size={15} className="text-blue-600" />;
      case 'cancelled': return <MdCancel size={15} className="text-rose-600" />;
      default: return null;
    }
  };

  return (
    <div className="w-48 flex flex-col gap-2 shrink-0">
      {/* Pending Tests */}
      <div className="flex-[4] bg-white border-2 border-slate-300 flex flex-col shadow-sm overflow-hidden h-1/2 relative rounded-lg">
        <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 flex justify-between items-center">
          <span className="text-[11px] font-black text-slate-600 uppercase tracking-wide">Pending Tests</span>
          <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 rounded border border-amber-200">
            {pendingTests.length}
          </span>
        </div>
        <div className="flex-1 overflow-auto bg-slate-50 pb-10">
          {pendingTests.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-[10px] uppercase font-bold text-center px-4">
              All tests completed
            </div>
          ) : (
            pendingTests.map((test, i) => (
              <div
                key={i}
                onClick={() => onTestSelect(test.name)}
                className={`p-3 text-[13px] font-bold cursor-pointer border-b border-slate-200 transition-all flex items-center justify-between ${activeTest === test.name ? 'bg-blue-600 text-white' : 'bg-white hover:bg-blue-50 text-slate-700'
                  }`}
              >
                {test.name}
                {activeTest === test.name && (
                  <span className="text-[9px] text-blue-100 bg-green-700 px-1 rounded uppercase">Active</span>
                )}
              </div>
            ))
          )}
        </div>
        <button
          onClick={onPrintBarcode}
          className="absolute bottom-0 inset-x-0 bg-slate-800 text-white py-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 flex items-center justify-center gap-2 transition-all border-t border-slate-600"
        >
          <MdQrCode2 size={16} /> Print Barcode
        </button>
      </div>

      {/* Completed/Verified/Authorized Tests */}
      <div className="flex-[3] bg-white border-2 border-slate-300 flex flex-col shadow-sm overflow-hidden h-1/2 relative rounded-lg">
        <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 flex justify-between items-center">
          <span className="text-[11px] font-black text-black-500 uppercase tracking-wide">Finding Entered </span>
          <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 rounded border border-emerald-200">
            {completedTests.length}
          </span>
        </div>
        <div className="flex-1 overflow-auto bg-slate-50/50 pb-10">
          {completedTests.map((test, i) => (
            <div
              key={i}
              onClick={() => onTestSelect(test.name)}
              className={`p-2 pl-3 text-[13px] font-bold cursor-pointer border-b border-slate-200 transition-all flex items-center justify-between group 
                ${activeTest === test.name ? 'bg-slate-800 text-white' : getStatusColor(test.status)}`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <input
                  type="checkbox"
                  className="accent-slate-800 w-3.5 h-3.5"
                  checked={selectedTests.includes(test.name)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onTestToggle(test.name);
                  }}
                />
                <span className={`truncate ${activeTest === test.name ? 'text-white' : ''}`}>{test.name}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {test.printed && <MdPrint size={14} className={activeTest === test.name ? "text-purple-300" : "text-purple-500"} title="Printed" />}
                {getStatusIcon(test.status)}
              </div>
            </div>
          ))}
          {completedTests.length === 0 && (
            <div className="p-4 text-center text-[10px] text-slate-300 font-bold uppercase italic">
              No completed entries
            </div>
          )}
        </div>

        {/* Print Selected Button */}
        <button
          onClick={onPrintSelected}
          disabled={selectedTests.length === 0 || !selectedTests.every(t =>
            tests.find(te => te.name === t)?.status === 'authorized'
          )}
          className={`absolute bottom-0 inset-x-0 border-t border-slate-300 py-2 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm z-10
            ${selectedTests.length > 0 && selectedTests.every(t =>
            tests.find(te => te.name === t)?.status === 'authorized')
              ? 'bg-slate-800 text-white hover:bg-slate-700 cursor-pointer'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
        >
          <MdPrint size={16} /> Print Selected ({selectedTests.length})
        </button>
      </div>
    </div>
  );
};

// Test Results Table Component with Simplified High/Low Flags
const TestResultsTable = ({
  results,
  isLocked,
  testStatus,
  onResultChange,
  onCommentChange,
  onRemarkChange,
  onKeyDown
}) => {
  // Robust helper function to determine if value is high or low
  const getFlagStatus = (result, value) => {
    if (value === undefined || value === null || value === '' || result.isHeader || !result.normalRange) return null;

    // Remove any commas used as thousands separators and parse
    const cleanValue = value.toString().replace(/,/g, '');
    const numValue = parseFloat(cleanValue);
    if (isNaN(numValue)) return null;

    const range = result.normalRange.trim();

    // Case 1: Less than format (e.g., < 200 or <200)
    if (range.startsWith('<')) {
      const maxVal = parseFloat(range.replace('<', '').trim());
      if (!isNaN(maxVal)) {
        return numValue >= maxVal ? 'HIGH' : null;
      }
    }

    // Case 2: Greater than format (e.g., > 40 or >40)
    if (range.startsWith('>')) {
      const minVal = parseFloat(range.replace('>', '').trim());
      if (!isNaN(minVal)) {
        return numValue <= minVal ? 'LOW' : null;
      }
    }

    // Case 3: Range format (e.g., 13.5-17.5 or 4000 - 11000)
    if (range.includes('-')) {
      const parts = range.split('-');
      if (parts.length === 2) {
        const minVal = parseFloat(parts[0].trim());
        const maxVal = parseFloat(parts[1].trim());

        if (!isNaN(minVal) && !isNaN(maxVal)) {
          if (numValue < minVal) return 'LOW';
          if (numValue > maxVal) return 'HIGH';
        }
      }
    }

    return null;
  };

  const tableColumns = [
    { id: 'parameter', label: 'Test Parameter', className: '', width: '18%' },
    { id: 'result', label: 'Result Value', className: 'text-center', width: '12%' },
    { id: 'flag', label: 'Flag', className: 'text-center', width: '8%' },
    { id: 'unit', label: 'Unit', className: '', width: '8%' },
    { id: 'range', label: 'Ref. Range', className: 'text-right', width: '12%' },
    { id: 'comment', label: 'Comment', className: '', width: '22%' },
    { id: 'remarks', label: 'Remarks', className: '', width: '20%' }
  ];

  // Get row background color based on test status and flag
  const getRowBackground = (result, index, flag) => {
    if (result.isHeader) return 'bg-amber-50 border-y border-amber-100';

    // Priority 1: Flagged/Abnormal state (Always show distinct background)
    if (flag) {
      if (testStatus === 'authorized') return 'bg-rose-100/70 hover:bg-rose-200/80';
      if (testStatus === 'verified') return 'bg-rose-100/60 hover:bg-rose-200/70';
      return 'bg-rose-100 hover:bg-rose-200';
    }

    // Priority 2: Normal states
    if (testStatus === 'authorized') {
      return 'bg-indigo-50/50 hover:bg-indigo-100/50';
    }
    if (testStatus === 'verified') {
      return 'bg-emerald-50/50 hover:bg-emerald-100/50';
    }
    if (testStatus === 'completed') {
      return 'bg-blue-50/50 hover:bg-blue-100/50';
    }

    // Default backgrounds for pending/normal
    return index % 2 === 0 ? 'bg-white hover:bg-blue-50/50' : 'bg-slate-50/50 hover:bg-blue-50/50';
  };

  // Get flag display
  const getFlagDisplay = (flag) => {
    if (!flag) return null;

    if (flag === 'HIGH') {
      return (
        <div className="flex items-center justify-center gap-1.5 px-2 py-1 rounded bg-rose-600 shadow-sm animate-pulse-slow">
          <span className="text-white font-black text-xs" title="Critically High">↑ HIGH</span>
        </div>
      );
    }
    if (flag === 'LOW') {
      return (
        <div className="flex items-center justify-center gap-1.5 px-2 py-1 rounded bg-blue-600 shadow-sm animate-pulse-slow">
          <span className="text-white font-black text-xs" title="Critically Low">↓ LOW</span>
        </div>
      );
    }
    return <span className="text-slate-400 text-xs">--</span>;
  };

  return (
    <div className="overflow-auto h-full">
      <table className="w-full text-left border-collapse text-sm">
        <thead className="bg-[#f8fafc] sticky top-0 z-10 shadow-sm text-slate-700 border-b-2 border-slate-200">
          <tr className="divide-x divide-slate-200">
            {tableColumns.map((col) => (
              <th
                key={col.id}
                className={`px-3 py-3 font-black text-[11px] uppercase tracking-wider text-blue-900 select-none ${col.className || ''}`}
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {results.map((result, idx) => {
            const flag = getFlagStatus(result, result.result);

            return (
              <tr
                key={idx}
                className={`divide-x divide-slate-100 transition-colors ${getRowBackground(result, idx, flag)}`}
              >
                {/* Parameter */}
                <td className={`px-3 py-2 ${result.isHeader ? 'font-black text-slate-800 uppercase tracking-wide text-[11px]' : 'text-slate-700 font-bold text-[13px]'}`}>
                  {result.isHeader ? '▶ ' : ''}{result.name}
                </td>

                {/* Result Input */}
                <td className="p-0 text-center">
                  {!result.isHeader ? (
                    <input
                      id={`row-${idx}-col-0`}
                      type="text"
                      className={`w-full h-full px-2 py-2 outline-none text-sm font-black bg-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all text-center tracking-tight 
                        ${flag ? 'font-extrabold' : 'text-slate-900'}
                        ${flag === 'HIGH' ? 'text-rose-700' : ''}
                        ${flag === 'LOW' ? 'text-blue-700' : ''}
                        ${isLocked ? 'disabled:text-slate-500 disabled:bg-transparent' : ''}`}
                      value={result.result || ''}
                      placeholder="--"
                      disabled={isLocked}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
                          onResultChange(idx, 'result', val);
                        }
                      }}
                      onKeyDown={(e) => onKeyDown(e, idx, 0)}
                      autoComplete="off"
                    />
                  ) : null}
                </td>

                {/* Flag Column */}
                <td className="px-2 py-2 text-center">
                  {!result.isHeader && getFlagDisplay(flag)}
                </td>

                {/* Unit */}
                <td className={`px-3 py-2 text-slate-400 text-[11px] font-bold italic ${result.isHeader ? 'bg-amber-50' : ''}`}>
                  {result.unit}
                </td>

                {/* Reference Range */}
                <td className={`px-3 py-2 text-slate-500 text-[11px] font-bold text-right ${result.isHeader ? 'bg-amber-50' : ''}`}>
                  {result.normalRange}
                </td>

                {/* Comment Column */}
                <td className="p-0">
                  {!result.isHeader ? (
                    <div className="flex items-center">
                      <MdComment className="text-slate-400 ml-2 mr-1" size={14} />
                      <input
                        id={`row-${idx}-col-1`}
                        type="text"
                        className="w-full px-1 py-2 outline-none text-xs bg-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all placeholder:text-slate-300"
                        value={result.comment || ''}
                        placeholder="Add comment..."
                        disabled={isLocked}
                        onChange={(e) => onCommentChange(idx, 'comment', e.target.value)}
                        onKeyDown={(e) => onKeyDown(e, idx, 1)}
                        autoComplete="off"
                      />
                    </div>
                  ) : null}
                </td>

                {/* Remarks Column */}
                <td className="p-0">
                  {!result.isHeader ? (
                    <select
                      id={`row-${idx}-col-2`}
                      className="w-full px-2 py-2 outline-none text-xs bg-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all"
                      value={result.remarks || ''}
                      onChange={(e) => onRemarkChange(idx, 'remarks', e.target.value)}
                      onKeyDown={(e) => onKeyDown(e, idx, 2)}
                      disabled={isLocked}
                    >
                      <option value="">Select Remark</option>
                      <option value="repeat">🔄 Repeat Test</option>
                      <option value="hemolyzed">🧪 Hemolyzed</option>
                      <option value="lipemic">🧪 Lipemic</option>
                      <option value="icteric">🧪 Icteric</option>
                      <option value="insufficient">⚠️ Insufficient Sample</option>
                      <option value="contaminated">⚠️ Contaminated</option>
                      <option value="confirmed">✅ Confirmed</option>
                      <option value="borderline">⚠️ Borderline</option>
                      <option value="critical">🔥 Critical</option>
                    </select>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Action Bar Component
const ActionBar = ({
  isLocked,
  testCount,
  onSave,
  onVerify,
  onAuthorize,
  onRetest,
  onCancel,
  onPrint,
  onPrintNoHeader,
  onPrevTest,
  onNextTest,
  onExit,
  hasUnsavedData,
  testStatus
}) => (
  <div className="bg-[#bfdbfe] px-6 py-2 border-t border-blue-300 flex items-center justify-between shadow-inner">
    {/* Left Side: Stats */}
    <div className="flex items-center gap-2">
      <div className="bg-white/50 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wider border border-blue-200">
        Total Parameters: {testCount}
      </div>
      {hasUnsavedData && (
        <div className="flex items-center gap-1 text-amber-700 bg-amber-100 px-3 py-1.5 rounded text-[10px] font-black uppercase">
          <MdWarning size={14} /> Unsaved Changes
        </div>
      )}
      {testStatus && (
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded text-[10px] font-black uppercase
          ${testStatus === 'authorized' ? 'bg-indigo-100 text-indigo-700' :
            testStatus === 'verified' ? 'bg-emerald-100 text-emerald-700' :
              testStatus === 'completed' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-700'}`}>
          Status: {testStatus}
        </div>
      )}
    </div>

    {/* Right Side: Actions */}
    <div className="flex items-center gap-2">
      {!isLocked && testStatus !== 'cancelled' ? (
        <>
          <button
            onClick={onSave}
            className="bg-gradient-to-b from-white to-slate-50 border border-slate-400 text-slate-800 px-4 py-2 text-[11px] font-black uppercase tracking-widest hover:from-blue-600 hover:to-blue-700 hover:text-white hover:border-blue-800 transition-all shadow-md active:scale-95 rounded-lg flex items-center gap-1.5"
            title="Save (Ctrl+S)"
          >
            <MdSave size={16} /> Save
          </button>
          <button
            onClick={onVerify}
            className="bg-gradient-to-b from-white to-slate-50 border border-emerald-400 text-emerald-800 px-4 py-2 text-[11px] font-black uppercase tracking-widest hover:from-emerald-600 hover:to-emerald-700 hover:text-white hover:border-emerald-800 transition-all shadow-md active:scale-95 rounded-lg flex items-center gap-1.5"
          >
            <MdFactCheck size={16} /> Verify
          </button>
          <button
            onClick={onAuthorize}
            className="bg-gradient-to-b from-white to-slate-50 border border-indigo-400 text-indigo-800 px-4 py-2 text-[11px] font-black uppercase tracking-widest hover:from-indigo-600 hover:to-indigo-700 hover:text-white hover:border-indigo-800 transition-all shadow-md active:scale-95 rounded-sm flex items-center gap-1.5"
          >
            <MdVerified size={16} /> Authorize
          </button>

          <div className="w-px h-6 bg-blue-300/50 mx-1"></div>

          <button
            onClick={onRetest}
            className="bg-gradient-to-b from-white to-slate-50 border border-amber-400 text-amber-800 px-3 py-2 text-[11px] font-black uppercase tracking-widest hover:from-amber-600 hover:to-amber-700 hover:text-white hover:border-amber-800 transition-all shadow-md active:scale-95 rounded-sm flex items-center gap-1.5"
            title="Retest (Reset results)"
          >
            <MdRefresh size={16} /> Retest
          </button>
          <button
            onClick={onCancel}
            className="bg-gradient-to-b from-white to-slate-50 border border-rose-400 text-rose-800 px-3 py-2 text-[11px] font-black uppercase tracking-widest hover:from-rose-600 hover:to-rose-700 hover:text-white hover:border-rose-800 transition-all shadow-md active:scale-95 rounded-sm flex items-center gap-1.5"
          >
            <MdCancel size={16} /> Cancel
          </button>
        </>
      ) : (
        <div className="flex items-center gap-2">
          {testStatus !== 'cancelled' && (
            <button
              onClick={onRetest}
              className="bg-white border border-amber-400 text-amber-700 px-3 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-amber-50 shadow-md rounded-sm flex items-center gap-2"
            >
              <MdRefresh size={16} /> Retest
            </button>
          )}
          {testStatus === 'cancelled' ? (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 border border-rose-200 rounded text-[11px] font-black uppercase animate-pulse">
              <MdCancel size={16} /> Panel Cancelled
            </div>
          ) : (
            <>
              <button
                onClick={onPrint}
                className="bg-slate-800 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 shadow-md rounded-sm flex items-center gap-2"
              >
                <MdPrint size={16} /> Print w/ Header
              </button>
              <button
                onClick={onPrintNoHeader}
                className="bg-white border border-slate-800 text-slate-800 px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 shadow-md rounded-sm flex items-center gap-2"
              >
                <MdPrint size={16} /> Print w/o Header
              </button>
            </>
          )}
        </div>
      )}

      <div className="w-px h-8 bg-slate-400/30 mx-2"></div>

      <button
        onClick={onPrevTest}
        className="bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-300 text-slate-600 px-3 py-2 text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-sm active:scale-95 rounded-sm"
        title="Previous test (←)"
      >
        &lt; Prev
      </button>
      <button
        onClick={onNextTest}
        className="bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-300 text-blue-800 px-3 py-2 text-[11px] font-black uppercase tracking-widest hover:bg-blue-200 transition-all shadow-sm active:scale-95 rounded-sm"
        title="Next test (→)"
      >
        Next &gt;
      </button>

      <button
        onClick={onExit}
        className="bg-gradient-to-b from-white to-slate-50 border border-slate-400 text-slate-700 px-4 py-2 text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm active:scale-95 rounded-sm ml-2"
        title="Exit (Esc)"
      >
        Exit
      </button>
    </div>
  </div>
);

// Barcode Modal Component
const BarcodeModal = ({ isOpen, onClose, patient, labNo, testName, onPrint }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-96 animate-in zoom-in duration-200 border-2 border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Print Barcode Label</h3>
          <button onClick={onClose} className="hover:bg-rose-50 rounded-full p-1 text-rose-500">
            <MdClose size={20} />
          </button>
        </div>
        <div className="bg-white border-2 border-slate-800 p-4 rounded-lg mb-6 flex flex-col items-center gap-2">
          <p className="font-bold text-sm">{patient.patientName}</p>
          <div className="h-16 w-full flex items-center justify-center overflow-hidden">
            <Barcode128 value={labNo} className="h-full w-full" />
          </div>
          <p className="font-mono text-xs tracking-[0.5em]">{labNo}</p>
          <p className="text-[10px] font-bold uppercase mt-2 border-t border-slate-200 w-full text-center pt-2">
            {testName}
          </p>
        </div>
        <button
          onClick={() => {
            onPrint();
            onClose();
          }}
          className="w-full bg-slate-900 text-white font-bold uppercase tracking-widest p-3 rounded-lg hover:bg-blue-600 transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <MdPrint size={18} /> Print Label
        </button>
      </div>
    </div>
  );
};

// List View Component
const ListView = ({
  reports,
  searchTerm,
  onSearchChange,
  onEditReport,
  visibleColumns,
  onToggleColumn
}) => {
  const [showColMenu, setShowColMenu] = useState(false);

  const filteredReports = useMemo(() => {
    return reports.filter(r =>
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.labNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patientId.includes(searchTerm)
    );
  }, [searchTerm, reports]);

  const getStatusColor = (status) => {
    if (status.includes('Pending')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (status.includes('Partially')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (status.includes('Cancelled')) return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const getStatusIcon = (status) => {
    if (status.includes('Pending')) return <MdPendingActions size={14} />;
    if (status.includes('Cancelled')) return <MdCancel size={14} />;
    return <MdCheckCircle size={14} />;
  };

  return (
    <div className="h-full flex flex-col p-6 bg-[#f0f2f5] font-sans text-slate-800">
      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-6 mb-6">
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date Range</label>
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <input type="date" className="bg-transparent text-xs font-bold text-slate-700 outline-none px-2" />
            <span className="text-slate-400 font-bold">-</span>
            <input type="date" className="bg-transparent text-xs font-bold text-slate-700 outline-none px-2" />
          </div>
        </div>
        <div className="flex-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Search</label>
          <div className="relative group">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by Patient Name, Lab ID, or MRN..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
        </div>

        {/* Column Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowColMenu(!showColMenu)}
            className="bg-slate-50 border border-slate-200 hover:bg-white text-slate-600 p-2.5 rounded-xl shadow-sm transition-all active:scale-95"
            title="Manage Columns"
          >
            <MdCheckBoxOutlineBlank size={20} />
          </button>
          {showColMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowColMenu(false)} />
              <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 shadow-xl rounded-xl p-3 z-50 w-56 animate-in fade-in zoom-in-95">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 pb-2 border-b border-slate-100 block mb-1">
                  Toggle Columns
                </span>
                {visibleColumns.map(col => (
                  <div
                    key={col.id}
                    className="flex items-center gap-3 px-2 py-2 hover:bg-slate-50 cursor-pointer rounded-lg text-xs font-bold text-slate-700 select-none"
                    onClick={() => onToggleColumn(col.id)}
                  >
                    {col.isVisible ? <MdCheckBox className="text-blue-600" size={16} /> : <MdCheckBoxOutlineBlank className="text-slate-400" size={16} />}
                    {col.label}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f8fafc] sticky top-0 z-10 border-b border-slate-200 shadow-sm">
              <tr>
                {visibleColumns.find(c => c.id === 'photo')?.isVisible && (
                  <th className="px-6 py-4 text-[11px] font-bold text-blue-900 uppercase tracking-wider">Photo</th>
                )}
                {visibleColumns.find(c => c.id === 'labId')?.isVisible && (
                  <th className="px-6 py-4 text-[11px] font-bold text-blue-900 uppercase tracking-wider">Lab ID</th>
                )}
                {visibleColumns.find(c => c.id === 'patientDetails')?.isVisible && (
                  <th className="px-6 py-4 text-[11px] font-bold text-blue-900 uppercase tracking-wider">Patient Details</th>
                )}
                {visibleColumns.find(c => c.id === 'refBy')?.isVisible && (
                  <th className="px-6 py-4 text-[11px] font-bold text-blue-900 uppercase tracking-wider">Referred By</th>
                )}
                {visibleColumns.find(c => c.id === 'testPanels')?.isVisible && (
                  <th className="px-6 py-4 text-[11px] font-bold text-blue-900 uppercase tracking-wider">Test Panels</th>
                )}
                {visibleColumns.find(c => c.id === 'verifiedBy')?.isVisible && (
                  <th className="px-6 py-4 text-[11px] font-bold text-blue-900 uppercase tracking-wider">Verified By</th>
                )}
                {visibleColumns.find(c => c.id === 'authorizedBy')?.isVisible && (
                  <th className="px-6 py-4 text-[11px] font-bold text-blue-900 uppercase tracking-wider">Authorized By</th>
                )}
                {visibleColumns.find(c => c.id === 'status')?.isVisible && (
                  <th className="px-6 py-4 text-[11px] font-bold text-blue-900 uppercase tracking-wider text-center">Status</th>
                )}
                {visibleColumns.find(c => c.id === 'action')?.isVisible && (
                  <th className="px-6 py-4 text-[11px] font-bold text-blue-900 uppercase tracking-wider text-center">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                  onClick={() => onEditReport(report)}
                >
                  {visibleColumns.find(c => c.id === 'photo')?.isVisible && (
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-blue-300 transition-colors">
                        {report.photo ? (
                          <img src={report.photo} alt={report.patientName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-slate-400 font-black text-xs uppercase">{report.patientName.charAt(0)}</div>
                        )}
                      </div>
                    </td>
                  )}
                  {visibleColumns.find(c => c.id === 'labId')?.isVisible && (
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 font-mono tracking-tight">{report.labNo}</td>
                  )}
                  {visibleColumns.find(c => c.id === 'patientDetails')?.isVisible && (
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 uppercase tracking-tight">{report.patientName}</span>
                        <span className="text-[11px] text-blue-800 font-bold uppercase tracking-wider">
                          {report.ageGender} • ID: {report.patientId}
                        </span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.find(c => c.id === 'refBy')?.isVisible && (
                    <td className="px-6 py-4 text-xs font-black text-blue-900 uppercase tracking-tighter leading-tight max-w-[150px] truncate" title={report.refBy}>
                      {report.refBy}
                    </td>
                  )}
                  {visibleColumns.find(c => c.id === 'testPanels')?.isVisible && (
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {report.tests.map((test, idx) => (
                          <span
                            key={idx}
                            className={`border px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest leading-none ${test.status === 'authorized' ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm' :
                              test.status === 'verified' ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' :
                                test.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  'bg-slate-50 text-slate-500 border-slate-200'
                              }`}
                          >
                            {test.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}
                  {visibleColumns.find(c => c.id === 'verifiedBy')?.isVisible && (
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[10px] font-black text-emerald-800 uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          {report.verifiedBy}
                        </span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.find(c => c.id === 'authorizedBy')?.isVisible && (
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[10px] font-black text-indigo-800 uppercase tracking-tighter bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {report.authorizedBy}
                        </span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.find(c => c.id === 'status')?.isVisible && (
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(report.status)} shadow-sm`}>
                        {getStatusIcon(report.status)}
                        {report.status}
                      </span>
                    </td>
                  )}
                  {visibleColumns.find(c => c.id === 'action')?.isVisible && (
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditReport(report);
                        }}
                        className="bg-slate-900 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
                      >
                        Open
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ReportEntry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [view, setView] = useState('list');
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]);
  const [toast, setToast] = useState(null);
  const [isMethodRemarksExpanded, setIsMethodRemarksExpanded] = useState(false);
  const inputRefs = useRef([]);

  // Sample Data with improved structure including comments and remarks
  const [reports, setReports] = useState([
    {
      id: 1,
      labNo: "041510228",
      patientId: "2863",
      patientName: "JAMUNA RAJKARNIKAR",
      ageGender: "53Y / F",
      mobile: "9851076760",
      photo: null,
      verifiedBy: "PRASAD MAHATO",
      authorizedBy: "DR. ASHOK",
      refBy: "DR. CHANDA SHRIVASTAVA",
      status: "Partially Entered",
      entryDate: "15/02/2026 10:30 AM",
      method: "Photometry",
      remarks: "Sample hemolyzed",
      remarksHistory: ["2026-02-15: Sample hemolyzed", "2026-02-14: Borderline result", "2026-02-13: Repeat test required"],
      tests: [
        {
          name: "VITAMIN B12",
          status: "pending",
          printed: false,
          results: [
            { name: "VITAMIN B12", result: "14.2", unit: "pg/mL", normalRange: "200-900", isHeader: false, comment: "Low range", remarks: "confirmed" },
          ]
        },
        {
          name: "CBC COMPLETE",
          status: "pending",
          printed: false,
          results: [
            { name: "HAEMOGLOBIN", result: "12.5", unit: "g/dl", normalRange: "13.5-17.5", isHeader: false, comment: "Normal range", remarks: "confirmed" },
            { name: "Total R.B.C.", result: "", unit: "mill/cumm", normalRange: "4.5-6.2", isHeader: false, comment: "", remarks: "" },
          ]
        }
      ]
    },
    {
      id: 2,
      labNo: "041510234",
      patientId: "8052",
      patientName: "SHANTI PANDIT",
      ageGender: "53Y / F",
      mobile: "9849896601",
      photo: null,
      verifiedBy: "SANTOSH KUMAR",
      authorizedBy: "DR. MEHTA",
      refBy: "Prof. Dr. DEEPAK PRAKASH MAHARA",
      status: "Partially Entered",
      entryDate: "16/02/2026 11:00 AM",
      method: "Enzymatic",
      remarks: "Borderline result",
      remarksHistory: ["2026-02-16: Borderline result", "2026-02-15: Sample lipemic"],
      tests: [
        {
          name: "VITAMIN B12",
          status: "pending",
          printed: false,
          results: [
            { name: "VITAMIN B12", result: "", unit: "pg/mL", normalRange: "200-900", isHeader: false, comment: "", remarks: "" },
          ]
        },
        {
          name: "LIPID PROFILE",
          status: "pending",
          printed: false,
          results: [
            { name: "Total Cholesterol", result: "220", unit: "mg/dl", normalRange: "< 200", isHeader: false, comment: "High cholesterol", remarks: "borderline" },
            { name: "Triglycerides", result: "180", unit: "mg/dl", normalRange: "< 150", isHeader: false, comment: "Elevated", remarks: "repeat" },
          ]
        }
      ]
    },
    {
      id: 3,
      labNo: "041510238",
      patientId: "81012632",
      patientName: "BISHNU KHATRI",
      ageGender: "42Y / M",
      mobile: "9813885905",
      photo: null,
      verifiedBy: "--",
      authorizedBy: "--",
      refBy: "Prof. Dr. UTTAM KUMAR SHARMA",
      status: "Authorized",
      entryDate: "16/02/2026 12:30 PM",
      method: "",
      remarks: "",
      remarksHistory: [],
      tests: [
        {
          name: "VITAMIN D",
          status: "authorized",
          printed: true,
          results: [
            { name: "25-HYDROXY VITAMIN D", result: "35", unit: "ng/mL", normalRange: "30-100", isHeader: false, comment: "Optimal", remarks: "confirmed" },
          ]
        },
        {
          name: "LIVER FUNCTION TEST",
          status: "pending",
          printed: false,
          results: [
            { name: "SGPT (ALT)", result: "", unit: "IU/L", normalRange: "7 - 56", isHeader: false, comment: "", remarks: "" }
          ]
        }
      ]
    }
  ]);

  const [patientListColumns, setPatientListColumns] = useState([
    { id: 'photo', label: 'Photo', isVisible: true },
    { id: 'labId', label: 'Lab ID', isVisible: true },
    { id: 'patientDetails', label: 'Patient Details', isVisible: true },
    { id: 'refBy', label: 'Referred By', isVisible: true },
    { id: 'testPanels', label: 'Test Panels', isVisible: true },
    { id: 'verifiedBy', label: 'Verified By', isVisible: true },
    { id: 'authorizedBy', label: 'Authorized By', isVisible: true },
    { id: 'status', label: 'Status', isVisible: true },
    { id: 'action', label: 'Action', isVisible: true }
  ]);

  // Get current active test
  const activeTest = useMemo(() => {
    if (!selectedReport || !selectedReport.activeTest) return null;
    return selectedReport.tests.find(t => t.name === selectedReport.activeTest);
  }, [selectedReport]);

  // Check if current test is locked (authorized)
  const isLocked = useMemo(() => {
    return activeTest?.status === 'authorized';
  }, [activeTest]);

  // Check if there are unsaved changes
  const [originalResults, setOriginalResults] = useState(null);
  const hasUnsavedChanges = useMemo(() => {
    if (!activeTest || !originalResults) return false;
    return JSON.stringify(activeTest.results) !== JSON.stringify(originalResults);
  }, [activeTest, originalResults]);

  // Show toast message
  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  // Handle edit report
  const handleEditReport = useCallback((report) => {
    // Deep copy the report
    const reportCopy = {
      ...report,
      tests: report.tests.map(test => ({
        ...test,
        results: test.results.map(result => ({ ...result }))
      }))
    };

    // Set active test to first pending, or first available
    const firstPending = reportCopy.tests.find(t => t.status === 'pending');
    const firstAvailable = reportCopy.tests[0];

    reportCopy.activeTest = firstPending?.name || firstAvailable?.name;
    setSelectedReport(reportCopy);

    // Store original results for change tracking
    if (firstPending || firstAvailable) {
      const activeResults = (firstPending || firstAvailable).results;
      setOriginalResults(JSON.parse(JSON.stringify(activeResults)));
    }

    setSelectedTests([]);
    setView('edit');
    inputRefs.current = [];
  }, []);

  // Handle incoming patient from Service Queue
  useEffect(() => {
    if (location.state?.labNo) {
      const patient = reports.find(r => r.labNo === location.state.labNo);
      if (patient) {
        handleEditReport(patient);
      }
    }
    // Only run on mount or when labNo changes to prevent loops
  }, [location.state?.labNo, handleEditReport]);


  // Handle result change
  const handleResultChange = (index, field, value) => {
    if (!selectedReport || !activeTest || isLocked) return;

    setSelectedReport(prev => {
      const newReport = { ...prev };
      const testIndex = newReport.tests.findIndex(t => t.name === activeTest.name);
      newReport.tests[testIndex].results[index][field] = value;
      return newReport;
    });
  };

  // Handle comment change
  const handleCommentChange = (index, field, value) => {
    if (!selectedReport || !activeTest || isLocked) return;

    setSelectedReport(prev => {
      const newReport = { ...prev };
      const testIndex = newReport.tests.findIndex(t => t.name === activeTest.name);
      newReport.tests[testIndex].results[index][field] = value;
      return newReport;
    });
  };

  // Handle remarks change
  const handleRemarkChange = (index, field, value) => {
    if (!selectedReport || !activeTest || isLocked) return;

    setSelectedReport(prev => {
      const newReport = { ...prev };
      const testIndex = newReport.tests.findIndex(t => t.name === activeTest.name);
      newReport.tests[testIndex].results[index][field] = value;
      return newReport;
    });
  };

  // Handle method change
  const handleMethodChange = (value) => {
    if (!selectedReport || isLocked) return;

    setSelectedReport(prev => ({
      ...prev,
      method: value
    }));
  };

  // Handle remarks change (global)
  const handleRemarksChange = (value) => {
    if (!selectedReport || isLocked) return;

    setSelectedReport(prev => ({
      ...prev,
      remarks: value,
      remarksHistory: [`${new Date().toLocaleDateString()}: ${value}`, ...(prev.remarksHistory || [])].slice(0, 10)
    }));
  };

  // Handle add new method
  const handleAddNewMethod = () => {
    if (!selectedReport || isLocked) return;

    const newMethod = prompt("Enter new method name:");
    if (newMethod && newMethod.trim()) {
      setSelectedReport(prev => ({
        ...prev,
        method: newMethod.trim()
      }));
      showToast(`New method added: ${newMethod}`, 'success');
    }
  };

  // Validate test results
  const validateTestResults = (test) => {
    const hasData = test.results.some(r => !r.isHeader && r.result && r.result.trim() !== '');
    if (!hasData) {
      showToast('Cannot save empty test. Please enter at least one result.', 'error');
      return false;
    }
    return true;
  };

  // Handle save
  const handleSave = useCallback(() => {
    if (!activeTest) return;
    if (!validateTestResults(activeTest)) return;

    setSelectedReport(prev => {
      const newReport = { ...prev };
      const testIndex = newReport.tests.findIndex(t => t.name === activeTest.name);
      newReport.tests[testIndex].status = 'completed';

      // Update overall report status
      const hasPending = newReport.tests.some(t => t.status === 'pending');
      newReport.status = hasPending ? 'Partially Entered' : 'Entry Complete';

      return newReport;
    });

    // Update original results
    setOriginalResults(JSON.parse(JSON.stringify(activeTest.results)));
    showToast('Test saved successfully', 'success');
  }, [activeTest]);

  // Handle verify
  const handleVerify = useCallback(() => {
    if (!activeTest) return;
    if (!validateTestResults(activeTest)) return;

    setSelectedReport(prev => {
      const newReport = { ...prev };
      const testIndex = newReport.tests.findIndex(t => t.name === activeTest.name);
      newReport.tests[testIndex].status = 'verified';
      return newReport;
    });

    showToast('Test verified successfully', 'success');
  }, [activeTest]);

  // Handle authorize
  const handleAuthorize = useCallback(() => {
    if (!activeTest) return;

    if (!window.confirm('Are you sure you want to AUTHORIZE this report? This action is final.')) {
      return;
    }

    if (!validateTestResults(activeTest)) return;

    setSelectedReport(prev => {
      const newReport = { ...prev };
      const testIndex = newReport.tests.findIndex(t => t.name === activeTest.name);
      newReport.tests[testIndex].status = 'authorized';
      return newReport;
    });

    showToast('Test authorized successfully', 'success');
  }, [activeTest]);

  // Handle Retest
  const handleRetest = useCallback(() => {
    if (!activeTest) return;

    if (!window.confirm(`Are you sure you want to RETEST "${activeTest.name}"? All entered results for this panel will be cleared.`)) {
      return;
    }

    setSelectedReport(prev => {
      const newReport = { ...prev };
      const testIndex = newReport.tests.findIndex(t => t.name === activeTest.name);

      // Clear results
      newReport.tests[testIndex].results = newReport.tests[testIndex].results.map(r => ({
        ...r,
        result: ""
      }));
      newReport.tests[testIndex].status = 'pending';
      newReport.tests[testIndex].printed = false;

      return newReport;
    });

    showToast(`${activeTest.name} set for retest`, 'success');
  }, [activeTest]);

  // Handle Cancel
  const handleCancel = useCallback(() => {
    if (!activeTest) return;

    const reason = prompt(`Enter reason for cancelling "${activeTest.name}":`);
    if (reason === null) return; // Cancelled prompt
    if (!reason.trim()) {
      showToast('Cancellation reason is required', 'error');
      return;
    }

    setSelectedReport(prev => {
      const newReport = { ...prev };
      const testIndex = newReport.tests.findIndex(t => t.name === activeTest.name);
      newReport.tests[testIndex].status = 'cancelled';
      newReport.tests[testIndex].cancellationReason = reason;
      return newReport;
    });

    showToast(`${activeTest.name} cancelled`, 'success');
  }, [activeTest]);

  // Handle print
  const handlePrint = (withHeader = true) => {
    if (!activeTest) return;
    if (activeTest.status !== 'authorized') {
      showToast('Cannot print unauthorized test', 'error');
      return;
    }

    showToast(`Printing ${activeTest.name} ${withHeader ? 'with' : 'without'} header`, 'success');

    // Mark as printed
    setSelectedReport(prev => {
      const newReport = { ...prev };
      const testIndex = newReport.tests.findIndex(t => t.name === activeTest.name);
      newReport.tests[testIndex].printed = true;
      return newReport;
    });
  };

  // Handle print selected tests
  const handlePrintSelected = () => {
    if (selectedTests.length === 0) {
      showToast('No tests selected', 'error');
      return;
    }

    const unauthorized = selectedTests.filter(testName => {
      const test = selectedReport.tests.find(t => t.name === testName);
      return test?.status !== 'authorized';
    });

    if (unauthorized.length > 0) {
      showToast(`Cannot print unauthorized tests: ${unauthorized.join(', ')}`, 'error');
      return;
    }

    showToast(`Printing: ${selectedTests.join(', ')}`, 'success');

    // Mark as printed
    setSelectedReport(prev => {
      const newReport = { ...prev };
      selectedTests.forEach(testName => {
        const testIndex = newReport.tests.findIndex(t => t.name === testName);
        if (testIndex >= 0) newReport.tests[testIndex].printed = true;
      });
      return newReport;
    });

    setSelectedTests([]);
  };

  // Handle test selection
  const handleTestSelect = useCallback((testName) => {
    setSelectedReport(prev => {
      if (!prev) return prev;
      const test = prev.tests.find(t => t.name === testName);
      if (test) {
        setOriginalResults(JSON.parse(JSON.stringify(test.results)));
      }
      return {
        ...prev,
        activeTest: testName
      };
    });
    inputRefs.current = [];
  }, []);

  // Handle test toggle for printing
  const handleTestToggle = (testName) => {
    setSelectedTests(prev =>
      prev.includes(testName)
        ? prev.filter(t => t !== testName)
        : [...prev, testName]
    );
  };

  // Handle navigation
  const handlePrevTest = useCallback(() => {
    if (!selectedReport) return;
    const testNames = selectedReport.tests.map(t => t.name);
    const currentIndex = testNames.indexOf(selectedReport.activeTest);
    if (currentIndex > 0) {
      handleTestSelect(testNames[currentIndex - 1]);
    }
  }, [selectedReport, handleTestSelect]);

  const handleNextTest = useCallback(() => {
    if (!selectedReport) return;
    const testNames = selectedReport.tests.map(t => t.name);
    const currentIndex = testNames.indexOf(selectedReport.activeTest);
    if (currentIndex < testNames.length - 1) {
      handleTestSelect(testNames[currentIndex + 1]);
    }
  }, [selectedReport, handleTestSelect]);

  const handleExit = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to exit?")) {
        return;
      }
    }

    if (location.state?.labNo) {
      navigate("/Home/ServiceQueue");
    } else {
      setView("list");
      setSelectedReport(null);
      setSelectedTests([]);
    }
  };

  // Table Level Navigation (Vertical & Horizontal)
  const handleTableKeyDown = useCallback((e, rowIndex, colIndex) => {
    if (isLocked) return;

    const rowCount = activeTest?.results.length || 0;
    const colCount = 3; // 0: Result, 1: Comment, 2: Remarks

    const moveFocus = (r, c) => {
      let targetRow = r;
      if (targetRow < 0) targetRow = 0;
      if (targetRow >= rowCount) targetRow = rowCount - 1;

      // Skip headers when moving vertically
      const step = r > rowIndex ? 1 : -1;
      while (targetRow >= 0 && targetRow < rowCount && activeTest.results[targetRow].isHeader) {
        if (targetRow + step < 0 || targetRow + step >= rowCount) break;
        targetRow += step;
      }

      if (targetRow >= 0 && targetRow < rowCount && !activeTest.results[targetRow].isHeader) {
        const targetId = `row-${targetRow}-col-${c}`;
        const el = document.getElementById(targetId);
        if (el) {
          el.focus();
          if (el.tagName === 'INPUT') el.select();
        }
      }
    };

    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      moveFocus(rowIndex + 1, colIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveFocus(rowIndex - 1, colIndex);
    } else if (e.key === 'ArrowRight' && !e.ctrlKey) {
      const isAtEnd = e.target.tagName === 'SELECT' || e.target.selectionStart === e.target.value.length;
      if (isAtEnd && colIndex < colCount - 1) {
        e.preventDefault();
        moveFocus(rowIndex, colIndex + 1);
      }
    } else if (e.key === 'ArrowLeft' && !e.ctrlKey) {
      const isAtStart = e.target.tagName === 'SELECT' || e.target.selectionStart === 0;
      if (isAtStart && colIndex > 0) {
        e.preventDefault();
        moveFocus(rowIndex, colIndex - 1);
      }
    }
  }, [activeTest, isLocked]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (view !== 'edit') return;

      // Save: Ctrl+S
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (!isLocked) handleSave();
        return;
      }

      // Exit: Escape
      if (e.key === 'Escape') {
        handleExit();
        return;
      }

      // Panel Navigation: Arrow keys (only if not typing or if Ctrl is held)
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
      if (!isTyping || e.ctrlKey) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevTest();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextTest();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [view, isLocked, handleSave, handlePrevTest, handleNextTest, handleExit]);

  // Update reports list when selected report changes
  useEffect(() => {
    if (selectedReport) {
      setReports(prev =>
        prev.map(r => r.id === selectedReport.id ? selectedReport : r)
      );
    }
  }, [selectedReport]);

  const togglePatientListColumn = (colId) => {
    setPatientListColumns(prev =>
      prev.map(c => c.id === colId ? { ...c, isVisible: !c.isVisible } : c)
    );
  };

  return (
    <div className="h-full w-full bg-slate-100 overflow-hidden relative">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {view === 'list' ? (
        <ListView
          reports={reports}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEditReport={handleEditReport}
          visibleColumns={patientListColumns}
          onToggleColumn={togglePatientListColumn}
        />
      ) : (
        selectedReport && (
          <div className="h-full flex flex-col bg-[#e2e8f0]">
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 px-4 py-2 flex items-center justify-between border-b border-slate-400 shadow-sm select-none">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleExit}
                  className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-all text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm"
                >
                  <MdChevronLeft size={16} /> Back to List
                </button>
                <div className="h-5 w-px bg-slate-300"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Workspace: Report Entry
                </span>
              </div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
              </span>
            </div>

            <div className="flex-1 flex overflow-hidden p-2 gap-2">
              {/* Sidebar */}
              <TestSidebar
                tests={selectedReport.tests}
                activeTest={selectedReport.activeTest}
                onTestSelect={handleTestSelect}
                onPrintBarcode={() => setShowBarcodeModal(true)}
                onPrintSelected={handlePrintSelected}
                selectedTests={selectedTests}
                onTestToggle={handleTestToggle}
              />

              {/* Main Content */}
              <div className="flex-1 bg-[#f1f5f9] border-2 border-slate-300 flex flex-col shadow-md overflow-hidden rounded-xl">
                {/* Patient Header */}
                <PatientInfoHeader
                  patient={selectedReport}
                  labNo={selectedReport.labNo}
                />

                {/* Method & Remarks Section (Expandable) */}
                <MethodRemarksSection
                  method={selectedReport.method}
                  remarks={selectedReport.remarks}
                  remarksHistory={selectedReport.remarksHistory}
                  onMethodChange={handleMethodChange}
                  onRemarksChange={handleRemarksChange}
                  onAddNewMethod={handleAddNewMethod}
                  isExpanded={isMethodRemarksExpanded}
                  onToggleExpand={() => setIsMethodRemarksExpanded(!isMethodRemarksExpanded)}
                  isLocked={isLocked}
                />

                {/* Test Header */}
                <div className="bg-slate-200 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-blue-900 border-y border-slate-300 flex justify-between items-center">
                  <span>Active Panel: {selectedReport.activeTest}</span>
                  {isLocked && (
                    <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1">
                      <MdVerified /> AUTHORIZED
                    </span>
                  )}
                  {activeTest?.status === 'verified' && !isLocked && (
                    <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1">
                      <MdFactCheck /> VERIFIED
                    </span>
                  )}
                  {activeTest?.status === 'completed' && !isLocked && activeTest?.status !== 'verified' && (
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1">
                      <MdSave /> COMPLETED
                    </span>
                  )}
                </div>

                {/* Results Table */}
                <div className="flex-1 bg-white overflow-auto">
                  {activeTest && (
                    <TestResultsTable
                      results={activeTest.results}
                      isLocked={isLocked || activeTest.status === 'cancelled'}
                      testStatus={activeTest.status}
                      onResultChange={handleResultChange}
                      onCommentChange={handleCommentChange}
                      onRemarkChange={handleRemarkChange}
                      onKeyDown={handleTableKeyDown}
                    />
                  )}
                </div>

                {/* Action Bar */}
                <ActionBar
                  isLocked={isLocked}
                  testCount={activeTest?.results.filter(r => !r.isHeader).length || 0}
                  hasUnsavedData={hasUnsavedChanges}
                  testStatus={activeTest?.status}
                  onSave={handleSave}
                  onVerify={handleVerify}
                  onAuthorize={handleAuthorize}
                  onRetest={handleRetest}
                  onCancel={handleCancel}
                  onPrint={() => handlePrint(true)}
                  onPrintNoHeader={() => handlePrint(false)}
                  onPrevTest={handlePrevTest}
                  onNextTest={handleNextTest}
                  onExit={handleExit}
                />
              </div>
            </div>

            {/* Barcode Modal */}
            <BarcodeModal
              isOpen={showBarcodeModal}
              onClose={() => setShowBarcodeModal(false)}
              patient={selectedReport}
              labNo={selectedReport.labNo}
              testName={selectedReport.activeTest}
              onPrint={() => showToast('Printing barcode...', 'success')}
            />
          </div>
        )
      )}
    </div>
  );
};

export default ReportEntry;