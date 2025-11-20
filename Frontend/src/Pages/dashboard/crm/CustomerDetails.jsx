// // frontend/src/pages/dashboard/crm/CustomerDetails.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   ArrowLeft,
//   Edit,
//   Trash2,
//   Phone,
//   Mail,
//   Calendar,
//   Clock,
//   Tag,
//   Plus,
//   MessageSquare,
//   PhoneCall,
//   FileText,
//   MapPin,
//   Building,
//   ExternalLink,
//   Eye
// } from 'lucide-react';
// import Card from '../../../Components/ui/Card';
// import Button from '../../../Components/ui/Button';
// import Badge from '../../../Components/ui/Badge';
// import Modal from '../../../Components/ui/Modal';
// import Input from '../../../Components/ui/Input';
// import customerService from '../../../services/customer';
// import { formatDate, formatPhone, formatDateTime } from '../../../utils/helpers';
// import toast from 'react-hot-toast';

// const CustomerDetails = () => {
//   const { customerId } = useParams();
//   const navigate = useNavigate();
//   const [customer, setCustomer] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [callHistory, setCallHistory] = useState([]);
//   const [timeline, setTimeline] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [showNoteModal, setShowNoteModal] = useState(false);
//   const [showTagModal, setShowTagModal] = useState(false);
//   const [newNote, setNewNote] = useState('');
//   const [newTag, setNewTag] = useState('');

//   useEffect(() => {
//     fetchCustomerData();
//   }, [customerId]);

//   const fetchCustomerData = async () => {
//     try {
//       setLoading(true);
//       const [customerData, appointmentsData, callsData, timelineData] = await Promise.all([
//         customerService.getById(customerId),
//         customerService.getAppointments(customerId),
//         customerService.getCallHistory(customerId),
//         customerService.getTimeline(customerId)
//       ]);

//       setCustomer(customerData);
//       setAppointments(appointmentsData.appointments || []);
//       setCallHistory(callsData.calls || []);
//       setTimeline(timelineData.timeline || []);
//     } catch (error) {
//       console.error('Failed to fetch customer data:', error);
//       toast.error('Failed to load customer details');
//       navigate('/dashboard/crm/customers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddNote = async () => {
//     if (!newNote.trim()) {
//       toast.error('Please enter a note');
//       return;
//     }

//     try {
//       await customerService.addNote(customerId, newNote);
//       toast.success('Note added successfully');
//       setNewNote('');
//       setShowNoteModal(false);
//       fetchCustomerData();
//     } catch (error) {
//       console.error('Failed to add note:', error);
//       toast.error('Failed to add note');
//     }
//   };

//   const handleAddTag = async () => {
//     if (!newTag.trim()) {
//       toast.error('Please enter a tag');
//       return;
//     }

//     try {
//       await customerService.addTags(customerId, [newTag]);
//       toast.success('Tag added successfully');
//       setNewTag('');
//       setShowTagModal(false);
//       fetchCustomerData();
//     } catch (error) {
//       console.error('Failed to add tag:', error);
//       toast.error('Failed to add tag');
//     }
//   };

//   const handleRemoveTag = async (tag) => {
//     try {
//       await customerService.removeTag(customerId, tag);
//       toast.success('Tag removed successfully');
//       fetchCustomerData();
//     } catch (error) {
//       console.error('Failed to remove tag:', error);
//       toast.error('Failed to remove tag');
//     }
//   };

//   const handleDelete = async () => {
//     if (!window.confirm('Are you sure you want to delete this customer?')) return;

//     try {
//       await customerService.delete(customerId);
//       toast.success('Customer deleted successfully');
//       navigate('/dashboard/crm/customers');
//     } catch (error) {
//       console.error('Failed to delete customer:', error);
//       toast.error('Failed to delete customer');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f2070d]"></div>
//       </div>
//     );
//   }

//   if (!customer) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-[#666666]">Customer not found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Button
//             variant="outline"
//             onClick={() => navigate('/dashboard/crm/customers')}
//             className="border-[#E0E0E0]"
//           >
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <div>
//             <h1 className="text-2xl font-bold text-[#2C2C2C]">{customer.name}</h1>
//             <p className="text-sm text-[#666666] mt-1">
//               Customer since {formatDate(customer.created_at)}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <Button
//             variant="outline"
//             onClick={() => navigate(`/dashboard/crm/customers/${customerId}/edit`)}
//             className="border-[#2C2C2C] text-[#2C2C2C]"
//           >
//             <Edit className="h-4 w-4 mr-2" />
//             Edit
//           </Button>
//           <Button
//             variant="outline"
//             onClick={handleDelete}
//             className="border-[#f2070d] text-[#f2070d] hover:bg-[#f2070d] hover:text-white"
//           >
//             <Trash2 className="h-4 w-4 mr-2" />
//             Delete
//           </Button>
//         </div>
//       </div>

//       {/* Customer Info Cards */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Contact Information */}
//         <Card className="p-6 border-2 border-[#F0F0F0]">
//           <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Contact Information</h3>
//           <div className="space-y-3">
//             <div className="flex items-center gap-3">
//               <Mail className="h-5 w-5 text-[#666666]" />
//               <div>
//                 <div className="text-sm text-[#666666]">Email</div>
//                 <a
//                   href={`mailto:${customer.email}`}
//                   className="text-[#f2070d] hover:underline font-medium"
//                 >
//                   {customer.email}
//                 </a>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <Phone className="h-5 w-5 text-[#666666]" />
//               <div>
//                 <div className="text-sm text-[#666666]">Phone</div>
//                 <a
//                   href={`tel:${customer.phone}`}
//                   className="text-[#f2070d] hover:underline font-medium"
//                 >
//                   {formatPhone(customer.phone)}
//                 </a>
//               </div>
//             </div>

//             {customer.company && (
//               <div className="flex items-center gap-3">
//                 <Building className="h-5 w-5 text-[#666666]" />
//                 <div>
//                   <div className="text-sm text-[#666666]">Company</div>
//                   <div className="font-medium text-[#2C2C2C]">{customer.company}</div>
//                 </div>
//               </div>
//             )}

//             {customer.address && (
//               <div className="flex items-center gap-3">
//                 <MapPin className="h-5 w-5 text-[#666666]" />
//                 <div>
//                   <div className="text-sm text-[#666666]">Address</div>
//                   <div className="font-medium text-[#2C2C2C]">{customer.address}</div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </Card>

//         {/* Statistics */}
//         <Card className="p-6 border-2 border-[#F0F0F0]">
//           <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Statistics</h3>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-5 w-5 text-[#666666]" />
//                 <span className="text-sm text-[#666666]">Total Appointments</span>
//               </div>
//               <span className="text-xl font-bold text-[#2C2C2C]">
//                 {customer.total_appointments || 0}
//               </span>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <PhoneCall className="h-5 w-5 text-[#666666]" />
//                 <span className="text-sm text-[#666666]">Total Calls</span>
//               </div>
//               <span className="text-xl font-bold text-[#2C2C2C]">
//                 {customer.total_calls || 0}
//               </span>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <MessageSquare className="h-5 w-5 text-[#666666]" />
//                 <span className="text-sm text-[#666666]">Total Interactions</span>
//               </div>
//               <span className="text-xl font-bold text-[#2C2C2C]">
//                 {customer.total_interactions || 0}
//               </span>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Clock className="h-5 w-5 text-[#666666]" />
//                 <span className="text-sm text-[#666666]">Last Contact</span>
//               </div>
//               <span className="text-sm font-medium text-[#2C2C2C]">
//                 {customer.last_contact_at ? formatDate(customer.last_contact_at) : 'Never'}
//               </span>
//             </div>
//           </div>
//         </Card>

//         {/* Tags & Notes */}
//         <Card className="p-6 border-2 border-[#F0F0F0]">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-[#2C2C2C]">Tags</h3>
//             <button
//               onClick={() => setShowTagModal(true)}
//               className="p-2 hover:bg-[#F0F0F0] rounded-lg transition-colors"
//             >
//               <Plus className="h-4 w-4 text-[#666666]" />
//             </button>
//           </div>

//           <div className="flex flex-wrap gap-2 mb-6">
//             {customer.tags && customer.tags.length > 0 ? (
//               customer.tags.map((tag, index) => (
//                 <Badge
//                   key={index}
//                   variant="secondary"
//                   className="bg-[#F0F0F0] text-[#2C2C2C] border border-[#E0E0E0] flex items-center gap-1"
//                 >
//                   {tag}
//                   <button
//                     onClick={() => handleRemoveTag(tag)}
//                     className="ml-1 hover:text-[#f2070d]"
//                   >
//                     ×
//                   </button>
//                 </Badge>
//               ))
//             ) : (
//               <span className="text-sm text-[#999999]">No tags yet</span>
//             )}
//           </div>

//           <div className="border-t border-[#E0E0E0] pt-4">
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-sm font-semibold text-[#2C2C2C]">Notes</h3>
//               <button
//                 onClick={() => setShowNoteModal(true)}
//                 className="p-2 hover:bg-[#F0F0F0] rounded-lg transition-colors"
//               >
//                 <Plus className="h-4 w-4 text-[#666666]" />
//               </button>
//             </div>
//             {customer.notes ? (
//               <p className="text-sm text-[#666666] bg-[#F9F9F9] p-3 rounded-lg">
//                 {customer.notes}
//               </p>
//             ) : (
//               <p className="text-sm text-[#999999]">No notes yet</p>
//             )}
//           </div>
//         </Card>
//       </div>

//       {/* Tabs */}
//       <Card className="border-2 border-[#F0F0F0]">
//         <div className="border-b border-[#E0E0E0]">
//           <div className="flex space-x-8 px-6">
//             <button
//               onClick={() => setActiveTab('overview')}
//               className={`py-4 border-b-2 font-medium transition-colors ${
//                 activeTab === 'overview'
//                   ? 'border-[#f2070d] text-[#f2070d]'
//                   : 'border-transparent text-[#666666] hover:text-[#2C2C2C]'
//               }`}
//             >
//               Overview
//             </button>
//             <button
//               onClick={() => setActiveTab('appointments')}
//               className={`py-4 border-b-2 font-medium transition-colors ${
//                 activeTab === 'appointments'
//                   ? 'border-[#f2070d] text-[#f2070d]'
//                   : 'border-transparent text-[#666666] hover:text-[#2C2C2C]'
//               }`}
//             >
//               Appointments ({appointments.length})
//             </button>
//             <button
//               onClick={() => setActiveTab('calls')}
//               className={`py-4 border-b-2 font-medium transition-colors ${
//                 activeTab === 'calls'
//                   ? 'border-[#f2070d] text-[#f2070d]'
//                   : 'border-transparent text-[#666666] hover:text-[#2C2C2C]'
//               }`}
//             >
//               Call History ({callHistory.length})
//             </button>
//             <button
//               onClick={() => setActiveTab('timeline')}
//               className={`py-4 border-b-2 font-medium transition-colors ${
//                 activeTab === 'timeline'
//                   ? 'border-[#f2070d] text-[#f2070d]'
//                   : 'border-transparent text-[#666666] hover:text-[#2C2C2C]'
//               }`}
//             >
//               Timeline
//             </button>
//           </div>
//         </div>

//         <div className="p-6">
//           {/* Overview Tab */}
//           {activeTab === 'overview' && (
//             <div className="space-y-6">
//               <div>
//                 <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">
//                   Recent Activity
//                 </h3>
//                 {timeline.length > 0 ? (
//                   <div className="space-y-4">
//                     {timeline.slice(0, 5).map((event, index) => (
//                       <div key={index} className="flex items-start gap-3">
//                         <div className="w-2 h-2 bg-[#f2070d] rounded-full mt-2"></div>
//                         <div className="flex-1">
//                           <div className="text-sm font-medium text-[#2C2C2C]">
//                             {event.title}
//                           </div>
//                           <div className="text-sm text-[#666666]">{event.description}</div>
//                           <div className="text-xs text-[#999999] mt-1">
//                             {formatDateTime(event.timestamp)}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-[#999999]">No recent activity</p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Appointments Tab */}
//           {activeTab === 'appointments' && (
//             <div className="space-y-4">
//               {appointments.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-[#E0E0E0]">
//                     <thead className="bg-[#F9F9F9]">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-[#666666] uppercase tracking-wider">
//                           Service
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-[#666666] uppercase tracking-wider">
//                           Date & Time
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-[#666666] uppercase tracking-wider">
//                           Status
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-[#666666] uppercase tracking-wider">
//                           Duration
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-[#666666] uppercase tracking-wider">
//                           Created
//                         </th>
//                         <th className="px-6 py-3 text-right text-xs font-medium text-[#666666] uppercase tracking-wider">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-[#E0E0E0]">
//                       {appointments.map((appointment) => (
//                         <tr key={appointment.id} className="hover:bg-[#F9F9F9]">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <Calendar className="h-4 w-4 text-[#666666] mr-2" />
//                               <div>
//                                 <div className="text-sm font-medium text-[#2C2C2C]">
//                                   {appointment.service_type || 'General'}
//                                 </div>
//                                 {appointment.notes && (
//                                   <div className="text-xs text-[#999999] truncate max-w-[200px]">
//                                     {appointment.notes}
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm text-[#2C2C2C]">
//                               {appointment.appointment_date
//                                 ? new Date(appointment.appointment_date).toLocaleDateString('en-US', {
//                                     weekday: 'short',
//                                     month: 'short',
//                                     day: 'numeric',
//                                     year: 'numeric'
//                                   })
//                                 : 'N/A'}
//                             </div>
//                             <div className="text-xs text-[#666666]">
//                               {appointment.appointment_date
//                                 ? new Date(appointment.appointment_date).toLocaleTimeString('en-US', {
//                                     hour: '2-digit',
//                                     minute: '2-digit'
//                                   })
//                                 : ''}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <Badge
//                               variant={
//                                 appointment.status === 'completed'
//                                   ? 'success'
//                                   : appointment.status === 'cancelled'
//                                   ? 'danger'
//                                   : appointment.status === 'confirmed'
//                                   ? 'info'
//                                   : 'warning'
//                               }
//                             >
//                               {appointment.status}
//                             </Badge>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666666]">
//                             {appointment.duration_minutes || 60} min
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666666]">
//                             {appointment.created_at
//                               ? new Date(appointment.created_at).toLocaleDateString('en-US', {
//                                   month: 'short',
//                                   day: 'numeric',
//                                   year: 'numeric',
//                                   hour: '2-digit',
//                                   minute: '2-digit'
//                                 })
//                               : 'N/A'}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                             <div className="flex items-center justify-end gap-2">
//                               {appointment.google_calendar_link && (
//                                 <button
//                                   onClick={() => window.open(appointment.google_calendar_link, '_blank')}
//                                   className="text-[#666666] hover:text-[#2C2C2C] p-1"
//                                   title="Open in Google Calendar"
//                                 >
//                                   <ExternalLink className="h-4 w-4" />
//                                 </button>
//                               )}
//                               <button
//                                 onClick={() => navigate('/dashboard/email-logs')}
//                                 className="text-[#666666] hover:text-[#f2070d] p-1"
//                                 title="View in Email Logs"
//                               >
//                                 <Eye className="h-4 w-4" />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <Calendar className="h-12 w-12 text-[#999999] mx-auto mb-4" />
//                   <p className="text-[#999999]">No appointments yet</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Call History Tab */}
//           {activeTab === 'calls' && (
//             <div className="space-y-4">
//               {callHistory.length > 0 ? (
//                 callHistory.map((call) => (
//                   <Card key={call.id} className="p-4 border border-[#E0E0E0]">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3 flex-1">
//                         <div
//                           className={`p-2 rounded-lg ${
//                             call.direction === 'inbound'
//                               ? 'bg-[#D1FAE5] text-[#10B981]'
//                               : 'bg-[#DBEAFE] text-[#3B82F6]'
//                           }`}
//                         >
//                           <PhoneCall className="h-5 w-5" />
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-1">
//                             <span className="font-semibold text-[#2C2C2C]">
//                               {call.direction === 'inbound' ? 'Incoming Call' : 'Outgoing Call'}
//                             </span>
//                             <Badge
//                               variant={
//                                 call.status === 'completed'
//                                   ? 'success'
//                                   : call.status === 'missed'
//                                   ? 'danger'
//                                   : 'warning'
//                               }
//                             >
//                               {call.status}
//                             </Badge>
//                           </div>
//                           <div className="text-sm text-[#666666]">
//                             Duration: {call.duration}s • {formatDateTime(call.created_at)}
//                           </div>
//                         </div>
//                       </div>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => navigate('/dashboard/call-logs')}
//                         className="border-[#E0E0E0]"
//                       >
//                         View Details
//                       </Button>
//                     </div>
//                   </Card>
//                 ))
//               ) : (
//                 <div className="text-center py-12">
//                   <PhoneCall className="h-12 w-12 text-[#999999] mx-auto mb-4" />
//                   <p className="text-[#999999]">No call history yet</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Timeline Tab */}
//           {activeTab === 'timeline' && (
//             <div className="space-y-4">
//               {timeline.length > 0 ? (
//                 <div className="relative">
//                   <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#E0E0E0]"></div>
//                   <div className="space-y-6">
//                     {timeline.map((event, index) => (
//                       <div key={index} className="relative pl-12">
//                         <div className="absolute left-2.5 top-2 w-3 h-3 bg-[#f2070d] rounded-full border-4 border-white"></div>
//                         <Card className="p-4 border border-[#E0E0E0]">
//                           <div className="flex items-center gap-2 mb-2">
//                             {event.type === 'call' && <PhoneCall className="h-4 w-4 text-[#666666]" />}
//                             {event.type === 'appointment' && <Calendar className="h-4 w-4 text-[#666666]" />}
//                             {event.type === 'email' && <Mail className="h-4 w-4 text-[#666666]" />}
//                             {event.type === 'sms' && <MessageSquare className="h-4 w-4 text-[#666666]" />}
//                             {event.type === 'note' && <FileText className="h-4 w-4 text-[#666666]" />}
//                             <span className="font-semibold text-[#2C2C2C]">{event.title}</span>
//                           </div>
//                           <p className="text-sm text-[#666666] mb-2">{event.description}</p>
//                           <div className="text-xs text-[#999999]">
//                             {formatDateTime(event.timestamp)}
//                           </div>
//                         </Card>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <Clock className="h-12 w-12 text-[#999999] mx-auto mb-4" />
//                   <p className="text-[#999999]">No timeline events yet</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Add Note Modal */}
//       <Modal
//         isOpen={showNoteModal}
//         onClose={() => {
//           setShowNoteModal(false);
//           setNewNote('');
//         }}
//         title="Add Note"
//       >
//         <div className="space-y-4">
//           <textarea
//             value={newNote}
//             onChange={(e) => setNewNote(e.target.value)}
//             placeholder="Enter your note here..."
//             rows={4}
//             className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#f2070d]"
//           />
//           <div className="flex justify-end gap-3">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowNoteModal(false);
//                 setNewNote('');
//               }}
//               className="border-[#E0E0E0]"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleAddNote}
//               className="bg-gradient-to-r from-[#f2070d] to-[#FF6B6B] text-white"
//             >
//               Add Note
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       {/* Add Tag Modal */}
//       <Modal
//         isOpen={showTagModal}
//         onClose={() => {
//           setShowTagModal(false);
//           setNewTag('');
//         }}
//         title="Add Tag"
//       >
//         <div className="space-y-4">
//           <Input
//             type="text"
//             value={newTag}
//             onChange={(e) => setNewTag(e.target.value)}
//             placeholder="Enter tag name"
//             className="border-[#E0E0E0] focus:border-[#f2070d]"
//           />
//           <div className="flex justify-end gap-3">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setShowTagModal(false);
//                 setNewTag('');
//               }}
//               className="border-[#E0E0E0]"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleAddTag}
//               className="bg-gradient-to-r from-[#f2070d] to-[#FF6B6B] text-white"
//             >
//               Add Tag
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default CustomerDetails;
// frontend/src/pages/dashboard/crm/CustomerDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  Clock,
  Tag,
  Plus,
  MessageSquare,
  PhoneCall,
  FileText,
  MapPin,
  Building,
  ExternalLink,
  Eye
} from 'lucide-react';
import Card from '../../../Components/ui/Card';
import Button from '../../../Components/ui/Button';
import Badge from '../../../Components/ui/Badge';
import Modal from '../../../Components/ui/Modal';
import Input from '../../../Components/ui/Input';
import customerService from '../../../services/customer';
import { formatDate, formatPhone, formatDateTime } from '../../../utils/helpers';
import toast from 'react-hot-toast';

const CustomerDetails = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchCustomerData();
  }, [customerId]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const [customerData, appointmentsData, callsData, timelineData] = await Promise.all([
        customerService.getById(customerId),
        customerService.getAppointments(customerId),
        customerService.getCallHistory(customerId),
        customerService.getTimeline(customerId)
      ]);

      setCustomer(customerData);
      setAppointments(appointmentsData.appointments || []);
      setCallHistory(callsData.calls || []);
      setTimeline(timelineData.timeline || []);
    } catch (error) {
      console.error('Failed to fetch customer data:', error);
      toast.error('Failed to load customer details');
      navigate('/dashboard/crm/customers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      await customerService.addNote(customerId, newNote);
      toast.success('Note added successfully');
      setNewNote('');
      setShowNoteModal(false);
      fetchCustomerData();
    } catch (error) {
      console.error('Failed to add note:', error);
      toast.error('Failed to add note');
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) {
      toast.error('Please enter a tag');
      return;
    }

    try {
      await customerService.addTags(customerId, [newTag]);
      toast.success('Tag added successfully');
      setNewTag('');
      setShowTagModal(false);
      fetchCustomerData();
    } catch (error) {
      console.error('Failed to add tag:', error);
      toast.error('Failed to add tag');
    }
  };

  const handleRemoveTag = async (tag) => {
    try {
      await customerService.removeTag(customerId, tag);
      toast.success('Tag removed successfully');
      fetchCustomerData();
    } catch (error) {
      console.error('Failed to remove tag:', error);
      toast.error('Failed to remove tag');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await customerService.delete(customerId);
      toast.success('Customer deleted successfully');
      navigate('/dashboard/crm/customers');
    } catch (error) {
      console.error('Failed to delete customer:', error);
      toast.error('Failed to delete customer');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f2070d]"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-[#666666]">Customer not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/crm/customers')}
            className="border-[#E0E0E0]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#2C2C2C]">{customer.name}</h1>
            <p className="text-sm text-[#666666] mt-1">
              Customer since {formatDate(customer.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/crm/customers/${customerId}/edit`)}
            className="border-[#2C2C2C] text-[#2C2C2C]"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="border-[#f2070d] text-[#f2070d] hover:bg-[#f2070d] hover:text-white"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Customer Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <Card className="p-6 border-2 border-[#F0F0F0]">
          <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-[#666666]" />
              <div>
                <div className="text-sm text-[#666666]">Email</div>
                <a
                  href={`mailto:${customer.email}`}
                  className="text-[#f2070d] hover:underline font-medium"
                >
                  {customer.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-[#666666]" />
              <div>
                <div className="text-sm text-[#666666]">Phone</div>
                <a
                  href={`tel:${customer.phone}`}
                  className="text-[#f2070d] hover:underline font-medium"
                >
                  {formatPhone(customer.phone)}
                </a>
              </div>
            </div>

            {customer.company && (
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-[#666666]" />
                <div>
                  <div className="text-sm text-[#666666]">Company</div>
                  <div className="font-medium text-[#2C2C2C]">{customer.company}</div>
                </div>
              </div>
            )}

            {customer.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-[#666666]" />
                <div>
                  <div className="text-sm text-[#666666]">Address</div>
                  <div className="font-medium text-[#2C2C2C]">{customer.address}</div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Statistics */}
        <Card className="p-6 border-2 border-[#F0F0F0]">
          <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#666666]" />
                <span className="text-sm text-[#666666]">Total Appointments</span>
              </div>
              <span className="text-xl font-bold text-[#2C2C2C]">
                {customer.total_appointments || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5 text-[#666666]" />
                <span className="text-sm text-[#666666]">Total Calls</span>
              </div>
              <span className="text-xl font-bold text-[#2C2C2C]">
                {customer.total_calls || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#666666]" />
                <span className="text-sm text-[#666666]">Total Interactions</span>
              </div>
              <span className="text-xl font-bold text-[#2C2C2C]">
                {customer.total_interactions || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#666666]" />
                <span className="text-sm text-[#666666]">Last Contact</span>
              </div>
              <span className="text-sm font-medium text-[#2C2C2C]">
                {customer.last_contact_at ? formatDate(customer.last_contact_at) : 'Never'}
              </span>
            </div>
          </div>
        </Card>

        {/* Tags & Notes */}
        <Card className="p-6 border-2 border-[#F0F0F0]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#2C2C2C]">Tags</h3>
            <button
              onClick={() => setShowTagModal(true)}
              className="p-2 hover:bg-[#F0F0F0] rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4 text-[#666666]" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {customer.tags && customer.tags.length > 0 ? (
              customer.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-[#F0F0F0] text-[#2C2C2C] border border-[#E0E0E0] flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-[#f2070d]"
                  >
                    ×
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-sm text-[#999999]">No tags yet</span>
            )}
          </div>

          <div className="border-t border-[#E0E0E0] pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#2C2C2C]">Notes</h3>
              <button
                onClick={() => setShowNoteModal(true)}
                className="p-2 hover:bg-[#F0F0F0] rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4 text-[#666666]" />
              </button>
            </div>
            {customer.notes ? (
              <p className="text-sm text-[#666666] bg-[#F9F9F9] p-3 rounded-lg">
                {customer.notes}
              </p>
            ) : (
              <p className="text-sm text-[#999999]">No notes yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="border-2 border-[#F0F0F0]">
        <div className="border-b border-[#E0E0E0]">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#f2070d] text-[#f2070d]'
                  : 'border-transparent text-[#666666] hover:text-[#2C2C2C]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'appointments'
                  ? 'border-[#f2070d] text-[#f2070d]'
                  : 'border-transparent text-[#666666] hover:text-[#2C2C2C]'
              }`}
            >
              Appointments ({appointments.length})
            </button>
            <button
              onClick={() => setActiveTab('calls')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'calls'
                  ? 'border-[#f2070d] text-[#f2070d]'
                  : 'border-transparent text-[#666666] hover:text-[#2C2C2C]'
              }`}
            >
              Call History ({callHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'timeline'
                  ? 'border-[#f2070d] text-[#f2070d]'
                  : 'border-transparent text-[#666666] hover:text-[#2C2C2C]'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4">
                  Recent Activity
                </h3>
                {timeline.length > 0 ? (
                  <div className="space-y-4">
                    {timeline.slice(0, 5).map((event, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#f2070d] rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#2C2C2C]">
                            {event.title}
                          </div>
                          <div className="text-sm text-[#666666]">{event.description}</div>
                          <div className="text-xs text-[#999999] mt-1">
                            {formatDateTime(event.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#999999]">No recent activity</p>
                )}
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              {appointments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#E0E0E0]">
                    <thead className="bg-[#F9F9F9]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#666666] uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#666666] uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#666666] uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#666666] uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#666666] uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-[#666666] uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#E0E0E0]">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-[#F9F9F9]">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-[#666666] mr-2" />
                              <div>
                                <div className="text-sm font-medium text-[#2C2C2C]">
                                  {appointment.service_type || 'General'}
                                </div>
                                {appointment.notes && (
                                  <div className="text-xs text-[#999999] truncate max-w-[200px]">
                                    {appointment.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[#2C2C2C]">
                              {appointment.appointment_date
                                ? new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })
                                : 'N/A'}
                            </div>
                            <div className="text-xs text-[#666666]">
                              {appointment.appointment_date
                                ? new Date(appointment.appointment_date).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                : ''}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant={
                                appointment.status === 'completed'
                                  ? 'success'
                                  : appointment.status === 'cancelled'
                                  ? 'danger'
                                  : appointment.status === 'confirmed'
                                  ? 'info'
                                  : 'warning'
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666666]">
                            {appointment.duration_minutes || 60} min
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-[#666666]">
                            {appointment.created_at
                              ? new Date(appointment.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              {appointment.google_calendar_link && (
                                <button
                                  onClick={() => window.open(appointment.google_calendar_link, '_blank')}
                                  className="text-[#666666] hover:text-[#2C2C2C] p-1"
                                  title="Open in Google Calendar"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => navigate('/dashboard/email-logs')}
                                className="text-[#666666] hover:text-[#f2070d] p-1"
                                title="View in Email Logs"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-[#999999] mx-auto mb-4" />
                  <p className="text-[#999999]">No appointments yet</p>
                </div>
              )}
            </div>
          )}

          {/* Call History Tab */}
          {activeTab === 'calls' && (
            <div className="space-y-4">
              {callHistory.length > 0 ? (
                callHistory.map((call) => (
                  <Card key={call.id} className="p-4 border border-[#E0E0E0]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`p-2 rounded-lg ${
                            call.direction === 'inbound'
                              ? 'bg-[#D1FAE5] text-[#10B981]'
                              : 'bg-[#DBEAFE] text-[#3B82F6]'
                          }`}
                        >
                          <PhoneCall className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-[#2C2C2C]">
                              {call.direction === 'inbound' ? 'Incoming Call' : 'Outgoing Call'}
                            </span>
                            <Badge
                              variant={
                                call.status === 'completed'
                                  ? 'success'
                                  : call.status === 'missed'
                                  ? 'danger'
                                  : 'warning'
                              }
                            >
                              {call.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-[#666666]">
                            Duration: {call.duration}s • {formatDateTime(call.created_at)}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/dashboard/calls/logs', { state: { selectedCallId: call.id } })}
                        className="border-[#E0E0E0]"
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <PhoneCall className="h-12 w-12 text-[#999999] mx-auto mb-4" />
                  <p className="text-[#999999]">No call history yet</p>
                </div>
              )}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {timeline.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#E0E0E0]"></div>
                  <div className="space-y-6">
                    {timeline.map((event, index) => (
                      <div key={index} className="relative pl-12">
                        <div className="absolute left-2.5 top-2 w-3 h-3 bg-[#f2070d] rounded-full border-4 border-white"></div>
                        <Card 
                          className={`p-4 border border-[#E0E0E0] ${event.type === 'sms' ? 'cursor-pointer hover:border-[#f2070d] hover:shadow-md transition-all' : ''}`}
                          onClick={() => {
                            if (event.type === 'sms' && event.metadata?.to_number) {
                              const phoneNumber = event.metadata.direction === 'outbound' 
                                ? event.metadata.to_number 
                                : event.metadata.from_number;
                              navigate(`/dashboard/sms-chat/${encodeURIComponent(phoneNumber)}`);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {event.type === 'call' && <PhoneCall className="h-4 w-4 text-[#666666]" />}
                              {event.type === 'appointment' && <Calendar className="h-4 w-4 text-[#666666]" />}
                              {event.type === 'email' && <Mail className="h-4 w-4 text-[#666666]" />}
                              {event.type === 'sms' && <MessageSquare className="h-4 w-4 text-[#666666]" />}
                              {event.type === 'note' && <FileText className="h-4 w-4 text-[#666666]" />}
                              <span className="font-semibold text-[#2C2C2C]">{event.title}</span>
                            </div>
                            {event.type === 'sms' && (
                              <Eye className="h-4 w-4 text-[#999999] hover:text-[#f2070d]" />
                            )}
                          </div>
                          <p className="text-sm text-[#666666] mb-2">{event.description}</p>
                          <div className="text-xs text-[#999999]">
                            {formatDateTime(event.timestamp)}
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-[#999999] mx-auto mb-4" />
                  <p className="text-[#999999]">No timeline events yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Add Note Modal */}
      <Modal
        isOpen={showNoteModal}
        onClose={() => {
          setShowNoteModal(false);
          setNewNote('');
        }}
        title="Add Note"
      >
        <div className="space-y-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note here..."
            rows={4}
            className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#f2070d]"
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowNoteModal(false);
                setNewNote('');
              }}
              className="border-[#E0E0E0]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddNote}
              className="bg-gradient-to-r from-[#f2070d] to-[#FF6B6B] text-white"
            >
              Add Note
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Tag Modal */}
      <Modal
        isOpen={showTagModal}
        onClose={() => {
          setShowTagModal(false);
          setNewTag('');
        }}
        title="Add Tag"
      >
        <div className="space-y-4">
          <Input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Enter tag name"
            className="border-[#E0E0E0] focus:border-[#f2070d]"
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowTagModal(false);
                setNewTag('');
              }}
              className="border-[#E0E0E0]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTag}
              className="bg-gradient-to-r from-[#f2070d] to-[#FF6B6B] text-white"
            >
              Add Tag
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerDetails;