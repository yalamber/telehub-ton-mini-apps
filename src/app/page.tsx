'use client';
import { useEffect } from 'react';
import { useBackButton, useMainButton } from '@telegram-apps/sdk-react';
import {
  Section,
  FixedLayout,
  Avatar,
  Button,
  Cell,
} from '@telegram-apps/telegram-ui';
import { Icon28AddCircle } from '@telegram-apps/telegram-ui/dist/icons/28/add_circle';

import FilterSelector from '@/components/FilterSelector/FilterSelector';

import { Link } from '@/components/Link/Link';

export default function Home() {
  const bb = useBackButton(true);
  const mb = useMainButton(true);
  useEffect(() => {
    if (bb) {
      bb.hide();
    }
  }, [bb]);

  useEffect(() => {
    if (mb) {
      mb.hide();
    }
  }, [mb]);

  return (
    <>
      <FixedLayout
        vertical="top"
        style={{
          padding: 0,
        }}
      >
        <div className="flex m-4">
          <input
            type="text"
            className="p-2 mr-2 flex-grow rounded bg-transparent border border-blue-400"
            placeholder="Search"
          />
          <Link href="/add-link">
            <Button mode="filled" before={<Icon28AddCircle />}>
              Add Link
            </Button>
          </Link>
        </div>
        <div className="grid grid-flow-col space-x-2 m-4 justify-stretch">
          <FilterSelector
            items={[
              { label: 'Fun', value: 'fun' },
              { label: 'Culture', value: 'culture' },
            ]}
            label="Categories"
          />
          <FilterSelector
            items={[{ label: 'Nepal', value: 'NP' }]}
            label="Countries"
          />
          <FilterSelector
            items={[{ label: 'Nepal', value: 'NP' }]}
            label="City"
          />
          <FilterSelector
            items={[{ label: 'Nepal', value: 'NP' }]}
            label="Language"
          />
        </div>
      </FixedLayout>
      <Section className="mt-32">
        <Section header="Trending this week">
          <Link href="https://t.me/yolo1ce">
            <Cell
              before={
                <Avatar
                  size={40}
                  src="https://avatars.githubusercontent.com/u/84640980?v=4"
                />
              }
            >
              Channel 1
            </Cell>
          </Link>
          <Link href="https://t.me/yolo1ce">
            <Cell
              before={
                <Avatar
                  size={40}
                  src="https://avatars.githubusercontent.com/u/84640980?v=4"
                />
              }
            >
              Channel 2
            </Cell>
          </Link>

          <Link href="https://t.me/yolo1ce">
            <Cell
              before={
                <Avatar
                  size={40}
                  src="https://avatars.githubusercontent.com/u/84640980?v=4"
                />
              }
            >
              Channel 3
            </Cell>
          </Link>
        </Section>
        <Section header="New">
          <Link href="https://t.me/yolo1ce">
            <Cell
              before={
                <Avatar
                  size={40}
                  src="https://avatars.githubusercontent.com/u/84640980?v=4"
                />
              }
            >
              Channel 1
            </Cell>
          </Link>

          <Link href="https://t.me/yolo1ce">
            <Cell
              before={
                <Avatar
                  size={40}
                  src="https://avatars.githubusercontent.com/u/84640980?v=4"
                />
              }
            >
              Channel 2
            </Cell>
          </Link>
          <Link href="https://t.me/yolo1ce">
            <Cell
              before={
                <Avatar
                  size={40}
                  src="https://avatars.githubusercontent.com/u/84640980?v=4"
                />
              }
            >
              Channel 3
            </Cell>
          </Link>
        </Section>
      </Section>
    </>
  );
}
