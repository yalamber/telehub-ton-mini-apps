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
  onChange: (value: string) => void;
}

const FilterSelector = ({ items, label = 'select', onChange }: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Modal
      open={isOpen}
      header={
        <Modal.Header
          after={
            <button onClick={() => setIsOpen(false)}>
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
        <Button size="m" mode="outline" onClick={() => setIsOpen(true)}>
          {label}
        </Button>
      }
    >
      <div className="m-2 px-5">
        {items.map((item) => (
          <List
            key={item.value}
            className="cursor-pointer"
            onClick={() => {
              onChange(item.value);
              setIsOpen(false);
            }}
          >
            <Navigation>{item.label}</Navigation>
            <Divider />
          </List>
        ))}
      </div>
    </Modal>
  );
};

export default FilterSelector;
