
import { MdSearch, MdKeyboardArrowDown } from "react-icons/md";

const SearchHeader = ({
    searchTerm, setSearchTerm,
    testSearch, setTestSearch,
    isTestDropdownOpen, setIsTestDropdownOpen,
    filteredTests,
    days, handleDaysChange,
    startDate, setStartDate,
    endDate, setEndDate,
    handleSearch
}) => {
    return (
        <div className="bg-white/80 backdrop-blur-md p-3 rounded-lg shadow-sm border border-white mb-3 ring-1 ring-slate-200/50">
            <div className="flex flex-wrap items-end gap-2.5">

                {/* Patient Search */}
                <div className="w-52">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-tight">Search Patient</label>
                    <div className="relative group">
                        <MdSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ID, Name..."
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Test Name Dropdown */}
                <div className="w-64 relative">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-tight">Test Name</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={testSearch}
                            onFocus={() => setIsTestDropdownOpen(true)}
                            onChange={(e) => {
                                setTestSearch(e.target.value);
                                setIsTestDropdownOpen(true);
                            }}
                            placeholder="Filter test..."
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                        />
                        <MdKeyboardArrowDown className={`absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-lg transition-transform ${isTestDropdownOpen ? 'rotate-180' : ''}`} />

                        {isTestDropdownOpen && filteredTests.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-xl max-h-60 overflow-y-auto ring-1 ring-slate-900/5">
                                {filteredTests.map((test, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            setTestSearch(test);
                                            setIsTestDropdownOpen(false);
                                        }}
                                        className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer text-slate-600 border-b border-slate-50 last:border-0"
                                    >
                                        {test}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {isTestDropdownOpen && (
                        <div className="fixed inset-0 z-40" onClick={() => setIsTestDropdownOpen(false)}></div>
                    )}
                </div>

                {/* Days Input */}
                <div className="w-16">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-tight">Days</label>
                    <input
                        type="number"
                        value={days}
                        onChange={(e) => handleDaysChange(e.target.value)}
                        className="w-full px-1 py-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm text-center font-bold text-blue-600"
                    />
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-3">
                    <div className="w-44">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-tight">From Date</label>
                        <input
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-xs font-medium"
                        />
                    </div>
                    <div className="self-center pt-5 text-slate-300 font-bold">~</div>
                    <div className="w-44">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1 tracking-tight">To Date</label>
                        <input
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-xs font-medium"
                        />
                    </div>
                </div>

                {/* Search Button */}
                <div className="ml-auto">
                    <button
                        onClick={handleSearch}
                        className="flex items-center justify-center gap-1.5 px-6 py-2.5 text-white bg-blue-600 rounded-md hover:bg-blue-700 active:scale-[0.98] transition-all font-bold shadow-md shadow-blue-500/10 text-sm"
                    >
                        <MdSearch className="text-lg" />
                        <span>Search</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SearchHeader;
