import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SnackbarContextValue {
    show: (message: string, duration?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

// Module-level global show function that can be used from non-render code safely
let globalShow: ((message: string, duration?: number) => void) | null = null;
const pendingQueue: Array<{ message: string; duration?: number }> = [];
export const showGlobalSnackbar = (message: string, duration?: number) => {
    try {
        if (globalShow) {
            globalShow(message, duration);
        } else {
            // queue until provider mounts
            pendingQueue.push({ message, duration });
        }
    } catch (e) {
        // swallow; no-op if provider not mounted
    }
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<string>('');
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<number | null>(null);
    const anim = useRef(new Animated.Value(0)).current;

    const show = useCallback((msg: string, duration = 3000) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setMessage(msg);
        setVisible(true);
        Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
        timerRef.current = setTimeout(() => {
            Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
                setVisible(false);
                setMessage('');
            });
        }, duration);
    }, [anim]);

    // expose to global caller and flush pending queue
    React.useEffect(() => {
        globalShow = show;

        // Flush pending queue
        if (pendingQueue.length > 0) {
            pendingQueue.forEach((item) => {
                try {
                    globalShow && globalShow(item.message, item.duration);
                } catch (_) { }
            });
            pendingQueue.length = 0;
        }

        return () => {
            globalShow = null;
        };
    }, [show]);

    const value = useMemo(() => ({ show }), [show]);

    return (
        <SnackbarContext.Provider value={value}>
            {children}
            {visible && (
                <Animated.View
                    pointerEvents="box-none"
                    style={[
                        styles.container,
                        {
                            transform: [
                                {
                                    translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [80, 0] }),
                                },
                            ],
                            opacity: anim,
                        },
                    ]}
                >
                    <View style={styles.snackbar}>
                        <Text style={styles.text}>{message}</Text>
                        <TouchableOpacity onPress={() => {
                            if (timerRef.current) {
                                clearTimeout(timerRef.current);
                                timerRef.current = null;
                            }
                            Animated.timing(anim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
                                setVisible(false);
                                setMessage('');
                            });
                        }}>
                            <Text style={styles.dismiss}>✕</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </SnackbarContext.Provider>
    );
};

export function useSnackbar() {
    const ctx = useContext(SnackbarContext);
    // If provider is not present, return a safe fallback that uses the global show
    if (!ctx) return { show: showGlobalSnackbar };
    return ctx;
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 24,
        zIndex: 9999,
    },
    snackbar: {
        backgroundColor: '#323232',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
    },
    text: {
        color: '#FFF',
        flex: 1,
        marginRight: 8,
    },
    dismiss: {
        color: '#FFF',
        fontSize: 18,
        marginLeft: 8,
    },
});
