
const Profile = ({ isExpanded }) => {
  return (
    <div className={`flex items-center transition-all duration-300 ${isExpanded ? "mx-2 px-2 py-2 bg-slate-800/40 rounded-lg border border-slate-700/50" : "justify-center py-1"}`}>
      <div className={`shrink-0 transition-all duration-300 bg-blue-500/10 border border-blue-500/20 rounded-md flex items-center justify-center text-blue-400 font-bold shadow-inner uppercase ${isExpanded ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm"}`}>
        AD
      </div>
      {isExpanded && (
        <div className="ml-2.5 transition-all duration-300 overflow-hidden">
          <h3 className="text-slate-200 font-black text-[10px] leading-none uppercase">Admin User</h3>
          <p className="text-blue-400 text-[8px] font-black uppercase tracking-tighter mt-1">Super Admin</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
