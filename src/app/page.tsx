import { Footer } from "@/components/layout/Footer";
import { Topo } from "@/sections/Topo";
import { Cases } from "@/sections/Cases";
import { OQueFazemos } from "@/sections/OQueFazemos";
import { ComoTrabalhamos } from "@/sections/ComoTrabalhamos";
import { Perguntas } from "@/sections/Perguntas";
import { ChamadaFinal } from "@/sections/ChamadaFinal";

export default function Home() {
  return (
    <>
      <main>
        <Topo />
        <Cases />
        <OQueFazemos />
        <ComoTrabalhamos />
        <Perguntas />
        <ChamadaFinal />
      </main>
      <Footer />
    </>
  );
}
