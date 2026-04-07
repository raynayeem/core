import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Briefcase, MapPin, User } from 'lucide-react'
import Layout from '../components/Layout'
import { fetchCaseStudyBySlug } from '../lib/api'

const CaseStudyPage = () => {
  const { slug } = useParams()

  const { data: study, isLoading } = useQuery({
    queryKey: ['caseStudy', slug],
    queryFn: () => fetchCaseStudyBySlug(slug),
  })

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </Layout>
    )
  }

  if (!study) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Case Study Not Found</h1>
            <Link to="/case-studies" className="text-white hover:underline">
              Back to Case Studies
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Case Studies
          </Link>

          <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm text-gray-300 mb-6">
            {study.propertyType} Case Study
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {study.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-gray-400">
            {study.clientName && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{study.clientName}</span>
              </div>
            )}
            {study.clientLocation && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{study.clientLocation}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="bg-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="aspect-video bg-corex-gray rounded-2xl overflow-hidden -mt-10 relative z-10 border border-white/10">
            {study.featuredImage ? (
              <img
                src={study.featuredImage}
                alt={study.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Briefcase className="w-20 h-20 text-gray-600" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          {/* Stats */}
          {study.stats && study.stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              {study.stats.map((stat, index) => (
                <div key={index} className="feature-card rounded-xl p-6 text-center">
                  <p className="text-4xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Challenge */}
          {study.challenge && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">The Challenge</h2>
              <p className="text-gray-400 text-lg leading-relaxed">{study.challenge}</p>
            </div>
          )}

          {/* Solution */}
          {study.solution && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">Our Solution</h2>
              <p className="text-gray-400 text-lg leading-relaxed">{study.solution}</p>
            </div>
          )}

          {/* Main Content */}
          {study.content && (
            <div 
              className="prose prose-lg max-w-none prose-headings:text-white prose-p:text-gray-400 prose-a:text-white prose-strong:text-white"
              dangerouslySetInnerHTML={{ __html: study.content }}
            />
          )}

          {/* Results */}
          {study.results && study.results.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Key Results</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {study.results.map((result, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white/5 rounded-lg p-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-white">{result.value}</span>
                    </div>
                    <span className="text-gray-300">{result.metric}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-corex-darker">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Achieve Similar Results?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Let&apos;s discuss how CORE can help maximize your property&apos;s potential.
          </p>
          <Link
            to="/book-a-call"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors"
          >
            Book a Free Consultation
          </Link>
        </div>
      </section>
    </Layout>
  )
}

export default CaseStudyPage
