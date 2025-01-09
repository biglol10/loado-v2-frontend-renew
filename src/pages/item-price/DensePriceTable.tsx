import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IItemData, TActiveTabType } from '@/apis/itemPrice/types';
import React from 'react';
import { Avatar, Box, Button, Divider, Typography } from '@mui/material';
import { imageSrcCollection } from './const/imageSrcCollection';
import GoldImage from '@/assets/images/goldImage_noBackground.webp';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import itemPriceStore from '@/store/item-price/itemPriceStore';
import { useTranslation } from 'react-i18next';
import { tier3ItemIds, tier4ItemIds } from './const/itemTierInfo';

interface IDensePriceTableProps {
  title: string;
  rows: IItemData[];
  type?: 'book';
  activeTab?: TActiveTabType;
}

const DensePriceTable = ({ title, rows, type, activeTab = 'ALL' }: IDensePriceTableProps) => {
  const { setSelectedItemToView } = itemPriceStore();
  const { t } = useTranslation();

  const headers = [
    t('item-price.table.columns.item-name'),
    t('item-price.table.columns.min-price'),
    t('item-price.table.columns.avg-price'),
    t('item-price.table.columns.max-price'),
    t('item-price.table.columns.price-check'),
  ];

  const PriceCellWithAvatar = React.memo(
    ({ imgSrc, alt, price }: { imgSrc: string; alt: string; price: number }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
          <Typography sx={{ fontSize: '12px', fontWeight: '400' }}>
            {Math.floor(price).toLocaleString()}
          </Typography>
          <Avatar src={imgSrc} alt={alt} />
        </Box>
      );
    }
  );

  const openSingleItemHistoryPriceModal = (item: IItemData) => {
    setSelectedItemToView({ itemId: item.itemId, itemName: item.itemName });
  };

  return (
    <TableContainer component={Paper}>
      <Typography gutterBottom variant="h5" component={'div'} sx={{ marginTop: '10px' }}>
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
          {rows
            .filter((item) => {
              if (activeTab === 'ALL') {
                return item;
              } else if (activeTab === 'T3') {
                return tier3ItemIds.includes(item.itemId);
              } else {
                return tier4ItemIds.includes(item.itemId);
              }
            })
            .map((item, idx) => {
              const itemId = item.itemId as keyof typeof imageSrcCollection;
              const itemName = item.itemName;
              if (imageSrcCollection[itemId] || type === 'book') {
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
                              ? imageSrcCollection[itemId]
                              : imageSrcCollection[
                                  itemName.includes('(유물)') ? 'relicBook' : 'book'
                                ]
                          }
                          alt={item.itemName}
                        />
                        <Typography sx={{ fontSize: '12px', marginLeft: '5px' }}>
                          {item.itemName.replace('(유물)', '')}
                        </Typography>
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
                        <Button
                          onClick={() => {
                            openSingleItemHistoryPriceModal(item);
                          }}
                        >
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
