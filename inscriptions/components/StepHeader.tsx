import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface StepHeaderProps {
  current: number;
  total: number;
  title: string;
  subtitle?: string;
}

const size = 48;
const strokeWidth = 4;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;

const StepHeader: React.FC<StepHeaderProps> = ({
  current,
  total,
  title,
  subtitle,
}) => {
  const progress = current / total;
  const progressStroke = circumference * (1 - progress);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
        marginTop: 16,
        paddingHorizontal: 24,
      }}
    >
      {/* Cercle progressif */}
      <View style={{ width: size, height: size, marginRight: 16 }}>
        <Svg width={size} height={size}>
          {/* Cercle de fond */}
          <Circle
            stroke="#e0e0e0"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Cercle de progression */}
          <Circle
            stroke="#4CAF50"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressStroke}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2},${size / 2}`}
          />
        </Svg>
        {/* Texte au centre */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#222", fontSize: 15 }}>
            {current} / {total}
          </Text>
        </View>
      </View>
      {/* Titre et sous-titre */}
      <View>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#222" }}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default StepHeader;