 // frontend/src/pages/dashboard/Calendar.jsx - ✅ FIXED VIEW BUTTONS

import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { appointmentsAPI } from '../../services/appointments';
import { CalendarIcon, ClockIcon, UserIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState('month'); // ✅ ADDED: State for current view

  // Fetch appointments
  const fetchAppointments = async (date = new Date()) => {
    try {
      setLoading(true);
      
      // Get first and last day of month
      const startOfMonth = moment(date).startOf('month').toISOString();
      const endOfMonth = moment(date).endOf('month').toISOString();
      
      console.log('📅 Fetching appointments:', startOfMonth, 'to', endOfMonth);
      
      const response = await appointmentsAPI.getByDateRange(startOfMonth, endOfMonth);
      
      console.log('✅ Appointments loaded:', response.data);
      
      const formattedAppointments = response.data.appointments.map(apt => ({
        id: apt.id,
        title: `${apt.customer_name} - ${apt.service_type || 'Appointment'}`,
        start: new Date(apt.appointment_date),
        end: new Date(new Date(apt.appointment_date).getTime() + (apt.duration_minutes || 60) * 60000),
        resource: apt,
      }));
      
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('❌ Failed to load appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(currentMonth);
  }, [currentMonth]);

  // Handle event click
  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    setShowModal(true);
  };

  // Handle navigate (month change)
  const handleNavigate = (newDate) => {
    setCurrentMonth(newDate);
  };

  // ✅ ADDED: Handle view change
  const handleViewChange = (newView) => {
    setView(newView);
  };

  // Event style getter
  const eventStyleGetter = (event) => {
    const status = event.resource.status;
    let backgroundColor = '#3B82F6'; // blue for scheduled
    
    if (status === 'completed') {
      backgroundColor = '#10B981'; // green
    } else if (status === 'cancelled') {
      backgroundColor = '#EF4444'; // red
    } else if (status === 'confirmed') {
      backgroundColor = '#8B5CF6'; // purple
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      }
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            Appointments Calendar
          </h1>
          <p className="text-gray-600 mt-1">View and manage your scheduled appointments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
              <CalendarIcon className="h-10 w-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">
                  {appointments.filter(a => a.resource.status === 'scheduled').length}
                </p>
              </div>
              <ClockIcon className="h-10 w-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {appointments.filter(a => a.resource.status === 'completed').length}
                </p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">✓</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">
                  {appointments.filter(a => a.resource.status === 'cancelled').length}
                </p>
              </div>
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xl">✕</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <BigCalendar
              localizer={localizer}
              events={appointments}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              onSelectEvent={handleSelectEvent}
              onNavigate={handleNavigate}
              onView={handleViewChange} // ✅ ADDED: Handle view changes
              view={view} // ✅ ADDED: Control current view
              views={['month', 'week', 'day', 'agenda']} // ✅ Available views
              eventPropGetter={eventStyleGetter}
              popup // ✅ ADDED: Show popup for multiple events
              selectable // ✅ ADDED: Allow selecting time slots
              // ✅ ADDED: Custom messages
              messages={{
                today: 'Today',
                previous: 'Back',
                next: 'Next',
                month: 'Month',
                week: 'Week',
                day: 'Day',
                agenda: 'Agenda',
                date: 'Date',
                time: 'Time',
                event: 'Event',
                noEventsInRange: 'No appointments in this date range.',
                showMore: (total) => `+${total} more`,
              }}
            />
          )}
        </div>

        {/* Appointment Detail Modal */}
        {showModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Appointment Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Status Badge */}
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedEvent.status === 'completed' ? 'bg-green-100 text-green-800' :
                    selectedEvent.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    selectedEvent.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="flex items-start gap-3">
                  <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium text-gray-900">{selectedEvent.customer_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedEvent.customer_email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{selectedEvent.customer_phone}</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-medium text-gray-900">
                      {moment(selectedEvent.appointment_date).format('MMMM D, YYYY')}
                    </p>
                    <p className="text-sm text-gray-600">{selectedEvent.appointment_time}</p>
                  </div>
                </div>

                {/* Service Type */}
                {selectedEvent.service_type && (
                  <div className="flex items-start gap-3">
                    <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Service</p>
                      <p className="font-medium text-gray-900">{selectedEvent.service_type}</p>
                    </div>
                  </div>
                )}

                {/* Duration */}
                <div className="flex items-start gap-3">
                  <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">{selectedEvent.duration_minutes || 60} minutes</p>
                  </div>
                </div>

                {/* Notes */}
                {selectedEvent.notes && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-1">Notes</p>
                    <p className="text-gray-900">{selectedEvent.notes}</p>
                  </div>
                )}

                {/* Google Calendar Link */}
                {selectedEvent.google_calendar_link && (
                  <div className="pt-4">
                    <a
                      href={selectedEvent.google_calendar_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <CalendarIcon className="h-5 w-5" />
                      View in Google Calendar
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;