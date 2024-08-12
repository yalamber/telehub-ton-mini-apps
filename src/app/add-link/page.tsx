'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useLaunchParams,
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
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

type Inputs = {
  link: string;
  country: string;
  city: string;
  category: string;
  language: string;
};

export default function AddLinkPage() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  const initDataRaw = useLaunchParams().initDataRaw;
  const bb = useBackButton(true);
  const mb = useMainButton(true);
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log('raw', initDataRaw);
    const res = await fetch('/api/submit-link', {
      method: 'POST',
      headers: {
        Authorization: `tma ${initDataRaw}`,
      },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    console.log(resData);
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
  return (
    <Section header="Channel/Group Details">
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
        <div>
          <Controller
            name="country"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select
                header="Country"
                defaultValue={value ?? ''}
                onChange={onChange}
              >
                <option value="">Select Country</option>
                <option value="NP">Nepal</option>
              </Select>
            )}
          />
        </div>
        <div>
          <Controller
            name="city"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select
                header="City"
                defaultValue={value ?? ''}
                onChange={onChange}
              >
                <option value="">Select City</option>
                <option value="KTM">Kathmandu</option>
              </Select>
            )}
          />
        </div>
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
                <option value="en">English</option>
              </Select>
            )}
          />
        </div>
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
                <option value="fun">Fun</option>
              </Select>
            )}
          />
        </div>
      </form>
    </Section>
  );
}
