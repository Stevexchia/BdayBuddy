import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Svg, { G, Circle } from 'react-native-svg'
import { AntDesign } from '@expo/vector-icons';

interface NextButtonProps {
    percentage: number;
    scrollTo: () => void;
}

const NextButton: React.FC<NextButtonProps> = ({ percentage, scrollTo }) => {
    const size = 128;
    const strokeWidth = 2;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const progressAnimation = useRef(new Animated.Value(0)).current;
    const progressRef = useRef<Circle>(null);

    const animation = (toValue: number) => {
        return Animated.timing(progressAnimation, {
            toValue,
            duration: 250,
            useNativeDriver: false
        }).start()
    };

    useEffect(() => {
        animation(percentage);
    }, [percentage]);

    useEffect(() => {
        const listener = progressAnimation.addListener((value) => {
            const strokeDashoffset = circumference - (circumference * value.value) / 100;

            if (progressRef?.current) {
                progressRef.current.setNativeProps({
                    strokeDashoffset,
                });
            }
        });

        return () => {
            progressAnimation.removeListener(listener);
        };
    }, [circumference, progressAnimation]);


  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={center}>
        <Circle stroke="#FFFFFF" cx={center} cy={center} r={radius} strokeWidth={strokeWidth}
            />
            <Circle
                stroke="#EB68A0"
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                fill="white"
            />
            </G>
        </Svg>
        <TouchableOpacity onPress={scrollTo} style={styles.button} activeOpacity={0.6}>
            <AntDesign name="arrowright" size={32} color="#fff" />
        </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        position: 'absolute',
        backgroundColor: '#EB68A0',
        borderRadius: 100,
        padding: 20,
    },
});

export default NextButton;