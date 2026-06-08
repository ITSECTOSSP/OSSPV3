import { useEffect, useState } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';
import { SearchIcon } from 'lucide-react';
import {
  DocumentType,
  TrackingCategory,
  TrackingClassification,
} from '@/types/document-tracking';

type FiltersProps = {
  filters: {
    per_page: number;
    search?: string;
    document_type_id?: string;
    classifications_id?: string;
    categories_id?: string;
  };
  documentTypes: DocumentType[];
  trackingCategory: TrackingCategory[];
  trackingClassification: TrackingClassification[];
  onFilterChange: (key: string, value: string) => void;
};

export default function DocumentFilters({
  filters,
  documentTypes,
  trackingCategory,
  trackingClassification,
  onFilterChange,
}: FiltersProps) {
  // 🔹 Local state for debounced search
  const [search, setSearch] = useState(filters.search ?? '');

  // 🔹 Debounce search (400ms)
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilterChange('search', search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  // 🔹 Sync when filters.search changes from outside (pagination, reset, etc.)
  useEffect(() => {
    setSearch(filters.search ?? '');
  }, [filters.search]);

  return (
    <div className="flex flex-wrap items-center gap-2 w-full m-1">
      {/* Search */}
      <div className="flex-1 min-w-[250px]">
        <InputGroup className="w-full">
          <InputGroupInput
            placeholder="Search by title, from, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* Document Type */}
      <div className="min-w-[180px]">
        <Select
          value={filters.document_type_id ?? 'all'}
          onValueChange={(value) =>
            onFilterChange(
              'document_type_id',
              value === 'all' ? '' : value
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Document Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Types</SelectItem>
              {documentTypes.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>
                  {type.types_name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Classification */}
      <div className="min-w-[180px]">
        <Select
          value={filters.classifications_id ?? 'all'}
          onValueChange={(value) =>
            onFilterChange(
              'classifications_id',
              value === 'all' ? '' : value
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Classification" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Classifications</SelectItem>
              {trackingClassification.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.classifications_name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="min-w-[180px]">
        <Select
          value={filters.categories_id ?? 'all'}
          onValueChange={(value) =>
            onFilterChange(
              'categories_id',
              value === 'all' ? '' : value
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Categories</SelectItem>
              {trackingCategory.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.categories_name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
