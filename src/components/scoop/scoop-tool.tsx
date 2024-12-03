import { TTokenData } from '@/types'

type Props = {
  selectedToken: TTokenData[]
}

const ScoopTool = ({ selectedToken }: Props) => {
  const swapToken = () => {
    console.log('☠️ ~ ScoopTool ~ selectedToken:', selectedToken)
  }

  return (
    <div className="flex flex-col gap-3 w-full border border-black p-4 rounded">
      <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg">
        <div className="flex flex-col">
          <p className="text-black">0</p>
          <p className="text-[12px]">Possible Scoop</p>
        </div>
        <button>DEL</button>
      </div>
      <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg">
        <div className="flex flex-col">
          <p className="text-black">0</p>
          <p className="text-[12px]">Total Scoop</p>
        </div>
        <button>DEL</button>
      </div>
      <button onClick={swapToken} className="w-full flex justify-center items-center py-3 bg-base-300 rounded-md">
        Scoop
      </button>
    </div>
  )
}

export default ScoopTool
