import { AgentApi } from "@/components/sections/agent-api";
import { ChunksToChain } from "@/components/sections/chunks-to-chain";
import { ContextDemo } from "@/components/sections/context-demo";
import { Cta } from "@/components/sections/cta";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { GraphBento } from "@/components/sections/graph-bento";
import { Hero } from "@/components/sections/hero";
import { Levels } from "@/components/sections/levels";
import { ModelAgnostic } from "@/components/sections/model-agnostic";
import { Nav } from "@/components/sections/nav";
import { PictoLoop } from "@/components/sections/picto-loop";
import { Problem } from "@/components/sections/problem";
import { Retrieval } from "@/components/sections/retrieval";
import { Stack } from "@/components/sections/stack";
import { WorksWith } from "@/components/sections/works-with";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WorksWith />
        <Problem />
        <ChunksToChain />
        <Levels />
        <Retrieval />
        <ContextDemo />
        <GraphBento />
        <Stack />
        <AgentApi />
        <ModelAgnostic />
        <PictoLoop />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
