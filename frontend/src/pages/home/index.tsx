import logo from '../../assets/logbelladesign.png'

export const Home = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-brand-100 px-10 py-16 text-brand-700 shadow-xl">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -right-16 top-10 h-52 w-52 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-brand-300/30 blur-3xl" />
      </div>

      <div className="relative flex flex-col gap-10 md:flex-row md:items-center">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold text-brand-900 md:text-5xl">
              Painel unificado para clientes, pedidos e finanças
            </h1>
            <p className="text-base text-brand-600">
              Painel que reúne toda a operação da Bella Design em um só lugar, com cadastro de clientes, acompanhamento de pedidos,
              registro de despesas e indicadores financeiros claros.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm font-semibold text-brand-500 md:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-brand-200/70 bg-white/80 px-4 py-3 shadow-sm">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-500">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7h6l2 2h10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
                  <path d="M3 7V5a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v2" />
                </svg>
              </span>
              <div>
                <p className="text-brand-900">Clientes & pedidos sincronizados</p>
                <p className="text-xs text-brand-500">Dados prontos para o próximo orçamento</p>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-brand-200/70 bg-white/80 px-4 py-3 shadow-sm">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-500">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20V10" />
                  <path d="M10 20V4" />
                  <path d="M16 20v-6" />
                  <path d="M20 20V8" />
                  <path d="M3 20h18" />
                </svg>
              </span>
              <div>
                <p className="text-brand-900">Financeiro sem planilhas</p>
                <p className="text-xs text-brand-500">Fluxo de caixa atualizado em tempo real</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 justify-center">
          <div className="w-full max-w-md rounded-[32px] border border-white/60 bg-white/90 p-8 text-center shadow-2xl ring-1 ring-brand-100/80">
            <img src={logo} alt="Bella Design" className="mx-auto w-full max-w-xs" />
            <p className="mt-6 text-sm text-brand-500">“Realizando sonhos em MDF.”</p>
          </div>
        </div>
      </div>
    </section>
  )
}