// // Components/call/CallHistory.jsx - Enhanced UI Version change the ui 
// import React, { useState, useEffect } from "react";
// import { Phone, PhoneIncoming, PhoneOutgoing, Clock, Calendar, Filter, ChevronDown } from "lucide-react";
// import { useCall } from "../../../hooks/useCall";
// import { format } from "date-fns";
// import Card from "../../../Components/ui/Card";
// import Button from "../../../Components/ui/Button";
// // import LoadingSpinner from "../../../Components/ui/LoadingSpinner";
// const CustomSelect = ({ label, options, value, onChange, id, openDropdown, setOpenDropdown }) => {
//   const isOpen = openDropdown === id;
//   const selected = options.find((opt) => opt.value === value);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (isOpen && !e.target.closest('.dropdown-container')) {
//         setOpenDropdown(null);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [isOpen, setOpenDropdown]);

//   return (
//     <div className="relative dropdown-container">
//       <label className="block text-sm sm:text-base font-black mb-2 uppercase tracking-wide">
//         {label}
//       </label>

//       {/* Dropdown trigger */}
//       <button
//         type="button"
//         onClick={() => setOpenDropdown(isOpen ? null : id)}
//         className="w-full px-4 py-3 border border-black rounded-full bg-white font-bold text-[#2C2C2C] flex justify-between items-center shadow-md hover:shadow-lg transition-all"
//       >
//         <span>{selected ? selected.label : "Select"}</span>
//         <ChevronDown className={`text-[#f2070d] transition-transform ${isOpen ? 'rotate-180' : ''}`} size={16} />
//       </button>

//       {/* Dropdown items - Only show if there are options to display */}
//       {isOpen && options.length > 0 && (
//         <div className="absolute top-full left-0 w-full bg-white border-2 border-[#f2070d] rounded-xl mt-2 shadow-lg z-50 overflow-hidden">
//           {options.map((opt) => (
//             <div
//               key={opt.value}
//               onClick={() => {
//                 onChange(opt.value);
//                 setOpenDropdown(null);
//               }}
//               className="px-4 py-2 font-bold text-[#2C2C2C] hover:bg-gray-100 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
//             >
//               {opt.label}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // --- Main CallHistory component ---
// const CallHistory = ({ onCallSelect }) => {
//   const { getCallHistory, isLoading } = useCall();
//   const [calls, setCalls] = useState([]);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [filters, setFilters] = useState({
//     status: "",
//     direction: "",
//     from_date: "",
//     to_date: "",
//   });

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const data = await getCallHistory(filters);
//         setCalls(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Error fetching call history:", err);
//         setCalls([]);
//       }
//     };
//     loadData();
//   }, [filters]);

//   const getStatusBadge = (status) => {
//     const badges = {
//       completed: "bg-gray-100 text-[#2C2C2C] border border-[#2C2C2C]",
//       failed: "bg-red-100 text-[#f2070d] border border-[#f2070d]",
//       "no-answer": "bg-yellow-100 text-yellow-800 border border-yellow-500",
//       busy: "bg-orange-100 text-orange-800 border border-orange-500",
//     };
//     return badges[status] || "bg-gray-100 text-gray-800 border border-gray-500";
//   };

//   const formatDuration = (seconds) => {
//     if (!seconds) return "0:00";
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   if (isLoading && calls.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="relative">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#f2070d]"></div>
//           <Phone className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-[#f2070d]" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50">
//       <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6 border border-black rounded-3xl bg-white shadow-lg">
//         {/* Filters Section */}
//         <Card className="p-4 sm:p-6 rounded-3xl shadow-lg bg-white">
//           <div className="flex items-center mb-6">
//             <Filter className="h-5 w-5 sm:h-6 sm:w-6 text-[#f2070d] mr-3" />
//             <h3 className="text-lg sm:text-xl font-bold text-[#2C2C2C]">
//               Filters
//             </h3>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//             {/* Direction Filter */}
//             <CustomSelect
//               id="direction"
//               label={
//                 <>
//                   <span className="text-[#2C2C2C]">CAL</span>
//                   <span className="text-[#f2070d]">L</span>
//                   <span className="text-[#2C2C2C]"> DIRE</span>
//                   <span className="text-[#f2070d]">C</span>
//                   <span className="text-[#2C2C2C]">TION</span>
//                 </>
//               }
//               options={[
//                 { value: "", label: "All Directions" },
//                 { value: "inbound", label: "Inbound" },
//                 { value: "outbound", label: "Outbound" },
//               ]}
//               value={filters.direction}
//               onChange={(value) =>
//                 setFilters({ ...filters, direction: value })
//               }
//               openDropdown={openDropdown}
//               setOpenDropdown={setOpenDropdown}
//             />

//             {/* Status Filter */}
//             <CustomSelect
//               id="status"
//               label={
//                 <>
//                   <span className="text-[#2C2C2C]">CAL</span>
//                   <span className="text-[#f2070d]">L</span>
//                   <span className="text-[#2C2C2C]"> STAT</span>
//                   <span className="text-[#f2070d]">U</span>
//                   <span className="text-[#2C2C2C]">S</span>
//                 </>
//               }
//               options={[
//                 { value: "", label: "All Status" },
//                 { value: "completed", label: "Completed" },
//                 { value: "failed", label: "Failed" },
//                 { value: "no-answer", label: "No Answer" },
//                 { value: "busy", label: "Busy" },
//               ]}
//               value={filters.status}
//               onChange={(value) => setFilters({ ...filters, status: value })}
//               openDropdown={openDropdown}
//               setOpenDropdown={setOpenDropdown}
//             />

//             {/* From Date */}
//             <div className="relative">
//               <label className="block text-sm sm:text-base font-black mb-2 uppercase tracking-wide">
//                 <span className="text-[#2C2C2C]">FRO</span>
//                 <span className="text-[#f2070d]">M</span>
//                 <span className="text-[#2C2C2C]"> DAT</span>
//                 <span className="text-[#f2070d]">E</span>
//               </label>
//               <div className="relative">
//                 <Calendar
//                   className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#f2070d] pointer-events-none z-10"
//                   size={20}
//                 />
//                 <input
//                   type="date"
//                   value={filters.from_date}
//                   onChange={(e) =>
//                     setFilters({ ...filters, from_date: e.target.value })
//                   }
//                   className="w-full pl-12 pr-4 py-3 border border-black rounded-full transition-all focus:ring-0 focus:outline-none shadow-md hover:shadow-lg cursor-pointer font-bold text-[#2C2C2C] bg-white [&::-webkit-calendar-picker-indicator]:cursor-pointer"
//                 />
//               </div>
//             </div>

//             {/* To Date */}
//             <div className="relative">
//               <label className="block text-sm sm:text-base font-black mb-2 uppercase tracking-wide">
//                 <span className="text-[#2C2C2C]">T</span>
//                 <span className="text-[#f2070d]">O</span>
//                 <span className="text-[#2C2C2C]"> DAT</span>
//                 <span className="text-[#f2070d]">E</span>
//               </label>
//               <div className="relative">
//                 <Calendar
//                   className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#f2070d] pointer-events-none z-10"
//                   size={20}
//                 />
//                 <input
//                   type="date"
//                   value={filters.to_date}
//                   onChange={(e) =>
//                     setFilters({ ...filters, to_date: e.target.value })
//                   }
//                   className="w-full pl-12 pr-4 py-3 border border-black rounded-full transition-all focus:ring-0 focus:outline-none shadow-md hover:shadow-lg cursor-pointer font-bold text-[#2C2C2C] bg-white [&::-webkit-calendar-picker-indicator]:cursor-pointer"
//                 />
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Call List Section */}
//         <div className="space-y-4">
//           {calls.length === 0 ? (
//             <Card className="p-8 sm:p-16 text-center rounded-3xl bg-white">
//               <Phone size={72} className="mx-auto text-gray-300 mb-4" />
//               <p className="text-[#2C2C2C] text-xl font-bold">No calls found</p>
//               <p className="text-gray-500 text-sm mt-2">
//                 Try adjusting your filters
//               </p>
//             </Card>
//           ) : (
//             calls.map((call) => (
//               <Card
//                 key={call._id}
//                 onClick={() => onCallSelect(call)}
//                 className="p-4 sm:p-6 rounded-3xl cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-1 transform active:scale-[0.98] bg-white"
//               >
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                   <div className="flex items-start sm:items-center space-x-5 flex-1">
//                     <div
//                       className={`p-4 rounded-2xl ${
//                         call.direction === "inbound"
//                           ? "bg-gray-100 text-[#2C2C2C]"
//                           : "bg-[#f2070d] text-white"
//                       }`}
//                     >
//                       {call.direction === "inbound" ? (
//                         <PhoneIncoming size={24} />
//                       ) : (
//                         <PhoneOutgoing size={24} />
//                       )}
//                     </div>

//                     <div className="flex-1 pb-3">
//                       <div className="font-bold text-[#2C2C2C] text-xl mb-2">
//                         {call.direction === "inbound"
//                           ? call.from_number
//                           : call.to_number}
//                       </div>
//                       <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 font-semibold">
//                         <span className="flex items-center">
//                           <Calendar
//                             size={14}
//                             className="mr-2 text-[#f2070d]"
//                           />
//                           {format(new Date(call.created_at), "MMM dd, yyyy")}
//                         </span>
//                         <span className="flex items-center">
//                           <Clock size={14} className="mr-2 text-[#f2070d]" />
//                           {format(new Date(call.created_at), "hh:mm a")}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-4">
//                     <span
//                       className={`px-5 py-2 rounded-xl text-sm font-bold uppercase ${getStatusBadge(
//                         call.status
//                       )}`}
//                     >
//                       {call.status}
//                     </span>
//                     {call.duration > 0 && (
//                       <div className="bg-[#f2070d] px-5 py-3 rounded-xl text-white text-center">
//                         <p className="text-xs font-bold uppercase">Duration</p>
//                         <p className="text-xl font-black">
//                           {formatDuration(call.duration)}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </Card>
//             ))
//           )}
//         </div>

//         {/* Results Counter */}
//         {calls.length > 0 && (
//           <div className="text-center py-6">
//             <p className="text-[#2C2C2C] font-bold text-lg">
//               Showing{" "}
//               <span className="text-[#f2070d] text-2xl">{calls.length}</span>{" "}
//               call{calls.length !== 1 ? "s" : ""}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CallHistory;




// Components/call/CallHistory.jsx - Enhanced UI Version
import React, { useState, useEffect } from "react";
import { Phone, PhoneIncoming, PhoneOutgoing, Clock, Calendar, Filter, ChevronDown } from "lucide-react";
import { useCall } from "../../../hooks/useCall";
import { format } from "date-fns";
import Card from "../../../Components/ui/Card";

const CustomSelect = ({ label, options, value, onChange, id, openDropdown, setOpenDropdown }) => {
  const isOpen = openDropdown === id;
  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setOpenDropdown]);

  return (
    <div className="relative dropdown-container">
      <label className="block text-sm sm:text-base font-black mb-2 uppercase tracking-wide">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpenDropdown(isOpen ? null : id)}
        className="w-full px-4 py-3 border border-black rounded-full bg-white font-bold text-[#2C2C2C] flex justify-between items-center shadow-md hover:shadow-lg transition-all"
      >
        <span>{selected ? selected.label : "Select"}</span>
        <ChevronDown className={`text-[#f2070d] transition-transform ${isOpen ? 'rotate-180' : ''}`} size={16} />
      </button>

      {isOpen && options.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border-2 border-[#f2070d] rounded-xl mt-2 shadow-lg z-50 overflow-hidden">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpenDropdown(null);
              }}
              className="px-4 py-2 font-bold text-[#2C2C2C] hover:bg-gray-100 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CallHistory = ({ onCallSelect }) => {
  const { getCallHistory, isLoading } = useCall();
  const [calls, setCalls] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    direction: "",
    from_date: "",
    to_date: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCallHistory(filters);
        setCalls(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching call history:", err);
        setCalls([]);
      }
    };
    loadData();
  }, [filters]);

  const getStatusBadge = (status) => {
    const badges = {
      completed: "bg-gray-100 text-[#2C2C2C] border border-[#2C2C2C]",
      failed: "bg-red-100 text-[#f2070d] border border-[#f2070d]",
      "no-answer": "bg-yellow-100 text-yellow-800 border border-yellow-500",
      busy: "bg-orange-100 text-orange-800 border border-orange-500",
    };
    return badges[status] || "bg-gray-100 text-gray-800 border border-gray-500";
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading && calls.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#f2070d]"></div>
          <Phone className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-[#f2070d]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6 border border-black rounded-3xl bg-white shadow-lg">
        {/* Filters Section */}
        <Card className="p-4 sm:p-6 rounded-3xl shadow-lg bg-white">
          <div className="flex items-center mb-6">
            <Filter className="h-5 w-5 sm:h-6 sm:w-6 text-[#f2070d] mr-3" />
            <h3 className="text-lg sm:text-xl font-bold text-[#2C2C2C]">
              Filters
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Direction Filter */}
            <CustomSelect
              id="direction"
              label={
                <>
                  <span className="text-[#2C2C2C]">CAL</span>
                  <span className="text-[#f2070d]">L</span>
                  <span className="text-[#2C2C2C]"> DIRE</span>
                  <span className="text-[#f2070d]">C</span>
                  <span className="text-[#2C2C2C]">TION</span>
                </>
              }
              options={[
                { value: "", label: "All Directions" },
                { value: "inbound", label: "Inbound" },
                { value: "outbound", label: "Outbound" },
              ]}
              value={filters.direction}
              onChange={(value) =>
                setFilters({ ...filters, direction: value })
              }
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />

            {/* Status Filter */}
            <CustomSelect
              id="status"
              label={
                <>
                  <span className="text-[#2C2C2C]">CAL</span>
                  <span className="text-[#f2070d]">L</span>
                  <span className="text-[#2C2C2C]"> STAT</span>
                  <span className="text-[#f2070d]">U</span>
                  <span className="text-[#2C2C2C]">S</span>
                </>
              }
              options={[
                { value: "", label: "All Status" },
                { value: "completed", label: "Completed" },
                { value: "failed", label: "Failed" },
                { value: "no-answer", label: "No Answer" },
                { value: "busy", label: "Busy" },
              ]}
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />

            {/* From Date */}
            <div className="relative">
              <label className="block text-sm sm:text-base font-black mb-2 uppercase tracking-wide">
                <span className="text-[#2C2C2C]">FRO</span>
                <span className="text-[#f2070d]">M</span>
                <span className="text-[#2C2C2C]"> DAT</span>
                <span className="text-[#f2070d]">E</span>
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#f2070d] pointer-events-none z-10"
                  size={20}
                />
                <input
                  type="date"
                  value={filters.from_date}
                  onChange={(e) =>
                    setFilters({ ...filters, from_date: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 border border-black rounded-full transition-all focus:ring-0 focus:outline-none shadow-md hover:shadow-lg cursor-pointer font-bold text-[#2C2C2C] bg-white [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </div>
            </div>

            {/* To Date */}
            <div className="relative">
              <label className="block text-sm sm:text-base font-black mb-2 uppercase tracking-wide">
                <span className="text-[#2C2C2C]">T</span>
                <span className="text-[#f2070d]">O</span>
                <span className="text-[#2C2C2C]"> DAT</span>
                <span className="text-[#f2070d]">E</span>
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#f2070d] pointer-events-none z-10"
                  size={20}
                />
                <input
                  type="date"
                  value={filters.to_date}
                  onChange={(e) =>
                    setFilters({ ...filters, to_date: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 border border-black rounded-full transition-all focus:ring-0 focus:outline-none shadow-md hover:shadow-lg cursor-pointer font-bold text-[#2C2C2C] bg-white [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Call List Section */}
        <div className="space-y-4">
          {calls.length === 0 ? (
            <Card className="p-8 sm:p-16 text-center rounded-3xl bg-white">
              <Phone size={72} className="mx-auto text-gray-300 mb-4" />
              <p className="text-[#2C2C2C] text-xl font-bold">No calls found</p>
              <p className="text-gray-500 text-sm mt-2">
                Try adjusting your filters
              </p>
            </Card>
          ) : (
            calls.map((call) => (
              <Card
                key={call._id}
                onClick={() => onCallSelect(call)}
                className="p-4 sm:p-6 rounded-3xl cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-1 transform active:scale-[0.98] bg-white"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center space-x-5 flex-1">
                    <div
                      className={`p-4 rounded-2xl ${
                        call.direction === "inbound"
                          ? "bg-gray-100 text-[#2C2C2C]"
                          : "bg-[#f2070d] text-white"
                      }`}
                    >
                      {call.direction === "inbound" ? (
                        <PhoneIncoming size={24} />
                      ) : (
                        <PhoneOutgoing size={24} />
                      )}
                    </div>

                    <div className="flex-1 pb-3">
                      <div className="font-bold text-[#2C2C2C] text-xl mb-2">
                        {call.direction === "inbound"
                          ? call.from_number
                          : call.to_number}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 font-semibold">
                        <span className="flex items-center">
                          <Calendar
                            size={14}
                            className="mr-2 text-[#f2070d]"
                          />
                          {format(new Date(call.created_at), "MMM dd, yyyy")}
                        </span>
                        <span className="flex items-center">
                          <Clock size={14} className="mr-2 text-[#f2070d]" />
                          {format(new Date(call.created_at), "hh:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-5 py-2 rounded-xl text-sm font-bold uppercase ${getStatusBadge(
                        call.status
                      )}`}
                    >
                      {call.status}
                    </span>
                    {call.duration > 0 && (
                      <div className="bg-[#f2070d] px-5 py-3 rounded-xl text-white text-center">
                        <p className="text-xs font-bold uppercase">Duration</p>
                        <p className="text-xl font-black">
                          {formatDuration(call.duration)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Results Counter */}
        {calls.length > 0 && (
          <div className="text-center py-6">
            <p className="text-[#2C2C2C] font-bold text-lg">
              Showing{" "}
              <span className="text-[#f2070d] text-2xl">{calls.length}</span>{" "}
              call{calls.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallHistory;