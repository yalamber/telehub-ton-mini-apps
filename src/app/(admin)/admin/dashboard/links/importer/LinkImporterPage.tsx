'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Papa from 'papaparse';

export default function AdminPage() {
  const [csvData, setCsvData] = useState<any[]>([]);
  const processingRef = useRef(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          setCsvData(results.data.map(row => 
            typeof row === 'object' && row !== null ? { ...row, _status: 'pending' } : { _status: 'error' }
          ));
        },
      });
    }
  }, []);

  const processRow = useCallback(async (row: any, index: number) => {
    try {
      const response = await fetch('/api/links/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        return 'error';
      }
      return 'success';
    } catch (error) {
      console.error('Error processing row:', error);
      return 'error';
    }
  }, []);

  useEffect(() => {
    const processRowsSequentially = async () => {
      if (processingRef.current) return;
      processingRef.current = true;

      for (let i = 0; i < csvData.length; i++) {
        if (csvData[i]._status === 'pending') {
          const status = await processRow(csvData[i], i);
          setCsvData(prevData => 
            prevData.map((row, index) => 
              index === i ? { ...row, _status: status } : row
            )
          );
        }
      }

      processingRef.current = false;
    };

    if (csvData.length > 0) {
      processRowsSequentially();
    }
  }, [csvData, processRow]);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <div className="items-center justify-between lg:flex">
        <div className="mb-4 lg:mb-0">
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            Import CSV file
          </h3>
          <span className="text-base font-normal text-gray-500 dark:text-gray-400">
            Use specific format for csv import
            <br />
            link, category, country, city, language
          </span>
        </div>
        <div className="items-center sm:flex"></div>
      </div>
      <div className="flex flex-col mt-6">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 focus:outline-none"
        />
      </div>
      <div className="flex flex-col mt-6">
        {csvData.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              CSV Data Preview:
            </h4>
            <ul className="space-y-2">
              {csvData.map((row, index) => (
                <li
                  key={index}
                  className={`p-2 rounded-md ${
                    row._status === 'success'
                      ? 'bg-green-100 dark:bg-green-700'
                      : row._status === 'error'
                      ? 'bg-red-100 dark:bg-red-700'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  {row.link} - {row._status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
