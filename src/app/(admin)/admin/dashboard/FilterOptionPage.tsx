"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

export default function FilterOptionsPage({
  type,
  title,
  parent,
}: {
  title: string;
  type: string;
  parent?: string;
}) {
  const [items, setItems] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(() => {
    (async () => {
      setLoading(true);
      let url = `/api/filter-options?type=${type}`;
      if (parent) {
        url += `&parent=${parent}`;
      }
      const response = await fetch(url);
      const resData = await response.json();
      const items = resData?.data;
      setItems(items);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <div className="items-center justify-between lg:flex">
        <div className="mb-4 lg:mb-0">
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            {(type === "CITY" && items?.length > 0) && `${items?.[0]?.parent} > `} {title}
          </h3>
        </div>
        <div className="items-center sm:flex">
          <div className="flex items-center"></div>
        </div>
      </div>
      <div className="flex flex-col mt-6">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                    >
                      Label
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                    >
                      Value
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                  {items?.map((item: any) => (
                    <tr key={`item-${item.id}`}>
                      <td className="p-4 text-sm font-normal text-gray-900 whitespace-nowrap dark:text-white">
                        {item.label}
                      </td>
                      <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                        {item.value}{" "}
                      </td>
                      <td className="p-4 whitespace-nowra flex gap-2">
                        <div title="Add" style={{ cursor: "pointer" }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="#fff"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </div>
                        {type === "COUNTRY" && (
                          <div title="View" style={{ cursor: "pointer" }}>
                            <Link
                              href={`/admin/dashboard/cities?parent=${item.value}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="#fff"
                                className="size-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                              </svg>
                            </Link>
                          </div>
                        )}
                        <div title="Delete" style={{ cursor: "pointer" }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="#fff"
                            className="size-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading && "Loading..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
