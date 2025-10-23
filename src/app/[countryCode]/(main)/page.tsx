import { Metadata } from "next"
import Image from "next/image"
import { getRegion } from "@lib/data/regions"
import { getProductTypesList } from "@lib/data/product-types"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { CollectionsSection } from "@/components/CollectionsSection"
import HeroCarousel from "@/components/hero-carousel"
import { listCategories } from "@lib/data/categories"
import { FeaturedProductSection } from "@/components/FeaturedProductSection"

export const metadata: Metadata = {
  title: "Zuhoor Lifestyle",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
}

const ProductTypesSection: React.FC = async () => {
  const productTypes = await getProductTypesList(0, 20, [
    "id",
    "value",
    "metadata",
  ])

  if (!productTypes) {
    return null
  }

  return (
    <Layout>
      <LayoutColumn className="col-span-full mb-6 md:mb-10">
        <h3 className="text-lg md:text-3xl font-semibold tracking-tight px-4 md:px-0">Our Products</h3>
      </LayoutColumn>
      
      {/* Mobile Layout */}
      <div className="col-span-full md:hidden">
        {productTypes.productTypes.map((productType) => (
          <div key={productType.id} className="mb-6 px-4">
            <LocalizedLink href={`/store?type=${productType.value}`} className="group block">
              {typeof productType.metadata?.image === "object" &&
                productType.metadata.image &&
                "url" in productType.metadata.image &&
                typeof productType.metadata.image.url === "string" && (
                  <div className="relative mb-3 overflow-hidden aspect-[4/3]">
                    <Image
                      src={productType.metadata.image.url}
                      fill
                      alt={productType.value}
                      className="object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                  </div>
                )}
              <p className="text-sm font-semibold group-hover:text-gray-700 transition-colors">{productType.value}</p>
            </LocalizedLink>
          </div>
        ))}
      </div>

      {/* Desktop Layout */}
      {productTypes.productTypes.map((productType, index) => (
        <LayoutColumn
          key={productType.id}
          start={index % 2 === 0 ? 1 : 7}
          end={index % 2 === 0 ? 7 : 13}
          className="mb-10 max-md:hidden"
        >
          <LocalizedLink href={`/store?type=${productType.value}`} className="group block">
            {typeof productType.metadata?.image === "object" &&
              productType.metadata.image &&
              "url" in productType.metadata.image &&
              typeof productType.metadata.image.url === "string" && (
                <div className="relative mb-4 overflow-hidden aspect-[16/10]">
                  <Image
                    src={productType.metadata.image.url}
                    fill
                    alt={productType.value}
                    className="object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                </div>
              )}
            <p className="text-lg font-semibold group-hover:text-gray-700 transition-colors">{productType.value}</p>
          </LocalizedLink>
        </LayoutColumn>
      ))}
    </Layout>
  )
}

export default async function Home({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }
  const categories = await listCategories()
  console.log(categories)
  

  return (
    <>
      <div className="relative h-[50vh] min-h-[500px] overflow-hidden">
        {/* <Image
          src="/images/content/living-room-gray-armchair-two-seater-sofa.png"
          width={2880}
          height={1500}
          alt="Living room with gray armchair and two-seater sofa"
          className="md:h-screen md:object-cover"
        /> */}
        <HeroCarousel/>
      </div>
      <div className="pt-6 pb-16 md:pt-6 md:pb-16">
        <ProductTypesSection />
        <CollectionsSection className="mt-12 md:mt-20" />
        <FeaturedProductSection
          className="mt-12 md:mt-20"
          countryCode={countryCode}
        />
        
        {/* <Layout>
          <LayoutColumn className="col-span-full">
            <h3 className="text-md md:text-2xl mb-8 md:mb-16">
              About Sofa Society
            </h3>
            <Image
              src="/images/content/gray-sofa-against-concrete-wall.png"
              width={2496}
              height={1400}
              alt="Gray sofa against concrete wall"
              className="mb-8 md:mb-16 max-md:aspect-[3/2] max-md:object-cover"
            />
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, md: 7 }}>
            <h2 className="text-md md:text-2xl">
              At Sofa Society, we believe that a sofa is the heart of every
              home.
            </h2>
          </LayoutColumn>
          <LayoutColumn
            start={{ base: 1, md: 8 }}
            end={13}
            className="mt-6 md:mt-19"
          >
            <div className="md:text-md">
              <p className="mb-5 md:mb-9">
                We are dedicated to delivering high-quality, thoughtfully
                designed sofas that merge comfort and style effortlessly.
              </p>
              <p className="mb-5 md:mb-3">
                Our mission is to transform your living space into a sanctuary
                of relaxation and beauty, with products built to last.
              </p>
              <LocalizedLink href="/about" variant="underline">
                Read more about Sofa Society
              </LocalizedLink>
            </div>
          </LayoutColumn>
        </Layout> */}
      </div>
    </>
  )
}
