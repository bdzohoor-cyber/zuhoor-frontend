"use client"
import { Icon } from "@/components/Icon"
import { withReactQueryProvider } from "@lib/util/react-query"
import { useDeleteLineItem } from "hooks/cart"

const DeleteButton = ({ id }: { id: string }) => {
  const { mutate, isPending } = useDeleteLineItem()

  return (
    <button
      type="button"
      onClick={() => mutate({ lineId: id })}
      disabled={isPending}
      className="p-1 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Delete"
    >
      {isPending ? (
        <Icon name="loader" className="w-4 h-4 sm:w-6 sm:h-6 animate-spin" />
      ) : (
        <Icon name="trash" className="w-4 h-4 sm:w-6 sm:h-6" />
      )}
    </button>
  )
}

export default withReactQueryProvider(DeleteButton)
