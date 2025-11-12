import { Center, Spinner } from "@gluestack-ui/themed";

export function Loading() {
  return (
    <Center flex={1} bg="$white" w="$full" h="$full">
      <Spinner color="$orange" size="large" />
    </Center>
  );
}
