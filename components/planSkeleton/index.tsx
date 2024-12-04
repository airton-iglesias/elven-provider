import { AppColors } from "@/constants/colors";
import { fontSize } from "@/constants/fonts";
import React from "react";
import { Skeleton } from 'moti/skeleton'
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

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
    header: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
    },
    headerText: {
        fontSize: fontSize.titles.medium,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: AppColors.internal.border,
    },
    cardPayment: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        borderColor: AppColors.internal.border,
        borderWidth: 1,
    },
    cardPartWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#15803D',
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rowPayment: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    statusButton: {
        backgroundColor: '#15803D',
        paddingVertical: 6,
        borderRadius: 999,
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 3,
        width: 70,
        height: 25,
        justifyContent: 'center',
    },

})