'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  useLaunchParams,
  useBackButton,
  useMainButton,
  usePopup,
} from '@telegram-apps/sdk-react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  Input,
  Spinner,
  Select,
  Placeholder,
} from '@telegram-apps/telegram-ui';
import { fetchCities } from '@/utils/helpers';

type Inputs = {
  link: string;
  country: string;
  city: string;
  category: string;
  language: string;
};

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
    formState: { errors },
  } = useForm<Inputs>();

  const [cities, setCities] = useState<Array<any>>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const initDataRaw = useLaunchParams().initDataRaw;
  const bb = useBackButton(true);
  const mb = useMainButton(true);
  const router = useRouter();
  const popup = usePopup();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
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
      popup.open({
        title: 'Error!',
        message: 'Something Went wrong!',
      });
      mb?.setText('Submit');
    }
  };

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
        mb.setText('Submitting...');
        document?.querySelector('form')?.requestSubmit();
      });
    }
  }, [mb]);

  if (!initDataRaw) {
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
  if (formSubmitted) {
    return (
      <Placeholder
        header="Submitted"
        description="Link submitted for review by the administrators"
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-10">
      <div>
        <Controller
          name="link"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Input
              header="Link"
              defaultValue={value ?? ''}
              onChange={onChange}
              placeholder="t.me/link"
            />
          )}
        />
      </div>
      {countries?.length > 0 && (
        <div>
          <Controller
            name="country"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select
                header="Country"
                defaultValue={value ?? ''}
                onChange={async (e) => {
                  onChange(e.target.value);
                  const country = e.target.value;
                  setCitiesLoading(true);
                  const cities = await fetchCities(country);
                  setCities(cities);
                  setCitiesLoading(false);
                }}
              >
                <option value="">Select Country</option>
                {countries.map((item: any, index: number) => (
                  <option key={`country-${index}`} value={item?.value}>
                    {item?.label}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>
      )}
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
      {languages?.length > 0 && (
        <div>
          <Controller
            name="language"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select
                header="language"
                defaultValue={value ?? ''}
                onChange={onChange}
              >
                <option value="">Select Language</option>
                {languages.map((item: any, index: number) => (
                  <option key={`language-${index}`} value={item?.value}>
                    {item?.label}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>
      )}
      {categories?.length > 0 && (
        <div>
          <Controller
            name="category"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select
                header="Category"
                defaultValue={value ?? ''}
                onChange={onChange}
              >
                <option value="">Select Category</option>
                {categories.map((item: any, index: number) => (
                  <option key={`category-${index}`} value={item?.value}>
                    {item?.label}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>
      )}
    </form>
  );
}
