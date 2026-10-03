import { SEO } from "../seo";
import SiteLayout from "../components/SiteLayout";
import { BlurText, Reveal } from "../components/motion";
import CartoriosWidget from "@/pages/cartorios/CartoriosWidget";

/**
 * Lista dos cartórios de MT. No Framer era um iframe de /cartorios/widget (app do blog, raiz 14.4px);
 * aqui o mesmo widget é renderizado direto na página (zoom .9 mantém a escala original).
 */
const CartoriosDeProtesto = () => (
  <SiteLayout {...SEO["/cartoriosdeprotesto"]}>
    <section className="px-6 pb-16 pt-[94px] min-[810px]:px-16 min-[810px]:pt-12 min-[1200px]:pb-32 min-[1200px]:pt-[86px]">
      <h1 className="text-center text-[28px] font-medium leading-[1.4] text-[#0061ff] min-[810px]:text-[64px]">
        <BlurText text="Cartórios de Protesto" immediate />
      </h1>
      <Reveal immediate delay={0.2}>
        <p className="text-center text-[13px] font-light leading-[1.6] text-[#2a2d33]/80 min-[810px]:text-[16px]">
          Encontre aqui o cartório mais próximo de você
        </p>
      </Reveal>
      <h2 className="sr-only">Lista de cartórios de protesto de Mato Grosso</h2>
      {/* Lista completa direto na página (sem rolagem interna). */}
      <div className="min-[810px]:mt-6">
        <div style={{ zoom: 0.9 }}>
          <CartoriosWidget embedded />
        </div>
      </div>
    </section>
  </SiteLayout>
);

export default CartoriosDeProtesto;
