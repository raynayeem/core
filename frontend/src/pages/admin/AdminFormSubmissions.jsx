import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Mail, Eye, Trash2, CheckCircle, Loader2 } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import { contactAPI } from '../../lib/api'

const AdminFormSubmissions = () => {
  const queryClient = useQueryClient()
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['contactSubmissions'],
    queryFn: async () => {
      const response = await contactAPI.getAll()
      return response.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => contactAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['contactSubmissions'])
      setSelectedSubmission(null)
    },
  })

  const markAsReadMutation = useMutation({
    mutationFn: (id) => contactAPI.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['contactSubmissions'])
    },
  })

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
            <h1 className="text-3xl font-bold text-[#0A0A0A]">Contact Form Submissions</h1>
            <p className="text-gray-500 mt-1">
              {submissions?.length || 0} total submissions
            </p>
          </div>
        </div>

        {submissions?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No submissions yet</h3>
            <p className="text-gray-500">Contact form submissions will appear here.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Submissions List */}
            <div className="lg:col-span-1 space-y-4">
              {submissions?.map((submission) => (
                <div
                  key={submission.id}
                  onClick={() => setSelectedSubmission(submission)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedSubmission?.id === submission.id
                      ? 'bg-[#4353FF]/10 border-2 border-[#4353FF]'
                      : 'bg-white border-2 border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${submission.isRead ? 'bg-gray-300' : 'bg-[#4353FF]'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0A0A0A] truncate">{submission.name}</p>
                      <p className="text-sm text-gray-500 truncate">{submission.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submission Detail */}
            <div className="lg:col-span-2">
              {selectedSubmission ? (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-[#0A0A0A]">{selectedSubmission.name}</h2>
                      <a 
                        href={`mailto:${selectedSubmission.email}`}
                        className="text-[#4353FF] hover:underline"
                      >
                        {selectedSubmission.email}
                      </a>
                      {selectedSubmission.phone && (
                        <p className="text-gray-500 text-sm mt-1">
                          Phone: {selectedSubmission.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!selectedSubmission.isRead && (
                        <button
                          onClick={() => markAsReadMutation.mutate(selectedSubmission.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteMutation.mutate(selectedSubmission.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedSubmission.message}</p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-400">
                    Submitted on {new Date(selectedSubmission.createdAt).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a submission to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminFormSubmissions
