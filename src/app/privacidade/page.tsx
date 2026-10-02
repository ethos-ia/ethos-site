import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Política de Privacidade · Ethos",
  description: "Como a Ethos coleta, utiliza e protege os dados pessoais que recebe pelo site.",
};

export default function PrivacidadePage() {
  return (
    <>
      <Nav />
      <main className="w-full bg-areia pt-12 md:pt-16 pb-20 px-6 min-h-screen">
        <article className="mx-auto max-w-3xl prose prose-stone">

          <p className="font-mono text-[0.72rem] text-pedra tracking-[0.12em] uppercase mb-4">
            Política de Privacidade
          </p>
          <h1
            className="text-[2.25rem] md:text-[3rem] font-black text-carvao leading-[1.02] tracking-[-0.04em] mb-6"
          >
            Como a Ethos trata os seus dados.
          </h1>
          <p className="text-base text-tinta leading-[1.8] mb-10">
            Esta página descreve, em linguagem simples, como a Ethos coleta, utiliza e protege os
            dados pessoais que recebe pelo formulário de contato deste site. O texto está em
            conformidade com a Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018).
            Última atualização: 15 de maio de 2026.
          </p>

          <Section title="1. Quem é o controlador">
            <p>
              A Ethos AI - Automações e Integrações é o controlador dos dados coletados.
              Em caso de dúvidas, escreva para{" "}
              <a href="mailto:contato@somosethos.com.br" className="text-laranja-texto underline underline-offset-2">
                contato@somosethos.com.br
              </a>.
            </p>
          </Section>

          <Section title="2. Quais dados são coletados">
            <p>
              Pelo formulário de contato, coletamos: nome, empresa, e-mail, telefone, faixa de
              faturamento mensal, tamanho da empresa e a descrição do desafio que você quer
              resolver. Você só envia esses dados ao preencher e submeter o formulário.
            </p>
          </Section>

          <Section title="3. Por que coletamos">
            <p>
              Usamos esses dados exclusivamente para responder à sua mensagem, conduzir um
              diagnóstico inicial gratuito e, se houver interesse mútuo, evoluir para uma
              proposta comercial. Não enviamos comunicação de marketing sem permissão expressa.
            </p>
          </Section>

          <Section title="4. Quanto tempo mantemos">
            <p>
              Os dados ficam armazenados pelo tempo necessário para concluir o atendimento da
              sua solicitação. Após a conclusão, mantemos os registros pelo prazo legal de
              guarda contábil e fiscal e, na sequência, eliminamos as informações.
            </p>
          </Section>

          <Section title="5. Com quem compartilhamos">
            <p>
              Os dados podem ser processados pelos prestadores de serviço que sustentam a
              operação do site, como o serviço de e-mail transacional (Resend) e a hospedagem
              (Vercel). Esses fornecedores atuam como operadores e estão obrigados a tratar os
              dados nos limites definidos pela Ethos. Não compartilhamos dados com terceiros
              para fins de marketing.
            </p>
          </Section>

          <Section title="6. Seus direitos como titular">
            <p>
              A LGPD garante a você os direitos de acessar, corrigir, atualizar, anonimizar ou
              eliminar os seus dados, além de revogar o consentimento a qualquer momento. Para
              exercer qualquer um desses direitos, escreva para{" "}
              <a href="mailto:contato@somosethos.com.br" className="text-laranja-texto underline underline-offset-2">
                contato@somosethos.com.br
              </a>{" "}
              identificando-se e indicando o pedido. Respondemos em até 15 dias.
            </p>
          </Section>

          <Section title="7. Segurança">
            <p>
              Aplicamos medidas técnicas e administrativas razoáveis para proteger os dados
              contra acessos não autorizados, alteração indevida e perda. Em caso de incidente
              de segurança relevante, a Autoridade Nacional de Proteção de Dados e os titulares
              afetados serão comunicados, conforme exige a lei.
            </p>
          </Section>

          <Section title="8. Atualizações desta política">
            <p>
              Esta política pode ser atualizada para refletir mudanças nos serviços ou na
              legislação. Sempre que houver alteração relevante, a data de atualização no topo
              será modificada.
            </p>
          </Section>

          <p className="mt-12 text-xs text-pedra italic">
            Este texto é um ponto de partida com base nos princípios da LGPD. Antes de assumir
            obrigações comerciais relevantes, recomendamos revisão por assessoria jurídica.
          </p>

        </article>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2
        className="text-xl md:text-2xl font-bold text-carvao tracking-[-0.02em] mb-3"
      >
        {title}
      </h2>
      <div className="text-tinta leading-[1.8] text-base [&_p]:mb-3">
        {children}
      </div>
    </section>
  );
}
