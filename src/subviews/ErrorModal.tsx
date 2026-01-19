import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from 'react-native';
import { COLORS } from '../utils/theme';
import { fs, hs, vs } from '../utils/stylesUtils';

interface Props {
    visible: boolean;
    title: string;
    message: string;
    cancel: string;
    confirm?: string;
    onCancel: () => void;
    onConfirm?: () => void;
}

const ErrorModal: React.FC<Props> = ({
    visible,
    title,
    message,
    cancel,
    onCancel,
}) => {
    return (
        <Modal
            transparent
            animationType="none"
            visible={visible}
            onRequestClose={onCancel}
        >
            <Pressable style={styles.overlay} onPress={onCancel}>
                <Pressable style={styles.modal}>
                    <Text style={styles.title}>{title}</Text>

                    <Text style={styles.message}>
                        {message}
                    </Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelBtn]}
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelText}>
                                {cancel}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default ErrorModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingHorizontal: hs(20),
        paddingVertical: vs(24),
        alignItems: 'center',
    },
    title: {
        fontSize: fs(18),
        fontWeight: '700',
        color: COLORS.blackColor,
        textAlign: 'center',
    },
    message: {
        fontSize: fs(15),
        color: COLORS.subGreyColor,
        marginTop: vs(12),
        textAlign: 'center',
        lineHeight: fs(20),
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: vs(24),
        width: '100%',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        paddingVertical: vs(12),
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#F1F4F8',
        marginRight: hs(10),
    },
    logoutBtn: {
        backgroundColor: COLORS.danger,
        marginLeft: hs(10),
    },
    cancelText: {
        color: COLORS.blackColor,
        fontSize: fs(14),
        fontWeight: '600',
    },
    logoutText: {
        color: '#fff',
        fontSize: fs(14),
        fontWeight: '600',
    },
});