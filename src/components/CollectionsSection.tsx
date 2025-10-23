import Image from "next/image"
import { getCollectionsList } from "@lib/data/collections"
import { Carousel } from "@/components/Carousel"
import { LocalizedButtonLink, LocalizedLink } from "@/components/LocalizedLink"

export const CollectionsSection: React.FC<{ className?: string }> = async ({
  className,
}) => {
  const collections = await getCollectionsList(0, 20, [
    "id",
    "title",
    "handle",
    "metadata",
  ])

  if (!collections) {
    return null
  }

  return (
    <Carousel
      heading={<h3 className="text-lg md:text-3xl font-semibold tracking-tight">Collections</h3>}
      button={
        <>
          <LocalizedButtonLink
            href="/store"
            size="md"
            className="h-full flex-1 max-md:hidden md:h-auto bg-black text-white hover:bg-gray-900 transition-colors"
          >
            View All
          </LocalizedButtonLink>
          <LocalizedButtonLink href="/store" size="sm" className="md:hidden bg-black text-white hover:bg-gray-900 transition-colors">
            View All
          </LocalizedButtonLink>
        </>
      }
      className={className}
    >
      {collections.collections.map((collection) => (
        <div
          className="w-[70%] sm:w-[60%] lg:w-full max-w-124 flex-shrink-0"
          key={collection.id}
        >
          <LocalizedLink href={`/collections/${collection.handle}`}>
            {typeof collection.metadata?.image === "object" &&
              collection.metadata.image &&
              "url" in collection.metadata.image &&
              typeof collection.metadata.image.url === "string" && (
                <div className="relative mb-4 md:mb-10 w-full aspect-[3/4] overflow-hidden group">
                  <Image
                    src={collection.metadata.image.url}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>
              )}
            <h3 className="md:text-lg mb-2 md:mb-4 font-semibold text-black group-hover:text-gray-700 transition-colors">{collection.title}</h3>
            {typeof collection.metadata?.description === "string" &&
              collection.metadata?.description.length > 0 && (
                <p className="text-xs text-gray-600 md:text-sm">
                  {collection.metadata.description}
                </p>
              )}
          </LocalizedLink>
        </div>
      ))}
    </Carousel>
  )
}
