import React from 'react'
import { Modal, Pressable, View, TouchableOpacity, StyleSheet } from 'react-native'
import { hs, vs } from '../utils/stylesUtils'
import AppText from '../components/AppText';
import { textStyles } from '../common/CommonStyles';
import { X } from 'lucide-react-native';
import { AppString } from '../common/AppString';

interface Props {
    visible: boolean;
    onClose: () => void;
    onChoose: (choice: 'In Progress' | 'Completed') => void;
    currentTask?: any;
}

const CheckOutAlert: React.FC<Props> = ({ visible, onClose, onChoose, currentTask }) => {
    const handleStatusSelect = async (status: 'In Progress' | 'Completed') => {
        onChoose(status);
    };

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <View style={styles.wrapper}>
                <Pressable style={styles.modalOverlay} onPress={onClose} />
                <View style={styles.dialog}>
                    <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={onClose}>
                        <X size={25} />
                    </TouchableOpacity>

                    <AppText
                        txt={AppString.CheckOut}
                        style={[textStyles.body, { color: '#1B1D28', textAlign: 'center' }]}
                    />

                    <AppText
                        txt={AppString.HowWouldYouLikeToMark}
                        style={[textStyles.bodySmall, { textAlign: 'center', marginTop: vs(10), color: '#6B7280' }]}
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(20) }}>
                        <TouchableOpacity
                            style={[styles.alertButton, { backgroundColor: '#FBBF24' }]}
                            onPress={() => handleStatusSelect('In Progress')}
                        >
                            <AppText
                                txt={AppString.InProgress}
                                style={[textStyles.bodySmall, { color: '#1B1D28' }]}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.alertButton, { backgroundColor: '#10B981' }]}
                            onPress={() => handleStatusSelect('Completed')}
                        >
                            <AppText
                                txt={AppString.Completed}
                                style={[textStyles.bodySmall, { color: '#fff' }]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    wrapper: {
        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    dialog: { backgroundColor: '#fff', width: '80%', padding: 20, borderRadius: 12 },
    alertButton: {
        flex: 1,
        paddingVertical: vs(12),
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: hs(5),
    },
});

export default CheckOutAlert;
