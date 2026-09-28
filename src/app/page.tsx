import {
  getCodRules,
  getFaqItems,
  getHighlights,
  getProducts,
  getShippingOptions,
  getStoreConfig,
} from "@/lib/data";
import Storefront from "@/components/Storefront";

export default async function Home() {
  const [config, products, rules, faqItems, highlights, shippingOptions] = await Promise.all([
    getStoreConfig(),
    getProducts(),
    getCodRules(),
    getFaqItems(),
    getHighlights(),
    getShippingOptions(),
  ]);

  return (
    <Storefront
      products={products}
      config={config}
      rules={rules}
      faqItems={faqItems}
      highlights={highlights}
      shippingOptions={shippingOptions}
    />
  );
}
