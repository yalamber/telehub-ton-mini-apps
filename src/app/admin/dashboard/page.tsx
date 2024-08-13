export default function AdminPage() {
  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 mt-4 xl:grid-cols-2 2xl:grid-cols-3">
        <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <div className="w-full">
            <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
              New Links
            </h3>
            <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
              2,340
            </span>
            <p className="flex items-center text-base font-normal text-gray-500 dark:text-gray-400">
              Since last month
            </p>
          </div>
        </div>
        <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <div className="w-full">
            <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
              Users
            </h3>
            <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
              2,340
            </span>
            <p className="flex items-center text-base font-normal text-gray-500 dark:text-gray-400">
              Since last month
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
