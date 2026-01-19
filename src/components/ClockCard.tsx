import React, {
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from "react";
import {
    View,
    AppState,
    StyleSheet,
    Animated, Easing
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppButton from "./AppButton";
import { COLORS } from "../utils/theme";
import { fs, hs, vs } from "../utils/stylesUtils";
import { Clock } from "lucide-react-native";
import AppCard from "./AppCard";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Constants } from "../common/Constants";
import AppText from "./AppText";
import { textStyles } from "../common/CommonStyles";
import { AppString } from "../common/AppString";

const ClockCard = (
    {
        isClockedIn,
        setIsClockedIn,
        onCheckIn,
        onCheckOut,
        onRecordSaved,
        currentTask,
    }: any,
    ref: any
) => {

    const spinAnim = useRef(new Animated.Value(0)).current;
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    const [displayTime, setDisplayTime] = useState("00:00:00");
    const [startTimestamp, setStartTimestamp] = useState<number | null>(null);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const appStateRef = useRef(AppState.currentState);

    const isLoggedIn = useSelector(
        (state: RootState) => state.appData.isLogin
    );

    const stopEverything = async () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        await AsyncStorage.removeItem(Constants.STORAGE_KEY);
        setIsClockedIn(false);
        setStartTimestamp(null);
        setDisplayTime("00:00:00");
    };

    const startInterval = (startTs: number) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            const diff = Date.now() - startTs;
            setDisplayTime(
                Constants.millisecondsToHHMMSSClockCard(diff)
            );
        }, 1000);
    };

    useEffect(() => {
        if (isClockedIn) {
            spinAnim.setValue(0); // reset
            animationRef.current = Animated.loop(
                Animated.timing(spinAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            );
            animationRef.current.start();
        } else {
            if (animationRef.current) {
                animationRef.current.stop();
            }
        }
    }, [isClockedIn]);

    useEffect(() => {
        if (!isLoggedIn) {
            stopEverything();
        }
    }, [isLoggedIn]);

    const handleClockIn = async () => {
        const now = Date.now();
        await AsyncStorage.setItem(
            Constants.STORAGE_KEY,
            String(now)
        );
        setStartTimestamp(now);
        setIsClockedIn(true);
        startInterval(now);
    };

    const saveClockRecord = async (recordData: any) => {
        try {
            const existing = await AsyncStorage.getItem(
                Constants.CLOCK_RECORDS_KEY
            );
            const records = existing ? JSON.parse(existing) : [];
            records.unshift({ id: `${Date.now()}`, ...recordData });
            await AsyncStorage.setItem(
                Constants.CLOCK_RECORDS_KEY,
                JSON.stringify(records)
            );
            onRecordSaved?.(records);
        } catch (e) {
            console.error("Clock save error", e);
        }
    };

    const handleClockOutWithCallback = async () => {
        const now = Date.now();
        const saved = await AsyncStorage.getItem(Constants.STORAGE_KEY);
        const start = saved ? parseInt(saved, 10) : startTimestamp;
        const durationMs = start ? now - start : 0;

        const clockData = {
            checkInTime: Constants.formatTimeHMClockCard(start || now),
            checkOutTime: Constants.formatTimeHMClockCard(now),
            duration: Constants.formatDurationClockCard(durationMs),
            date: Constants.newDateDMY,
            timestamp: now,
            // status: (onCheckOut as any)?.status,
            // taskTitle: (onCheckOut as any)?.taskTitle,
            status: currentTask?.status ?? AppString.Completed,
            taskTitle: currentTask?.taskTitle ?? "—",
        };

        if (typeof onCheckOut === "function") {
            onCheckOut(clockData, async () => {
                await saveClockRecord(clockData);
                await stopEverything();
            });
        } else {
            await stopEverything();
        }
    };

    useImperativeHandle(ref, () => ({
        forceTaskCheckout: async () => {
            if (!isClockedIn) return;

            const now = Date.now();
            const saved = await AsyncStorage.getItem(Constants.STORAGE_KEY);
            const start = saved ? parseInt(saved, 10) : startTimestamp;
            const durationMs = start ? now - start : 0;

            console.log('Saved auto clock out', saved);

            const clockData = {
                checkInTime: Constants.formatTimeHMClockCard(start || now),
                checkOutTime: Constants.formatTimeHMClockCard(now),
                duration: Constants.formatDurationClockCard(durationMs),
                date: Constants.newDateDMY,
                timestamp: now,
                status: "In Progress",
                taskTitle: currentTask?.taskTitle ?? "—",
            };

            await saveClockRecord(clockData);
            await stopEverything();
        },
    }));

    const restoreFromStorage = async () => {
        const saved = await AsyncStorage.getItem(Constants.STORAGE_KEY);
        if (!saved) return;

        const start = parseInt(saved, 10);
        setStartTimestamp(start);
        setIsClockedIn(true);
        startInterval(start);
    };

    useEffect(() => {
        restoreFromStorage();
        const sub = AppState.addEventListener("change", (next) => {
            if (
                appStateRef.current.match(/inactive|background/) &&
                next === "active"
            ) {
                restoreFromStorage();
            }
            appStateRef.current = next;
        });

        return () => {
            stopEverything();
            sub.remove();
        };
    }, []);

    return (
        <AppCard style={{ marginTop: vs(20) }}>
            <View style={styles.row}>
                <View style={styles.left}>
                    {/* <View style={styles.iconContainer}>
                        <Clock size={30} color={COLORS.card} />
                    </View> */}
                    <Animated.View
                        style={[styles.iconContainer, {
                            transform: [
                                {
                                    rotate: spinAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ["0deg", "360deg"],
                                    }),
                                },
                            ],
                        }]}
                    >
                        <Clock size={30} color={COLORS.card} />
                    </Animated.View>

                    <View style={styles.texts}>
                        <AppText
                            txt={displayTime}
                            style={[
                                textStyles.emptyText,
                                { color: COLORS.blackColor },
                            ]}
                        />
                        <AppText
                            txt={new Date().toLocaleDateString(undefined, {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                            })}
                            style={[
                                textStyles.primary13,
                                {
                                    color: "#8A8A8A",
                                    marginTop: vs(5),
                                },
                            ]}
                        />
                    </View>
                </View>

                <AppButton
                    label={isClockedIn ? "Check Out" : "Check In"}
                    textColor={COLORS.card}
                    style={[
                        styles.buttonStyle,
                        {
                            backgroundColor: isClockedIn
                                ? COLORS.danger
                                : COLORS.secondaryPrimary,
                        },
                    ]}
                    onPress={() =>
                        isClockedIn
                            ? handleClockOutWithCallback()
                            : onCheckIn
                                ? onCheckIn(handleClockIn)
                                : handleClockIn()
                    }
                />
            </View>
        </AppCard>
    );
};

export default forwardRef(ClockCard);

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        height: vs(50),
        width: hs(50),
        borderRadius: 100,
        backgroundColor: COLORS.secondaryPrimary,
        justifyContent: "center",
        alignItems: "center",
    },
    texts: {
        marginLeft: hs(10),
    },
    buttonStyle: {
        width: "30%",
    },
});
