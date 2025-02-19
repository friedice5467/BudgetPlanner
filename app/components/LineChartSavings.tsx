import React from 'react';
import {View, Text} from 'react-native';
import {LineChart, lineDataItem} from 'react-native-gifted-charts';
import {ruleTypes} from 'gifted-charts-core';
import { useTheme } from 'react-native-paper';

type LineChartSavingsProps = {
  data: lineDataItem[];
};

export const LineChartSavings: React.FC<LineChartSavingsProps> = ({data}) => {
  const theme = useTheme();

  if (data.length > 4) {
    for (let i = 0; i < data.length; i++) {
      if (i % 2 === 0) {
        data[i].label = '';
      }
    }
  }
  return (
    <View
      style={{
        paddingVertical: 10,
        paddingLeft: 10,
      }}>
      <LineChart
        isAnimated={true}
        areaChart={true}
        animationDuration={2000}
        data={data}
        width={350}
        spacing={24}
        color={theme.colors.onBackground}
        thickness={1}
        startFillColor="rgba(20,105,81,0.3)"
        endFillColor="rgba(20,85,81,0.01)"
        startOpacity={0.9}
        endOpacity={0.2}
        height={400}
        yAxisColor={theme.colors.onBackground}
        yAxisThickness={0}
        rulesType={ruleTypes.DOTTED}
        rulesColor="gray"
        yAxisTextStyle={{color: theme.colors.onBackground, width: 60, fontSize: 12}}
        yAxisLabelPrefix="$"
        yAxisTextNumberOfLines={1}
        xAxisColor="lightgray"
        xAxisLabelTextStyle={{color: theme.colors.onBackground, width: 60, fontSize: 12}}
        pointerConfig={{
          pointerStripHeight: 160,
          pointerStripColor: 'lightgray',
          pointerStripWidth: 2,
          pointerColor: 'lightgray',
          radius: 6,
          pointerLabelWidth: 100,
          pointerLabelHeight: 90,
          pointerLabelComponent: (items: any[]) => {
            return (
              <View
                style={{
                  justifyContent: 'flex-start',
                }}>
                <Text
                  style={{
                    color: theme.colors.onBackground,
                    fontSize: 12,
                    marginBottom: 6,
                    textAlign: 'center',
                  }}>
                  ${items[0].value.toFixed(2)}
                  {`\n`+items[0].date}
                </Text>
              </View>
            );
          },
        }}
      />
    </View>
  );
};
