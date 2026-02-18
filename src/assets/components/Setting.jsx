import React, { useState, useEffect } from 'react';
import {
  MdPeople,
  MdBiotech,
  MdDescription,
  MdPercent,
  MdSettingsEthernet,
  MdAdd,
  MdSearch,
  MdSecurity,
  MdAdminPanelSettings,
  MdOutlineSave,
  MdEdit,
  MdDelete,
  MdOutlineViewModule,
  MdOutlineViewDay,
  MdClose,
  MdCheck,
  MdWarning,
  MdInfo,
  MdRefresh,
  MdDownload,
  MdUpload,
  MdMoreVert,
  MdFilterList,
  MdSort,
  MdVisibility,
  MdLock,
  MdLockOpen,
  MdHistory,
  MdCloudDone,
  MdCloudOff,
  MdPrint,
  MdShare,
  MdArchive,
  MdRestore,
  MdCopyAll,
  MdContentPaste,
  MdSettings,
  MdDashboard,
  MdNotifications,
  MdHelp,
  MdLogout,
  MdPerson,
  MdVpnKey,
  MdFingerprint,
  MdQrCodeScanner,
  MdBarChart,
  MdTimeline,
  MdAssessment,
  MdBackup,
  MdUpdate,
  MdVerified,
  MdError,
  MdCheckCircle,
  MdCancel,
  MdSchedule,
  MdCalendarToday,
  MdAccessTime,
  MdAttachMoney,
  MdTrendingUp,
  MdOutlineCloudDownload,
  MdOutlineCloudUpload,
  MdOutlineSync,
  MdOutlineSyncProblem,
  MdOutlineSyncDisabled,
  MdOutlineSyncLock,
  MdOutlineCloudSync,
  MdOutlineCloudQueue,
  MdOutlineCloudCircle,
  MdOutlineCloudDone as MdOutlineCloudDoneIcon,
  MdOutlineCloudOff as MdOutlineCloudOffIcon,
  MdDraw,
  MdTune,
  MdLayers,
  MdQrCode,
  MdOutlineBurstMode
} from 'react-icons/md';

const Setting = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('user');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('active'); // 'active', 'syncing', 'error', 'offline'
  const [lastSync, setLastSync] = useState(new Date().toISOString());
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [dismissedTour, setDismissedTour] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [showSystemStatus, setShowSystemStatus] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    cpu: 45,
    memory: 62,
    storage: 38,
    uptime: '15d 7h',
    version: '2.3.1',
    lastBackup: '2024-01-15 03:00',
    nextBackup: '2024-01-16 03:00'
  });

  const tabs = [
    { id: 'user', label: 'User & Roles', icon: <MdPeople size={20} />, description: 'Access Control' },
    { id: 'dept', label: 'Departments', icon: <MdSecurity size={20} />, description: 'Lab Sections' },
    { id: 'test', label: 'Test Setup', icon: <MdBiotech size={20} />, description: 'Assay Mapping' },
    { id: 'design', label: 'Report Design', icon: <MdDescription size={20} />, description: 'Templates' },
    { id: 'analytics', label: 'Analytics', icon: <MdBarChart size={20} />, description: 'Revenue & TAT' },
    { id: 'fraction', label: 'Fraction', icon: <MdPercent size={20} />, description: 'Referral Shares' },
    { id: 'machine', label: 'Integration', icon: <MdSettingsEthernet size={20} />, description: 'LIS / Machine' },
  ];

  // Data States
  const [users, setUsers] = useState([
    { id: 1, name: 'Dr. Ashok Sharma', role: 'Pathologist', department: 'Pathology', email: 'ashok.sharma@hospital.com', status: 'active', lastLogin: '2024-01-15T10:30:00', mfa: true, permissions: ['admin', 'reports', 'users'], signature: 'sig_ashok.png' },
    { id: 2, name: 'Prasad Mahato', role: 'Lab Technician', department: 'Hematology', email: 'prasad.mahato@hospital.com', status: 'active', lastLogin: '2024-01-15T09:15:00', mfa: false, permissions: ['tests', 'results'], signature: 'sig_prasad.png' },
    { id: 3, name: 'Sita Kumari', role: 'Front Desk', department: 'Reception', email: 'sita.kumari@hospital.com', status: 'away', lastLogin: '2024-01-14T16:45:00', mfa: false, permissions: ['registration', 'billing'], signature: null },
    { id: 4, name: 'Dr. Rajesh Gupta', role: 'Microbiologist', department: 'Microbiology', email: 'rajesh.gupta@hospital.com', status: 'active', lastLogin: '2024-01-15T08:30:00', mfa: true, permissions: ['admin', 'culture', 'sensitivity'], signature: 'sig_rajesh.png' },
    { id: 5, name: 'Priya Singh', role: 'Lab Manager', department: 'Administration', email: 'priya.singh@hospital.com', status: 'active', lastLogin: '2024-01-15T08:00:00', mfa: true, permissions: ['all'], signature: 'sig_priya.png' }
  ]);

  const [tests, setTests] = useState([
    { id: 1, name: 'CBC / Hemogram', code: 'CBC001', dept: 'Hematology', rate: 450, cost: 200, profit: 250, margin: 55.6, parameters: 25, turnaround: '4 hours', assayCode: 'CBC_MOD_1', active: true },
    { id: 2, name: 'Lipid Profile', code: 'LIP002', dept: 'Biochemistry', rate: 800, cost: 350, profit: 450, margin: 56.3, parameters: 8, turnaround: '6 hours', assayCode: 'LIPID_XP', active: true },
    { id: 3, name: 'Thyroid Panel', code: 'THY003', dept: 'Immunology', rate: 1200, cost: 500, profit: 700, margin: 58.3, parameters: 5, turnaround: '8 hours', assayCode: 'T3T4_M', active: true },
    { id: 4, name: 'RFT / Renal Function', code: 'RFT004', dept: 'Biochemistry', rate: 650, cost: 280, profit: 370, margin: 56.9, parameters: 12, turnaround: '5 hours', assayCode: 'KIDNEY_1', active: true },
    { id: 5, name: 'LFT / Liver Function', code: 'LFT005', dept: 'Biochemistry', rate: 750, cost: 320, profit: 430, margin: 57.3, parameters: 15, turnaround: '6 hours', assayCode: 'LIVER_A2', active: true }
  ]);

  const [departments, setDepartments] = useState([
    { id: 1, name: 'Hematology', code: 'HEM', hod: 'Dr. Prasad', status: 'active', tests: 45 },
    { id: 2, name: 'Biochemistry', code: 'BIO', hod: 'Dr. Sharma', status: 'active', tests: 120 },
    { id: 3, name: 'Microbiology', code: 'MIC', hod: 'Dr. Gupta', status: 'active', tests: 85 },
    { id: 4, name: 'Immunology', code: 'IMM', hod: 'Dr. Singh', status: 'active', tests: 30 }
  ]);

  const [reports, setReports] = useState([
    {
      id: 1,
      name: 'Hematology Standard',
      template: 'standard',
      header: 'hospital_logo.png',
      footer: 'standard_footer.png',
      margins: { top: 20, bottom: 20, left: 15, right: 15 },
      watermark: false,
      qrCode: true,
      barcode: true,
      signatures: {
        left: { active: true, label: 'Verified by', user: 'Pradeep Giri', role: 'Med Lab Technician', nhpcNo: 'NHPC No. 8-8130 MLT' },
        centerLeft: { active: false, label: 'Analyzed by', user: '', role: '', nhpcNo: '' },
        center: { active: false, label: 'Checked by', user: '', role: '', nhpcNo: '' },
        centerRight: { active: false, label: 'Reviewed by', user: '', role: '', nhpcNo: '' },
        right: { active: true, label: 'Approved by', user: 'Dr. Ashok Sharma', role: 'Pathologist', nhpcNo: 'PMC No. 12345' }
      }
    },
    {
      id: 2,
      name: 'Biochemistry Compact',
      template: 'compact',
      header: 'hospital_logo.png',
      footer: 'compact_footer.png',
      margins: { top: 15, bottom: 15, left: 10, right: 10 },
      watermark: false,
      qrCode: true,
      barcode: false,
      signatures: {
        left: { active: true, label: 'Technician', user: 'Suman Thapa', role: 'Lab Asst.', nhpcNo: 'NHPC 456' },
        centerLeft: { active: false, label: '', user: '', role: '', nhpcNo: '' },
        center: { active: false, label: '', user: '', role: '', nhpcNo: '' },
        centerRight: { active: false, label: '', user: '', role: '', nhpcNo: '' },
        right: { active: true, label: 'Pathologist', user: 'Dr. Rajesh Gupta', role: 'MD Pathology', nhpcNo: 'PMC 789' }
      }
    }
  ]);

  const [fractions, setFractions] = useState([
    { id: 1, name: 'Dr. Sharma Referral', type: 'doctor', share: 30, minAmount: 0, maxAmount: 10000, active: true },
    { id: 2, name: 'Hospital Network', type: 'corporate', share: 25, minAmount: 1000, maxAmount: 50000, active: true },
    { id: 3, name: 'Lab Partner', type: 'lab', share: 40, minAmount: 0, maxAmount: 0, active: false }
  ]);

  const [machines, setMachines] = useState([
    { id: 1, name: 'Hematology Analyzer XT-4000', type: 'hematology', ip: '192.168.1.100', port: 8080, protocol: 'HL7', status: 'online', lastConnection: '2024-01-15T10:45:00' },
    { id: 2, name: 'Chemistry Analyzer AU-680', type: 'chemistry', ip: '192.168.1.101', port: 8081, protocol: 'LIS2', status: 'online', lastConnection: '2024-01-15T10:44:00' },
    { id: 3, name: 'Immunology Analyzer i2000', type: 'immunology', ip: '192.168.1.102', port: 8082, protocol: 'ASTM', status: 'offline', lastConnection: '2024-01-14T23:15:00' }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, user: 'admin@hospital.com', action: 'User Created', target: 'Dr. Ashok Sharma', timestamp: '2024-01-15T10:30:00', ip: '192.168.1.50' },
    { id: 2, user: 'admin@hospital.com', action: 'Test Updated', target: 'CBC / Hemogram', timestamp: '2024-01-15T09:45:00', ip: '192.168.1.50' },
    { id: 3, user: 'labmanager@hospital.com', action: 'Report Generated', target: 'Report #12345', timestamp: '2024-01-15T08:30:00', ip: '192.168.1.51' }
  ]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        handleAddNew();
      }
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        handleExport();
      }
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        handleImport();
      }
      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        setShowHelp(true);
      }
      if (e.key === 'Escape') {
        setShowModal(false);
        setShowDeleteConfirm(false);
        setShowNotifications(false);
        setShowUserMenu(false);
        setShowFilters(false);
        setShowExportModal(false);
        setShowImportModal(false);
        setShowHistoryModal(false);
        setShowAuditLog(false);
        setShowSettings(false);
        setShowHelp(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (hasUnsavedChanges()) {
        handleAutoSave();
      }
    }, 30000);

    return () => clearInterval(autoSave);
  }, []);

  // Sync status simulation
  useEffect(() => {
    const syncInterval = setInterval(() => {
      setSyncStatus(prev => {
        if (prev === 'active') return 'syncing';
        if (prev === 'syncing') {
          setLastSync(new Date().toISOString());
          return 'active';
        }
        return prev;
      });
    }, 30000);

    return () => clearInterval(syncInterval);
  }, []);

  // Notification simulation
  useEffect(() => {
    const notificationInterval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        type: 'info',
        message: 'System health check completed successfully',
        timestamp: new Date().toISOString(),
        read: false
      };
      setNotifications(prev => [newNotification, ...prev].slice(0, 10));
    }, 60000);

    return () => clearInterval(notificationInterval);
  }, []);

  // Helper Functions
  const hasUnsavedChanges = () => {
    // Implement actual unsaved changes detection
    return false;
  };

  const handleAutoSave = () => {
    console.log('Auto-saving...');
    setSuccessMessage('Changes auto-saved');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddNew = () => {
    setModalType('add');
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalType('edit');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // Implement delete logic
    setShowDeleteConfirm(false);
    setSuccessMessage(`${selectedItem.name} deleted successfully`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSave = () => {
    // Implement save logic
    setSuccessMessage('Changes saved successfully');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setShowModal(false);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleImport = () => {
    setShowImportModal(true);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Data refreshed');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('active');
      setLastSync(new Date().toISOString());
      setSuccessMessage('Sync completed');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  const handleBulkAction = (action) => {
    // Implement bulk actions
    setShowBulkActions(false);
    setSelectedRows([]);
  };

  const handleRowSelect = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentItems = activeTab === 'user' ? users :
      activeTab === 'test' ? tests :
        activeTab === 'reports' ? reports :
          activeTab === 'fraction' ? fractions :
            machines;
    setSelectedRows(
      selectedRows.length === currentItems.length ? [] : currentItems.map(item => item.id)
    );
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleFilter = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setShowFilters(false);
  };

  const handleTourNext = () => {
    if (tourStep < 5) {
      setTourStep(tourStep + 1);
    } else {
      setShowTour(false);
      setDismissedTour(true);
    }
  };

  const handleTourPrev = () => {
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  const handleTourSkip = () => {
    setShowTour(false);
    setDismissedTour(true);
  };

  const handleFeedbackSubmit = () => {
    // Submit feedback
    setShowFeedback(false);
    setFeedbackText('');
    setFeedbackRating(0);
    setSuccessMessage('Thank you for your feedback!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Enhanced UserManagement Component
  const UserManagement = () => (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">User / Role Management</h2>
          <p className="text-slate-500 text-sm font-medium">Control module access and hospital staff privileges</p>
        </div>
        <button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95">
          <MdAdd size={18} /> Create Staff Account
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Lookup user or role..."
              className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white outline-none focus:ring-2 focus:ring-blue-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 text-slate-400">
            <MdFilterList className="cursor-pointer hover:text-blue-500" />
            <MdDownload className="cursor-pointer hover:text-blue-500" />
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-[#f8fafc] border-b border-slate-200">
            <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <th className="px-6 py-2.5">Staff Identity</th>
              <th className="px-6 py-2.5">Assigned Role</th>
              <th className="px-6 py-2.5">Department</th>
              <th className="px-6 py-2.5">Access Status</th>
              <th className="px-6 py-2.5">MFA</th>
              <th className="px-6 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-blue-50/20 transition-all text-sm">
                <td className="px-6 py-1.5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-black text-[10px]">
                      {user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-[13px]">{user.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-1.5">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-tighter border border-slate-200">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-1.5 text-[11px] font-black text-blue-900/60 uppercase">{user.department}</td>
                <td className="px-6 py-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    <span className="text-[10px] font-black text-slate-600 uppercase italic">{user.status}</span>
                  </div>
                </td>
                <td className="px-6 py-1.5">
                  <span className={`text-[10px] font-black uppercase ${user.mfa ? 'text-emerald-600' : 'text-slate-300'}`}>
                    {user.mfa ? 'Verified' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-1.5 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button onClick={() => handleEdit(user)} className="text-slate-400 hover:text-blue-600 p-1"><MdEdit size={16} /></button>
                    <button className="text-slate-400 hover:text-indigo-600 p-1"><MdSecurity size={16} /></button>
                    <button onClick={() => handleDelete(user)} className="text-slate-400 hover:text-rose-500 p-1"><MdDelete size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Enhanced TestSetup Component
  const TestSetup = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Test Setup</h2>
          <p className="text-slate-500 text-sm font-medium">Configure test parameters, normal ranges, and pricing</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all w-64"
            />
          </div>
          <button
            onClick={handleExport}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
            title="Export"
          >
            <MdDownload size={20} />
          </button>
          <button
            onClick={handleImport}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
            title="Import"
          >
            <MdUpload size={20} />
          </button>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all ${isLoading ? 'animate-spin' : ''}`}
            title="Refresh"
          >
            <MdRefresh size={20} />
          </button>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95"
          >
            <MdAdd size={18} /> New Test
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-bold">Total Tests</p>
          <p className="text-2xl font-black text-slate-800">{tests.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-bold">Active Tests</p>
          <p className="text-2xl font-black text-emerald-600">{tests.filter(t => t.active).length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-bold">Avg Turnaround</p>
          <p className="text-2xl font-black text-slate-800">5.8 hrs</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-bold">Total Revenue</p>
          <p className="text-2xl font-black text-blue-600">NPR 4,543</p>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.length === tests.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-slate-700 text-blue-600"
                />
              </th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest cursor-pointer" onClick={() => handleSort('name')}>
                Test / Panel Name
              </th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest cursor-pointer" onClick={() => handleSort('code')}>
                Code
              </th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest">Assay / Machine ID</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-right">Rate (Rs)</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest">Dept</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-center">TAT</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest">Status</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tests
              .filter(test =>
                test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                test.code.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((test) => (
                <tr key={test.id} className="hover:bg-blue-50/30 transition-colors border-b border-slate-50">
                  <td className="px-6 py-1.5">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(test.id)}
                      onChange={() => handleRowSelect(test.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600"
                    />
                  </td>
                  <td className="px-6 py-1.5">
                    <span className="font-bold text-slate-800 text-xs">{test.name}</span>
                  </td>
                  <td className="px-6 py-1.5">
                    <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">{test.code}</span>
                  </td>
                  <td className="px-6 py-1.5">
                    <span className="font-black text-amber-600 text-[10px] uppercase tracking-tighter">{test.assayCode}</span>
                  </td>
                  <td className="px-6 py-1.5 text-right font-black text-slate-700 text-xs">Rs. {test.rate}</td>
                  <td className="px-6 py-1.5 uppercase font-bold text-slate-400 text-[10px]">{test.dept}</td>
                  <td className="px-6 py-1.5 text-center text-[10px] font-bold text-slate-500">{test.turnaround}</td>
                  <td className="px-6 py-1.5">
                    <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${test.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-200'
                      }`}>
                      {test.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-1.5 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => handleEdit(test)} className="text-slate-400 hover:text-blue-600 p-1"><MdEdit size={14} /></button>
                      <button onClick={() => handleDelete(test)} className="text-slate-400 hover:text-rose-500 p-1"><MdDelete size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Enhanced ReportSettings Component
  const ReportSettings = () => {
    const [selectedReport, setSelectedReport] = useState(reports[0]);
    const [previewMode, setPreviewMode] = useState('desktop');

    const signaturePositions = [
      { id: 'left', label: 'Left Slot' },
      { id: 'centerLeft', label: 'Center Left Slot' },
      { id: 'center', label: 'Center Slot' },
      { id: 'centerRight', label: 'Center Right Slot' },
      { id: 'right', label: 'Right Slot' }
    ];

    const handleSignatureToggle = (pos) => {
      setSelectedReport(prev => ({
        ...prev,
        signatures: {
          ...prev.signatures,
          [pos]: { ...prev.signatures[pos], active: !prev.signatures[pos].active }
        }
      }));
    };

    const handleSignatureFieldChange = (pos, field, value) => {
      setSelectedReport(prev => ({
        ...prev,
        signatures: {
          ...prev.signatures,
          [pos]: { ...prev.signatures[pos], [field]: value }
        }
      }));
    };

    return (
      <div className="animate-in fade-in duration-500 max-h-[calc(100vh-140px)] overflow-hidden">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">Report Designer</h2>
            <p className="text-slate-500 text-[9px] font-medium uppercase tracking-widest">Multi-Signature & Layout Config</p>
          </div>
          <div className="flex gap-1">
            {['desktop', 'print'].map(mode => (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode)}
                className={`p-1.5 rounded-lg border flex items-center gap-1.5 text-[8px] font-black uppercase transition-all ${previewMode === mode ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                  }`}
              >
                {mode === 'desktop' ? <MdOutlineViewModule size={12} /> : <MdPrint size={12} />}
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Template Quick Selection - Micro */}
        <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1 invisible-scrollbar">
          {reports.map(report => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className={`px-3 py-1 rounded-md border text-[9px] font-black uppercase tracking-tighter cursor-pointer transition-all whitespace-nowrap ${selectedReport.id === report.id
                ? 'bg-slate-800 border-slate-800 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-400 hover:border-blue-300'
                }`}
            >
              {report.name}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 h-[calc(100vh-220px)] overflow-hidden">
          {/* Config Panel */}
          <div className="xl:col-span-4 space-y-3 overflow-y-auto pr-1 custom-scrollbar pb-10">
            {/* Signature Slots */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-800 px-3 py-1 flex justify-between items-center">
                <span className="text-white text-[9px] font-black uppercase tracking-widest">Signatures</span>
                <span className="text-[8px] text-blue-400 font-bold">5 ACTIVE</span>
              </div>
              <div className="p-2 space-y-1.5">
                {signaturePositions.map((pos) => (
                  <div key={pos.id} className={`p-2 rounded-lg border transition-all ${selectedReport.signatures[pos.id]?.active ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-25/30 border-slate-100 opacity-60'}`}>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 accent-blue-600 rounded"
                          checked={selectedReport.signatures[pos.id]?.active}
                          onChange={() => handleSignatureToggle(pos.id)}
                        />
                        <span className="text-[9px] font-black text-slate-800 uppercase tracking-tight">{pos.label}</span>
                      </label>
                      {selectedReport.signatures[pos.id]?.active && (
                        <input
                          type="text"
                          value={selectedReport.signatures[pos.id].user}
                          onChange={(e) => handleSignatureFieldChange(pos.id, 'user', e.target.value)}
                          className="text-[8px] font-bold p-1 border border-slate-200 rounded w-28 bg-white"
                          placeholder="Staff Name"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assets */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="h-12 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center bg-slate-50 hover:border-blue-400 text-slate-400 transition-all cursor-pointer">
                  <MdUpload size={12} />
                  <span className="text-[7px] font-black uppercase mt-0.5">Header</span>
                </div>
                <div className="h-12 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center bg-slate-50 hover:border-blue-400 text-slate-400 transition-all cursor-pointer">
                  <MdUpload size={12} />
                  <span className="text-[7px] font-black uppercase mt-0.5">Footer</span>
                </div>
              </div>
            </div>

            {/* Layout */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest block mb-1">Margins (mm)</label>
                  <div className="grid grid-cols-4 gap-0.5">
                    {['top', 'bottom', 'left', 'right'].map(dir => (
                      <input
                        key={dir}
                        type="number"
                        value={selectedReport.margins[dir]}
                        onChange={(e) => setSelectedReport({ ...selectedReport, margins: { ...selectedReport.margins, [dir]: parseInt(e.target.value) } })}
                        className="w-full text-[8px] font-black p-0.5 bg-slate-50 border border-slate-200 rounded text-center outline-none focus:border-blue-500"
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={selectedReport.qrCode} onChange={(e) => setSelectedReport({ ...selectedReport, qrCode: e.target.checked })} className="w-2.5 h-2.5 accent-blue-600 rounded" />
                    <span className="text-[8px] font-bold text-slate-500 uppercase">QR</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={selectedReport.barcode} onChange={(e) => setSelectedReport({ ...selectedReport, barcode: e.target.checked })} className="w-2.5 h-2.5 accent-blue-600 rounded" />
                    <span className="text-[8px] font-bold text-slate-500 uppercase">Bar</span>
                  </label>
                </div>
              </div>
              <button onClick={handleSave} className="w-full bg-slate-800 text-white py-1.5 rounded-lg font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-md">
                <MdOutlineSave size={12} /> Deploy Configuration
              </button>
            </div>
          </div>
          {/* Scaled Preview Area */}
          <div className="xl:col-span-8 flex flex-col bg-slate-200/50 rounded-2xl overflow-hidden border border-slate-200 relative">
            <div className="absolute top-2 right-4 z-10 bg-white/80 backdrop-blur px-2 py-0.5 rounded-md border border-slate-200 text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
              Live 60% Scale
            </div>
            <div className="flex-1 overflow-auto flex items-start justify-center p-4 custom-scrollbar">
              <div className="origin-top scale-[0.60] transform-gpu">
                {/* A4 Report Canvas */}
                <div className="bg-[#fdfcf5] aspect-[210/297] w-[620px] shadow-2xl border border-slate-200 flex flex-col p-8 font-sans text-slate-800">
                  {/* Header */}
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-20 h-20 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-bold text-[9px]">LOGO</div>
                    <div className="flex-1">
                      <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1 uppercase">City Hospital & Research Center</h1>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Laboratory Services</p>
                      <p className="text-[9px] font-medium text-slate-400">Main Road, Sector-4 | +977-1-4XXXXXX</p>
                    </div>
                  </div>

                  <div className="h-[1.5px] bg-slate-900 mb-6" />

                  {/* Patient Info */}
                  <div className="grid grid-cols-2 gap-6 mb-8 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <div className="space-y-1">
                      {[{ L: 'P. Name', V: 'AMAR KUMAL', B: true }, { L: 'Age/Gen', V: '35Y / Male' }, { L: 'Lab ID', V: 'L-2024-0012', B: true }].map((x, i) => (
                        <div key={i} className="flex text-[10px] uppercase">
                          <span className="w-16 text-slate-400 font-black shrink-0">{x.L}</span>
                          <span className={`font-black ${x.B ? 'text-slate-900' : 'text-slate-600'}`}>{x.V}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1 border-l border-slate-200 pl-6">
                      {[{ L: 'Date', V: '2024/01/15' }, { L: 'Type', V: 'Routine OPD' }, { L: 'Ref By', V: 'Dr. Self' }].map((x, i) => (
                        <div key={i} className="flex text-[10px] uppercase">
                          <span className="w-16 text-slate-400 font-black shrink-0">{x.L}</span>
                          <span className="font-black text-slate-700">{x.V}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Test Sections */}
                  <div className="flex-1">
                    <h2 className="text-center text-[10px] font-black uppercase tracking-widest mb-4 border-b-2 border-slate-900 pb-0.5 inline-block w-full">Hematology Results</h2>
                    <table className="w-full text-[10px]">
                      <thead>
                        <tr className="border-y border-slate-300">
                          <th className="py-1 text-left font-black uppercase text-slate-500">Parameter</th>
                          <th className="py-1 text-center font-black uppercase text-slate-500">Value</th>
                          <th className="py-1 text-left font-black uppercase text-slate-500">Unit</th>
                          <th className="py-1 text-left font-black uppercase text-slate-500">Reference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { P: 'Hemoglobin', V: '14.5', U: 'g/dL', R: '13 - 17' },
                          { P: 'WBC Count', V: '7,200', U: '/cmm', R: '4k - 11k' },
                          { P: 'Platelets', V: '2.5', U: 'lakh/cmm', R: '1.5 - 4.5' }
                        ].map((r, i) => (
                          <tr key={i} className="border-b border-slate-50">
                            <td className="py-2 font-bold text-slate-900 uppercase">{r.P}</td>
                            <td className="py-2 font-black text-center">{r.V}</td>
                            <td className="py-2">{r.U}</td>
                            <td className="py-2 italic text-slate-500">{r.R}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer & Signs */}
                  <div className="mt-auto pt-6 border-t border-slate-200">
                    <div className="flex items-end justify-between">
                      <div className="flex-1 grid grid-cols-5 gap-2">
                        {signaturePositions.map(pos => {
                          const sig = selectedReport.signatures?.[pos.id];
                          return (
                            <div key={pos.id} className={`text-center transition-opacity ${sig?.active ? 'opacity-100' : 'opacity-0'}`}>
                              <div className="h-10 border-b border-slate-300 mb-1 flex items-end justify-center">
                                <span className="italic font-serif text-[9px] text-slate-500 mb-0.5">
                                  {sig?.user?.split(' ')[0]}
                                </span>
                              </div>
                              <p className="text-[7px] font-black uppercase text-slate-400 leading-none">{sig?.label || 'Sign'}</p>
                              <p className="text-[8px] font-black uppercase text-slate-900 leading-tight">{sig?.user || ''}</p>
                            </div>
                          );
                        })}
                      </div>
                      {selectedReport.qrCode && (
                        <div className="w-16 h-16 bg-slate-100 rounded-lg border border-slate-200 ml-4 flex items-center justify-center text-[9px] text-slate-300 font-black">QR</div>
                      )}
                    </div>
                    <div className="mt-6 text-center text-[7px] font-bold text-slate-300 uppercase tracking-widest border-t border-slate-50 pt-2">
                      Digitally Verified Clinical Report • Generated on {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fraction/Share Component
  const FractionSettings = () => (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Fraction / Revenue Share</h2>
          <p className="text-slate-500 text-sm font-medium">Configure referral commissions and revenue distribution</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg"
        >
          <MdAdd size={18} /> New Fraction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-bold">Active Fractions</p>
          <p className="text-2xl font-black text-slate-800">{fractions.filter(f => f.active).length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-bold">Average Share</p>
          <p className="text-2xl font-black text-blue-600">31.7%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 uppercase font-bold">Total Commission</p>
          <p className="text-2xl font-black text-emerald-600">NPR 45,678</p>
        </div>
      </div>

      {/* Fractions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Name</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Type</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase text-right">Share %</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase text-right">Min Amount</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase text-right">Max Amount</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fractions.map((fraction) => (
              <tr key={fraction.id} className="hover:bg-blue-50/30">
                <td className="px-6 py-4 font-bold text-slate-800">{fraction.name}</td>
                <td className="px-6 py-4 capitalize">{fraction.type}</td>
                <td className="px-6 py-4 text-right font-bold text-blue-600">{fraction.share}%</td>
                <td className="px-6 py-4 text-right">NPR {fraction.minAmount.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">NPR {fraction.maxAmount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${fraction.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                    {fraction.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="text-slate-400 hover:text-blue-600">
                      <MdEdit size={18} />
                    </button>
                    <button className="text-slate-400 hover:text-rose-500">
                      <MdDelete size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Analytics Dashboard Component
  const AnalyticsDashboard = () => (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Performance Analytics</h2>
          <p className="text-slate-500 text-sm font-medium">Detailed lab workload, TAT, and revenue insights</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg">
            <MdDownload size={18} /> Export Full Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Samples Collected', value: '1,284', grow: '+12%', color: 'text-blue-600', icon: <MdFingerprint /> },
          { label: 'Avg. TAT (Total)', value: '3.2 hrs', grow: '-15%', color: 'text-emerald-600', icon: <MdAccessTime /> },
          { label: 'Revenue (Today)', value: 'NPR 84,210', grow: '+8%', color: 'text-indigo-600', icon: <MdAttachMoney /> },
          { label: 'Tests Pending', value: '45', grow: 'Low', color: 'text-amber-600', icon: <MdSchedule /> }
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">{kpi.icon}</div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-50 ${kpi.grow.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {kpi.grow}
              </span>
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
            <p className={`text-2xl font-black ${kpi.color} tracking-tight`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test-wise Revenue */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-white text-[11px] font-black uppercase tracking-widest">Test-wise Revenue & Workload</h3>
            <MdAssessment className="text-slate-400" />
          </div>
          <div className="overflow-auto max-h-80">
            <table className="w-full text-left">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
                <tr className="text-[9px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Test Name</th>
                  <th className="px-4 py-2 text-center">Count</th>
                  <th className="px-4 py-2 text-right">Revenue</th>
                  <th className="px-4 py-2 text-right">Avg TAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tests.map(test => (
                  <tr key={test.id} className="hover:bg-slate-50 text-[11px]">
                    <td className="px-4 py-2 font-bold text-slate-700">{test.name}</td>
                    <td className="px-4 py-2 text-center font-black text-blue-600">84</td>
                    <td className="px-4 py-2 text-right font-black text-slate-900">NPR 37,800</td>
                    <td className="px-4 py-2 text-right font-bold text-slate-500">4.1h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department-wise Metrics */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-white text-[11px] font-black uppercase tracking-widest">Departmental Split</h3>
            <MdTrendingUp className="text-slate-400" />
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {departments.map(dept => (
                <div key={dept.id}>
                  <div className="flex justify-between items-center mb-1 text-[11px]">
                    <span className="font-black text-slate-700 uppercase">{dept.name}</span>
                    <span className="font-bold text-blue-600">NPR 1,24,000</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-[9px] font-black text-slate-400 uppercase">Whole Turnaround</p>
                <p className="text-lg font-black text-slate-800">98.4%</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-[9px] font-black text-slate-400 uppercase">Share Fractions</p>
                <p className="text-lg font-black text-emerald-600">NPR 12.4k</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Department Setup Component
  const DepartmentSetup = () => (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Department Setup</h2>
          <p className="text-slate-500 text-sm font-medium">Manage lab sections and administrative heads</p>
        </div>
        <button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg">
          <MdAdd size={18} /> New Department
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-white">
            <tr className="text-[10px] font-black uppercase tracking-widest">
              <th className="px-6 py-3">Dept Name</th>
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Section Head (HOD)</th>
              <th className="px-6 py-3 text-center">Tests</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {departments.map((dept) => (
              <tr key={dept.id} className="hover:bg-blue-50/30 transition-colors text-[13px]">
                <td className="px-6 py-2 font-bold text-slate-800">{dept.name}</td>
                <td className="px-6 py-2 font-mono text-xs font-bold text-blue-600">{dept.code}</td>
                <td className="px-6 py-2 text-slate-600 font-bold">{dept.hod}</td>
                <td className="px-6 py-2 text-center font-black text-slate-400">{dept.tests}</td>
                <td className="px-6 py-2">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase border border-emerald-100">
                    Active
                  </span>
                </td>
                <td className="px-6 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="text-slate-400 hover:text-blue-600 p-1"><MdEdit size={16} /></button>
                    <button className="text-slate-400 hover:text-rose-500 p-1"><MdDelete size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Machine Integration Component
  const MachineSettings = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Machine Integration</h2>
          <p className="text-slate-500 text-sm font-medium">Configure LIS, HL7, and instrument interfaces</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSync} className={`bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${syncStatus === 'syncing' ? 'bg-blue-600' : 'hover:bg-blue-600 shadow-lg'}`}>
            <MdOutlineSync size={18} className={syncStatus === 'syncing' ? 'animate-spin' : ''} /> Sync All Units
          </button>
          <button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg">
            <MdAdd size={18} /> Add Machine
          </button>
        </div>
      </div>

      {/* Assay Mapping - The "Detailed thing" for machine integration */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-white text-[11px] font-black uppercase tracking-widest">Machine Assay / Test Mapping</h3>
          <span className="text-[10px] text-slate-400 font-bold bg-slate-700 px-2 py-0.5 rounded">LIS-MAPPED</span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <th className="px-6 py-2">Test Name (LIS)</th>
              <th className="px-6 py-2">Machine ID</th>
              <th className="px-6 py-2">Assay Code</th>
              <th className="px-6 py-2">Channel No.</th>
              <th className="px-6 py-2">Formula/Factor</th>
              <th className="px-6 py-2">Sync Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tests.map(test => (
              <tr key={test.id} className="hover:bg-blue-50/20 transition-all text-[11px]">
                <td className="px-6 py-1.5 font-bold text-slate-700">{test.name}</td>
                <td className="px-6 py-1.5 font-black text-blue-600">SYSMEX-X1</td>
                <td className="px-6 py-1.5 font-mono text-xs text-amber-600">{test.assayCode}</td>
                <td className="px-6 py-1.5 text-slate-400 font-bold">CHNL_0{test.id}</td>
                <td className="px-6 py-1.5 text-slate-500 italic">1.0 x Result</td>
                <td className="px-6 py-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-black uppercase text-[9px]">
                    <MdCloudDone size={14} /> Mapped
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Registered Machines List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {machines.map((machine) => (
          <div key={machine.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${machine.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${machine.status === 'online' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  <MdSettingsEthernet size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-none">{machine.name}</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{machine.type} • {machine.protocol}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${machine.status === 'online' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                {machine.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-3 rounded-xl">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase">IP Address</p>
                <p className="text-xs font-mono font-bold text-slate-900">{machine.ip}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase">Port Mapping</p>
                <p className="text-xs font-mono font-bold text-slate-900">{machine.port}</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-400 font-bold italic">Last Heartbeat: {new Date(machine.lastConnection).toLocaleTimeString()}</span>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><MdEdit size={16} /></button>
                <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><MdDelete size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const AddEditModal = () => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none uppercase mb-1">
              {modalType === 'add' ? 'Register' : 'Modify'} {activeTab === 'user' ? 'Staff Member' :
                activeTab === 'test' ? 'Clinical Test' :
                  activeTab === 'reports' ? 'Template' :
                    activeTab === 'fraction' ? 'Fraction' : 'Interface'}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Complete the details below</p>
          </div>
          <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all">
            <MdClose size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {activeTab === 'user' && (
              <>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wide">Full Name</label>
                  <input type="text" className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-xs font-bold" placeholder="Enter full name" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wide">Email Address</label>
                  <input type="email" className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-xs font-bold" placeholder="Enter email" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wide">Role / Designation</label>
                  <select className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-xs font-bold">
                    <option>Pathologist</option>
                    <option>Lab Technician</option>
                    <option>Front Desk</option>
                    <option>Lab Manager</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wide">Department</label>
                  <select className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-xs font-bold">
                    <option>Pathology</option>
                    <option>Hematology</option>
                    <option>Biochemistry</option>
                    <option>Microbiology</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5 tracking-wide">Staff Signature Scan (PNG Transparent)</label>
                  <div className="h-24 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-blue-300 transition-all cursor-pointer group">
                    {selectedItem?.signature ? (
                      <div className="flex flex-col items-center">
                        <MdCheckCircle className="text-emerald-500 mb-0.5" size={20} />
                        <span className="text-[10px] font-black text-emerald-600 uppercase">{selectedItem.signature}</span>
                        <span className="text-[8px] text-slate-400 uppercase">Click to replace</span>
                      </div>
                    ) : (
                      <>
                        <MdUpload size={24} className="text-slate-400 group-hover:text-blue-600 transition-all" />
                        <span className="text-[10px] font-black text-slate-500 uppercase mt-1">Select Signature File</span>
                        <span className="text-[8px] text-slate-300 uppercase mt-0.5 whitespace-nowrap">Recommended: 300x150px Transparent PNG</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded-md accent-blue-600" />
                    <span className="text-[10px] font-black text-slate-600 uppercase group-hover:text-blue-600 transition-colors">Multiple Factor Auth</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded-md accent-blue-600" />
                    <span className="text-[10px] font-black text-slate-600 uppercase group-hover:text-blue-600 transition-colors">Send Welcome Email</span>
                  </label>
                </div>
              </>
            )}

            {activeTab === 'test' && (
              <>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5">Test Name</label>
                  <input type="text" className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold" placeholder="Enter test name" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5">Test Code</label>
                  <input type="text" className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold" placeholder="Enter test code" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5">Lab Department</label>
                  <select className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold">
                    <option>Hematology</option>
                    <option>Biochemistry</option>
                    <option>Immunology</option>
                    <option>Microbiology</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5">Clinical Category</label>
                  <select className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold">
                    <option>Hematology</option>
                    <option>Chemistry</option>
                    <option>Hormones</option>
                    <option>Serology</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5">Rate (NPR)</label>
                  <input type="number" className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold" placeholder="0" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5">Net Cost (NPR)</label>
                  <input type="number" className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold" placeholder="0" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase block mb-1.5">Parameters & Remarks</label>
                  <textarea className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold" rows="2" placeholder="Enter test parameters"></textarea>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-6 py-2 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <MdOutlineSave size={16} />
            Commit Record
          </button>
        </div>
      </div>
    </div>
  );

  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-4">
          <MdWarning size={32} />
        </div>
        <h3 className="text-xl font-black text-center text-slate-800 mb-2">Confirm Delete</h3>
        <p className="text-center text-slate-600 mb-6">
          Are you sure you want to delete {selectedItem?.name}? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="flex-1 py-3 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const ExportModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-black text-slate-800 mb-4">Export Data</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Format</label>
            <select className="w-full p-3 border border-slate-200 rounded-xl">
              <option>CSV</option>
              <option>Excel</option>
              <option>PDF</option>
              <option>JSON</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Date Range</label>
            <select className="w-full p-3 border border-slate-200 rounded-xl">
              <option>All Time</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Custom Range</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Include headers</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Include metadata</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Compress file</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowExportModal(false)}
            className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowExportModal(false);
              setSuccessMessage('Export started');
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 3000);
            }}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );

  const ImportModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-black text-slate-800 mb-4">Import Data</h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
            <MdUpload size={32} className="mx-auto mb-2 text-slate-400" />
            <p className="text-sm font-bold text-slate-600 mb-1">Drop file here or click to upload</p>
            <p className="text-xs text-slate-400">Supports CSV, Excel, JSON (max 10MB)</p>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Import Options</label>
            <select className="w-full p-3 border border-slate-200 rounded-xl">
              <option>Replace existing</option>
              <option>Merge with existing</option>
              <option>Skip duplicates</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Validate data before import</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Send email notification when complete</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowImportModal(false)}
            className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setShowImportModal(false);
              setSuccessMessage('Import started');
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 3000);
            }}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );

  const NotificationsPanel = () => (
    <div className="absolute top-16 right-8 w-96 bg-white rounded-2xl border border-slate-200 shadow-xl z-40 animate-in slide-in-from-top-2">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-black text-slate-800">Notifications</h3>
        <button className="text-xs text-blue-600 hover:text-blue-800">Mark all as read</button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <MdNotifications size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className="p-4 border-b border-slate-100 hover:bg-slate-50">
              <p className="text-sm text-slate-800">{notification.message}</p>
              <p className="text-[10px] text-slate-400 mt-1">
                {new Date(notification.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const UserMenu = () => (
    <div className="absolute top-16 right-8 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl z-40 animate-in slide-in-from-top-2">
      <div className="p-4 border-b border-slate-200">
        <p className="font-bold text-slate-800">Admin User</p>
        <p className="text-xs text-slate-500">admin@hospital.com</p>
      </div>
      <div className="p-2">
        <button className="w-full p-3 text-left text-sm hover:bg-slate-50 rounded-xl flex items-center gap-3">
          <MdPerson size={18} className="text-slate-400" />
          Profile
        </button>
        <button className="w-full p-3 text-left text-sm hover:bg-slate-50 rounded-xl flex items-center gap-3">
          <MdSettings size={18} className="text-slate-400" />
          Account Settings
        </button>
        <button className="w-full p-3 text-left text-sm hover:bg-slate-50 rounded-xl flex items-center gap-3">
          <MdVpnKey size={18} className="text-slate-400" />
          Change Password
        </button>
        <button className="w-full p-3 text-left text-sm hover:bg-slate-50 rounded-xl flex items-center gap-3">
          <MdFingerprint size={18} className="text-slate-400" />
          Two-Factor Auth
        </button>
        <div className="border-t border-slate-100 my-2" />
        <button className="w-full p-3 text-left text-sm hover:bg-rose-50 rounded-xl flex items-center gap-3 text-rose-600">
          <MdLogout size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  const HelpModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800">Help & Documentation</h3>
          <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600">
            <MdClose size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-800 mb-2">Getting Started</h4>
              <p className="text-sm text-slate-600">Learn how to configure your laboratory settings efficiently.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-2">Keyboard Shortcuts</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between"><span>Ctrl + N</span> <span className="text-slate-500">New Item</span></div>
                <div className="flex justify-between"><span>Ctrl + F</span> <span className="text-slate-500">Search</span></div>
                <div className="flex justify-between"><span>Ctrl + S</span> <span className="text-slate-500">Save</span></div>
                <div className="flex justify-between"><span>Ctrl + E</span> <span className="text-slate-500">Export</span></div>
                <div className="flex justify-between"><span>Ctrl + I</span> <span className="text-slate-500">Import</span></div>
                <div className="flex justify-between"><span>Esc</span> <span className="text-slate-500">Close Modal</span></div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-2">Contact Support</h4>
              <p className="text-sm text-slate-600">Email: support@hospital.com</p>
              <p className="text-sm text-slate-600">Phone: +977-1-2345678</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TourModal = () => {
    const tourSteps = [
      { title: 'Welcome!', content: 'Let us take a quick tour of the settings panel.' },
      { title: 'User Management', content: 'Manage users, roles, and permissions here.' },
      { title: 'Test Setup', content: 'Configure all your lab tests and parameters.' },
      { title: 'Reports', content: 'Customize report templates and layouts.' },
      { title: 'Fractions', content: 'Set up revenue sharing and commissions.' },
      { title: 'Machine Integration', content: 'Connect and manage your lab instruments.' }
    ];

    return (
      <div className="fixed bottom-8 right-8 w-80 bg-white rounded-2xl border border-blue-200 shadow-2xl z-50 animate-in slide-in-from-bottom-4">
        <div className="bg-blue-600 text-white p-4 rounded-t-2xl">
          <h3 className="font-black">{tourSteps[tourStep].title}</h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-slate-600 mb-4">{tourSteps[tourStep].content}</p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === tourStep ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {tourStep > 0 && (
                <button
                  onClick={handleTourPrev}
                  className="px-3 py-1 border border-slate-200 rounded-lg text-xs hover:bg-slate-50"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleTourNext}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
              >
                {tourStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleTourSkip}
          className="absolute top-2 right-2 text-white/50 hover:text-white"
        >
          <MdClose size={16} />
        </button>
      </div>
    );
  };

  const FeedbackModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-black text-slate-800 mb-4">Send Feedback</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setFeedbackRating(star)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${star <= feedbackRating ? 'bg-amber-100 text-amber-500' : 'bg-slate-100 text-slate-400'
                    }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Your Feedback</label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl"
              rows="4"
              placeholder="Tell us what you think..."
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFeedback(false)}
              className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleFeedbackSubmit}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* Success/Error Toasts */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl shadow-lg z-50 animate-in slide-in-from-top-2 flex items-center gap-2">
          <MdCheckCircle className="text-emerald-500" size={20} />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {showError && (
        <div className="fixed top-4 right-4 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl shadow-lg z-50 animate-in slide-in-from-top-2 flex items-center gap-2">
          <MdError className="text-rose-500" size={20} />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between shadow-sm z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <MdBiotech size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tighter leading-none">System Settings</h1>
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Configuration Panel</span>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all relative group whitespace-nowrap ${activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
            >
              <div className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}>
                {React.cloneElement(tab.icon, { size: 18 })}
              </div>
              <div className="flex flex-col items-start">
                <span className={`text-[11px] font-black uppercase tracking-tight leading-none ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-500'
                  }`}>
                  {tab.label}
                </span>
              </div>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Quick Actions */}
          <button
            onClick={() => setShowKeyboardShortcuts(true)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            title="Keyboard Shortcuts"
          >
            ⌨️
          </button>

          {/* Help Button */}
          <button
            onClick={() => setShowHelp(true)}
            className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
            title="Help"
          >
            <MdHelp size={20} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 relative"
            >
              <MdNotifications size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
            </button>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-1" />

          {/* System Status */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'active' ? 'bg-emerald-500 animate-pulse' :
                syncStatus === 'syncing' ? 'bg-amber-500 animate-pulse' :
                  syncStatus === 'error' ? 'bg-rose-500' : 'bg-slate-400'
                }`} />
              <span className={`text-[11px] font-bold tracking-tight ${syncStatus === 'active' ? 'text-emerald-600' :
                syncStatus === 'syncing' ? 'text-amber-600' :
                  syncStatus === 'error' ? 'text-rose-600' : 'text-slate-600'
                }`}>
                {syncStatus === 'active' ? 'Sync Active' :
                  syncStatus === 'syncing' ? 'Syncing...' :
                    syncStatus === 'error' ? 'Sync Error' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Panels */}
      {showNotifications && <NotificationsPanel />}
      {showUserMenu && <UserMenu />}

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-[#f8fafc] relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4" />

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {activeTab === 'user' && <UserManagement />}
          {activeTab === 'test' && <TestSetup />}
          {activeTab === 'design' && <ReportSettings />}
          {activeTab === 'fraction' && <FractionSettings />}
          {activeTab === 'machine' && <MachineSettings />}
          {activeTab === 'dept' && <DepartmentSetup />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
        </div>
      </div>

      {/* Modals */}
      {showModal && <AddEditModal />}
      {showDeleteConfirm && <DeleteConfirmModal />}
      {showExportModal && <ExportModal />}
      {showImportModal && <ImportModal />}
      {showHelp && <HelpModal />}
      {showTour && !dismissedTour && <TourModal />}
      {showFeedback && <FeedbackModal />}

      {/* Tour Trigger (only on first visit) */}
      {!dismissedTour && !showTour && (
        <button
          onClick={() => setShowTour(true)}
          className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 z-40"
        >
          <MdInfo size={20} />
          Take a Tour
        </button>
      )}
    </div>
  );
};

export default Setting;