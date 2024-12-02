import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IItemData } from '@/apis/itemPrice/types';
import React from 'react';
import { Avatar, Box, Button, Divider, Typography } from '@mui/material';
import { imageSrcCollection } from './const/imageSrcCollection';
import GoldImage from '@/assets/images/goldImage_noBackground.webp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const headers = ['아이템명', '최소가격', '평균가격', '최대가격', '시세조회'];

interface IDensePriceTableProps {
  title: string;
  rows: IItemData[];
  type?: 'book';
}

const DensePriceTable = ({ title, rows, type }: IDensePriceTableProps) => {
  const PriceCellWithAvatar = React.memo(
    ({ imgSrc, alt, price }: { imgSrc: string; alt: string; price: number }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
          <Avatar src={imgSrc} alt={alt} />
          <Typography sx={{ fontSize: '0.0875rem', fontWeight: '400' }}>
            {Math.floor(price).toLocaleString()}
          </Typography>
        </Box>
      );
    }
  );

  return (
    <TableContainer component={Paper}>
      <Typography gutterBottom variant="h5" component={'div'} sx={{ marginTop: '1px' }}>
        {title}
      </Typography>

      <Divider sx={{ margin: '10px 0' }} />

      <Table size="small" aria-label="a dense table" sx={{ maxHeight: '200px' }}>
        <TableHead>
          <TableRow>
            {headers.map((item, idx) => {
              const key = `${item}_${idx}`;

              if (idx === 0) {
                return <TableCell key={`${key}`}>{item}</TableCell>;
              } else {
                return (
                  <TableCell key={key} align="right">
                    {item}
                  </TableCell>
                );
              }
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((item, idx) => {
            if (imageSrcCollection.hasOwnProperty(item.itemId) || type === 'book') {
              return (
                <TableRow
                  key={`${title}_${idx}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component={'th'} scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={
                          type !== 'book'
                            ? imageSrcCollection[item.itemId as keyof typeof imageSrcCollection]
                            : imageSrcCollection['book']
                        }
                        alt={item.itemName}
                      />
                      <Typography sx={{ fontSize: '12px' }}>{item.itemName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <PriceCellWithAvatar
                      imgSrc={GoldImage}
                      alt="gold-image"
                      price={item.minCurrentMinPrice}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <PriceCellWithAvatar
                      imgSrc={GoldImage}
                      alt="gold-image"
                      price={item.avgCurrentMinPrice}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <PriceCellWithAvatar
                      imgSrc={GoldImage}
                      alt="gold-image"
                      price={item.maxCurrentMinPrice}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                      <Button>
                        <MonetizationOnIcon />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            }
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DensePriceTable;
