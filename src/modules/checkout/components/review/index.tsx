"use client"

import { twJoin } from "tailwind-merge"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useCart } from "hooks/cart"
import { withReactQueryProvider } from "@lib/util/react-query"

import { Button } from "@/components/Button"
import PaymentButton from "@modules/checkout/components/payment-button"
import { StoreCart } from "@medusajs/types"

const Review = ({ cart: initialCart }: { cart: StoreCart }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "review"
  
  // Fetch fresh cart data when review step opens to ensure payment button appears
  const { data: cart, refetch } = useCart({ enabled: isOpen })
  const activeCart = cart || initialCart

  // Refetch when review step opens to ensure we have latest payment_collection
  useEffect(() => {
    if (isOpen) {
      refetch()
    }
  }, [isOpen, refetch])

  // const paidByGiftcard =
  //   activeCart?.gift_cards && activeCart?.gift_cards?.length > 0 && activeCart?.total === 0
  const previousStepsCompleted =
    activeCart.shipping_address &&
    activeCart.shipping_methods &&
    activeCart.shipping_methods.length > 0 &&
    activeCart.payment_collection

  return (
    <>
      <div className="flex justify-between mb-6 md:mb-8 border-t border-grayscale-200 pt-8 mt-8">
        <div>
          <p
            className={twJoin(
              "transition-fontWeight duration-75",
              isOpen && "font-semibold"
            )}
          >
            5. Review
          </p>
        </div>
        {!isOpen &&
          previousStepsCompleted &&
          activeCart?.shipping_address &&
          activeCart?.billing_address &&
          activeCart?.email && (
            <Button
              variant="link"
              onPress={() => {
                router.push(pathname + "?step=review", { scroll: false })
              }}
            >
              View
            </Button>
          )}
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <p className="mb-8">
            By clicking the Place Order button, you confirm that you have read,
            understand and accept our Terms of Use, Terms of Sale and Returns
            Policy and acknowledge that you have read Zuhoor&apos;s
            Privacy Policy.
          </p>
          <PaymentButton
            cart={activeCart}
            selectPaymentMethod={() => {
              router.push(pathname + "?step=payment", { scroll: false })
            }}
          />
        </>
      )}
    </>
  )
}

export default withReactQueryProvider(Review)
