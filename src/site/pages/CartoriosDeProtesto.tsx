import SiteLayout from "../components/SiteLayout";
import { BlurText, Reveal } from "../components/motion";
import CartoriosWidget from "@/pages/cartorios/CartoriosWidget";

/**
 * Lista dos cartórios de MT. No Framer era um iframe de /cartorios/widget (app do blog, raiz 14.4px);
 * aqui o mesmo widget é renderizado direto na página, com zoom .9 para manter a escala original.
 */
const CartoriosDeProtesto = () => (
  <SiteLayout title="Cartórios de Protesto | Cartórios de Protesto de Mato Grosso">
    <section className="px-4 pb-16 pt-12 min-[810px]:px-16 min-[1200px]:pt-[86px]">
      <h1 className="text-center text-[44px] font-medium leading-[1.4] text-[#0061ff] min-[810px]:text-[64px]">
        <BlurText text="Cartórios de Protesto" />
      </h1>
      <Reveal>
        <p className="text-center text-[16px] font-light leading-[1.6] text-[#2a2d33]/80">
          Encontre aqui o cartório mais próximo de você
        </p>
      </Reveal>
      <div className="mt-6" style={{ zoom: 0.9 }}>
        <CartoriosWidget />
      </div>
    </section>
  </SiteLayout>
);

export default CartoriosDeProtesto;
