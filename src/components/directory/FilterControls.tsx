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
// TODO: These should probably be fetched from the database eventually
const physicalAttributesOptions = ['Tall', 'Short', 'Glowing Eyes', 'Mechanical Limbs'];
const cosmeticSymbologyOptions = ['Ornate', 'Minimalist', 'Geometric', 'Ancient'];
const animalFormOptions = ['Avian', 'Reptilian', 'Mammalian', 'Insectoid'];

export function FilterControls() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleFilterChange = (filterName: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(filterName, value);
    } else {
      params.delete(filterName);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  const handleSearch = useDebouncedCallback((term: string) => {
    handleFilterChange('search', term);
  }, 300);

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <Input
        placeholder="Search by name or description..."
        className="max-w-xs"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('search')?.toString()}
      />
      <Select onValueChange={(value) => handleFilterChange('status', value)} defaultValue={searchParams.get('status') || 'all'}>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statuses.map((status) => (<SelectItem key={status} value={status} className="capitalize">{status.replace('-', ' ')}</SelectItem>))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => handleFilterChange('physical_attribute', value)} defaultValue={searchParams.get('physical_attribute') || 'all'}>
        <SelectTrigger className="w-[220px]"><SelectValue placeholder="Physical Attributes" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Physical Attributes</SelectItem>
          {physicalAttributesOptions.map((option) => (<SelectItem key={option} value={option}>{option}</SelectItem>))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => handleFilterChange('cosmetic_symbology', value)} defaultValue={searchParams.get('cosmetic_symbology') || 'all'}>
        <SelectTrigger className="w-[220px]"><SelectValue placeholder="Cosmetic Symbology" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cosmetic Symbologies</SelectItem>
          {cosmeticSymbologyOptions.map((option) => (<SelectItem key={option} value={option}>{option}</SelectItem>))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => handleFilterChange('animal_form', value)} defaultValue={searchParams.get('animal_form') || 'all'}>
        <SelectTrigger className="w-[220px]"><SelectValue placeholder="Animal Form" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Animal Forms</SelectItem>
          {animalFormOptions.map((option) => (<SelectItem key={option} value={option}>{option}</SelectItem>))}
        </SelectContent>
      </Select>
    </div>
  );
} 