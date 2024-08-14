import { useState } from 'react';
import {
  Modal,
  Button,
  Placeholder,
  List,
  Navigation,
  Divider,
} from '@telegram-apps/telegram-ui';
import { Icon28Close } from '@telegram-apps/telegram-ui/dist/icons/28/close';

interface FilterProps {
  items: Array<{ label: string; value: string }>;
  label: string;
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

const FilterSelector = ({
  items,
  label = 'select',
  disabled = false,
  onChange,
}: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Modal
      className="z-20"
      open={isOpen}
      header={
        <Modal.Header
          after={
            <button
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
            >
              <Icon28Close style={{ color: 'var(--tgui--plain_foreground)' }} />
            </button>
          }
        >
          <Placeholder description="Description" header="Title">
            {label}
          </Placeholder>
        </Modal.Header>
      }
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
      trigger={
        <Button
          disabled={disabled}
          size="m"
          mode="bezeled"
          onClick={() => setIsOpen(items?.length > 0 ? true : false)}
        >
          {label}
        </Button>
      }
    >
      <div className="m-2 px-5">
        <List
          className="cursor-pointer"
          onClick={() => {
            onChange(null);
            setIsOpen(false);
          }}
        >
          <Navigation className="pt-2">Not selected</Navigation>
          <Divider />
        </List>
        {items.map((item) => (
          <List
            key={item.value}
            className="cursor-pointer"
            onClick={() => {
              onChange(item.value);
              setIsOpen(false);
            }}
          >
            <Navigation className="pt-2">{item.label}</Navigation>
            <Divider />
          </List>
        ))}
      </div>
    </Modal>
  );
};

export default FilterSelector;
