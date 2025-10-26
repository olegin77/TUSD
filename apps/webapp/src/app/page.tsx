export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              USDX/Wexel
            </span>
            <br />
            <span className="text-gray-900">Platform</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Децентрализованная платформа приёма ликвидности с поддержкой Solana и Tron,
            депозитов в USDT и механики буст-монет
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              Начать инвестировать
            </button>
            <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
              Узнать больше
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
