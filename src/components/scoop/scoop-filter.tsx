import { SORT_BY, SORT_TYPE, TFilterData } from '@/types'

type Props = {
  filterData: TFilterData
  setFilterData: (data: TFilterData) => void
}

const ScoopFilter = ({ filterData, setFilterData }: Props) => {
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({
      ...filterData,
      symbol: e.target.value,
    })
  }

  const onChangeSort = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({
      ...filterData,
      isSort: e.target.checked,
    })
  }

  const onChangeSortType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterData({
      ...filterData,
      sortType: e.target.value as SORT_TYPE,
    })
  }

  const onChangeSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterData({
      ...filterData,
      sortBy: e.target.value,
    })
  }

  return (
    <div className="w-full mb-2 flex items-center gap-4">
      <div className="flex items-center border rounded border-gray-300 w-[300px] px-3 py-1">
        <input
          type="text"
          placeholder="Search Assets"
          value={filterData?.symbol}
          onChange={onChangeSearch}
          className="bg-transparent border-none outline-none text-black text-[14px] flex-1"
        />
        <img src="/search-icon.svg" alt="icon" className="size-4 shrink-0" />
      </div>
      <div className="flex items-center gap-1">
        <div className="flex gap-3 items-center">
          {/* Checkbox */}
          <div className="flex h-full shrink-0 items-center gap-1">
            <div className="group grid size-4 grid-cols-1">
              <input
                id="sort"
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                checked={filterData?.isSort}
                onChange={onChangeSort}
                className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
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
            <label htmlFor="sort" className="font-medium text-gray-900">
              Sort
            </label>
          </div>
          {filterData?.isSort && (
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-1">
                <select
                  id="sortType"
                  name="sortType"
                  value={filterData?.sortType}
                  onChange={onChangeSortType}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                  <option value={SORT_TYPE.ASC}>Ascending</option>
                  <option value={SORT_TYPE.DESC}>Descending</option>
                </select>
                <svg
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="grid grid-cols-1">
                <select
                  id="sortBy"
                  name="sortBy"
                  value={filterData?.sortBy}
                  onChange={onChangeSortBy}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                  <option value={SORT_BY.SYMBOL}>Symbol</option>
                  <option value={SORT_BY.BALANCE}>Balance</option>
                  <option value={SORT_BY.SCOOP_VALUE}>Scoop Value</option>
                </select>
                <svg
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScoopFilter
