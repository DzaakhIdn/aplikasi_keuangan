import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from '@/components/filters-result';

// ----------------------------------------------------------------------

interface TrackTableFiltersResultProps {
  filters: any;
  activeAcademicYearId?: string;
  academicYearLabel?: string;
  totalResults: number;
  onResetPage: () => void;
  sx: any;
}

export function PaymentTableFiltersResult({
  filters,
  activeAcademicYearId,
  academicYearLabel,
  totalResults,
  onResetPage,
  sx,
}: TrackTableFiltersResultProps) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    updateFilters({ name: '' });
  }, [onResetPage, updateFilters]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    updateFilters({ status: 'all' });
  }, [onResetPage, updateFilters]);

  const handleRemoveAcademicYear = useCallback(() => {
    onResetPage();
    updateFilters({ academicYear: activeAcademicYearId ?? 'all' });
  }, [activeAcademicYearId, onResetPage, updateFilters]);

  return (
    <FiltersResult totalResults={totalResults} onReset={() => resetFilters()} sx={sx}>
      <FiltersBlock label="Status:" isShow={currentFilters.status !== 'all'}>
        <Chip
          {...chipProps}
          label={currentFilters.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock
        label="Tahun ajaran:"
        isShow={!!currentFilters.academicYear && currentFilters.academicYear !== activeAcademicYearId}
      >
        <Chip {...chipProps} label={academicYearLabel ?? currentFilters.academicYear} onDelete={handleRemoveAcademicYear} />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!currentFilters.name}>
        <Chip {...chipProps} label={currentFilters.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
