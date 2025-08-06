import React from "react";
import { Pressable, Text } from "@gluestack-ui/themed";

type Props = {
  visivel: boolean;
  onToggle: () => void;
};

export function ToggleSaldoButton({ visivel, onToggle }: Props) {
  return (
    <Pressable onPress={onToggle}>
      <Text fontSize={30}>{visivel ? "👁️" : "🙈"}</Text>
    </Pressable>
  );
}