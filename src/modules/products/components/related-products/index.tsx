import Product from "@modules/products/components/product-preview"
import { getRegion } from "@lib/data/regions"
import { getProductsList } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Layout, LayoutColumn } from "@/components/Layout"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductListParams = {
    limit: 3,
  }
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    queryParams.tag_id = product.tags.map((t) => t.value).filter(Boolean)
  }
  queryParams.is_giftcard = false

  const products = await getProductsList({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  if (!products.length) {
    return null
  }

  return (
    <>
      <Layout>
        <LayoutColumn className="mt-12 md:mt-20">
          <h4 className="text-md md:text-2xl mb-8 md:mb-12">
            Related products
          </h4>
        </LayoutColumn>
      </Layout>
      
      {/* Mobile: Single column for better UX */}
      <div className="md:hidden px-4">
        <div className="grid grid-cols-1 gap-6">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Desktop: 3 columns */}
      <Layout className="gap-y-10 md:gap-y-16 max-md:hidden">
        {products.map((product) => (
          <LayoutColumn key={product.id} className="!col-span-4">
            <Product product={product} />
          </LayoutColumn>
        ))}
      </Layout>
    </>
  )
}
