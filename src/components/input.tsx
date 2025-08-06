import { Input as GluestackInput, InputField } from "@gluestack-ui/themed"
import { ComponentProps } from "react"

// Infer props for the GluestackInput component itself
type GluestackInputProps = ComponentProps<typeof GluestackInput>

// Update Props to include 'rounded' using the inferred type
type Props = ComponentProps<typeof InputField> & {
    rounded?: GluestackInputProps['rounded']
}

export function Input({ rounded, ...rest }: Props) {

    return (
        <GluestackInput
            bg="#FFF"
            h="$14"
            px="$4"
            borderWidth={1}
            borderColor="#DDD"
            rounded={rounded}
            overflow="hidden"
            $focus={{
                borderWidth: 1,
                borderColor: "#FF9100",
            }}
        >
            <InputField  
                color="#222"
                fontFamily="$body"
                placeholderTextColor="#888"
                {...rest} />
        </GluestackInput>
    )


}