import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Rect, Text as SvgText, Line, Defs, LinearGradient, Stop, G } from 'react-native-svg';

export default function QuarterlyBarChart ({ data }) {
  const screenWidth = Dimensions.get('window').width;
  const chartHeight = 320; // Increased height to accommodate tooltip
  const padding = { top: 70, right: 20, bottom: 40, left: 10 }; // Increased top padding for tooltip space
  
  const [tooltipData, setTooltipData] = useState(null);

  // Transform and parse data
  const chartData = React.useMemo(() => {
    return data.map((item) => {
      const label = item.lable || item.label || 'N/A';
      let amount = 0;
      
      if (typeof item.value === 'number') {
        amount = item.value;
      } else if (typeof item.value === 'string') {
        const cleanValue = item.value.replace(/[₹,]/g, '').trim();
        amount = parseFloat(cleanValue) || 0;
      }

      return { label, amount, originalValue: item.value };
    });
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Quarterly Payouts</Text>
        <Text style={styles.emptyText}>No quarterly payout data available</Text>
      </View>
    );
  }

  const maxValue = Math.max(...chartData.map(d => d.amount));
  
  // Custom spacing configuration
  const barWidth = 40;
  const barSpacing = 40; 
  const contentWidth = Math.max(
    screenWidth - 50, 
    chartData.length * (barWidth + barSpacing) + padding.left + padding.right
  );

  const formatYLabel = (value) => {
    if (value >= 100000) {
      return `${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <View style={styles.container}>

      <View style={{ flexDirection: 'row', height: chartHeight }}>
        {/* Fixed Y-Axis */}
        <View style={{ width: 50, height: chartHeight,marginRight:10 }}>
          <Svg width={50} height={chartHeight}>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = padding.top + (chartHeight - padding.top - padding.bottom) * (1 - ratio);
              const value = maxValue * ratio;
              return (
                <SvgText
                  key={`ylabel-${i}`}
                  x={40}
                  y={y + 4}
                  fontSize="12"
                  fill="#6b7280"
                  textAnchor="end"
                >
                  {formatYLabel(value)}
                </SvgText>
              );
            })}
          </Svg>
        </View>

        {/* Scrollable Chart Area */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{ paddingRight: 0 }}
          onScroll={() => setTooltipData(null)} // Hide tooltip on scroll
          scrollEventThrottle={16}
        >
          <View>
            <Svg width={contentWidth} height={chartHeight}>
              <Defs>
                <LinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#4A90E2" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
                </LinearGradient>
              </Defs>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = padding.top + (chartHeight - padding.top - padding.bottom) * (1 - ratio);
                return (
                  <Line
                    key={`grid-${i}`}
                    x1={0}
                    y1={y}
                    x2={contentWidth}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                    opacity="0.3"
                  />
                );
              })}

              {/* Bars */}
              {chartData.map((item, index) => {
                const barHeight = ((chartHeight - padding.top - padding.bottom) * item.amount) / maxValue;
                const x = padding.left + index * (barWidth + barSpacing);
                const y = chartHeight - padding.bottom - barHeight;
                const isSelected = tooltipData?.index === index;

                return (
                  <G 
                    key={`bar-group-${index}`} 
                    onPressIn={() => setTooltipData({
                      index,
                      x: x + barWidth / 2,
                      y: y,
                      label: item.label,
                      amount: item.amount
                    })}
                  >
                    {/* Invisible Hit Area */}
                    <Rect
                      x={x}
                      y={0}
                      width={barWidth + barSpacing}
                      height={chartHeight}
                      fill="transparent"
                    />

                    <Rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill="url(#barGradient)"
                      rx={8}
                      ry={8}
                      opacity={isSelected ? 1 : 0.8}
                      stroke={isSelected ? "#4A90E2" : "none"}
                      strokeWidth={isSelected ? 2 : 0}
                    />
                    
                    {/* X-axis labels */}
                    <SvgText
                      x={x + barWidth / 2}
                      y={chartHeight - padding.bottom + 20}
                      fontSize="12"
                      fill={isSelected ? "#4A90E2" : "#6b7280"}
                      fontWeight={isSelected ? "bold" : "normal"}
                      textAnchor="middle"
                    >
                      {item.label}
                    </SvgText>
                  </G>
                );
              })}
            </Svg>

            {/* Native Overlay Tooltip */}
            {tooltipData && (
              <View 
                style={[
                  styles.tooltip, 
                  { 
                    left: tooltipData.x - 60, // Center (120 width / 2)
                    top: tooltipData.y - 70   // Above bar
                  }
                ]}
                pointerEvents="none"
              >
                <Text style={styles.tooltipAmount}>₹{tooltipData.amount.toLocaleString()}</Text>
                <Text style={styles.tooltipLabel}>{tooltipData.label}</Text>
                {/* Arrow */}
                <View style={styles.tooltipArrow} />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    // borderRadius: 12,
    // padding: 16,
    // marginVertical: 8,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  tooltip: {
    position: 'absolute',
    width: 120,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    elevation: 30, // Higher elevation for shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#eee',
  },
  tooltipAmount: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tooltipLabel: {
    color: '#666666',
    fontSize: 12,
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1, // subtle shadow for arrow
  },
});