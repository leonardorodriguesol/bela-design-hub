import logo from '../../assets/logbelladesign.png'

export const Home = () => {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-brand-100/80 bg-white/90 p-6 text-brand-700 shadow-2xl backdrop-blur-sm sm:p-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-52 w-52 rounded-full bg-brand-200/35 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-56 w-56 rounded-full bg-brand-300/25 blur-3xl" />
      </div>

      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
            Plataforma Bella Design
          </span>
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-brand-900 sm:text-5xl">
            Gestão comercial, financeira e de produção em um só lugar.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-brand-600">
            Um painel direto para organizar clientes, pedidos, ordens de serviço, despesas e planejamento da marcenaria.
          </p>
        </div>

        <aside>
          <div className="rounded-[2rem] border border-brand-100/90 bg-white/95 p-8 text-center shadow-[0_12px_32px_rgba(77,13,42,0.12)]">
            <img src={logo} alt="Bella Design" className="mx-auto w-full max-w-xs" />
            <p className="mt-5 text-sm text-brand-500">Rotina da operação em uma interface simples e conectada.</p>
          </div>
        </aside>
      </div>
    </section>
  )
}
