import { ReactNode, Suspense, useEffect, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import { Link } from 'react-router-dom'

import { WalletButton } from '../solana/solana-provider'

export function UiLayout({ children }: { children: ReactNode; links: { label: string; path: string }[] }) {
  return (
    <div className="h-full flex flex-col main-bg bg-white min-h-screen">
      <div className="container navbar text-neutral-content flex-col md:flex-row space-y-2 md:space-y-0 mx-auto">
        <div className="flex-1">
          <Link className="normal-case text-xl" to="/">
            <img className="h-4 md:h-12" alt="Logo" src="/logo.svg" />
          </Link>
        </div>
        <div className="flex-none space-x-2">
          <WalletButton />
        </div>
      </div>
      <div className="flex-grow flex-1 py-8">
        <Suspense
          fallback={
            <div className="text-center my-32">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          }
        >
          {children}
        </Suspense>
        <Toaster position="bottom-right" />
      </div>
      <footer className="footer footer-center p-4 text-base-content border-t border-[#e2e8f0]">
        <aside>
          <p>Solana Vacuum Assets</p>
        </aside>
      </footer>
    </div>
  )
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode
  title: string
  hide: () => void
  show: boolean
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (!dialogRef.current) return
    if (show) {
      dialogRef.current.showModal()
    } else {
      dialogRef.current.close()
    }
  }, [show, dialogRef])

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button className="btn btn-xs lg:btn-md btn-primary" onClick={submit} disabled={submitDisabled}>
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}
