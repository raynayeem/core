import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Briefcase } from 'lucide-react'
import Layout from '../components/Layout'
import { fetchCaseStudies } from '../lib/api'

const CaseStudiesPage = () => {
  const { data: caseStudies, isLoading } = useQuery({
    queryKey: ['caseStudies'],
    queryFn: fetchCaseStudies,
  })

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="section-label">Case Studies</span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-[0.9] tracking-tight">
            Success Stories
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            See how we&apos;ve helped property owners maximize their revenue and streamline operations.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : caseStudies?.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((study) => (
                <Link
                  key={study.id}
                  to={`/case-studies/${study.slug}`}
                  className="feature-card rounded-2xl overflow-hidden hover:border-white/30 transition-all group"
                >
                  <div className="aspect-video bg-corex-gray flex items-center justify-center overflow-hidden">
                    {study.featuredImage ? (
                      <img
                        src={study.featuredImage}
                        alt={study.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Briefcase className="w-12 h-12 text-gray-600" />
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{study.propertyType}</span>
                    <h3 className="text-xl font-semibold text-white mt-2 mb-3 group-hover:text-gray-300 transition-colors line-clamp-2">
                      {study.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">{study.excerpt}</p>
                    <div className="flex items-center gap-2 text-white font-medium text-sm">
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No case studies yet.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}

export default CaseStudiesPage
