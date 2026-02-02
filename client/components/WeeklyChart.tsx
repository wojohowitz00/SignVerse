import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

interface WeeklyChartProps {
  data: number[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeeklyChart({ data }: WeeklyChartProps) {
  const { theme } = useTheme();
  const maxValue = Math.max(...data, 1);
  const today = new Date().getDay();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundDefault },
        Shadows.card,
      ]}
    >
      <ThemedText type="h4" style={styles.title}>
        This Week
      </ThemedText>
      <View style={styles.chart}>
        {data.map((value, index) => {
          const height = (value / maxValue) * 100;
          const isToday = index === today;

          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${Math.max(height, 5)}%`,
                      backgroundColor: isToday
                        ? theme.primary
                        : theme.primary + "60",
                    },
                  ]}
                />
              </View>
              <ThemedText
                type="caption"
                style={[
                  styles.dayLabel,
                  {
                    color: isToday ? theme.primary : theme.textSecondary,
                    fontWeight: isToday ? "600" : "400",
                  },
                ]}
              >
                {DAYS[index]}
              </ThemedText>
            </View>
          );
        })}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: theme.primary }]}
          />
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            Minutes practiced
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  title: {
    marginBottom: Spacing.lg,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    marginBottom: Spacing.md,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
  },
  barWrapper: {
    height: 100,
    width: 24,
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: BorderRadius.xs,
    minHeight: 4,
  },
  dayLabel: {
    marginTop: Spacing.xs,
    fontSize: 11,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
