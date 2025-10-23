"use client"

import { useParams, usePathname } from "next/navigation"
import { twMerge } from "tailwind-merge"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"

export const Footer: React.FC = () => {
  const pathName = usePathname()
  const { countryCode } = useParams()
  const currentPath = pathName.split(`/${countryCode}`)[1]

  const isAuthPage = currentPath === "/register" || currentPath === "/login"

  return (
    <div
      className={twMerge(
        "bg-black text-white py-12 md:py-24",
        isAuthPage && "hidden"
      )}
    >
      <Layout>
        <LayoutColumn className="col-span-13">
          <div className="flex max-lg:flex-col justify-between md:gap-20 max-md:px-4">
            <div className="flex flex-1 max-lg:w-full max-lg:order-2 max-sm:flex-col justify-between sm:gap-30 lg:gap-20 md:items-start">
              <div className="max-w-40 md:flex-1 max-md:mb-12">
                <h1 className="text-xl md:text-2xl mb-3 md:mb-8 leading-tight font-semibold tracking-tight">
                  Zuhoor Lifestyle
                </h1>
                <p className="text-xs md:text-sm text-gray-400">
                  &copy; {new Date().getFullYear()}, Zuhoor Lifestyle. All rights reserved.
                </p>
              </div>
              <div className="flex gap-12 xl:gap-20 max-md:text-xs flex-1 justify-between lg:justify-center">
                
                <ul className="flex flex-col gap-5 md:gap-4">
                  <li className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Follow</li>
                  <li>
                    <a
                      href="https://www.instagram.com/agiloltd/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-gray-300 transition-colors"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-gray-300 transition-colors">
                      TikTok
                    </a>
                  </li>
                  <li>
                    <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-gray-300 transition-colors">
                      Pinterest
                    </a>
                  </li>
                  <li>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-gray-300 transition-colors">
                      Facebook
                    </a>
                  </li>
                </ul>
                <ul className="flex flex-col gap-5 md:gap-4">
                  <li className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Support</li>
                  <li>
                    <LocalizedLink href="/privacy-policy" className="text-sm hover:text-gray-300 transition-colors">
                      Privacy Policy
                    </LocalizedLink>
                  </li>
                  <li>
                    <LocalizedLink href="/cookie-policy" className="text-sm hover:text-gray-300 transition-colors">
                      Cookie Policy
                    </LocalizedLink>
                  </li>
                  <li>
                    <LocalizedLink href="/terms-of-use" className="text-sm hover:text-gray-300 transition-colors">
                      Terms of Use
                    </LocalizedLink>
                  </li>
                </ul>
              </div>
            </div>

            {/* <NewsletterForm className="flex-1 max-lg:w-full lg:max-w-90 xl:max-w-96 max-lg:order-1 max-md:mb-16" /> */}
          </div>
          <div className="border-t border-gray-800 mt-12 md:mt-16 pt-8 md:pt-12">
            <p className="text-xs text-gray-500 text-center">
              Crafted with care. Premium lifestyle essentials for the modern home.
            </p>
          </div>
        </LayoutColumn>
      </Layout>
    </div>
  )
}
