import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ResumeBanner from '@/components/layout/ResumeBanner'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="pt-16">
        <ResumeBanner />
        {children}
      </div>
      <Footer />
    </>
  )
}
