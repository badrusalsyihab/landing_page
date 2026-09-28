import { getCodRules, getFaqItems, getProducts, getStoreConfig } from "@/lib/data";
import Storefront from "@/components/Storefront";

export default async function Home() {
  const [config, products, rules, faqItems] = await Promise.all([
    getStoreConfig(),
    getProducts(),
    getCodRules(),
    getFaqItems(),
  ]);

  return <Storefront products={products} config={config} rules={rules} faqItems={faqItems} />;
}
