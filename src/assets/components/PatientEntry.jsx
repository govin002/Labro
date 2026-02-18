import { useState, useMemo, useRef, useEffect } from "react";
import { MdAddCircleOutline, MdSearch, MdPersonAdd, MdClose, MdSave, MdRefresh, MdPayments, MdCameraAlt, MdFileUpload, MdLocalHospital, MdReceipt } from "react-icons/md";
import BillReceiptModal from './BillReceiptModal';

function PatientEntry() {
    const [showForm, setShowForm] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [testSearch, setTestSearch] = useState("");
    const fileInputRef = useRef(null);

    const initialFormData = {
        patientId: Math.floor(10000000 + Math.random() * 90000000).toString(),
        registeredDate: new Date().toISOString().slice(0, 10),
        refByDr: "SELF",
        title: "MR.",
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "Male",
        ageValue: "",
        ageUnit: "Yrs.",
        patientType: "Other",
        remarks: "",
        email: "",
        mobile: "",
        address: "",
        sampleSource: "Internal",
        agentName: "SELF",
        agentShare: 0,
        photo: null,
        freeOfCost: false,
        discountAmount: 0,
        cashAmount: 0,
        onlineAmount: 0,
        paymentType: "Cash"
    };

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);

    // Form State (Patient Master)
    const [formData, setFormData] = useState(initialFormData);

    const [availableTests, setAvailableTests] = useState([
        { name: "HAEMOGRAM (CBC)", fees: 500 },
        { name: "CBC Complete", fees: 450 },
        { name: "HEMOGRAM REPORT (CBC Machine)", fees: 550 },
        { name: "HB TC DC", fees: 300 },
        { name: "BLOOD GROUP", fees: 200 },
        { name: "TYPHI DOT (Rapid)", fees: 400 },
        { name: "WIDAL", fees: 350 },
        { name: "MP ANTIGEN", fees: 450 },
        { name: "WIDAL REACTION", fees: 400 },
        { name: "MP (MALARIA PARASITES)", fees: 300 },
        { name: "MP (P/S)", fees: 300 },
        { name: "MP (Card)", fees: 400 },
        { name: "ESR", fees: 150 },
        { name: "BLOOD SUGAR (F)", fees: 100 },
        { name: "BLOOD SUGAR (R)", fees: 100 },
        { name: "BLOOD SUGAR (PP)", fees: 100 },
        { name: "BIO-CHEMISTRY REPORT (Full)", fees: 1200 },
        { name: "S. Creatinine", fees: 250 },
        { name: "S.Sodium/Potassium/Chloride", fees: 600 },
    ]);

    const [selectedTests, setSelectedTests] = useState([]);
    const [multiSelectedIndexes, setMultiSelectedIndexes] = useState([]);
    const [patientBillHistory, setPatientBillHistory] = useState([
        {
            id: "202602141",
            billNo: "202602141",
            date: "14/02/2026",
            patientName: "M. A.",
            refBy: "SELF",
            address: "",
            ageGender: "8 Yrs /Male",
            mobile: "0",
            tests: [
                { sr: 1, name: "CBC Complete", amount: 500 }
            ],
            totalAmount: 500,
            discount: 10,
            discountAmount: 50,
            paymentReceived: 0,
            dueAmount: 450,
            status: "Paid"
        },
        {
            id: "202602140",
            billNo: "202602140",
            date: "13/02/2026",
            patientName: "JAMUNA RAJKARNIKAR",
            refBy: "DR. SHARMA",
            address: "Kathmandu",
            ageGender: "53 Yrs /Female",
            mobile: "9851076760",
            tests: [
                { sr: 1, name: "WIDAL", amount: 300 },
                { sr: 2, name: "Sugar (Fasting)", amount: 150 }
            ],
            totalAmount: 450,
            discount: 0,
            discountAmount: 0,
            paymentReceived: 450,
            dueAmount: 0,
            status: "Paid"
        }
    ]);
    const [showBillHistoryModal, setShowBillHistoryModal] = useState(false);
    const [selectedBillForPreview, setSelectedBillForPreview] = useState(null);
    const [showBillPreviewModal, setShowBillPreviewModal] = useState(false);
    const [showCurrentBillPreview, setShowCurrentBillPreview] = useState(false);

    // Mock Data for Patient List
    const initialPatients = [
        {
            id: 1,
            patientId: "12345678",
            patientName: "JAMUNA RAJKARNIKAR",
            ageGender: "53 Y / F",
            mobile: "9851076760",
            email: "jamuna@example.com",
            photo: null,
            bills: [
                { id: "B-101", billNo: "B-101", patientId: "12345678", date: "10/01/2026", totalAmount: 1500, status: "Paid", items: "CBC, WIDAL", tests: [{ name: "CBC", amount: 1000 }, { name: "WIDAL", amount: 500 }], total: 1500, paymentReceived: 1500, dueAmount: 0 },
                { id: "B-105", billNo: "B-105", patientId: "12345678", date: "15/02/2026", totalAmount: 2200, status: "Paid", items: "Sugar, Thyroid", tests: [{ name: "Sugar", amount: 200 }, { name: "Thyroid", amount: 2000 }], total: 2200, paymentReceived: 2200, dueAmount: 0 }
            ]
        },
        {
            id: 2,
            patientId: "87654321",
            patientName: "SHANTI PANDIT",
            ageGender: "53 Y / F",
            mobile: "9849896601",
            email: "shanti@example.com",
            photo: null,
            bills: [
                { id: "B-202", billNo: "B-202", patientId: "87654321", date: "01/03/2026", totalAmount: 800, status: "Partially Paid", items: "Urine RE", tests: [{ name: "Urine RE", amount: 800 }], total: 800, paymentReceived: 400, dueAmount: 400 }
            ]
        },
        {
            id: 3,
            patientId: "11223344",
            patientName: "RAM KRISHNA",
            ageGender: "30 Y / M",
            mobile: "9800000000",
            email: "ram@example.com",
            photo: null,
            bills: []
        }
    ];

    const filteredRegistry = useMemo(() => {
        return initialPatients.filter(p =>
            p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.patientId.includes(searchTerm) ||
            (p.firstName && p.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.lastName && p.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                alert("Please upload only JPG or PNG images.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (isCameraOpen && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [isCameraOpen, stream]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720, facingMode: "user" }
            });
            setStream(mediaStream);
            setIsCameraOpen(true);
        } catch (err) {
            console.error("Camera Error:", err);
            alert("Unable to access camera. Please ensure permissions are granted.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const dataUrl = canvasRef.current.toDataURL('image/jpeg');
            setFormData(prev => ({ ...prev, photo: dataUrl }));
            stopCamera();
        }
    };

    const triggerPhotoUpload = () => fileInputRef.current?.click();

    const resetForm = () => {
        setFormData({
            ...initialFormData,
            registeredDate: new Date().toISOString().slice(0, 10)
        });
        setSelectedTests([]);
        setTestSearch("");
        setMultiSelectedIndexes([]);
        setPatientBillHistory([]);
    };

    const handleSaveNext = () => {
        if (!formData.firstName || !formData.lastName) {
            alert("Please enter both First and Last Name");
            return;
        }
        alert("Patient Entry Saved Successfully!");
        resetForm();
    };

    const loadPatientDetail = (patient) => {
        resetForm(); // Clear everything first
        const [age, unit] = patient.ageGender.split(" ");
        const gender = patient.ageGender.split("/")[1].trim() === "M" ? "Male" : "Female";

        setFormData(prev => {
            const nameParts = (patient.patientName || "").split(" ");
            let fName = "", mName = "", lName = "";

            if (nameParts.length === 1) {
                fName = nameParts[0];
            } else if (nameParts.length === 2) {
                fName = nameParts[0];
                lName = nameParts[1];
            } else if (nameParts.length >= 3) {
                fName = nameParts[0];
                mName = nameParts.slice(1, nameParts.length - 1).join(" ");
                lName = nameParts[nameParts.length - 1];
            }

            return {
                ...prev,
                firstName: fName,
                middleName: mName,
                lastName: lName,
                mobile: patient.mobile,
                email: patient.email || "",
                ageValue: age,
                patientId: patient.patientId || Math.floor(10000000 + Math.random() * 90000000).toString(),
                ageUnit: unit.startsWith("Y") ? "Yrs." : unit.startsWith("M") ? "Mon." : "Days",
                gender: gender,
                photo: patient.photo || null
            };
        });
        setPatientBillHistory(patient.bills || []);
        setShowForm(true);
    };

    const addTest = () => {
        // Validation Check for Primary Details
        if (!formData.firstName || !formData.lastName || !formData.ageValue) {
            alert("Mandatory: Please enter Patient's First Name, Last Name, and Age before adding tests.");
            return;
        }

        if (multiSelectedIndexes.length > 0) {
            const filtered = availableTests.filter(t => t.name.toLowerCase().includes(testSearch.toLowerCase()));
            const newTests = multiSelectedIndexes.map(index => {
                const test = filtered[index];
                return { ...test, discount: 0, id: Math.random() + Date.now() };
            });
            setSelectedTests([...selectedTests, ...newTests]);
            setMultiSelectedIndexes([]);
        }
    };

    const toggleTestSelection = (index) => {
        setMultiSelectedIndexes(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const handleTestDiscountChange = (index, value) => {
        const updatedTests = [...selectedTests];
        updatedTests[index].discount = parseFloat(value) || 0;
        setSelectedTests(updatedTests);
    };

    const removeTest = (index) => {
        const list = [...selectedTests];
        list.splice(index, 1);
        setSelectedTests(list);
    };

    const totalFees = selectedTests.reduce((acc, curr) => acc + curr.fees, 0);
    const totalTestDiscounts = selectedTests.reduce((acc, curr) => acc + (parseFloat(curr.discount) || 0), 0);
    const globalDiscount = parseFloat(formData.discountAmount) || 0;
    const payable = formData.freeOfCost ? 0 : totalFees - totalTestDiscounts - globalDiscount;
    const totalPaid = (parseFloat(formData.cashAmount) || 0) + (parseFloat(formData.onlineAmount) || 0);
    const due = payable - totalPaid;

    return (
        <div className="w-full h-screen bg-[#f1f5f9] font-sans flex flex-col overflow-hidden text-slate-800 select-none">
            {/* Window Header */}
            <div className="bg-[#003366] px-4 py-1.5 flex items-center justify-between text-white text-[11px] font-bold shadow-md">
                <span className="flex items-center gap-2 uppercase tracking-wide">Standard Patient Entry Master</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowForm(false)} className="hover:bg-red-500/80 rounded p-1 transition-all group" title="Close Module"><MdClose size={16} className="group-hover:rotate-90 transition-transform" /></button>
                </div>
            </div>

            {showForm ? (
                /* Simplified Patient Master Entry Form */
                <div className="flex-1 p-3 flex flex-col gap-3 overflow-hidden bg-[#e2e8f0]">
                    <div className="flex gap-3 flex-1 overflow-hidden">

                        {/* Left Pane: Patient Information - Scrollable */}
                        <div className="flex-[1.2] flex flex-col gap-3 h-full overflow-y-auto pr-1">
                            <div className="bg-white border border-slate-300 p-4 rounded-lg shadow-sm">
                                <fieldset className="border border-slate-200 p-4 pt-2 rounded-lg bg-slate-50/30">
                                    <legend className="px-2 text-[11px] font-black text-blue-900 bg-white uppercase tracking-wider border border-slate-200 rounded-full">Primary Details</legend>

                                    {/* Input Fields Area */}
                                    <div className="space-y-2 mt-2">
                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-bold w-28 text-slate-500 uppercase shrink-0">Reg. Date</label>
                                            <input
                                                type="date"
                                                name="registeredDate"
                                                value={formData.registeredDate}
                                                onChange={handleInputChange}
                                                className="flex-1 p-1 bg-white border border-slate-300 rounded text-[13px] font-bold outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                            />
                                            {/* View Old Bills Button - Inline */}
                                            {patientBillHistory.length > 0 && (
                                                <button
                                                    onClick={() => setShowBillHistoryModal(true)}
                                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2.5 py-1.5 rounded-md font-black text-[9px] uppercase shadow-md hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-1.5 active:scale-95 border border-blue-700 whitespace-nowrap"
                                                    title={`View ${patientBillHistory.length} previous transaction${patientBillHistory.length > 1 ? 's' : ''}`}
                                                >
                                                    <MdReceipt size={14} />
                                                    <span>Bills ({patientBillHistory.length})</span>
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-bold w-28 text-slate-500 uppercase shrink-0">Ref. By Dr</label>
                                            <div className="flex-1 flex gap-1">
                                                <select name="refByDr" value={formData.refByDr} onChange={handleInputChange} className="flex-1 p-1 border border-slate-300 rounded text-[13px] font-bold outline-none bg-blue-50/50">
                                                    <option value="SELF">SELF (Walk-in)</option>
                                                    <option value="DR. SHARMA">DR. SHARMA</option>
                                                    <option value="DR. ADHIKARI">DR. ADHIKARI</option>
                                                </select>
                                                <button className="text-[10px] bg-slate-200 px-2 py-1 rounded font-bold hover:bg-slate-300 uppercase">Add</button>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <label className="text-[12px] font-bold w-28 text-slate-500 uppercase shrink-0 pt-1.5">Patient Name</label>
                                            <div className="flex-1 flex flex-col gap-1.5">
                                                <div className="flex gap-1">
                                                    <select name="title" value={formData.title} onChange={handleInputChange} className="w-20 p-1 border border-slate-300 rounded text-[13px] font-bold outline-none bg-white">
                                                        <option value="MR.">MR.</option>
                                                        <option value="MRS.">MRS.</option>
                                                        <option value="MS.">MS.</option>
                                                    </select>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleInputChange}
                                                        placeholder="First Name"
                                                        className="flex-1 p-1 border border-slate-300 rounded text-[13px] font-bold outline-none uppercase bg-white"
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="middleName"
                                                    value={formData.middleName}
                                                    onChange={handleInputChange}
                                                    placeholder="Middle Name (Optional)"
                                                    className="w-full p-1 border border-slate-300 rounded text-[13px] font-bold outline-none uppercase bg-white focus:bg-slate-50"
                                                />
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    placeholder="Last Name"
                                                    className="w-full p-1 border border-slate-300 rounded text-[13px] font-bold outline-none uppercase bg-white focus:bg-slate-50"
                                                />
                                            </div>
                                        </div>

                                        {/* Photo Section - Right After Name */}
                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-bold w-28 text-slate-500 uppercase shrink-0">Patient Photo</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handlePhotoChange}
                                                    accept="image/jpeg,image/png"
                                                    className="hidden"
                                                />
                                                <div className="w-20 h-20 bg-white border-2 border-dashed border-slate-300 rounded-md overflow-hidden flex flex-col items-center justify-center text-slate-400 shadow-inner">
                                                    {formData.photo ? (
                                                        <img src={formData.photo} alt="Patient" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <>
                                                            <MdPersonAdd size={24} className="text-slate-200" />
                                                            <span className="text-[7px] font-black uppercase mt-0.5">No Photo</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={startCamera}
                                                        className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded text-[10px] font-black uppercase hover:bg-blue-100 text-blue-700 transition-all flex items-center gap-1.5"
                                                    >
                                                        <MdCameraAlt size={14} /> Capture
                                                    </button>
                                                    <button
                                                        onClick={triggerPhotoUpload}
                                                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-black uppercase hover:bg-slate-100 text-slate-700 transition-all flex items-center gap-1.5"
                                                    >
                                                        <MdFileUpload size={14} /> Upload
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-bold w-28 text-slate-500 uppercase shrink-0">Age & Sex</label>
                                            <div className="flex-1 flex gap-2">
                                                <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-24 p-1 border border-slate-300 rounded text-[13px] font-bold outline-none">
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    name="ageValue"
                                                    value={formData.ageValue}
                                                    onChange={handleInputChange}
                                                    placeholder="00"
                                                    className="w-14 p-1 border border-slate-300 rounded text-[13px] font-bold outline-none text-center"
                                                />
                                                <select name="ageUnit" value={formData.ageUnit} onChange={handleInputChange} className="w-20 p-1 border border-slate-300 rounded text-[13px] font-bold outline-none">
                                                    <option value="Yrs.">YRS</option>
                                                    <option value="Mon.">MON</option>
                                                    <option value="Days">DAY</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-bold w-28 text-slate-500 uppercase shrink-0">Mobile</label>
                                            <input
                                                type="text"
                                                name="mobile"
                                                value={formData.mobile || ""}
                                                onChange={handleInputChange}
                                                placeholder="98XXXXXXXX"
                                                className="flex-1 p-1 border border-slate-300 rounded text-[13px] font-bold outline-none"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-bold w-28 text-slate-500 uppercase shrink-0">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email || ""}
                                                onChange={handleInputChange}
                                                placeholder="patient@example.com"
                                                className="flex-1 p-1 border border-slate-300 rounded text-[13px] font-bold outline-none"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-bold w-28 text-slate-500 uppercase shrink-0">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="City, District"
                                                className="flex-1 p-1 border border-slate-300 rounded text-[13px] outline-none font-bold"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-bold w-28 text-slate-500 uppercase shrink-0">Agent/By</label>
                                            <div className="flex-1 flex gap-2">
                                                <select name="agentName" value={formData.agentName} onChange={handleInputChange} className="flex-1 p-1 border border-slate-300 rounded text-[13px] font-bold outline-none bg-orange-50/30">
                                                    <option value="SELF">SELF</option>
                                                    <option value="AGENT-001">AGENT-001</option>
                                                    <option value="HOSP-TRANS">HOSPITAL TRANSFER</option>
                                                </select>
                                                <div className="w-24 flex flex-col">
                                                    <label className="text-[8px] font-black uppercase text-slate-400">Share/Fraction</label>
                                                    <input
                                                        type="text"
                                                        name="agentShare"
                                                        value={formData.agentShare}
                                                        onChange={handleInputChange}
                                                        placeholder="0.00"
                                                        className="w-full p-1 border border-slate-300 rounded text-[11px] font-black text-right text-orange-700 bg-orange-50"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-bold w-28 text-slate-500 uppercase shrink-0">Source</label>
                                            <div className="flex-1 flex gap-2">
                                                <select name="sampleSource" value={formData.sampleSource} onChange={handleInputChange} className="flex-1 p-1 border border-slate-300 rounded text-[13px] font-bold outline-none">
                                                    <option value="Internal">In-house</option>
                                                    <option value="External">External</option>
                                                </select>
                                                <MdLocalHospital size={16} className="text-blue-600 self-center" />
                                            </div>
                                        </div>


                                    </div>
                                </fieldset>
                            </div>



                            {/* Simplified Action Buttons */}
                            <div className="grid grid-cols-2 gap-3 p-1 mt-2">
                                <button onClick={() => setShowForm(false)} className="flex items-center justify-center gap-3 p-4 bg-white border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 group">
                                    <MdSearch size={24} className="text-blue-600 group-hover:scale-110 transition-transform" />
                                    <div className="text-left">
                                        <p className="text-[11px] font-black uppercase text-slate-800 leading-none">Patient List</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">View & Search All</p>
                                    </div>
                                </button>
                                <button onClick={handleSaveNext} className="flex items-center justify-center gap-3 p-4 bg-emerald-600 border-2 border-emerald-700 rounded-xl hover:bg-emerald-700 transition-all shadow-lg active:scale-95 group">
                                    <MdSave size={24} className="text-white group-hover:scale-110 transition-transform" />
                                    <div className="text-left">
                                        <p className="text-[11px] font-black uppercase text-white leading-none">Save & Register</p>
                                        <p className="text-[9px] font-bold text-emerald-100 uppercase mt-0.5">Confirm & New</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Middle Pane: Test Search */}
                        <div className="flex-1 flex flex-col gap-3">
                            <div className="bg-white border border-slate-300 p-3 rounded-lg shadow-sm flex-1 flex flex-col gap-3 overflow-hidden">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Available Services</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search test by name..."
                                            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-[12px] font-bold outline-none bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-400 transition-all"
                                            value={testSearch}
                                            onChange={(e) => setTestSearch(e.target.value)}
                                        />
                                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    </div>
                                </div>
                                <div className="flex-1 bg-slate-50/50 border border-slate-200 rounded-lg overflow-auto p-1 custom-scrollbar">
                                    {availableTests.filter(t => t.name.toLowerCase().includes(testSearch.toLowerCase())).map((test, i) => (
                                        <div
                                            key={i}
                                            onClick={() => toggleTestSelection(i)}
                                            className={`group text-[11px] p-2.5 mb-1 cursor-pointer transition-all border-2 rounded-md uppercase font-black flex justify-between items-center ${multiSelectedIndexes.includes(i) ? 'bg-blue-600 border-blue-700 text-white shadow-md' : 'hover:bg-white hover:border-blue-200 border-transparent text-slate-600 shadow-sm bg-white'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3.5 h-3.5 rounded border ${multiSelectedIndexes.includes(i) ? 'bg-white border-white' : 'border-slate-300 bg-slate-50'}`}>
                                                    {multiSelectedIndexes.includes(i) && <div className="w-full h-full text-blue-600 flex items-center justify-center">✓</div>}
                                                </div>
                                                <span>{test.name}</span>
                                            </div>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full ${multiSelectedIndexes.includes(i) ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>रु {test.fees}</span>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addTest} className={`w-full py-2.5 rounded-lg font-black text-[11px] uppercase shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${multiSelectedIndexes.length > 0 ? 'bg-slate-800 text-white hover:bg-black cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                                    <MdAddCircleOutline size={18} /> Add {multiSelectedIndexes.length || ""} Items to Bill
                                </button>
                            </div>
                        </div>

                        {/* Right Pane: Bill Preview */}
                        <div className="flex-1 flex flex-col gap-3">
                            <div className="bg-white border border-slate-300 p-3 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 border border-slate-200 rounded-lg overflow-auto custom-scrollbar bg-slate-50/20">
                                    <table className="w-full text-left text-[11px] border-collapse">
                                        <thead className="sticky top-0 bg-[#f8fafc] border-b border-slate-300 z-10 shadow-sm">
                                            <tr>
                                                <th className="px-3 py-3 font-black text-slate-600 uppercase tracking-tighter">Test Name</th>
                                                <th className="px-2 py-3 font-black text-slate-600 uppercase text-center w-20 tracking-tighter">Fees</th>
                                                <th className="px-2 py-3 font-black text-slate-600 uppercase text-center w-20 tracking-tighter">Disc.</th>
                                                <th className="px-3 py-3 font-black text-slate-600 uppercase text-right w-24 tracking-tighter">Net</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {selectedTests.map((test, i) => (
                                                <tr key={test.id || i} className="group hover:bg-slate-50 transition-colors bg-white">
                                                    <td className="px-3 py-2 uppercase text-slate-700 font-black relative">
                                                        {test.name}
                                                        <button
                                                            onClick={() => removeTest(i)}
                                                            className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-all"
                                                        >
                                                            <MdClose size={12} />
                                                        </button>
                                                    </td>
                                                    <td className="px-2 py-2 text-center text-slate-500 font-bold">{test.fees.toFixed(0)}</td>
                                                    <td className="px-2 py-2">
                                                        <input
                                                            type="text"
                                                            value={test.discount}
                                                            onChange={(e) => handleTestDiscountChange(i, e.target.value)}
                                                            className="w-full p-1 border border-slate-200 rounded text-center text-[10px] font-black outline-none focus:border-blue-400"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 text-right font-black text-slate-900">रु {(test.fees - (test.discount || 0)).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            {selectedTests.length === 0 && (
                                                <tr><td colSpan="4" className="px-3 py-24 text-center text-slate-300 italic uppercase font-black tracking-widest text-[10px]">No services selected for bill</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Enhanced Billing Summary with Multiple Payment Types */}
                            <div className="bg-white border border-slate-300 p-4 rounded-lg shadow-md space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black text-slate-500 uppercase">Sub Total (Gross)</label>
                                    <div className="text-[14px] font-black text-slate-900">रु {totalFees.toFixed(2)}</div>
                                </div>

                                <div className="flex items-center justify-between text-red-600">
                                    <label className="text-[10px] font-black uppercase">Item-wise Discount</label>
                                    <div className="text-[12px] font-black">- रु {totalTestDiscounts.toFixed(2)}</div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" name="freeOfCost" checked={formData.freeOfCost} onChange={handleInputChange} className="w-3.5 h-3.5 accent-blue-700" id="foc" />
                                        <label htmlFor="foc" className="text-[10px] font-black text-slate-500 uppercase cursor-pointer">Free of Cost</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase">Discount</label>
                                        <input
                                            type="text"
                                            name="discountAmount"
                                            value={formData.discountAmount}
                                            onChange={handleInputChange}
                                            className="w-20 p-1 border border-slate-300 rounded text-[11px] font-black text-right text-red-600 bg-red-50"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                    <label className="text-[11px] font-black text-slate-800 uppercase tracking-tighter italic font-serif">Net Payable</label>
                                    <div className="text-[18px] font-black text-[#065f46] tracking-tighter">रु {payable.toFixed(2)}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-50">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Cash Payment</label>
                                        <input
                                            type="text"
                                            name="cashAmount"
                                            value={formData.cashAmount}
                                            onChange={handleInputChange}
                                            className="w-full p-1.5 bg-[#fafff0] border border-slate-200 rounded text-[12px] font-black text-right text-slate-800 outline-none focus:ring-1 focus:ring-green-400"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Online / FonePay</label>
                                        <input
                                            type="text"
                                            name="onlineAmount"
                                            value={formData.onlineAmount}
                                            onChange={handleInputChange}
                                            className="w-full p-1.5 bg-[#f0f9ff] border border-slate-200 rounded text-[12px] font-black text-right text-slate-800 outline-none focus:ring-1 focus:ring-blue-400"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase">Total Paid</label>
                                    <div className="text-[12px] font-black text-slate-700">रु {totalPaid.toFixed(2)}</div>
                                </div>

                                <div className="flex items-center justify-between p-2 bg-red-50 border border-red-100 rounded-lg">
                                    <label className="text-[11px] font-black text-red-400 uppercase tracking-widest">Balance Due</label>
                                    <div className="text-[16px] font-black text-red-700">रु {due.toFixed(2)}</div>
                                </div>


                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    <button
                                        onClick={() => {
                                            if (selectedTests.length === 0) {
                                                alert("Please add at least one test to preview the bill");
                                                return;
                                            }
                                            setShowCurrentBillPreview(true);
                                        }}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-black text-[10px] uppercase shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <MdPayments size={14} /> Generate Bill
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Patient Registry List View */
                <div className="flex-1 p-4 bg-[#f1f5f9] overflow-hidden flex flex-col gap-4 animate-in fade-in slide-in-from-bottom duration-300">
                    <div className="flex items-center justify-between bg-white p-4 border border-slate-300 rounded-xl shadow-sm">
                        <div className="flex items-center gap-8">

                            <div className="relative">
                                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    className="pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-sm w-[500px] outline-none focus:border-emerald-600 font-bold uppercase transition-all"
                                    placeholder="Search by name, ID or phone..."
                                    value={searchTerm}
                                    autoFocus
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowForm(true);
                            }}
                            className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-black text-[11px] uppercase shadow-lg hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <MdPersonAdd size={18} /> Register New Patient
                        </button>
                    </div>

                    <div className="flex-1 border-2 border-slate-300 rounded-xl overflow-auto bg-white shadow-xl custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-20">
                                <tr className="bg-slate-800 text-white text-[11px] uppercase font-black tracking-widest">
                                    <th className="px-6 py-4 border-r border-slate-700/50 w-24 text-center text-emerald-400">Photo</th>
                                    <th className="px-6 py-4 border-r border-slate-700/50 w-24 text-center">Patient ID</th>
                                    <th className="px-6 py-4 border-r border-slate-700/50">Patient Name</th>
                                    <th className="px-6 py-4 border-r border-slate-700/50 w-64">Email Address</th>
                                    <th className="px-6 py-4 border-r border-slate-700/50 w-44">Age / Gender</th>
                                    <th className="px-6 py-4 border-r border-slate-700/50 w-52 text-center">Phone</th>
                                    <th className="px-6 py-4 text-center w-36">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs font-bold text-slate-800 uppercase divide-y divide-slate-100">
                                {filteredRegistry.map((p, i) => (
                                    <tr key={i} className={`hover:bg-emerald-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                                        <td className="px-6 py-2 border-r border-slate-100/50">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden mx-auto shadow-inner">
                                                {p.photo ? <img src={p.photo} className="w-full h-full object-cover" /> : <MdPersonAdd className="text-slate-400" size={20} />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-emerald-700 font-black border-r border-slate-100/50">{p.patientId}</td>
                                        <td className="px-6 py-4 font-black text-slate-800 border-r border-slate-100/50">{p.patientName}</td>
                                        <td className="px-6 py-4 text-slate-500 border-r border-slate-100/50 lowercase italic font-normal">{p.email}</td>
                                        <td className="px-6 py-4 text-slate-500 border-r border-slate-100/50">{p.ageGender}</td>
                                        <td className="px-6 py-4 text-slate-900 border-r border-slate-100/50 text-center tracking-tight">{p.mobile}</td>
                                        <td className="px-6 py-3 text-center">
                                            <button
                                                onClick={() => loadPatientDetail(p)}
                                                className="bg-emerald-50 border-2 border-emerald-200 px-5 py-2 rounded-lg font-black text-[10px] uppercase text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-700 transition-all shadow-sm active:scale-95"
                                            >
                                                Load Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Removed Footer */}

            {/* Camera Modal */}
            {isCameraOpen && (
                <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-w-lg w-full">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between text-white">
                            <span className="text-[12px] font-black uppercase tracking-widest">Live Patient Camera</span>
                            <button onClick={stopCamera} className="hover:bg-red-500/20 p-1.5 rounded-full text-red-400"><MdClose size={20} /></button>
                        </div>
                        <div className="relative aspect-video bg-black flex items-center justify-center">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                            <canvas ref={canvasRef} className="hidden" />
                        </div>
                        <div className="p-6 bg-slate-800 flex items-center justify-center gap-4">
                            <button
                                onClick={capturePhoto}
                                className="w-20 h-20 bg-white rounded-full border-8 border-slate-600 hover:scale-110 active:scale-95 transition-all shadow-xl flex items-center justify-center overflow-hidden"
                                title="Click to Capture"
                            >
                                <div className="w-full h-full bg-red-600 rounded-full scale-50 group-active:scale-100 transition-all"></div>
                            </button>
                        </div>
                        <p className="text-slate-400 text-[10px] uppercase font-black text-center pb-4 tracking-tighter">Position the face within the frame and click the white button</p>
                    </div>
                </div>
            )}

            {/* Bill History Modal */}
            {showBillHistoryModal && (
                <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col max-w-5xl w-full max-h-[90vh]">
                        {/* Header */}
                        <div className="p-4 bg-slate-800 flex items-center justify-between text-white border-b border-slate-700">
                            <div>
                                <h2 className="text-[13px] font-black uppercase tracking-widest">Patient Billing History</h2>
                                <p className="text-[10px] font-bold text-slate-300 mt-0.5">{patientBillHistory.length} Previous Transaction{patientBillHistory.length > 1 ? 's' : ''} Found</p>
                            </div>
                            <button onClick={() => setShowBillHistoryModal(false)} className="hover:bg-white/20 p-2 rounded-full transition-all">
                                <MdClose size={24} />
                            </button>
                        </div>

                        {/* Table Content */}
                        <div className="flex-1 overflow-auto bg-slate-50">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 z-10">
                                    <tr className="bg-slate-700 text-white text-[11px] uppercase font-black tracking-wider">
                                        <th className="px-4 py-3 border-r border-slate-600 w-32">Bill ID</th>
                                        <th className="px-4 py-3 border-r border-slate-600 w-36">Date</th>
                                        <th className="px-4 py-3 border-r border-slate-600">Tests/Services</th>
                                        <th className="px-4 py-3 border-r border-slate-600 w-36 text-right">Amount</th>
                                        <th className="px-4 py-3 border-r border-slate-600 w-32 text-center">Status</th>
                                        <th className="px-4 py-3 text-center w-48">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[12px] font-bold text-slate-800 divide-y divide-slate-200">
                                    {patientBillHistory.map((bill, idx) => (
                                        <tr key={idx} className="bg-white hover:bg-blue-50/50 transition-colors">
                                            <td className="px-4 py-3 border-r border-slate-200">
                                                <span className="text-blue-900 font-black text-[13px]">{bill.id}</span>
                                            </td>
                                            <td className="px-4 py-3 border-r border-slate-200">
                                                <span className="text-slate-600 font-bold">{bill.date}</span>
                                            </td>
                                            <td className="px-4 py-3 border-r border-slate-200">
                                                <span className="text-slate-700 uppercase font-bold">
                                                    {bill.tests?.map(t => t.name).join(', ') || bill.items || 'No tests listed'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 border-r border-slate-200 text-right">
                                                <span className="text-emerald-700 font-black text-[14px]">रु {(bill.totalAmount || bill.total || 0).toFixed(2)}</span>
                                            </td>
                                            <td className="px-4 py-3 border-r border-slate-200 text-center">
                                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${bill.status === 'Paid'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {bill.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBillForPreview(bill);
                                                            setShowBillPreviewModal(true);
                                                        }}
                                                        className="px-3 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase rounded hover:bg-blue-700 transition-all active:scale-95 shadow-sm flex items-center gap-1"
                                                    >
                                                        <MdSearch size={12} />
                                                        Preview
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-slate-100 border-t border-slate-300 flex items-center justify-between">
                            <div className="text-[11px] font-bold text-slate-600">
                                Total Records: <span className="font-black text-slate-900">{patientBillHistory.length}</span>
                            </div>
                            <button
                                onClick={() => setShowBillHistoryModal(false)}
                                className="px-6 py-2 bg-slate-700 text-white text-[11px] font-black uppercase rounded-lg hover:bg-slate-900 transition-all active:scale-95 shadow-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Current Bill Preview Modal */}
            {showCurrentBillPreview && (
                <BillReceiptModal
                    bill={{
                        billNo: `NEW-${Date.now()}`,
                        date: new Date().toLocaleDateString('en-GB'),
                        patientName: `${formData.title} ${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
                        refBy: formData.refByDr,
                        address: formData.address,
                        ageGender: `${formData.ageValue} ${formData.ageUnit} / ${formData.gender}`,
                        mobile: formData.mobile || '0',
                        tests: selectedTests.map((test, idx) => ({
                            sr: idx + 1,
                            name: test.name,
                            amount: test.fees - (test.discount || 0)
                        })),
                        totalAmount: totalFees,
                        discount: 0,
                        discountAmount: totalTestDiscounts + globalDiscount,
                        paymentReceived: totalPaid,
                        dueAmount: due,
                        status: due === 0 ? 'Paid' : 'Pending',
                        patientId: formData.patientId
                    }}
                    onClose={() => setShowCurrentBillPreview(false)}
                />
            )}

            {/* Bill History Preview Modal */}
            {showBillPreviewModal && selectedBillForPreview && (
                <BillReceiptModal
                    bill={selectedBillForPreview}
                    onClose={() => {
                        setShowBillPreviewModal(false);
                        setSelectedBillForPreview(null);
                    }}
                />
            )}
        </div>
    );
}

export default PatientEntry;
