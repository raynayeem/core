import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, Eye, Trash2, CheckCircle, Clock, Loader2, Phone, Mail, User } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import { bookACallAPI } from '../../lib/api'

const AdminBookings = () => {
  const queryClient = useQueryClient()
  const [selectedBooking, setSelectedBooking] = useState(null)

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await bookACallAPI.getAll()
      return response.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => bookACallAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings'])
      setSelectedBooking(null)
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => bookACallAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings'])
    },
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#4353FF]" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A0A0A]">Book a Call Requests</h1>
            <p className="text-gray-500 mt-1">
              {bookings?.length || 0} total bookings
            </p>
          </div>
        </div>

        {bookings?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings yet</h3>
            <p className="text-gray-500">Book a Call requests will appear here.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Bookings List */}
            <div className="lg:col-span-1 space-y-4">
              {bookings?.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedBooking?.id === booking.id
                      ? 'bg-[#4353FF]/10 border-2 border-[#4353FF]'
                      : 'bg-white border-2 border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0A0A0A] truncate">{booking.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{booking.preferredDate}</span>
                        <Clock className="w-3 h-3 ml-2" />
                        <span>{booking.preferredTime}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Booking Detail */}
            <div className="lg:col-span-2">
              {selectedBooking ? (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-[#0A0A0A]">{selectedBooking.name}</h2>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <a href={`mailto:${selectedBooking.email}`} className="flex items-center gap-1 hover:text-[#4353FF]">
                          <Mail className="w-4 h-4" />
                          {selectedBooking.email}
                        </a>
                        <a href={`tel:${selectedBooking.phone}`} className="flex items-center gap-1 hover:text-[#4353FF]">
                          <Phone className="w-4 h-4" />
                          {selectedBooking.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteMutation.mutate(selectedBooking.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Preferred Date</p>
                      <p className="font-semibold text-[#0A0A0A]">{selectedBooking.preferredDate}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">Preferred Time</p>
                      <p className="font-semibold text-[#0A0A0A]">{selectedBooking.preferredTime}</p>
                    </div>
                  </div>

                  {selectedBooking.company && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-500 mb-1">Company/Property</p>
                      <p className="text-[#0A0A0A]">{selectedBooking.company}</p>
                    </div>
                  )}

                  {selectedBooking.message && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-500 mb-1">Additional Notes</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedBooking.message}</p>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-6">
                    <p className="text-sm text-gray-500 mb-3">Update Status</p>
                    <div className="flex gap-2">
                      {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatusMutation.mutate({ id: selectedBooking.id, status })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                            selectedBooking.status === status
                              ? 'bg-[#4353FF] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-400">
                    Requested on {new Date(selectedBooking.createdAt).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a booking to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminBookings
