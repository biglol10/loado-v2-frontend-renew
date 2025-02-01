import { useFormContext } from 'react-hook-form';
import { TooltipProps } from 'recharts';
import { TResourceConsumptionData, TResourcePriceData, TSimulationFormData } from '../model/schema';
import { EArmor } from '../const/simulationConsts';
import React from 'react';

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const SimulationResultTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  const { getValues } = useFormContext<TSimulationFormData>();
  const { getValues: getValues2 } = useFormContext<TResourceConsumptionData>();
  const formValues = getValues();
  const resourceConsumptionData = getValues2();

  if (!active) return null;

  const isWeapon = formValues.targetRefine.armorType === EArmor.WEAPON;
  const tier = formValues.targetRefine.tier.toLocaleLowerCase(); // t3 or t4

  console.log('active is ', active);
  console.log('payload is ', payload);
  console.log('label is ', label);
  console.log('formValues is ', formValues);
  console.log('resourceConsumptionData is ', resourceConsumptionData);

  const isBoundaryGroup = label?.includes('-');

  const labelObj = {
    labelStart: label?.split('-')[0],
    labelEnd: isBoundaryGroup && label?.split('-')[1],
  };

  const totalRefineGoldStart = formValues.existingResources.refineGold;
  const totalRefineGoldEnd = 0;

  return <div>SimulationResultTooltip</div>;
};

const areEqualProps = (
  prevProps: Pick<CustomTooltipProps, 'label'>,
  nextProps: Pick<CustomTooltipProps, 'label'>
) => {
  return prevProps.label === nextProps.label;
};

export default React.memo(SimulationResultTooltip, areEqualProps);
