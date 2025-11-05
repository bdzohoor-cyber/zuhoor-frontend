import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import { getProductTypesList } from "@lib/data/product-types"
import { Layout, LayoutColumn } from "@/components/Layout"
import { CollectionsSection } from "@/components/CollectionsSection"
import { getCollectionsList } from "@lib/data/collections"
import HeroCarousel from "@/components/hero-carousel"
import { FeaturedProductSection } from "@/components/FeaturedProductSection"
import ProductTypesGrid from "@/components/ProductTypesGrid"

export const metadata: Metadata = {
  title: "Zuhoor Lifestyle",
  description: "A modern clothing brand that offers a wide range of products for men and women.",
}

export const revalidate = 60 // Revalidate every 60 seconds

const ProductTypesSection: React.FC<{ className?: string }> = async ({ className }) => {
  const productTypes = await getProductTypesList(0, 20, [
    "id",
    "value",
    "metadata",
  ])

  if (!productTypes) {
    return null
  }

  return (
    <Layout className={className}>
      <LayoutColumn className="col-span-full mb-10 md:mb-16">
        <h3 className="text-xl md:text-3xl font-display font-normal tracking-tight px-4 md:px-0 text-center">
          Our Products
        </h3>
      </LayoutColumn>
      
      {/* Mobile Layout */}
      <LayoutColumn className="col-span-full md:hidden">
        <ProductTypesGrid
          productTypes={productTypes.productTypes}
          isMobile={true}
        />
      </LayoutColumn>

      {/* Desktop Layout */}
      <LayoutColumn className="col-span-full max-md:hidden">
        <ProductTypesGrid
          productTypes={productTypes.productTypes}
          isMobile={false}
        />
      </LayoutColumn>
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
  
  const collections = await getCollectionsList(0, 20, [
    "id",
    "title",
    "handle",
    "metadata",
  ])

  return (
    <>
      <div className="relative h-[60vh] md:h-[75vh] min-h-[500px] md:min-h-[700px] overflow-hidden bg-white">
        {/* <Image
          src="/images/content/living-room-gray-armchair-two-seater-sofa.png"
          width={2880}
          height={1500}
          alt="Living room with gray armchair and two-seater sofa"
          className="md:h-screen md:object-cover"
        /> */}
        <HeroCarousel/>
      </div>
      <div className="pt-8 pb-20 md:pt-12 md:pb-24">
      <FeaturedProductSection
          className="mt-16 md:mt-24"
          countryCode={countryCode}
        />
        {collections && collections.collections && (
          <CollectionsSection 
            collections={collections.collections}
            className="mt-20 md:mt-28" 
          />
        )}
        
        <ProductTypesSection className="mt-20 md:mt-28" />
        
        {/* <Layout>
          <LayoutColumn className="col-span-full">
            <h3 className="text-md md:text-2xl mb-8 md:mb-16">
              About Zuhoor
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
              At Zuhoor, we believe that style is the essence of every
              confident individual.
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
                designed clothing that merges comfort and style effortlessly.
              </p>
              <p className="mb-5 md:mb-3">
                Our mission is to help you build a wardrobe that reflects your
                unique personality and confidence, with pieces built to last.
              </p>
              <LocalizedLink href="/about" variant="underline">
                Read more about Zuhoor
              </LocalizedLink>
            </div>
          </LayoutColumn>
        </Layout> */}
      </div>
    </>
  )
}
