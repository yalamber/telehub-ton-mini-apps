"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

function LinkRow({ item }: { item: any }) {
  const updateStatus = (e: any) => {
    console.log(e.target.value);
  };
  return (
    <>
      <tr>
        <td className="p-4 text-sm font-normal text-gray-900 whitespace-nowrap dark:text-white">
          <Link href={`https://t.me/${item.link}`} className=" flex gap-2">
            {item.photo && (
              <img
                className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                src={item.photo}
                alt="avatar"
              ></img>
            )}
            {!item.photo && (
              <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  {item.title.slice(0, 1)}
                </span>
              </div>
            )}
            {item.link}
          </Link>
        </td>
        <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
          {item.country}
        </td>
        <td className="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap dark:text-white">
          {item.city}
        </td>
        <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
          {item.language}
        </td>
        <td className="inline-flex items-center p-4 space-x-2 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
          {item.category}
        </td>
        <td className="p-4 whitespace-nowrap">
          <select onChange={updateStatus} className="rounded p-1">
            <option value="PENDING" selected={item.status === "PENDING"}>
              PENDING
            </option>
            <option value="APPROVED" selected={item.status === "APPROVED"}>
              APPROVED
            </option>
            <option
              value="NOT_APPROVED"
              selected={item.status === "NOT_APPROVED"}
            >
              NOT APPROVED
            </option>
            <option value="DELETE">DELETE</option>
          </select>
        </td>
        <td className="p-4 whitespace-nowrap">
          <select onChange={updateStatus} className="rounded p-1">
            <option value="">SELECT TYPE</option>
            <option value="TRENDING" selected={item.featuredType === "TRENDING"}>
              TRENDING
            </option>
            <option value="NEW" selected={item.featuredType === "NEW"}>
              NEW
            </option>
          </select>
        </td>
      </tr>
    </>
  );
}

export default function AdminPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("PENDING");

  const fetchLinks = useCallback((filterStatus: string) => {
    (async () => {
      setLoading(true);
      let url = "/api/links";
      if (filterStatus) {
        url += `?status=${filterStatus}`;
      }
      const response = await fetch(url);
      const resData = await response.json();
      const links = resData?.data;
      setLinks(links);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    fetchLinks(filterStatus);
  }, [fetchLinks, filterStatus]);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <div className="items-center justify-between lg:flex">
        <div className="mb-4 lg:mb-0">
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            Links
          </h3>
          <span className="text-base font-normal text-gray-500 dark:text-gray-400">
            This is a list of all submitted link
          </span>
        </div>
        <div className="items-center sm:flex ">
          <span className="text-white">Filter by: &nbsp;</span>
          <select
            onChange={(e) => {
              setFilterStatus(e.target.value);
            }}
            className="rounded p-1"
          >
            <option value="">Status</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="NOT_APPROVED">NOT APPROVED</option>
          </select>
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
                      Link
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                    >
                      Country
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                    >
                      City
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                    >
                      Language
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                    >
                      Featured Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                  {links.map((item: any) => (
                    <LinkRow key={`link-${item._id}`} item={item} />
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
