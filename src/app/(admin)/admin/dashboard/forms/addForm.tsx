"use client";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
    label: string;
};

export default function AddForm({closeAddModal, fetchItems, parent, type}: {closeAddModal: any, fetchItems: any, parent?: string, type: string}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    if(formData?.label) {
        const payload = {
            label: formData.label,
            value: formData.label,
            type,
            parent: parent
        }
        const res = await fetch('/api/filter-options', {
            method: 'POST',
            // headers: {
            //   Authorization: `tma ${initDataRaw}`,
            // },
            body: JSON.stringify(payload),
          });
        const resData = await res.json();
        fetchItems()
        closeAddModal(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-10">
      <div className="mb-4 mt-5">
        <input
          {...register("label", { required: true })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="label"
          type="text"
          placeholder={type === "LANGUAGE" ? type : `${type} NAME`}
        />
      </div>
      <input
        className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
        type="submit"
      />
    </form>
  );
}
