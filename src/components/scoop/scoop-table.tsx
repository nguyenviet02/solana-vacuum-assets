'use client'

import { TTokenData } from '@/types'
import { useLayoutEffect, useRef, useState } from 'react'

type TProps = {
  data: TTokenData[]
  isLoading: boolean
}

export default function ScoopTable({ data, isLoading }: TProps) {
  const checkbox = useRef<HTMLInputElement>(null)
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedToken, setSelectedToken] = useState<TTokenData[]>([])

  useLayoutEffect(() => {
    const isIndeterminate = selectedToken.length > 0 && selectedToken.length < data?.length
    setChecked(selectedToken.length === data?.length)
    setIndeterminate(isIndeterminate)
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate
    }
  }, [data?.length, selectedToken])

  function toggleAll() {
    setSelectedToken(checked || indeterminate ? [] : data)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  return (
    <div className="flow-root w-full">
      <div className="overflow-x-auto border border-gray-300 rounded">
        <div className="inline-block min-w-full align-middle ">
          <div className="relative">
            <table className="min-w-full table-fixed divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                    <div className="group absolute left-4 top-1/2 -mt-2 grid size-4 grid-cols-1">
                      <input
                        type="checkbox"
                        className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                      <svg
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          className="opacity-0 group-has-[:checked]:opacity-100"
                          d="M3 8L6 11L11 3.5"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          className="opacity-0 group-has-[:indeterminate]:opacity-100"
                          d="M3 7H11"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" className="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                    Symbol
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Balance
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Scoop Value ($CAT)
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Scoop Value (Sol)
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Fee ($CAT)
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Token List
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y min-h-8 divide-gray-200 bg-white">
                {!isLoading ? (
                  <>
                    {data.map((token) => (
                      <tr key={token?.mintAddress} className={selectedToken.includes(token) ? 'bg-gray-50' : undefined}>
                        <td className="relative px-7 sm:w-12 sm:px-6">
                          {selectedToken.includes(token) && (
                            <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                          )}
                          <div className="group absolute left-4 top-1/2 -mt-2 grid size-4 grid-cols-1">
                            <input
                              type="checkbox"
                              className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                              value={token?.mintAddress}
                              checked={selectedToken.includes(token)}
                              onChange={(e) =>
                                setSelectedToken(
                                  e.target.checked
                                    ? [...selectedToken, token]
                                    : selectedToken.filter((p) => p !== token),
                                )
                              }
                            />
                            <svg
                              className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                className="opacity-0 group-has-[:checked]:opacity-100"
                                d="M3 8L6 11L11 3.5"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                d="M3 7H11"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </td>
                        <td
                          className={`
														whitespace-nowrap py-4 pr-3 text-sm font-medium'
														${selectedToken.includes(token) ? 'text-indigo-600' : 'text-gray-900'}`}
                        >
                          {token?.tokenSymbol}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{token?.tokenBalance}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{token?.tokenSymbol}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{token?.tokenSymbol}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{token?.tokenSymbol}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{token?.tokenSymbol}</td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
