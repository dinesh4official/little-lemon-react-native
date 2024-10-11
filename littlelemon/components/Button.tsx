import React, { ReactNode } from 'react';
import { Pressable, ViewStyle, StyleProp, Text, TextStyle } from 'react-native';

interface ButtonProps {
    children: ReactNode;
    onPress: () => void;
    disabled?: boolean;
    pressedStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    disabledStyle?: StyleProp<ViewStyle>;
}

const Button = ({ pressedStyle, textStyle, disabledStyle, disabled = false, onPress, children }: ButtonProps) => {
    return (
        <Pressable
            onPress={onPress}
            style={[
                pressedStyle,
                disabled && disabledStyle,
            ]}
            disabled={disabled}>
            <Text style={textStyle}>{children}</Text>
        </Pressable>
    );
}

export default Button;