import * as React from "react"

const TOAST_LIMIT = 1

export type ToasterToast = {
  id: string
  description?: string
  variant?: "default" | "destructive"
  open?: boolean
  action?: React.ReactNode
}

type State = {
  toasts: ToasterToast[]
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
  REMOVE_ALL: "REMOVE_ALL",
} as const

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type Action =
  | { type: typeof actionTypes.ADD_TOAST; toast: ToasterToast }
  | { type: typeof actionTypes.REMOVE_TOAST; toastId: string }
  | { type: typeof actionTypes.REMOVE_ALL }

let memoryState: State = { toasts: [] }
const listeners: Array<(state: State) => void> = []

function dispatch(action: Action) {
  switch (action.type) {
    case "ADD_TOAST":
      memoryState = {
        ...memoryState,
        toasts: [action.toast, ...memoryState.toasts].slice(0, TOAST_LIMIT),
      }
      break
    case "REMOVE_TOAST":
      memoryState = {
        ...memoryState,
        toasts: memoryState.toasts.filter((t) => t.id !== action.toastId),
      }
      break
    case "REMOVE_ALL":
      memoryState = {
        ...memoryState,
        toasts: [],
      }
      break
  }

  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

export function toast({ ...props }: Omit<ToasterToast, "id">) {
  const id = genId()

  const dismiss = () => dispatch({ type: "REMOVE_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
    },
  })

  // Auto-dismiss after 5 seconds
  setTimeout(dismiss, 5000)

  return {
    id,
    dismiss,
  }
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId: string) => dispatch({ type: "REMOVE_TOAST", toastId }),
    dismissAll: () => dispatch({ type: "REMOVE_ALL" }),
  }
}
