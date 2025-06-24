'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// The statuses are defined in memory_bank.md
const statuses = ['idea', 'in-progress', 'completed'];
const cosmeticSymbologyOptions = ['Ornate', 'Minimalist', 'Geometric', 'Ancient'];

export function FilterControls() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300); // 300ms debounce delay

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== 'all') {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleCosmeticFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set('cosmetic', value);
    } else {
      params.delete('cosmetic');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <Input
        placeholder="Search by name or description..."
        className="max-w-sm"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('search')?.toString()}
      />
      <Select
        onValueChange={handleStatusChange}
        defaultValue={searchParams.get('status')?.toString() || 'all'}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status} value={status} className="capitalize">
              {status.replace('-', ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={handleCosmeticFilterChange}
        defaultValue={searchParams.get('cosmetic')?.toString() || 'all'}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Filter by Cosmetic Symbology" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cosmetic Symbologies</SelectItem>
          {cosmeticSymbologyOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 