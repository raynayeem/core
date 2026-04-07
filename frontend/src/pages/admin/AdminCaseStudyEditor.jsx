import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Loader2, Plus, X } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import ImageUpload from '../../components/ImageUpload';
import RichTextEditor from '../../components/RichTextEditor';
import { fetchCaseStudy, createCaseStudy, updateCaseStudy } from '../../lib/api';

const AdminCaseStudyEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    client: '',
    clientName: '',
    clientLocation: '',
    propertyType: '',
    excerpt: '',
    content: '',
    challenge: '',
    solution: '',
    results: [{ metric: '', value: '' }],
    stats: [{ value: '', label: '' }],
    featuredImage: '',
    isPublished: false,
  });

  const { data: study, isLoading } = useQuery({
    queryKey: ['caseStudy', id],
    queryFn: () => fetchCaseStudy(id),
    enabled: !isNew,
  });

  useEffect(() => {
    if (study && !isNew) {
      setFormData({
        title: study.title || '',
        slug: study.slug || '',
        client: study.client || '',
        clientName: study.clientName || '',
        clientLocation: study.clientLocation || '',
        propertyType: study.propertyType || '',
        excerpt: study.excerpt || '',
        content: study.content || '',
        challenge: study.challenge || '',
        solution: study.solution || '',
        results: study.results?.length > 0 ? study.results : [{ metric: '', value: '' }],
        stats: study.stats?.length > 0 ? study.stats : [{ value: '', label: '' }],
        featuredImage: study.featuredImage || '',
        isPublished: study.isPublished || false,
      });
    }
  }, [study, isNew]);

  const createMutation = useMutation({
    mutationFn: createCaseStudy,
    onSuccess: () => {
      queryClient.invalidateQueries(['caseStudies']);
      navigate('/admin/case-studies');
    },
    onError: (error) => {
      alert('Error creating case study: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateCaseStudy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['caseStudies']);
      queryClient.invalidateQueries(['caseStudy', id]);
      navigate('/admin/case-studies');
    },
    onError: (error) => {
      alert('Error updating case study: ' + error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImageChange = (featuredImage) => {
    setFormData(prev => ({ ...prev, featuredImage }));
  };

  const addResult = () => {
    setFormData(prev => ({
      ...prev,
      results: [...prev.results, { metric: '', value: '' }]
    }));
  };

  const removeResult = (index) => {
    setFormData(prev => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index)
    }));
  };

  const updateResult = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      results: prev.results.map((r, i) => i === index ? { ...r, [field]: value } : r)
    }));
  };

  const addStat = () => {
    setFormData(prev => ({
      ...prev,
      stats: [...prev.stats, { value: '', label: '' }]
    }));
  };

  const removeStat = (index) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  const updateStat = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.map((s, i) => i === index ? { ...s, [field]: value } : s)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      results: formData.results.filter(r => r.metric && r.value),
      stats: formData.stats.filter(s => s.value && s.label),
    };

    if (isNew) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  if (isLoading && !isNew) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#4353FF]" />
        </div>
      </AdminLayout>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/case-studies"
              className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#0A0A0A]">
                {isNew ? 'New Case Study' : 'Edit Case Study'}
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            {!isNew && formData.slug && (
              <a
                href={`/#/case-studies/${formData.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </a>
            )}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#4353FF] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#4353FF]/90 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Case Study
                </>
              )}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4353FF] focus:ring-2 focus:ring-[#4353FF]/20 outline-none"
                    placeholder="Enter case study title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      required
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4353FF] focus:ring-2 focus:ring-[#4353FF]/20 outline-none"
                      placeholder="case-study-slug"
                    />
                    <button
                      type="button"
                      onClick={generateSlug}
                      className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4353FF] focus:ring-2 focus:ring-[#4353FF]/20 outline-none resize-none"
                    placeholder="Brief summary of the case study"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder="Write the case study content here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Challenge
                  </label>
                  <textarea
                    name="challenge"
                    value={formData.challenge}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4353FF] focus:ring-2 focus:ring-[#4353FF]/20 outline-none resize-none"
                    placeholder="What challenge did the client face?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Solution
                  </label>
                  <textarea
                    name="solution"
                    value={formData.solution}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4353FF] focus:ring-2 focus:ring-[#4353FF]/20 outline-none resize-none"
                    placeholder="How did you solve the challenge?"
                  />
                </div>

                {/* Results */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Results
                  </label>
                  <div className="space-y-2">
                    {formData.results.map((result, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={result.metric}
                          onChange={(e) => updateResult(index, 'metric', e.target.value)}
                          placeholder="Metric (e.g. Revenue Increase)"
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4353FF] focus:ring-2 focus:ring-[#4353FF]/20 outline-none text-sm"
                        />
                        <input
                          type="text"
                          value={result.value}
                          onChange={(e) => updateResult(index, 'value', e.target.value)}
                          placeholder="Value (e.g. 35%)"
                          className="w-32 px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4353FF] focus:ring-2 focus:ring-[#4353FF]/20 outline-none text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeResult(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addResult}
                      className="flex items-center gap-2 text-sm text-[#4353FF] hover:underline"
                    >
                      <Plus className="w-4 h-4" />
                      Add Result
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-[#0A0A0A] mb-4">Publish Settings</h3>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isPublished"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-[#4353FF] focus:ring-[#4353FF]"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                  Publish this case study
                </label>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <ImageUpload
                value={formData.featuredImage}
                onChange={handleImageChange}
                type="case-studies"
                label="Featured Image"
              />
            </div>

            {/* Client Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-[#0A0A0A] mb-4">Client Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4353FF] focus:ring-2 focus:ring-[#4353FF]/20 outline-none"
                    placeholder="e.g. Mohammed Al-Rashid"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Location
                  </label>
                  <input
                    type="text"
                    name="clientLocation"
                    value={formData.clientLocation}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4353FF] focus:ring-2 focus:ring-[#4353FF]/20 outline-none"
                    placeholder="e.g. Palm Jumeirah, Dubai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4353FF] focus:ring-2 focus:ring-[#4353FF]/20 outline-none"
                  >
                    <option value="">Select type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-[#0A0A0A] mb-4">Key Stats</h3>
              <div className="space-y-2">
                {formData.stats.map((stat, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                      placeholder="Value (e.g. 35%)"
                      className="w-24 px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4353FF] focus:ring-2 focus:ring-[#4353FF]/20 outline-none text-sm"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      placeholder="Label (e.g. Revenue Increase)"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4353FF] focus:ring-2 focus:ring-[#4353FF]/20 outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeStat(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addStat}
                  className="flex items-center gap-2 text-sm text-[#4353FF] hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  Add Stat
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminCaseStudyEditor;
