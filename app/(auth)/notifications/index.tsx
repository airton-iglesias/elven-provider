import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { fontSize } from "@/constants/fonts";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AppColors } from "@/constants/colors";
import NotificationSkeleton from "@/components/notificationSkeleton";
import NotificationModal from "@/components/NotificationModal";

interface Notification {
    id: string;
    title: string;
    description: string;
}

export default function Notifications() {
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isInformativeModalVisible, setIsInformativeModalVisible] = useState(false);
    const [selectedNotificationDescription, setSelectedNotificationDescription] = useState('');

    useEffect(() => {
        const requestNotifications: Notification[] = [
            /* 
                {
                    id: "1",
                    title: "Titulo da notificação",
                    description:
                        "Descrição 1",
                },
                {
                    id: "2",
                    title: "Titulo da notificação",
                    description:
                        "Descrição 2",
                },
                {
                    id: "3",
                    title: "Titulo da notificação",
                    description:
                        "Essa é uma breve descrição de um item de notificação que irá ser implementado em breve...",
                },
                {
                    id: "4",
                    title: "Titulo da notificação",
                    description:
                        "Essa é uma breve descrição de um item de notificação que irá ser implementado em breve... ",
                },
                {
                    id: "5",
                    title: "Titulo da notificação",
                    description:
                        "Essa é uma breve descrição de um item de notificação que irá ser implementado em breve...",
                },
            */
        ];

        setTimeout(() => {
            setNotifications(requestNotifications);
            setIsLoading(false);
        }, 1000);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Notificações</Text>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                    <AntDesign name="close" size={28} color="black" />
                </TouchableOpacity>
            </View>
            {isLoading ? (<NotificationSkeleton />) : (
                notifications.length > 0 ?
                    <View>
                        <FlatList
                            data={notifications}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.notificationItem}>
                                    <TouchableOpacity
                                        style={styles.notificationButton}
                                        onPress={() => {
                                            setSelectedNotificationDescription(item.description);
                                            setIsInformativeModalVisible(true);
                                        }}
                                    >
                                        <View style={styles.iconContainer}>
                                            <Ionicons name="alert-circle-outline" size={30} color="#fff" />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <Text style={styles.title}>{item.title}</Text>
                                            <Text style={styles.description} numberOfLines={2}>
                                                {item.description}
                                            </Text>
                                        </View>
                                        <View style={styles.arrowContainer}>
                                            <Ionicons name="chevron-forward-outline" size={24} color="#D96A0B" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                    :
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 }}>
                        <Text style={{ color: '#000', fontSize: fontSize.labels.medium }}>Você ainda não possui notificações.</Text>
                    </View>

            )}

            <NotificationModal
                isModalVisible={isInformativeModalVisible}
                setIsModalVisible={setIsInformativeModalVisible}
                text={selectedNotificationDescription}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: 'white'
    },
    headerContainer: {
        marginTop: 25,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerText: {
        fontSize: fontSize.titles.medium,
        fontWeight: "bold",
    },
    notificationItem: {
        paddingHorizontal: 12,
        paddingVertical: 20,
        borderRadius: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#D9D9D9",
    },
    iconContainer: {
        backgroundColor: AppColors.internal.button,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        height: 60,
        width: 60
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: fontSize.labels.large,
        fontWeight: "bold",
        marginBottom: 4,
    },
    description: {
        fontSize: fontSize.labels.medium,
        color: "#666",
    },
    arrowContainer: {
        paddingLeft: 8,
    },
    notificationButton: {
        flexDirection: "row",
        alignItems: "center",
    }
});
