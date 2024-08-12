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
  return (
    <Modal
      header={
        <Modal.Header
          after={
            <Modal.Close>
              <Icon28Close style={{ color: 'var(--tgui--plain_foreground)' }} />
            </Modal.Close>
          }
        >
          <Placeholder description="Description" header="Title">
            {label}
          </Placeholder>
        </Modal.Header>
      }
      trigger={
        <Button size="m" mode="outline">
          {label}
        </Button>
      }
    >
      <div className="m-2 px-5">
        {items.map((item) => (
          <List key={item.value} onClick={() => onChange(item.value)}>
            <Navigation>{item.label}</Navigation>
            <Divider />
          </List>
        ))}
      </div>
    </Modal>
  );
};

export default FilterSelector;
