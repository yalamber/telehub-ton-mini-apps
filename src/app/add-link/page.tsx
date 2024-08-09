'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useInitData,
  useBackButton,
  useMainButton,
  type User,
} from '@telegram-apps/sdk-react';

import {
  Section,
  Input,
  Select,
  Placeholder,
} from '@telegram-apps/telegram-ui';

import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  link: string;
  country: string;
  city: string;
  category: string;
  language: string;
};

export default function AddLinkPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const initData = useInitData();
  const bb = useBackButton(true);
  const mb = useMainButton(true);
  const router = useRouter();

  useEffect(() => {
    if (bb) {
      bb.show();
      bb.on('click', () => {
        // go back
        router.back();
      });
    }
  }, [bb, router]);

  useEffect(() => {
    if (mb) {
      mb.setText('Submit');
      mb.enable();
      mb.show();
      mb.on('click', () => {
        // TODO: submit
        handleSubmit(onSubmit)();
      });
    }
  }, [mb]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    const res = await fetch('/api/submit-link', {
      method: 'POST',
      body: JSON.stringify({ ...data, initData }),
    });
    const resData = await res.json();
    console.log(resData);
  };

  if (!initData) {
    return (
      <Placeholder
        header="Oops"
        description="Application was launched with missing init data"
      >
        <img
          alt="Telegram sticker"
          src="https://xelene.me/telegram.gif"
          style={{ display: 'block', width: '144px', height: '144px' }}
        />
      </Placeholder>
    );
  }
  return (
    <Section header="Channel/Group Details">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-6 space-y-4 pb-10">
        <div>
          <label
            htmlFor="link"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Link
          </label>
          <input
            {...register('link')}
            type="text"
            id="link"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
            placeholder="t.me/link"
            required
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Category
          </label>
          <select
            {...register('category')}
            id="category"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >
            <option>Select category</option>
            <option value="test">Test</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="country"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Country
          </label>
          <select
            {...register('country')}
            id="country"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >
            <option>Select country</option>
            <option value="test">Test</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="city"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            City
          </label>
          <select
            {...register('city')}
            id="city"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >
            <option>Select city</option>
            <option value="test">Test</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="language"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Language
          </label>
          <select
            {...register('language')}
            id="language"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          >
            <option>Select Language</option>
            <option value="test">Test</option>
          </select>
        </div>
      </form>
    </Section>
  );
}
