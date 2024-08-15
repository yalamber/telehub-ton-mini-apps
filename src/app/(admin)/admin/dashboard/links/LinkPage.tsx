"use client";
import { useCallback, useEffect, useState } from "react";
import Modal from "../../components/Modal";
import Link from "next/link";

function LinkRow({
  item,
  fetchLinks,
  filterStatus,
}: {
  item: any;
  fetchLinks: (filterStatus: string) => void;
  filterStatus: string;
}) {
  const updateLink = async (data: any) => {
    let url = `/api/filter-options/${item._id}`;
    const rawResponse = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resData = await rawResponse.json();
    if (resData) {
      fetchLinks(filterStatus);
    }
  };

  const handleDelete = async (id: string) => {
    let url = `/api/links/${id}`;
    const rawResponse = await fetch(url, { method: "DELETE" });
    const resData = await rawResponse.json();
    if (resData) {
      fetchLinks(filterStatus);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <>
      <Modal
        title="Are you sure want to delete?"
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <div className="flex justify-end border-t p-4">
          <button
            className="bg-gray-500 text-white rounded px-4 py-2 mr-2"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button onClick={() => handleDelete(item?._id)} className="bg-blue-500 text-white rounded px-4 py-2">
            Delete
          </button>
        </div>
      </Modal>
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
          <select
            onChange={(e) => updateLink({ status: e.target.value })}
            className="rounded p-1"
          >
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
          </select>
        </td>
        <td className="p-4 whitespace-nowrap">
          <select
            onChange={(e) => updateLink({ featuredType: e.target.value })}
            className="rounded p-1"
          >
            <option value="NONE" selected={item.featuredType === "NONE"}>
              SELECT
            </option>
            <option value="NEW" selected={item.featuredType === "NEW"}>
              NEW
            </option>
            <option
              value="TRENDING"
              selected={item.featuredType === "TRENDING"}
            >
              TRENDING
            </option>
          </select>
        </td>
        <td className="p-4 whitespace-nowrap">
          <div title="Delete" onClick={openModal} style={{ cursor: "pointer" }}>
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
    </>
  );
}

export default function AdminPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

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
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                  {links.map((item: any) => (
                    <LinkRow
                      key={`link-${item._id}`}
                      item={item}
                      fetchLinks={fetchLinks}
                      filterStatus={filterStatus}
                    />
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
