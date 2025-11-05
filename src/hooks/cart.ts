import {
  addToCart,
  applyPromotions,
  deleteLineItem,
  getCartQuantity,
  getPaymentMethod,
  initiatePaymentSession,
  placeOrder,
  retrieveCart,
  setAddresses,
  setEmail,
  setPaymentMethod,
  setShippingMethod,
  updateLineItem,
  updateRegion,
} from "@lib/data/cart"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { z } from "zod"

export const useCart = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await retrieveCart()
      return res
    },
    enabled,
    staleTime: 30 * 1000, // 30 seconds - short because cart changes frequently
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false, // Controlled via refetch() calls in components
  })
}

export const useCartQuantity = () => {
  return useQuery({
    queryKey: ["cart", "cart-quantity"],
    queryFn: async () => {
      const res = await getCartQuantity()
      return res
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

export const useCartShippingMethods = (cartId: string) => {
  return useQuery({
    queryKey: ["shipping", cartId], // More specific key prevents collisions
    queryFn: async () => {
      const res = await listCartShippingMethods(cartId)
      return res
    },
    enabled: !!cartId, // Only fetch when cartId exists
    staleTime: 5 * 60 * 1000, // 5 minutes - shipping methods rarely change
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}

export const useCartPaymentMethods = (regionId: string) => {
  return useQuery({
    queryKey: ["payment", regionId], // More specific key prevents collisions
    queryFn: async () => {
      const res = await listCartPaymentMethods(regionId)
      return res
    },
    enabled: !!regionId, // Only fetch when regionId exists
    staleTime: 10 * 60 * 1000, // 10 minutes - payment methods rarely change
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  })
}

export const useUpdateLineItem = (
  options?: UseMutationOptions<
    void,
    Error,
    { lineId: string; quantity: number },
    unknown
  >
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["cart-update-line-item"],
    mutationFn: async (payload: { lineId: string; quantity: number }) => {
      const response = await updateLineItem({
        lineId: payload.lineId,
        quantity: payload.quantity,
      })
      return response
    },
    onSuccess: async function (...args) {
      // Invalidate all cart queries including cart-quantity for immediate UI update
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
        exact: false, // Invalidate all cart-related queries including cart-quantity
        refetchType: "active", // Refetch active queries immediately
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useDeleteLineItem = (
  options?: UseMutationOptions<void, Error, { lineId: string }, unknown>
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["cart-delete-line-item"],
    mutationFn: async (payload: { lineId: string }) => {
      const response = await deleteLineItem(payload.lineId)

      return response
    },
    onSuccess: async function (...args) {
      // Invalidate all cart queries including cart-quantity for immediate UI update
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
        exact: false, // Invalidate all cart-related queries
        refetchType: "active", // Refetch active queries immediately
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useAddLineItem = (
  options?: UseMutationOptions<
    void,
    Error,
    { variantId: string; quantity: number; countryCode: string | undefined },
    { previousCart: any; previousQuantity: number | undefined }
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["cart-add-line-item"],
    mutationFn: async (payload: {
      variantId: string
      quantity: number
      countryCode: string | undefined
    }) => {
      const response = await addToCart({ ...payload })

      return response
    },
    // Optimistic update for instant UI feedback
    onMutate: async (payload) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["cart"] })
      
      // Snapshot previous values
      const previousCart = queryClient.getQueryData(["cart"])
      const previousQuantity = queryClient.getQueryData<number>(["cart", "cart-quantity"])
      
      // Optimistically update cart quantity
      queryClient.setQueryData<number>(
        ["cart", "cart-quantity"], 
        (old = 0) => old + payload.quantity
      )
      
      return { previousCart, previousQuantity }
    },
    onError: (err, payload, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart)
      }
      if (context?.previousQuantity !== undefined) {
        queryClient.setQueryData(["cart", "cart-quantity"], context.previousQuantity)
      }
    },
    onSuccess: async function (...args) {
      // Invalidate all cart queries including cart-quantity for immediate UI update
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
        exact: false, // Invalidate all cart-related queries including cart-quantity
        refetchType: "active", // Refetch active queries immediately
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useSetShippingMethod = (
  { cartId }: { cartId: string },
  options?: UseMutationOptions<
    void,
    Error,
    { shippingMethodId: string },
    { previousCart: any }
  >
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["shipping-update", cartId],
    mutationFn: async ({ shippingMethodId }) => {
      const response = await setShippingMethod({
        cartId,
        shippingMethodId,
      })

      return response
    },
    // Optimistic update
    onMutate: async ({ shippingMethodId }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] })
      const previousCart = queryClient.getQueryData(["cart"])
      
      // Optimistically update shipping method
      queryClient.setQueryData(["cart"], (old: any) => {
        if (!old) return old
        return {
          ...old,
          shipping_methods: [{
            shipping_option_id: shippingMethodId,
            // Keep other properties if they exist
            ...old.shipping_methods?.[0],
          }],
        }
      })
      
      return { previousCart }
    },
    onError: (err, payload, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart)
      }
    },
    onSuccess: async function (...args) {
      // Refetch active queries immediately to keep checkout in sync
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
        exact: false, // Invalidate all cart queries
        refetchType: "active", // Refetch active queries immediately
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const addressesFormSchema = z
  .object({
    shipping_address: z.object({
      first_name: z.string().min(1),
      last_name: z.string().min(1),
      company: z.string().optional(),
      address_1: z.string().min(1),
      address_2: z.string().optional(),
      city: z.string().min(1),
      postal_code: z.string().optional(),
      province: z.string().optional(),
      country_code: z.string().min(2),
      phone: z.string().min(1),
    }),
  })
  .and(
    z.discriminatedUnion("same_as_billing", [
      z.object({
        same_as_billing: z.literal("on"),
      }),
      z.object({
        same_as_billing: z.literal("off").optional(),
        billing_address: z.object({
          first_name: z.string().min(1),
          last_name: z.string().min(1),
          company: z.string().optional(),
          address_1: z.string().min(1),
          address_2: z.string().optional(),
          city: z.string().min(1),
          postal_code: z.string().optional(),
          province: z.string().optional(),
          country_code: z.string().min(2),
          phone: z.string().min(1),
        }),
      }),
    ])
  )

export const useSetShippingAddress = (
  options?: UseMutationOptions<
    { success: boolean; error: string | null },
    Error,
    z.infer<typeof addressesFormSchema>,
    { previousCart: any }
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["shipping-address-update"],
    mutationFn: async (payload) => {
      const response = await setAddresses(payload)
      return response
    },
    // Optimistic update
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] })
      const previousCart = queryClient.getQueryData(["cart"])
      
      // Optimistically update addresses
      queryClient.setQueryData(["cart"], (old: any) => 
        old ? {
          ...old,
          shipping_address: payload.shipping_address,
          billing_address: payload.same_as_billing === "on" 
            ? payload.shipping_address 
            : payload.billing_address,
        } : old
      )
      
      return { previousCart }
    },
    onError: (err, payload, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart)
      }
    },
    onSuccess: async function (...args) {
      // Refetch active queries immediately to keep checkout in sync
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
        exact: false, // Invalidate all cart queries
        refetchType: "active", // Refetch active queries immediately
      })
      
      // Also invalidate shipping methods since address changed
      await queryClient.invalidateQueries({
        queryKey: ["shipping"],
        exact: false,
        refetchType: "active", // Refetch active queries immediately
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useSetEmail = (
  options?: UseMutationOptions<
    { success: boolean; error: string | null },
    Error,
    { email: string; country_code: string },
    { previousCart: any }
  >
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["set-email"],
    mutationFn: async (payload) => {
      const response = await setEmail(payload)
      return response
    },
    // Optimistic update
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] })
      const previousCart = queryClient.getQueryData(["cart"])
      
      // Optimistically update cart email
      queryClient.setQueryData(["cart"], (old: any) => 
        old ? { ...old, email: payload.email } : old
      )
      
      return { previousCart }
    },
    onError: (err, payload, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart)
      }
    },
    onSuccess: async function (...args) {
      // Refetch active queries immediately to keep checkout in sync
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
        exact: false, // Invalidate all cart queries
        refetchType: "active", // Refetch active queries immediately
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useInitiatePaymentSession = (
  options?: UseMutationOptions<
    HttpTypes.StorePaymentCollectionResponse,
    Error,
    {
      providerId: string
    },
    unknown
  >
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["initiate-payment"],
    mutationFn: async (payload: { providerId: string }) => {
      const response = await initiatePaymentSession(payload.providerId)

      return response
    },
    onSuccess: async function (...args) {
      // Refetch active queries immediately to keep checkout in sync
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
        exact: false, // Invalidate all cart queries
        refetchType: "active", // Refetch active queries immediately
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useSetPaymentMethod = (
  options?: UseMutationOptions<
    void,
    Error,
    { sessionId: string; token: string | null | undefined },
    unknown
  >
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["set-payment"],
    mutationFn: async (payload) => {
      const response = await setPaymentMethod(payload.sessionId, payload.token)

      return response
    },
    onSuccess: async function (...args) {
      // Refetch active queries immediately to keep checkout in sync
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
        exact: false, // Invalidate all cart queries
        refetchType: "active", // Refetch active queries immediately
      })
      
      // Invalidate payment method query if token exists
      const variables = args[1]
      if (variables?.token) {
        await queryClient.invalidateQueries({
          queryKey: ["payment"],
          exact: false,
          refetchType: "active", // Refetch active queries immediately
        })
      }

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useGetPaymentMethod = (id: string | undefined) => {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: async () => {
      if (!id) {
        return null
      }
      const res = await getPaymentMethod(id)
      return res
    },
  })
}

export const usePlaceOrder = (
  options?: UseMutationOptions<
    | {
        type: "cart"
        cart: HttpTypes.StoreCart
        error: {
          message: string
          name: string
          type: string
        }
      }
    | {
        type: "order"
        order: HttpTypes.StoreOrder
      }
    | null,
    Error,
    null,
    unknown
  >
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["place-order"],
    mutationFn: async () => {
      const response = await placeOrder()
      return response
    },
    ...options,
    onSuccess: async function (...args) {
      // Place order should invalidate more aggressively since cart becomes order
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
        exact: false, // This one should invalidate all cart queries
      })
      
      await queryClient.invalidateQueries({
        queryKey: ["orders"],
        exact: false,
      })

      await options?.onSuccess?.(...args)
    },
  })
}

export const useApplyPromotions = (
  options?: UseMutationOptions<void, Error, string[], unknown>
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["apply-promotion"],
    mutationFn: async (payload) => {
      const response = await applyPromotions(payload)

      return response
    },
    onSuccess: async function (...args) {
      // Background refetch - doesn't block UI, but keeps data fresh
      queryClient.invalidateQueries({
        queryKey: ["cart"],
        exact: true,
        refetchType: "inactive", // Refetch when components mount, not immediately
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useUpdateRegion = (
  options?: UseMutationOptions<
    void,
    Error,
    { countryCode: string; currentPath: string },
    unknown
  >
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["update-region"],
    mutationFn: async ({ countryCode, currentPath }) => {
      await updateRegion(countryCode, currentPath)
    },
    onSuccess: async function (...args) {
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["cart"],
      })
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["regions"],
      })
      await queryClient.invalidateQueries({
        exact: false,
        queryKey: ["products"],
      })

      await options?.onSuccess?.(...args)
    },
    ...options,
  })
}
