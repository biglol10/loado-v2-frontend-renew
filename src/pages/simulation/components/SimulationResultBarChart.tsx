/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ReferenceLine,
  TooltipProps,
  ResponsiveContainer,
} from 'recharts';
import { SimulationResultGraphData } from '../types/types';
import { Box } from '@mui/material';
import { SectionTitle } from './SectionTitle';
import SimulationResultTooltip from './SimulationResultTooltip';
import { TSimulationFormData } from '../model/schema';
import { useFormContext, useWatch } from 'react-hook-form';
import { EArmor, ETier } from '../const/simulationConsts';
import useSimulationConsts from '../util/useSimulationConsts';

const SimulationResultBarChart = ({
  topNPercentPointData,
  topNPercentPoint,
}: {
  topNPercentPointData: SimulationResultGraphData;
  topNPercentPoint: number;
}) => {
  const { simulationResultGroupPointResultList, topNPercentPointRange } = topNPercentPointData;

  const { control } = useFormContext<TSimulationFormData>();
  const resourcePrice = useWatch({ control, name: 'resourcePrice' }) as any;
  const existingResources = useWatch({ control, name: 'existingResources' }) as any;
  const resourceConsumption = useWatch({ control, name: 'resourceConsumption' }) as any;
  const targetRefine = useWatch({ control, name: 'targetRefine' }) as any;

  const tier = targetRefine.tier.toLocaleLowerCase();
  const isWeapon = targetRefine.armorType === EArmor.WEAPON;

  const { t3ExistingResourceSections, t4ExistingResourceSections } = useSimulationConsts(
    targetRefine.armorType
  );

  const sections = tier === ETier.T4 ? t4ExistingResourceSections : t3ExistingResourceSections;

  console.log('resourcePrice is ', resourcePrice);
  console.log('existingResources is ', existingResources);
  console.log('resourceConsumption is ', resourceConsumption);

  const resource1Key = `${tier}${isWeapon ? 'RedStone' : 'BlueStone'}`;
  const resource2Key = `${tier}BlueCommonStone`;
  const resource3Key = `${tier}FusionMaterial`;
  const resource4Key = `${tier}fragment`;
  const resource5Key = `${tier}book`;

  const objectToPass = {
    resource1: {
      // 파괴석, 수호석
      price: resourcePrice?.[`${resource1Key}_price`],
      consumption: resourceConsumption?.[resource1Key],
      existing: existingResources?.[resource1Key],
      divider: 10,
    },
    resource2: {
      // 돌파석
      price: resourcePrice?.[`${resource2Key}_price`],
      consumption: resourceConsumption?.[resource2Key],
      existing: existingResources?.[resource2Key],
      divider: 1,
    },
    resource3: {
      // 융화재료
      price: resourcePrice?.[`${resource3Key}_price`],
      consumption: resourceConsumption?.[resource3Key],
      existing: existingResources?.[resource3Key],
      divider: 1,
    },
    resource4: {
      // 파편
      price: resourcePrice?.[`${resource4Key}_price`],
      consumption: resourceConsumption?.[resource4Key],
      existing: existingResources?.[resource4Key],
      divider: 1500,
    },
    resource5: {
      // 책
      price: resourcePrice?.[`${resource5Key}_price`],
      consumption: 1,
      existing: existingResources?.[resource5Key],
      divider: 1,
    },
    gold: {
      price: resourcePrice?.refineGold_price,
      consumption: resourceConsumption?.refineGold_price,
      existing: existingResources?.refineGold_price,
      divider: 1,
    },
  };

  return (
    <Box
      sx={{
        width: '70%',
        height: 500,
        margin: '0 auto',
        marginTop: '20px',
      }}
    >
      <SectionTitle>시뮬레이션 결과</SectionTitle>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={simulationResultGroupPointResultList} margin={{ top: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip content={<SimulationResultTooltip objectToPass={objectToPass} />} />
          <Legend
            wrapperStyle={{
              position: 'relative',
              top: '-10px',
            }}
            payload={[
              {
                value: '시뮬레이션 결과',
                type: 'star',
                id: 'LegendPayload',
                color: 'gold',
              },
            ]}
          />
          <Bar dataKey="count" fill="#8884d8" background={{ fill: '#0E0F15' }} />
          {topNPercentPointRange && (
            <ReferenceLine
              x={topNPercentPointRange.range}
              stroke="orange"
              label={{ value: `상위 ${topNPercentPoint}%`, position: 'top', stroke: 'orange' }}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SimulationResultBarChart;
