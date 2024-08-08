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
  FormInput,
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
      });
    }
  }, [mb]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          header="Link"
          placeholder="t.me/name"
          {...register('link', { required: true })}
        />
        <Select header="Country" {...register('country', { required: true })}>
          <option>Nepal</option>
          <option>USA</option>
        </Select>
        <Select header="City" {...register('city')}>
          <option>Kathmandu</option>
          <option>Biratnagar</option>
        </Select>
        <Select header="Language" {...register('language', { required: true })}>
          <option>Nepali</option>
          <option>English</option>
        </Select>
        <Select header="Category" {...register('category', { required: true })}>
          <option>Fun</option>
          <option>Cultural</option>
        </Select>
      </form>
    </Section>
  );
}
