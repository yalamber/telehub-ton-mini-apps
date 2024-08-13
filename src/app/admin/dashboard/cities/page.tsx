import FilterOptionsPage from '../FilterOptionPage';

export default function AdminPage({
  searchParams,
}: {
  searchParams?: {
    parent?: string;
  };
}) {
  return (
    <FilterOptionsPage
      title="Cities"
      type="CITY"
      parent={searchParams?.parent}
    />
  );
}
