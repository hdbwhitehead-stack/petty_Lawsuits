export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto mt-20 p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Petty Lawsuits</h1>
      <p className="text-gray-600 mb-8">
        Generate legal documents for Australian disputes — without a lawyer.
      </p>
      <a href="/signup"
        className="bg-black text-white rounded px-6 py-3 inline-block text-lg">
        Get started
      </a>
    </main>
  )
}
