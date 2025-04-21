import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import colors from '../../tokens/colors';
import spacing from '../../tokens/spacing';
import typography from '../../tokens/typography';

/**
 * 디자인 시스템 - 데이터 테이블 컴포넌트
 *
 * 이 컴포넌트는 애플리케이션 전체에서 일관된 데이터 테이블을 제공합니다.
 * 정렬, 페이지네이션, 필터링 등 데이터 탐색에 필요한 기능을 포함합니다.
 *
 * 이점:
 * 1. 일관성: 전체 애플리케이션에서 동일한 테이블 디자인 사용
 * 2. 재사용성: 모든 데이터 테이블에 동일한 컴포넌트 사용으로 코드 중복 감소
 * 3. 기능성: 정렬, 페이지네이션 등 테이블의 핵심 기능 제공
 * 4. 유지보수: 테이블 디자인 변경 시 한 곳만 수정하면 전체 적용
 * 5. 사용성: 일관된 데이터 탐색 경험 제공
 */

// 테이블 헤더 셀 정의
export interface HeadCell<T> {
  id: keyof T;
  label: string;
  numeric: boolean;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  renderCell?: (row: T) => React.ReactNode;
}

// 스타일링된 테이블 컨테이너
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}));

// 스타일링된 테이블 툴바
const StyledTableToolbar = styled(Toolbar)(({ theme }) => ({
  padding: `${spacing.space[2]} ${spacing.space[3]}`,
  backgroundColor: colors.palette.primary.light,
  color: colors.palette.primary.contrastText,
  '& .MuiTypography-root': {
    flex: '1 1 100%',
    ...typography.variants.h6,
  },
}));

// 스타일링된 테이블 헤더
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: colors.palette.grey[100],
  '& .MuiTableCell-head': {
    ...typography.variants.subtitle2,
    color: colors.semantic.text.primary,
    fontWeight: typography.fontWeight.bold,
    padding: spacing.space[3],
  },
}));

// 스타일링된 테이블 셀
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  ...typography.variants.body2,
  padding: spacing.space[3],
  borderBottom: `1px solid ${colors.semantic.divider}`,
}));

// 스타일링된 테이블 행
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: colors.palette.grey[50],
  },
  '&:hover': {
    backgroundColor: `${colors.palette.primary.light}20`,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// 스타일링된 테이블 페이지네이션
const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  borderTop: `1px solid ${colors.semantic.divider}`,
  overflow: 'hidden',
  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
    ...typography.variants.body2,
  },
}));

interface DataTableProps<T> {
  title?: string;
  data: T[];
  columns: HeadCell<T>[];
  initialSortBy?: keyof T;
  initialSortDirection?: 'asc' | 'desc';
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  onRefresh?: () => void;
  onFilter?: () => void;
  isLoading?: boolean;
  emptyMessage?: string;
  getRowId?: (row: T) => string | number;
  onRowClick?: (row: T) => void;
}

/**
 * 데이터 테이블 컴포넌트
 */
function DataTable<T extends object>({
  title,
  data,
  columns,
  initialSortBy,
  initialSortDirection = 'asc',
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 10,
  onRefresh,
  onFilter,
  isLoading = false,
  emptyMessage = '데이터가 없습니다',
  getRowId = (_row) => Math.random().toString(36).substr(2, 9),
  onRowClick,
}: DataTableProps<T>) {
  // 정렬 상태
  const [sortBy, setSortBy] = useState<keyof T | undefined>(initialSortBy);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);

  // 페이지네이션 상태
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // 정렬 처리
  const handleSort = (property: keyof T) => {
    const isAsc = sortBy === property && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  // 정렬된 데이터 계산
  const sortedData = React.useMemo(() => {
    if (!sortBy) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === bValue) return 0;

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue);
      const bString = String(bValue);

      return sortDirection === 'asc'
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [data, sortBy, sortDirection]);

  // 현재 페이지 데이터
  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // 페이지 변경 처리
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // 페이지당 행 수 변경 처리
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      {title && (
        <StyledTableToolbar>
          <Typography variant="h6">{title}</Typography>
          <Box>
            {onRefresh && (
              <Tooltip title="새로고침">
                <IconButton onClick={onRefresh} color="inherit">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}
            {onFilter && (
              <Tooltip title="필터">
                <IconButton onClick={onFilter} color="inherit">
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </StyledTableToolbar>
      )}

      <StyledTableContainer>
        <Table stickyHeader>
          <StyledTableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align || (column.numeric ? 'right' : 'left')}
                  style={{ width: column.width || 'auto' }}
                  sortDirection={sortBy === column.id ? sortDirection : false}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                      {sortBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {sortDirection === 'desc' ? '내림차순 정렬' : '오름차순 정렬'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </StyledTableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const rowId = getRowId(row);
                return (
                  <StyledTableRow
                    key={rowId}
                    hover
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {columns.map((column) => (
                      <StyledTableCell
                        key={`${rowId}-${String(column.id)}`}
                        align={column.align || (column.numeric ? 'right' : 'left')}
                      >
                        {column.renderCell
                          ? column.renderCell(row)
                          : (row[column.id] as React.ReactNode) || '-'}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <StyledTablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="행 수:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
      />
    </Paper>
  );
}

export default DataTable;
