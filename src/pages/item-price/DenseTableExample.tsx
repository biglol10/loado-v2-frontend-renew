import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar, Box, Typography } from '@mui/material';
import GoldImage from '@/assets/images/goldImage_noBackground.webp';
import React from 'react';

const headers = ['아이템명', '최소가격', '평균가격', '최대가격', '시세조회'];

const sampleData = {
  _id: '674b2fa4af1f730121687fb1',
  itemName: '에스더의 기운',
  date: '2024-12-01',
  __v: 0,
  avgCurrentMinPrice: 435622.5,
  categoryCode: 51100,
  itemId: '66150010',
  maxCurrentMinPrice: 437500,
  minCurrentMinPrice: 434000,
};

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function DenseTableExample() {
  const PriceCellWithAvatar = React.memo(
    ({ imgSrc, alt, price }: { imgSrc: string; alt: string; price: number }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
          <Avatar src={imgSrc} alt={alt} />
          <Typography sx={{ fontSize: '11px' }}>{Math.floor(price).toLocaleString()}</Typography>
        </Box>
      );
    }
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            {headers.map((item, idx) => {
              if (idx === 0) {
                return <TableCell>{item}</TableCell>;
              } else {
                return <TableCell align="right">{item}</TableCell>;
              }
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src="https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Use/Use_10_81.png"
                    alt="esder"
                  />
                  <Typography sx={{ fontSize: '11px' }}>{sampleData.itemName}</Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <PriceCellWithAvatar
                  imgSrc={GoldImage}
                  alt="gold-image"
                  price={sampleData.minCurrentMinPrice}
                />
              </TableCell>
              <TableCell align="right">
                <PriceCellWithAvatar
                  imgSrc={GoldImage}
                  alt="gold-image"
                  price={sampleData.avgCurrentMinPrice}
                />
              </TableCell>
              <TableCell align="right">
                <PriceCellWithAvatar
                  imgSrc={GoldImage}
                  alt="gold-image"
                  price={sampleData.maxCurrentMinPrice}
                />
              </TableCell>
              <TableCell align="right">{'asdf'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
