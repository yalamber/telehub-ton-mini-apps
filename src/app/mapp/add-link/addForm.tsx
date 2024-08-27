'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  useLaunchParams,
  useBackButton,
  useMainButton,
  usePopup,
} from '@telegram-apps/sdk-react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Input,
  Spinner,
  Select,
  Placeholder,
} from '@telegram-apps/telegram-ui';
import { fetchCities } from '@/utils/helpers';
import TelegramImg from '@/app/_assets/telegram.gif';

const schema = z.object({
  link: z
    .string({ message: 'please provide a telegram link' })
    .refine(
      (value) =>
        /^(https?:\/\/)?(t\.me|telegram\.me)\/[a-zA-Z0-9_]{5,32}$/.test(
          value
        ) ||
        /^[a-zA-Z0-9_]{5,32}$/.test(value) ||
        /^@[a-zA-Z0-9_]{5,32}$/.test(value),
      {
        message: 'Invalid Telegram link or username',
      }
    ),
  country: z
    .string({ message: 'please provide country' })
    .min(1, 'Please select a country'),
  city: z
    .string({ message: 'please provide city' })
    .min(1, 'Please select a city')
    .optional()
    .or(z.literal('')),
  category: z
    .string({ message: 'please provide category' })
    .min(1, 'Please select a category'),
  language: z
    .string({ message: 'please provide language' })
    .min(1, 'Please select a language'),
});

type Inputs = z.infer<typeof schema>;

interface AddFormProps {
  countries: Array<any>;
  languages: Array<any>;
  categories: Array<any>;
}

export default function AddForm({
  countries,
  languages,
  categories,
}: AddFormProps) {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });
  const [cities, setCities] = useState<Array<any>>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const initDataRaw = useLaunchParams().initDataRaw;
  const bb = useBackButton(true);
  const mb = useMainButton(true);
  const router = useRouter();
  const popup = usePopup();

  const handleBackButtonClick = useCallback(() => {
    router.back();
  }, [router]);

  const handleMainButtonClick = useCallback(async () => {
    if (mb) {
      document?.querySelector('form')?.requestSubmit();
    }
  }, [mb]);

  useEffect(() => {
    if (mb) {
      mb.setText('Next');
      mb.enable();
      mb.show();
      mb.on('click', handleMainButtonClick);
      return () => mb.off('click', handleMainButtonClick);
    }
  }, [mb, handleMainButtonClick]);

  useEffect(() => {
    if (bb) {
      bb.show();
      bb.on('click', handleBackButtonClick);
      return () => bb.off('click', handleBackButtonClick);
    }
  }, [bb, handleBackButtonClick]);

  useEffect(() => {
    if (mb) {
      mb.setText('Submit');
      mb.show();
    }
  }, [mb]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (!isValid) {
        // todo show popup and return
        popup.open({
          title: 'Form Validation Error',
          message: 'Please fill out all required fields correctly.',
        });
        return;
      }
      mb?.setText('Submitting...');
      mb?.setParams({ isLoaderVisible: true });
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: {
          Authorization: `tma ${initDataRaw}`,
        },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (resData.status === 'ok') {
        setFormSubmitted(true);
        mb?.hide();
      } else {
        throw new Error(resData.message);
      }
    } catch (error) {
      mb?.setText('Submit');
      popup.open({
        title: 'Error!',
        message: 'Something Went wrong!',
      });
    } finally {
      mb?.setParams({ isLoaderVisible: false });
    }
  };

  if (!initDataRaw) {
    return (
      <Placeholder
        header="Oops"
        description="Application was launched with missing init data"
      >
        <Image
          alt="Telegram sticker"
          src={TelegramImg}
          style={{ display: 'block', width: '144px', height: '144px' }}
        />
      </Placeholder>
    );
  }

  if (formSubmitted) {
    return (
      <div className="space-y-1 pb-10">
        <Placeholder
          header="Submitted"
          description="Link submitted for review by the administrators"
        >
          <Image
            alt="Telegram sticker"
            src={TelegramImg}
            style={{ display: 'block', width: '144px', height: '144px' }}
          />
        </Placeholder>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 pb-10">
      <div>
        <Controller
          name="link"
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              <Input
                header="Link"
                defaultValue={value ?? ''}
                onChange={onChange}
                placeholder="t.me/username"
                status={errors.link ? 'error' : 'default'}
              />
              {errors.link && (
                <div className="text-red-500 text-sm -mt-1 px-8 pb-3">
                  {errors.link.message}
                </div>
              )}
            </>
          )}
        />
      </div>
      <div>
        <Controller
          name="category"
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              <Select
                header="Category"
                defaultValue={value ?? ''}
                onChange={onChange}
                status={errors.category ? 'error' : 'default'}
              >
                <option value="">Select Category</option>
                {categories?.map((item: any, index: number) => (
                  <option key={`category-${index}`} value={item?.value}>
                    {item?.label}
                  </option>
                ))}
                <option value="other">Other</option>
              </Select>
              {errors.category && (
                <div className="text-red-500 text-sm -mt-1 px-8 pb-3">
                  {errors.category.message}
                </div>
              )}
            </>
          )}
        />
      </div>
      <div>
        <Controller
          name="country"
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              <Select
                header="Country"
                defaultValue={value ?? ''}
                onChange={async (e) => {
                  onChange(e);
                  const country = e.target.value;
                  setCitiesLoading(true);
                  const cities = await fetchCities(country);
                  setCities(cities);
                  setCitiesLoading(false);
                }}
                status={errors.country ? 'error' : 'default'}
              >
                <option value="">Select Country</option>
                <option value="other">Global</option>
                {countries?.map((item: any, index: number) => (
                  <option key={`country-${index}`} value={item?.value}>
                    {item?.label}
                  </option>
                ))}
              </Select>
              {errors.country && (
                <div className="text-red-500 text-sm -mt-1 px-8 pb-3">
                  {errors.country.message}
                </div>
              )}
            </>
          )}
        />
      </div>
      <div className="relative">
        {citiesLoading && (
          <Spinner size="s" className="absolute z-10 left-10 top-10" />
        )}
        <Controller
          name="city"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select
              header="City"
              defaultValue={value ?? ''}
              onChange={onChange}
              disabled={!cities?.length}
            >
              <option value="">Select City</option>
              {cities.map((item: any, index: number) => (
                <option key={`city-${index}`} value={item?.value}>
                  {item?.label}
                </option>
              ))}
            </Select>
          )}
        />
      </div>
      <div>
        <Controller
          name="language"
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              <Select
                header="language"
                defaultValue={value ?? ''}
                onChange={onChange}
                status={errors.language ? 'error' : 'default'}
              >
                <option value="">Select Language</option>
                {languages?.map((item: any, index: number) => (
                  <option key={`language-${index}`} value={item?.value}>
                    {item?.label}
                  </option>
                ))}
                <option value="other">Other</option>
              </Select>
              {errors.language && (
                <div className="text-red-500 text-sm -mt-1 px-8 pb-3">
                  {errors.language.message}
                </div>
              )}
            </>
          )}
        />
      </div>
    </form>
  );
}
