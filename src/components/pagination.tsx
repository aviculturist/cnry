import * as React from 'react';
import { useAtom } from 'jotai';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { browseCurrentPageAtom, cnryLastIdAtom } from '@store/cnry';
import { paginate, range } from '@utils/paginate';

export default function BasicPagination() {
  const [totalItems] = useAtom(cnryLastIdAtom);
  const [currentPage, setCurrentPage] = useAtom(browseCurrentPageAtom);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };
  const { totalPages, startPage, endPage, startIndex, endIndex, pages } = paginate({
    totalItems,
    currentPage,
    pageSize: 10,
    maxPages: 10,
  });
  return (
    <Stack spacing={2}>
      <Pagination count={totalPages} page={currentPage} onChange={handleChange} />
    </Stack>
  );
}
