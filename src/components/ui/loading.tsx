import React from 'react'

type Props = {
  isLoading: boolean
  children: React.ReactNode
}

const Loading = ({ isLoading, children }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute min-w-fit w-full h-8">
        <span className="w-fit shrink-0">Getting Data ....</span>
      </div>
    )
  }
  return <>{children}</>
}

export default Loading
