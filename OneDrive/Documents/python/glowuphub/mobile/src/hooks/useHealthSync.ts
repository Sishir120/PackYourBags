import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import AppleHealthKit, {
    HealthValue,
    HealthKitPermissions,
} from 'react-native-health';
import {
    initialize,
    requestPermission,
    readRecords,
    getSdkStatus,
    SdkAvailabilityStatus,
} from 'react-native-health-connect';

interface HealthData {
    steps: number;
    sleepMinutes: number;
    activeCalories: number;
    mindfulMinutes: number;
}

const IOS_PERMISSIONS: HealthKitPermissions = {
    permissions: {
        read: [
            AppleHealthKit.Constants.Permissions.StepCount,
            AppleHealthKit.Constants.Permissions.SleepAnalysis,
            AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
            AppleHealthKit.Constants.Permissions.MindfulSession,
        ],
        write: [], // Add write if needed
    },
};

export function useHealthSync() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isSupported, setIsSupported] = useState(true); // Optimistic Default
    const [data, setData] = useState<HealthData>({
        steps: 0,
        sleepMinutes: 0,
        activeCalories: 0,
        mindfulMinutes: 0,
    });

    const initHealthKit = useCallback(() => {
        AppleHealthKit.initHealthKit(IOS_PERMISSIONS, (error: string) => {
            if (error) {
                console.warn('Cannot grant permissions: ', error);
                return;
            }
            setIsAuthorized(true);
            fetchIOSData();
        });
    }, []);

    const initHealthConnect = useCallback(async () => {
        // Check if supported
        const status = await getSdkStatus();
        if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) {
            setIsSupported(false);
            return;
        }

        const initialized = await initialize();
        if (initialized) {
            // Request Permissions for Steps, TotalCaloriesBurned, SleepSession
            try {
                await requestPermission([
                    { accessType: 'read', recordType: 'Steps' },
                    { accessType: 'read', recordType: 'TotalCaloriesBurned' },
                    { accessType: 'read', recordType: 'SleepSession' },
                ]);
                setIsAuthorized(true);
                fetchAndroidData();
            } catch (e) {
                console.warn("Permission denied or cancelled", e);
            }
        }
    }, []);

    const requestPermissions = useCallback(() => {
        if (Platform.OS === 'ios') {
            initHealthKit();
        } else if (Platform.OS === 'android') {
            initHealthConnect();
        }
    }, [initHealthKit, initHealthConnect]);

    const fetchIOSData = () => {
        const options = {
            startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        };

        // Steps
        AppleHealthKit.getStepCount(options, (err, results) => {
            if (!err) {
                setData((prev) => ({ ...prev, steps: results.value }));
            }
        });

        // Active Energy
        AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
            if (!err && results && results.length > 0) {
                // Sum up samples if needed, but getActiveEnergy usually returns samples list
                // For simplicity in this v1, handle aggregating locally or check if there's a specific aggregate function
                const total = results.reduce((acc, curr) => acc + curr.value, 0);
                setData((prev) => ({ ...prev, activeCalories: total }));
            }
        });

        // Sleep (Simplified)
        AppleHealthKit.getSleepSamples(options, (err, results) => {
            if (!err && results) {
                // Aggregate ASLEEP time
                const sleepMins = results.reduce((acc: number, val: any) => {
                    // value is often 'ASLEEP' string in raw data, but types might say value is enum.
                    // We handle both for robustness or check specifically against the constant if available.
                    const isAsleep = val.value === 'ASLEEP' ||
                        val.value === AppleHealthKit.Constants.SleepAnalysis.ASLEEP;

                    if (isAsleep) {
                        const start = new Date(val.startDate).getTime();
                        const end = new Date(val.endDate).getTime();
                        return acc + (end - start) / 60000;
                    }
                    return acc;
                }, 0);
                setData(prev => ({ ...prev, sleepMinutes: sleepMins }));
            }
        });
    };

    const fetchAndroidData = async () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const timeRangeFilter: { operator: 'after'; startTime: string } = {
            operator: 'after',
            startTime: today.toISOString(),
        };

        try {
            // Steps
            const stepsResult = await readRecords('Steps', { timeRangeFilter });
            const stepsRecords = stepsResult.records || stepsResult; // Handle potential API shape variation
            const totalSteps = Array.isArray(stepsRecords)
                ? stepsRecords.reduce((acc: number, rec: any) => acc + (rec.count || 0), 0)
                : 0;

            // Calories
            const calResult = await readRecords('TotalCaloriesBurned', { timeRangeFilter });
            const calRecords = calResult.records || calResult;
            const totalCals = Array.isArray(calRecords)
                ? calRecords.reduce((acc: number, rec: any) => acc + (rec.energy?.inKilocalories || 0), 0)
                : 0;

            // Sleep
            const sleepResult = await readRecords('SleepSession', { timeRangeFilter });
            const sleepRecords = sleepResult.records || sleepResult;
            // Simplified aggregation of sleep session duration
            const totalSleep = Array.isArray(sleepRecords)
                ? sleepRecords.reduce((acc: number, rec: any) => {
                    const start = new Date(rec.startTime).getTime();
                    const end = new Date(rec.endTime).getTime();
                    return acc + (end - start) / 60000;
                }, 0)
                : 0;

            setData({
                steps: totalSteps,
                activeCalories: totalCals,
                sleepMinutes: totalSleep,
                mindfulMinutes: 0 // Health Connect mindfulness support varies, keeping 0 for now
            });
        } catch (e) {
            console.error("Error reading android records", e);
        }
    };

    return {
        isAuthorized,
        requestPermissions,
        data,
        isSupported
    };
}
