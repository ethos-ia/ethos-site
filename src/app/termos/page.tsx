import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Termos de Uso · Ethos",
  description: "Termos que regem o uso do site da Ethos e o contato inicial com a empresa.",
};

export default function TermosPage() {
  return (
    <>
      <Nav />
      <main className="w-full bg-areia pt-12 md:pt-16 pb-20 px-6 min-h-screen">
        <article className="mx-auto max-w-3xl prose prose-stone">

          <p className="font-mono text-[0.72rem] text-pedra tracking-[0.12em] uppercase mb-4">
            Termos de Uso
          </p>
          <h1
            className="text-[2.25rem] md:text-[3rem] font-black text-carvao leading-[1.02] tracking-[-0.04em] mb-6"
          >
            Regras de uso deste site.
          </h1>
          <p className="text-base text-tinta leading-[1.8] mb-10">
            Este documento descreve os termos sob os quais a Ethos disponibiliza este site
            e o canal de contato inicial. Ao navegar e interagir com o site, você concorda
            com as condições abaixo. Última atualização: 15 de maio de 2026.
          </p>

          <Section title="1. Quem somos">
            <p>
              A Ethos AI - Automações e Integrações é uma software house especializada em soluções
              com IA: cria automações, sistemas sob medida e projetos de IA generativa para empresas.
              Este site cumpre a função institucional e de captação inicial de
              contato comercial.
            </p>
          </Section>

          <Section title="2. Objeto destes termos">
            <p>
              Estes termos regulam apenas a navegação no site e o envio de mensagens pelo
              formulário de contato. Contratos comerciais entre a Ethos e clientes são
              instrumentos próprios, negociados após o diagnóstico inicial, e não estão
              cobertos por este documento.
            </p>
          </Section>

          <Section title="3. Aceitação">
            <p>
              Ao acessar o site, você declara estar ciente e de acordo com estes termos.
              Caso não concorde com qualquer cláusula, recomendamos descontinuar o uso.
            </p>
          </Section>

          <Section title="4. Uso permitido">
            <p>
              Você pode acessar, ler e compartilhar o conteúdo público do site para
              finalidades lícitas. É vedado: tentar acessar áreas restritas, interferir no
              funcionamento dos serviços, automatizar requisições em volume que afete a
              disponibilidade, e enviar conteúdo ilícito, ofensivo ou que infrinja direitos
              de terceiros pelos canais de contato.
            </p>
          </Section>

          <Section title="5. Conteúdo do formulário de contato">
            <p>
              Ao submeter o formulário, você confirma que as informações são verdadeiras e
              que tem autorização para fornecê-las em nome da empresa indicada. O tratamento
              dos dados pessoais coletados segue a{" "}
              <a href="/privacidade" className="text-laranja-texto underline underline-offset-2">
                Política de Privacidade
              </a>.
            </p>
          </Section>

          <Section title="6. Propriedade intelectual">
            <p>
              Marca, logotipo, identidade visual, textos, ilustrações e qualquer outro
              conteúdo deste site são de titularidade da Ethos ou licenciados a ela.
              É vedada a reprodução, distribuição ou uso comercial sem autorização prévia
              por escrito.
            </p>
          </Section>

          <Section title="7. Disponibilidade">
            <p>
              Empenhamos esforço razoável para manter o site disponível e estável, mas não
              garantimos funcionamento ininterrupto. Manutenções programadas, atualizações
              de infraestrutura e eventos fora do nosso controle podem causar indisponibilidade
              temporária.
            </p>
          </Section>

          <Section title="8. Limitação de responsabilidade">
            <p>
              A Ethos não se responsabiliza por decisões tomadas pelo usuário com base
              exclusivamente no conteúdo institucional deste site. Diagnósticos, propostas
              e compromissos comerciais ocorrem somente em instrumentos próprios, fora do
              site.
            </p>
          </Section>

          <Section title="9. Links externos">
            <p>
              O site pode conter links para canais externos (como WhatsApp, Instagram e
              serviços parceiros). A Ethos não controla o conteúdo desses destinos e não
              se responsabiliza por suas práticas.
            </p>
          </Section>

          <Section title="10. Modificações">
            <p>
              Estes termos podem ser atualizados a qualquer momento, para refletir mudanças
              nos serviços, na operação ou na legislação aplicável. A data de atualização
              no topo será modificada sempre que houver alteração relevante.
            </p>
          </Section>

          <Section title="11. Lei aplicável e foro">
            <p>
              Estes termos são regidos pela legislação brasileira. Fica eleito o foro da
              comarca de Brasília, Distrito Federal, para dirimir eventuais controvérsias,
              salvo competência específica prevista em lei.
            </p>
          </Section>

          <Section title="12. Contato">
            <p>
              Dúvidas sobre estes termos podem ser enviadas para{" "}
              <a href="mailto:contato@somosethos.com.br" className="text-laranja-texto underline underline-offset-2">
                contato@somosethos.com.br
              </a>.
            </p>
          </Section>

          <p className="mt-12 text-xs text-pedra italic">
            Este texto é um ponto de partida. Antes de assumir obrigações comerciais relevantes,
            recomendamos revisão por assessoria jurídica.
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
