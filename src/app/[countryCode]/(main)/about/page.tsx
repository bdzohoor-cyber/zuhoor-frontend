import { Metadata } from "next"
import Image from "next/image"
import { StoreRegion } from "@medusajs/types"
import { listRegions } from "@lib/data/regions"
import { Layout, LayoutColumn } from "@/components/Layout"

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Zuhoor",
}

export async function generateStaticParams() {
  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions.flatMap((r) =>
      r.countries
        ? r.countries
            .map((c) => c.iso_2)
            .filter(
              (value): value is string =>
                typeof value === "string" && Boolean(value)
            )
        : []
    )
  )

  const staticParams = countryCodes.map((countryCode) => ({
    countryCode,
  }))

  return staticParams
}

export default function AboutPage() {
  return (
    <>
      <div className="max-md:pt-18">
        <Image
          src="/images/content/living-room-gray-three-seater-sofa.png"
          width={2880}
          height={1500}
          alt="Living room with gray three-seater sofa"
          className="md:h-screen md:object-cover"
        />
      </div>
      <div className="pt-8 md:pt-26 pb-26 md:pb-36">
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, lg: 7 }}>
            <h3 className="text-md max-lg:mb-6 md:text-2xl">
              At Zuhoor, we believe that style is the essence of every
              confident individual.
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              <p className="mb-5 lg:mb-9">
                Welcome to Zuhoor, where we believe that comfort and style
                should be effortlessly intertwined. Our mission is to help you
                curate a wardrobe that reflects your unique personality and brings
                confidence to every moment.
              </p>
              <p>
                Every piece in our collection is designed with care, blending
                timeless craftsmanship with modern aesthetics to offer you the
                perfect balance between sophistication and versatility.
              </p>
            </div>
          </LayoutColumn>
          <LayoutColumn>
            <Image
              src="/images/content/living-room-black-armchair-dark-gray-sofa.png"
              width={2496}
              height={1404}
              alt="Living room with black armchair and dark gray sofa"
              className="mt-26 lg:mt-36 mb-8 lg:mb-26"
            />
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, lg: 8 }}>
            <h3 className="text-md lg:mb-10 mb-6 md:text-2xl">
              We are here to make your wardrobe a true reflection of your
              personal style.
            </h3>
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, lg: 6 }}>
            <div className="mb-16 lg:mb-26">
              <p className="mb-5 md:mb-9">
                At the heart of our brand is a deep commitment to quality. We
                understand that clothing isn&apos;t just another piece of
                fabric; it&apos;s how you express yourself, make lasting
                impressions, and feel confident in every moment. That&apos;s why we source only the finest
                materials and textiles, ensuring that every garment we offer is
                built to last.
              </p>
              <p>
                From luxurious silks and premium cottons to high-performance
                fabrics, each textile is carefully selected for its quality
                and beauty. Our attention to detail extends to every stitch and
                seam, guaranteeing that your clothing will not only look stunning
                but will also withstand the test of time.
              </p>
            </div>
          </LayoutColumn>
          <LayoutColumn start={{ base: 2, lg: 1 }} end={{ base: 12, lg: 7 }}>
            <Image
              src="/images/content/gray-one-seater-sofa-wooden-coffee-table.png"
              width={1200}
              height={1600}
              alt="Gray one-seater sofa and wooden coffee table"
              className="mb-16 lg:mb-46"
            />
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="mb-6 lg:mb-20 xl:mb-36">
              <p>
                Our design philosophy revolves around creating pieces that are
                both beautiful and practical. Inspired by Scandinavian
                simplicity, modern luxury, and timeless classics, our
                collections are curated to suit a wide variety of tastes and
                lifestyles. We understand that every individual is unique, so we
                offer a diverse range of styles, colors, and textures to help
                you find the perfect fit. Whether you prefer sleek modern lines
                or soft, elegant silhouettes, we have something to suit every
                occasion and personality.
              </p>
            </div>
            <div className="md:text-md max-lg:mb-26">
              <p>
                We believe that great design should be environmentally
                conscious, which is why we strive to minimise our environmental
                footprint through responsible sourcing and production practices.
                Our commitment to sustainability ensures that our products are
                not only beautiful but also kind to the planet.
              </p>
            </div>
          </LayoutColumn>
        </Layout>
        <Image
          src="/images/content/living-room-gray-three-seater-puffy-sofa.png"
          width={2880}
          height={1618}
          alt="Living room with gray three-seater puffy sofa"
          className="mb-8 lg:mb-26"
        />
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, lg: 7 }}>
            <h3 className="text-md max-lg:mb-6 md:text-2xl">
              Our customers are at the center of everything we do!
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              <p className="mb-5 lg:mb-9">
                Our team is here to help guide you through the process, offering
                personalised support to ensure that you find exactly what
                you&apos;re looking for.
              </p>
              <p>
                We&apos;re not just selling clothing - we&apos;re helping you
                express yourself, feel confident, and make lasting
                impressions. Thank you for choosing Zuhoor to be a part of
                your style journey!
              </p>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
