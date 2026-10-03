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
      <h1 className="type-hero text-center text-[#0061ff]">
        <BlurText text="Cartórios de Protesto" immediate />
      </h1>
      <Reveal immediate delay={0.2}>
        <p className="type-lead mt-3 text-center text-[#2a2d33]/80">
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
