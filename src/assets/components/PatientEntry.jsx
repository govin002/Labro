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

    const handleFinalizeEntry = () => {
        // 1. Mandatory Details Validation
        if (!formData.firstName || !formData.lastName || !formData.ageValue) {
            alert("Mandatory: Please enter Patient's Name and Age before finalizing.");
            return;
        }

        // 2. Services Validation
        if (selectedTests.length === 0) {
            alert("No Services Selected: Please add at least one test to generate a bill.");
            return;
        }

        // 3. Payment Validation (Optional but good)
        if (payable > 0 && totalPaid === 0) {
            if (!confirm("No payment received. Proceed with generating a due bill?")) {
                return;
            }
        }

        // 4. Log/Simulate Saving
        console.log("Saving Consolidated Entry:", { patient: formData, tests: selectedTests, billing: { totalFees, totalTestDiscounts, payable, totalPaid, due } });

        // 5. Trigger Bill Preview (Master Action)
        setShowCurrentBillPreview(true);

        // Note: resetForm() will be called after printing/closing the receipt to prevent data loss before printing
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
        <div className="w-full h-screen bg-[#f1f5f9] font-sans flex flex-col overflow-hidden text-slate-700 select-none">
            {/* Window Header */}
            <div className="bg-[#003366] px-4 py-2 flex items-center justify-between text-white text-[12px] font-poppins font-medium shadow-md">
                <span className="flex items-center gap-2 uppercase tracking-wider">Standard Patient Entry Master</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowForm(false)} className="hover:bg-rose-500/80 rounded p-1 transition-all group" title="Close Module"><MdClose size={16} className="group-hover:rotate-90 transition-transform" /></button>
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
                                    <legend className="px-3 text-[11px] font-poppins font-semibold text-blue-900 bg-white uppercase tracking-widest border border-slate-200 rounded-full">Primary Details</legend>

                                    {/* Input Fields Area */}
                                    <div className="space-y-2 mt-2">
                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-medium w-28 text-slate-500 uppercase shrink-0">Reg. Date</label>
                                            <input
                                                type="date"
                                                name="registeredDate"
                                                value={formData.registeredDate}
                                                onChange={handleInputChange}
                                                className="flex-1 p-1 bg-white border border-slate-300 rounded text-[13px] font-semibold outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                                            />
                                            {/* View Old Bills Button - Inline */}
                                            {patientBillHistory.length > 0 && (
                                                <button
                                                    onClick={() => setShowBillHistoryModal(true)}
                                                    className="bg-blue-600 text-white px-2.5 py-1.5 rounded-md font-poppins font-semibold text-[9px] uppercase shadow-sm hover:bg-blue-700 transition-all flex items-center gap-1.5 active:scale-95 border border-blue-700 whitespace-nowrap"
                                                    title={`View ${patientBillHistory.length} previous transaction${patientBillHistory.length > 1 ? 's' : ''}`}
                                                >
                                                    <MdReceipt size={14} />
                                                    <span>Bills ({patientBillHistory.length})</span>
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-medium w-28 text-slate-500 uppercase shrink-0">Ref. By Dr</label>
                                            <div className="flex-1 flex gap-1">
                                                <select name="refByDr" value={formData.refByDr} onChange={handleInputChange} className="flex-1 p-1 border border-slate-300 rounded text-[13px] font-semibold outline-none bg-blue-50/30">
                                                    <option value="SELF">SELF (Walk-in)</option>
                                                    <option value="DR. SHARMA">DR. SHARMA</option>
                                                    <option value="DR. ADHIKARI">DR. ADHIKARI</option>
                                                </select>
                                                <button className="text-[10px] bg-slate-200 px-2 py-1 rounded font-poppins font-semibold hover:bg-slate-300 uppercase">Add</button>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <label className="text-[12px] font-medium w-28 text-slate-500 uppercase shrink-0 pt-1.5">Patient Name</label>
                                            <div className="flex-1 flex flex-col gap-1.5">
                                                <div className="flex gap-1">
                                                    <select name="title" value={formData.title} onChange={handleInputChange} className="w-20 p-1 border border-slate-300 rounded text-[13px] font-semibold outline-none bg-white">
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
                                                        className="flex-1 p-1 border border-slate-300 rounded text-[13px] font-semibold outline-none uppercase bg-white"
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="middleName"
                                                    value={formData.middleName}
                                                    onChange={handleInputChange}
                                                    placeholder="Middle Name (Optional)"
                                                    className="w-full p-1 border border-slate-300 rounded text-[13px] font-semibold outline-none uppercase bg-white focus:bg-slate-50"
                                                />
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    placeholder="Last Name"
                                                    className="w-full p-1 border border-slate-300 rounded text-[13px] font-semibold outline-none uppercase bg-white focus:bg-slate-50"
                                                />
                                            </div>
                                        </div>

                                        {/* Photo Section - Right After Name */}
                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-medium w-28 text-slate-500 uppercase shrink-0">Patient Photo</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handlePhotoChange}
                                                    accept="image/jpeg,image/png"
                                                    className="hidden"
                                                />
                                                <div className="w-20 h-20 bg-white border-2 border-dashed border-slate-200 rounded-md overflow-hidden flex flex-col items-center justify-center text-slate-400 shadow-inner">
                                                    {formData.photo ? (
                                                        <img src={formData.photo} alt="Patient" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <>
                                                            <MdPersonAdd size={24} className="text-slate-100" />
                                                            <span className="text-[7px] font-poppins font-semibold uppercase mt-0.5 tracking-tighter">No Photo</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={startCamera}
                                                        className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded text-[10px] font-poppins font-semibold uppercase hover:bg-blue-100 text-blue-700 transition-all flex items-center gap-1.5"
                                                    >
                                                        <MdCameraAlt size={14} /> Capture
                                                    </button>
                                                    <button
                                                        onClick={triggerPhotoUpload}
                                                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-poppins font-semibold uppercase hover:bg-slate-100 text-slate-700 transition-all flex items-center gap-1.5"
                                                    >
                                                        <MdFileUpload size={14} /> Upload
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-medium w-28 text-slate-500 uppercase shrink-0">Age & Sex</label>
                                            <div className="flex-1 flex gap-2">
                                                <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-24 p-1 border border-slate-300 rounded text-[13px] font-semibold outline-none bg-white">
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    name="ageValue"
                                                    value={formData.ageValue}
                                                    onChange={handleInputChange}
                                                    placeholder="00"
                                                    className="w-14 p-1 border border-slate-300 rounded text-[13px] font-semibold outline-none text-center"
                                                />
                                                <select name="ageUnit" value={formData.ageUnit} onChange={handleInputChange} className="w-20 p-1 border border-slate-300 rounded text-[13px] font-semibold outline-none">
                                                    <option value="Yrs.">YRS</option>
                                                    <option value="Mon.">MON</option>
                                                    <option value="Days">DAY</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-medium w-28 text-slate-500 uppercase shrink-0">Mobile</label>
                                            <input
                                                type="text"
                                                name="mobile"
                                                value={formData.mobile || ""}
                                                onChange={handleInputChange}
                                                placeholder="98XXXXXXXX"
                                                className="flex-1 p-1 border border-slate-300 rounded text-[13px] font-semibold outline-none"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-medium w-28 text-slate-500 uppercase shrink-0">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email || ""}
                                                onChange={handleInputChange}
                                                placeholder="patient@example.com"
                                                className="flex-1 p-1 border border-slate-300 rounded text-[13px] font-semibold outline-none"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-medium w-28 text-slate-500 uppercase shrink-0">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="City, District"
                                                className="flex-1 p-1 border border-slate-300 rounded text-[13px] outline-none font-semibold"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-medium w-28 text-slate-500 uppercase shrink-0">Agent/By</label>
                                            <div className="flex-1 flex gap-2">
                                                <select name="agentName" value={formData.agentName} onChange={handleInputChange} className="flex-1 p-1 border border-slate-300 rounded text-[13px] font-semibold outline-none bg-orange-50/20">
                                                    <option value="SELF">SELF</option>
                                                    <option value="AGENT-001">AGENT-001</option>
                                                    <option value="HOSP-TRANS">HOSPITAL TRANSFER</option>
                                                </select>
                                                <div className="w-24 flex flex-col">
                                                    <label className="text-[8px] font-poppins font-semibold uppercase text-slate-400">Share/Fraction</label>
                                                    <input
                                                        type="text"
                                                        name="agentShare"
                                                        value={formData.agentShare}
                                                        onChange={handleInputChange}
                                                        placeholder="0.00"
                                                        className="w-full p-1 border border-slate-300 rounded text-[11px] font-semibold text-right text-orange-700 bg-orange-50/50"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <label className="text-[12px] font-medium w-28 text-slate-500 uppercase shrink-0">Source</label>
                                            <div className="flex-1 flex gap-2">
                                                <select name="sampleSource" value={formData.sampleSource} onChange={handleInputChange} className="flex-1 p-1 border border-slate-300 rounded text-[13px] font-semibold outline-none bg-white">
                                                    <option value="Internal">In-house</option>
                                                    <option value="External">External</option>
                                                </select>
                                                <MdLocalHospital size={16} className="text-blue-500 self-center" />
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>

                            {/* Simplified Action Buttons */}
                            <div className="flex flex-col gap-3 p-1 mt-2">
                                <button onClick={() => setShowForm(false)} className="flex items-center justify-center gap-3 p-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 group">
                                    <MdSearch size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
                                    <div className="text-left">
                                        <p className="text-[10px] font-poppins font-semibold uppercase text-slate-800 leading-none">Open Patient Database</p>
                                        <p className="text-[8px] font-medium text-slate-400 uppercase mt-1">Search, Edit or View Master Records</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-3">
                            <div className="bg-white border border-slate-300 p-3 rounded-lg shadow-sm flex-1 flex flex-col gap-3 overflow-hidden">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-poppins font-semibold text-slate-500 uppercase tracking-widest">Available Services</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search test by name..."
                                            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-[12px] font-semibold outline-none bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-400 transition-all"
                                            value={testSearch}
                                            onChange={(e) => setTestSearch(e.target.value)}
                                        />
                                        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    </div>
                                </div>
                                <div className="flex-1 bg-slate-50/30 border border-slate-100 rounded-lg overflow-auto p-1 custom-scrollbar">
                                    {availableTests.filter(t => t.name.toLowerCase().includes(testSearch.toLowerCase())).map((test, i) => (
                                        <div
                                            key={i}
                                            onClick={() => toggleTestSelection(i)}
                                            className={`group text-[11px] p-2.5 mb-1 cursor-pointer transition-all border rounded-md uppercase font-semibold flex justify-between items-center ${multiSelectedIndexes.includes(i) ? 'bg-blue-600 border-blue-700 text-white shadow-sm' : 'hover:bg-white hover:border-blue-200 border-slate-100 text-slate-600 bg-white'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3.5 h-3.5 rounded border ${multiSelectedIndexes.includes(i) ? 'bg-white border-white' : 'border-slate-200 bg-slate-50'}`}>
                                                    {multiSelectedIndexes.includes(i) && <div className="w-full h-full text-blue-600 flex items-center justify-center">✓</div>}
                                                </div>
                                                <span>{test.name}</span>
                                            </div>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full ${multiSelectedIndexes.includes(i) ? 'bg-blue-500 text-white font-bold' : 'bg-slate-50 text-slate-400 font-medium group-hover:bg-blue-50 group-hover:text-blue-600'}`}>रु {test.fees}</span>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addTest} className={`w-full py-2.5 rounded-lg font-poppins font-semibold text-[11px] uppercase shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${multiSelectedIndexes.length > 0 ? 'bg-slate-800 text-white hover:bg-black cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                                    <MdAddCircleOutline size={18} /> Add {multiSelectedIndexes.length || ""} Items to Bill
                                </button>
                            </div>
                        </div>

                        {/* Right Pane: Bill Preview */}
                        <div className="flex-1 flex flex-col gap-3">
                            <div className="bg-white border border-slate-300 p-3 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 border border-slate-200 rounded-lg overflow-auto custom-scrollbar bg-slate-50/10">
                                    <table className="w-full text-left text-[11px] border-collapse">
                                        <thead className="sticky top-0 bg-[#f8fafc] border-b border-slate-300 z-10 shadow-sm">
                                            <tr>
                                                <th className="px-3 py-3 font-poppins font-semibold text-slate-600 uppercase tracking-wider">Test Name</th>
                                                <th className="px-2 py-3 font-poppins font-semibold text-slate-600 uppercase text-center w-20 tracking-wider">Fees</th>
                                                <th className="px-2 py-3 font-poppins font-semibold text-slate-600 uppercase text-center w-20 tracking-wider">Disc.</th>
                                                <th className="px-3 py-3 font-poppins font-semibold text-slate-600 uppercase text-right w-24 tracking-wider">Net</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {selectedTests.map((test, i) => (
                                                <tr key={test.id || i} className="group hover:bg-slate-50 transition-colors bg-white">
                                                    <td className="px-3 py-2 uppercase text-slate-700 font-medium relative">
                                                        {test.name}
                                                        <button
                                                            onClick={() => removeTest(i)}
                                                            className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600 transition-all shadow-sm"
                                                        >
                                                            <MdClose size={12} />
                                                        </button>
                                                    </td>
                                                    <td className="px-2 py-2 text-center text-slate-400 font-medium">{test.fees.toFixed(0)}</td>
                                                    <td className="px-2 py-2">
                                                        <input
                                                            type="text"
                                                            value={test.discount}
                                                            onChange={(e) => handleTestDiscountChange(i, e.target.value)}
                                                            className="w-full p-1 border border-slate-100 rounded text-center text-[10px] font-semibold outline-none focus:border-blue-400 focus:bg-blue-50/10 transition-colors"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 text-right font-semibold text-slate-900">रु {(test.fees - (test.discount || 0)).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            {selectedTests.length === 0 && (
                                                <tr><td colSpan="4" className="px-3 py-24 text-center text-slate-300 italic uppercase font-semibold tracking-widest text-[10px]">No services selected for bill</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-white border border-slate-300 p-4 rounded-lg shadow-md space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Sub Total (Gross)</label>
                                    <div className="text-[14px] font-poppins font-semibold text-slate-900">रु {totalFees.toFixed(2)}</div>
                                </div>

                                <div className="flex items-center justify-between text-rose-500">
                                    <label className="text-[10px] font-medium uppercase tracking-wider">Item-wise Discount</label>
                                    <div className="text-[12px] font-semibold">- रु {totalTestDiscounts.toFixed(2)}</div>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-50 pt-1">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" name="freeOfCost" checked={formData.freeOfCost} onChange={handleInputChange} className="w-3.5 h-3.5 accent-blue-600" id="foc" />
                                        <label htmlFor="foc" className="text-[10px] font-medium text-slate-400 uppercase cursor-pointer tracking-wider">Free of Cost</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Add. Discount</label>
                                        <input
                                            type="text"
                                            name="discountAmount"
                                            value={formData.discountAmount}
                                            onChange={handleInputChange}
                                            className="w-20 p-1 border border-slate-100 rounded text-[11px] font-semibold text-right text-rose-600 bg-rose-50/30 outline-none focus:ring-1 focus:ring-rose-200"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                    <label className="text-[11px] font-poppins font-medium text-slate-800 uppercase tracking-widest italic tracking-tighter">Net Payable</label>
                                    <div className="text-[20px] font-poppins font-bold text-[#065f46]">रु {payable.toFixed(2)}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-slate-50">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div> Cash Payment</label>
                                        <input
                                            type="text"
                                            name="cashAmount"
                                            value={formData.cashAmount}
                                            onChange={handleInputChange}
                                            className="w-full p-2 bg-emerald-50/10 border border-slate-100 rounded text-[13px] font-semibold text-right text-slate-700 outline-none focus:ring-1 focus:ring-emerald-200"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div> Online / FonePay</label>
                                        <input
                                            type="text"
                                            name="onlineAmount"
                                            value={formData.onlineAmount}
                                            onChange={handleInputChange}
                                            className="w-full p-2 bg-blue-50/10 border border-slate-100 rounded text-[13px] font-semibold text-right text-slate-700 outline-none focus:ring-1 focus:ring-blue-200"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Total Received</label>
                                    <div className="text-[12px] font-semibold text-slate-700">रु {totalPaid.toFixed(2)}</div>
                                </div>

                                <div className="flex items-center justify-between p-2 bg-rose-50/50 border border-rose-100 rounded-lg">
                                    <label className="text-[11px] font-poppins font-semibold text-rose-400 uppercase tracking-[0.1em]">Balance Due</label>
                                    <div className="text-[16px] font-poppins font-bold text-rose-600">रु {due.toFixed(2)}</div>
                                </div>


                                <div className="grid grid-cols-1 gap-2 mt-1">
                                    <button
                                        onClick={handleFinalizeEntry}
                                        className="w-full bg-emerald-600 text-white py-3 rounded-xl font-poppins font-semibold text-[13px] uppercase shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex flex-col items-center justify-center gap-0.5 active:scale-[0.98] border-b-2 border-emerald-800"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MdSave size={18} />
                                            <span>Finalize & Print Bill</span>
                                        </div>
                                        <span className="text-[8px] opacity-70 font-medium uppercase tracking-[0.2em]">Register & Invoicing</span>
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
                                    className="pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-sm w-[500px] outline-none focus:border-emerald-600 font-semibold uppercase transition-all"
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
                            className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-poppins font-semibold text-[12px] uppercase shadow-md hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <MdPersonAdd size={18} /> Register New Patient
                        </button>
                    </div>

                    <div className="flex-1 border border-slate-200 rounded-xl overflow-auto bg-white shadow-xl custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-20">
                                <tr className="bg-slate-800 text-white text-[11px] font-poppins font-medium uppercase tracking-widest">
                                    <th className="px-6 py-4 border-r border-slate-700/30 w-24 text-center text-emerald-400">Photo</th>
                                    <th className="px-6 py-4 border-r border-slate-700/30 w-24 text-center">Patient ID</th>
                                    <th className="px-6 py-4 border-r border-slate-700/30">Patient Name</th>
                                    <th className="px-6 py-4 border-r border-slate-700/30 w-64">Email Address</th>
                                    <th className="px-6 py-4 border-r border-slate-700/30 w-44">Age / Gender</th>
                                    <th className="px-6 py-4 border-r border-slate-700/30 w-52 text-center">Phone</th>
                                    <th className="px-6 py-4 text-center w-36">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs font-semibold text-slate-600 uppercase divide-y divide-slate-50">
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
                            <span className="text-[12px] font-poppins font-semibold uppercase tracking-widest">Live Patient Camera</span>
                            <button onClick={stopCamera} className="hover:bg-rose-500/20 p-1.5 rounded-full text-rose-400 transition-colors"><MdClose size={20} /></button>
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
                                <div className="w-full h-full bg-rose-600 rounded-full scale-50 group-active:scale-100 transition-all"></div>
                            </button>
                        </div>
                        <p className="text-slate-400 text-[10px] uppercase font-poppins font-medium text-center pb-6 tracking-widest opacity-80">Position face within frame and capture</p>
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
                                <h2 className="text-[13px] font-poppins font-semibold uppercase tracking-widest">Patient Billing History</h2>
                                <p className="text-[10px] font-medium text-slate-400 mt-0.5">{patientBillHistory.length} Previous Transaction{patientBillHistory.length > 1 ? 's' : ''} Found</p>
                            </div>
                            <button onClick={() => setShowBillHistoryModal(false)} className="hover:bg-white/10 p-2 rounded-full transition-all">
                                <MdClose size={24} />
                            </button>
                        </div>

                        {/* Table Content */}
                        <div className="flex-1 overflow-auto bg-slate-50">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 z-10">
                                    <tr className="bg-slate-700 text-white text-[11px] uppercase font-poppins font-medium tracking-widest">
                                        <th className="px-4 py-3 border-r border-slate-600 w-32">Bill ID</th>
                                        <th className="px-4 py-3 border-r border-slate-600 w-36">Date</th>
                                        <th className="px-4 py-3 border-r border-slate-600">Tests/Services</th>
                                        <th className="px-4 py-3 border-r border-slate-600 w-36 text-right">Amount</th>
                                        <th className="px-4 py-3 border-r border-slate-600 w-32 text-center">Status</th>
                                        <th className="px-4 py-3 text-center w-48">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[12px] font-semibold text-slate-600 divide-y divide-slate-100">
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
