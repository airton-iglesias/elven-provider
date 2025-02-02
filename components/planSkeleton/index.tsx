import { AppColors } from "@/constants/colors";
import React from "react";
import { Skeleton } from 'moti/skeleton'
import { View, StyleSheet } from "react-native";

export default function PlanSkeleton() {
    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={[styles.iconCircle, { backgroundColor: AppColors.internal.button }]}>
                    <Skeleton
                        colorMode="light"
                        width={60}
                        height={60}
                        radius={999}
                    />
                </View>
                <View style={styles.labelsWrapper}>
                    <Skeleton height={30} width={200} colorMode="light" />
                    <Skeleton height={24} width={150} colorMode="light" />
                    <Skeleton height={20} width={100} colorMode="light" />
                </View>
            </View>
            <Skeleton height={50} width={'100%'} colorMode="light" />
        </View>
    );
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: AppColors.internal.border,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    labelsWrapper: {
        gap: 5,
        marginBottom: 10
    },
})