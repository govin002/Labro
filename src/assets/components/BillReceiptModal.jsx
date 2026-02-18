import React, { useState, useEffect } from 'react';
import { MdClose, MdReceipt } from 'react-icons/md';

const BillReceiptModal = ({ bill, onClose }) => {
    if (!bill) return null;

    const [paperSize, setPaperSize] = useState('A4');

    useEffect(() => {
        // Load JsBarcode for the preview
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js";
        script.async = true;
        script.onload = () => {
            if (window.JsBarcode) {
                window.JsBarcode("#barcode-preview", bill.patientId || bill.billNo, {
                    format: "CODE128",
                    width: 1.5,
                    height: 40,
                    displayValue: true,
                    fontSize: 10
                });
            }
        };
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [bill.billNo]);

    const printBill = (includeHeader) => {
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write('<html><head><title>Bill Receipt</title>');

        const paperSizes = {
            A4: { width: '210mm', height: '297mm' },
            A5: { width: '148mm', height: '210mm' }
        };
        const selectedSize = paperSizes[paperSize];

        printWindow.document.write(`
            <style>
                @page {
                    size: ${paperSize};
                    margin: 10mm;
                }
                * { box-sizing: border-box; }
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 0;
                    padding: 10px;
                    width: ${selectedSize.width};
                    max-width: ${selectedSize.width};
                }
                .letterhead-container {
                    width: 100%;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .letterhead-image {
                    max-width: 100%;
                    height: auto;
                    max-height: 120px;
                }
                table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
                th, td { padding: 4px 8px; text-align: left; border: 1px solid #ddd; font-size: 11px; }
                th { background-color: #f8f9fa; font-weight: bold; }
                
                .print-layout { width: 100%; }
                .flex-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
                .col-left { width: 30%; }
                .col-center { width: 33%; text-align: center; }
                .col-right { width: 33%; text-align: right; font-size: 11px; font-weight: bold; }
                
                .title-border {
                    display: inline-block;
                    border: 2px solid #000;
                    padding: 5px 20px;
                    font-weight: 900;
                    font-size: 16px;
                    text-transform: uppercase;
                }
                
                .patient-data { margin-bottom: 20px; font-size: 12px; font-weight: bold; }
                .data-row { display: flex; margin-bottom: 5px; }
                .data-label { width: 120px; color: #444; }
                .data-value { flex: 1; border-bottom: 1px dotted #999; text-transform: uppercase; }
                
                .footer-grid { display: flex; justify-content: space-between; margin-top: 20px; }
                .words-side { width: 60%; font-size: 10px; font-weight: bold; }
                .math-side { width: 35%; font-size: 12px; font-weight: bold; }
                .math-row { display: flex; justify-content: space-between; padding: 4px 0; }
                .due-final { border-top: 2px solid #000; margin-top: 5px; padding-top: 5px; font-size: 15px; }
            </style>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        `);
        printWindow.document.write('</head><body>');

        if (includeHeader) {
            printWindow.document.write(`
                <div class="letterhead-container">
                    <img src="/pathology_header.png" alt="Pathology Letterhead" class="letterhead-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                    <div style="display:none; padding: 20px; border: 1px solid #ddd; background: #f9f9f9;">
                        <h1 style="margin:0; color:#003366;">🏥 PATHOLOGY LABORATORY</h1>
                        <p style="margin:5px 0;">Quality diagnostics you can trust</p>
                    </div>
                </div>
            `);
        }

        printWindow.document.write(`
            <div class="print-layout">
                <div class="flex-row">
                    <div class="col-left">
                        <svg id="barcode-print"></svg>
                    </div>
                    <div class="col-center">
                        <div class="title-border">Bill / RECEIPT</div>
                    </div>
                    <div class="col-right">
                        <div>Bill No : ${bill.billNo}</div>
                        <div>Age/Gender : ${bill.ageGender}</div>
                        <div>Date : ${bill.date}</div>
                        <div>Mobile : ${bill.mobile}</div>
                    </div>
                </div>

                <div class="patient-data">
                    <div class="data-row"><span class="data-label">Patient's Name</span><span class="data-value">: ${bill.patientName}</span></div>
                    <div class="data-row"><span class="data-label">Ref. By</span><span class="data-value">: ${bill.refBy}</span></div>
                    <div class="data-row"><span class="data-label">Patient's Add.</span><span class="data-value">: ${bill.address || '-'}</span></div>
                </div>

                <table>
                    <thead>
                        <tr style="border-top: 2px solid black; border-bottom: 2px solid black; background: #f5f5f5;">
                            <th style="width: 50px; text-align: center;">Sr.</th>
                            <th>Test Name</th>
                            <th style="width: 120px; text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(bill.tests || []).map((t, i) => `
                            <tr>
                                <td style="text-align: center;">${i + 1}</td>
                                <td>${t.name}</td>
                                <td style="text-align: right;">${(t.amount || 0).toFixed(0)}</td>
                            </tr>
                        `).join('')}
                        ${(!bill.tests || bill.tests.length === 0) && bill.items ? `
                            <tr><td style="text-align: center;">1</td><td>${bill.items}</td><td style="text-align: right;">${(bill.totalAmount || 0).toFixed(0)}</td></tr>
                        ` : ''}
                    </tbody>
                </table>

                <div class="footer-grid">
                    <div class="words-side">
                        <div style="margin-bottom: 10px;">Paid Amount in word : Rupees ${bill.paymentReceived === 0 ? 'Zero' : `${bill.paymentReceived} Only`}</div>
                        <div>Due Amount in word : Rupees ${bill.dueAmount === 0 ? 'Zero' : `${bill.dueAmount} Only`}</div>
                    </div>
                    <div class="math-side">
                        <div class="math-row"><span>Total Amount:</span><span>${(bill.totalAmount || 0).toFixed(0)}</span></div>
                        <div class="math-row"><span>Discount:</span><span>${(bill.discountAmount || 0).toFixed(0)}</span></div>
                        <div class="math-row" style="border-top: 1px solid #ccc;"><span style="text-transform: uppercase;">Payment Received:</span><span>${(bill.paymentReceived || 0).toFixed(0)}</span></div>
                        <div class="math-row due-final"><span>Due :</span><span>${(bill.dueAmount || 0).toFixed(0)}</span></div>
                    </div>
                </div>
            </div>
        `);

        printWindow.document.write(`
            <script>
                window.onload = function() {
                    if (window.JsBarcode) {
                        JsBarcode("#barcode-print", "${bill.patientId || bill.billNo}", {
                            format: "CODE128",
                            width: 1.5,
                            height: 35,
                            displayValue: true,
                            fontSize: 10
                        });
                    }
                    setTimeout(function() {
                        window.print();
                        window.close();
                    }, 600);
                }
            </script>
        `);

        printWindow.document.write('</body></html>');
        printWindow.document.close();
    };

    return (
        <div className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col max-w-4xl w-full max-h-[95vh]">
                <div className="p-4 bg-slate-800 flex items-center justify-between text-white">
                    <div>
                        <h2 className="text-[13px] font-black uppercase tracking-widest">Bill Receipt Preview</h2>
                        <p className="text-[10px] font-bold text-slate-300">Bill No: {bill.billNo}</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-all">
                        <MdClose size={24} />
                    </button>
                </div>

                <div className="p-3 bg-slate-100 border-b border-slate-300 space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-black text-slate-700 uppercase">Print Options:</span>
                        <div className="flex gap-2">
                            <button onClick={() => printBill(true)} className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded hover:bg-blue-700 shadow-sm flex items-center gap-1.5 transition-all active:scale-95">
                                <MdReceipt size={14} /> With Letterhead
                            </button>
                            <button onClick={() => printBill(false)} className="px-4 py-2 bg-slate-600 text-white text-[10px] font-black uppercase rounded hover:bg-slate-700 shadow-sm flex items-center gap-1.5 transition-all active:scale-95">
                                <MdReceipt size={14} /> Without Letterhead
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-black text-slate-700 uppercase">Paper Size:</span>
                        <div className="flex gap-2">
                            {['A4', 'A5'].map(size => (
                                <button key={size} onClick={() => setPaperSize(size)} className={`px-4 py-1.5 text-[9px] font-black uppercase rounded transition-all ${paperSize === size ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'}`}>
                                    {size} {size === 'A4' ? '(210×297mm)' : '(148×210mm)'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto bg-slate-200/50 p-6">
                    <div id="bill-receipt-content" className="bg-white p-10 max-w-3xl mx-auto shadow-2xl border border-slate-300" style={{ fontFamily: 'Arial, sans-serif' }}>
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-1/3">
                                <svg id="barcode-preview"></svg>
                            </div>
                            <div className="w-1/3 text-center">
                                <div className="inline-block border-2 border-slate-900 px-6 py-2 font-black tracking-tighter text-[16px] uppercase">
                                    Bill / RECEIPT
                                </div>
                            </div>
                            <div className="w-1/3 text-[11px] font-bold text-slate-700 text-right">
                                <div className="mb-0.5">Bill No : <span className="font-black text-slate-900">{bill.billNo}</span></div>
                                <div className="mb-0.5">Age/Gender : <span className="font-black text-slate-900">{bill.ageGender}</span></div>
                                <div className="mb-0.5">Date : <span className="font-black text-slate-900">{bill.date}</span></div>
                                <div>Mobile : <span className="font-black text-slate-900">{bill.mobile}</span></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-1.5 mb-8 text-[12px] font-bold text-slate-800">
                            <div className="flex border-b border-slate-100 pb-1">
                                <span className="w-36 text-slate-500 font-medium">Patient's Name</span>
                                <span className="uppercase font-black flex-1">: {bill.patientName}</span>
                            </div>
                            <div className="flex border-b border-slate-100 pb-1">
                                <span className="w-36 text-slate-500 font-medium">Ref. By</span>
                                <span className="uppercase font-black flex-1">: {bill.refBy}</span>
                            </div>
                            <div className="flex">
                                <span className="w-36 text-slate-500 font-medium">Patient's Address</span>
                                <span className="uppercase font-black flex-1">: {bill.address || '-'}</span>
                            </div>
                        </div>

                        <table className="w-full mb-8 text-[13px] border-collapse">
                            <thead>
                                <tr className="border-y-2 border-slate-900 bg-slate-50">
                                    <th className="w-12 text-center py-2.5 px-2">Sr.</th>
                                    <th className="text-left py-2.5 px-4 font-black">Test Name</th>
                                    <th className="w-32 text-right py-2.5 px-4 font-black">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {(bill.tests || []).map((test, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50">
                                        <td className="text-center py-3 px-2 font-medium">{i + 1}</td>
                                        <td className="py-3 px-4 font-bold">{test.name}</td>
                                        <td className="text-right py-3 px-4 font-black">{(test.amount || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                                {(!bill.tests || bill.tests.length === 0) && bill.items && (
                                    <tr>
                                        <td className="text-center py-3 px-2">1</td>
                                        <td className="py-3 px-4 font-bold">{bill.items}</td>
                                        <td className="text-right py-3 px-4 font-black">{(bill.totalAmount || 0).toFixed(2)}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="flex justify-between items-start pt-4 border-t border-slate-200">
                            <div className="w-3/5 text-[10px] font-bold text-slate-600 space-y-2">
                                <div className="pb-1 border-b border-slate-100">Paid Amount in word : <span className="text-slate-900 font-black">Rupees {bill.paymentReceived === 0 ? 'Zero' : `${bill.paymentReceived} Only`}</span></div>
                                <div>Due Amount in word : <span className="text-slate-900 font-black">Rupees {bill.dueAmount === 0 ? 'Zero' : `${bill.dueAmount} Only`}</span></div>
                            </div>
                            <div className="w-2/5 text-[12px] font-bold text-slate-800">
                                <div className="flex justify-between py-1"><span>Total Amount:</span><span className="w-24 text-right">{(bill.totalAmount || 0).toFixed(2)}</span></div>
                                <div className="flex justify-between py-1"><span>Discount:</span><span className="w-24 text-right">{(bill.discountAmount || 0).toFixed(2)}</span></div>
                                <div className="flex justify-between py-2 border-t border-slate-300 my-1"><span className="uppercase text-[11px] text-slate-500">Received:</span><span className="w-24 text-right font-black">{(bill.paymentReceived || 0).toFixed(2)}</span></div>
                                <div className="flex justify-between py-2.5 border-t-2 border-slate-900 mt-1 bg-slate-900 text-white px-2 rounded-sm shadow-md transition-all active:scale-[0.98]">
                                    <span className="font-black text-[14px] uppercase tracking-tighter">Due :</span>
                                    <span className="w-24 text-right font-black text-[14px]">{(bill.dueAmount || 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-800 flex items-center justify-end border-t border-slate-700">
                    <button onClick={onClose} className="px-8 py-2.5 bg-white text-slate-900 text-[11px] font-black uppercase rounded-lg hover:bg-slate-100 transition-all active:scale-95 shadow-xl">
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillReceiptModal;
